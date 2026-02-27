import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const DATA_DIR = path.join(__dirname, "data")
const STAFF_FILE = path.join(DATA_DIR, "staff.json")
const PACIENTES_FILE = path.join(DATA_DIR, "pacientes.json")
const MEDICOS_FILE = path.join(DATA_DIR, "medicos.json")
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret"

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STAFF_FILE)) fs.writeFileSync(STAFF_FILE, JSON.stringify([]))
  if (!fs.existsSync(PACIENTES_FILE)) fs.writeFileSync(PACIENTES_FILE, JSON.stringify([]))
  if (!fs.existsSync(MEDICOS_FILE)) fs.writeFileSync(MEDICOS_FILE, JSON.stringify([]))
}

function readJSON(file) {
  const raw = fs.readFileSync(file, "utf-8")
  return JSON.parse(raw || "[]")
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function genId() {
  return crypto.randomUUID()
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || ""
  const token = h.startsWith("Bearer ") ? h.slice(7) : null
  if (!token) return res.status(401).json({ error: "Não autorizado" })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: "Token inválido" })
  }
}

app.use("/public", express.static(path.join(__dirname, "public")))

app.post("/api/auth/signup", (req, res) => {
  const { nome, sobrenome, email, senha } = req.body
  if (!nome || !sobrenome || !email || !senha) return res.status(400).json({ error: "Campos obrigatórios ausentes" })
  ensureDataFiles()
  const staff = readJSON(STAFF_FILE)
  const exists = staff.find(s => s.email.toLowerCase() === String(email).toLowerCase())
  if (exists) return res.status(409).json({ error: "Email já cadastrado" })
  const hash = bcrypt.hashSync(senha, 10)
  const now = new Date().toISOString()
  const user = { id: genId(), nome, sobrenome, email, senhaHash: hash, criadoEm: now }
  staff.push(user)
  writeJSON(STAFF_FILE, staff)
  res.json({ ok: true })
})

app.post("/api/auth/login", (req, res) => {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ error: "Campos obrigatórios ausentes" })
  ensureDataFiles()
  const staff = readJSON(STAFF_FILE)
  const user = staff.find(s => s.email.toLowerCase() === String(email).toLowerCase())
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" })
  const ok = bcrypt.compareSync(senha, user.senhaHash)
  if (!ok) return res.status(401).json({ error: "Credenciais inválidas" })
  const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome }, JWT_SECRET, { expiresIn: "8h" })
  res.json({ token })
})

app.get("/api/pacientes", authMiddleware, (req, res) => {
  ensureDataFiles()
  const list = readJSON(PACIENTES_FILE)
  res.json(list)
})

app.post("/api/pacientes", authMiddleware, (req, res) => {
  const { nome, sobrenome, dataNascimento, email, dataAdesaoPlano, endereco, telefone, documento } = req.body
  if (!nome || !sobrenome || !dataNascimento || !email || !dataAdesaoPlano || !endereco || !telefone || !documento) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" })
  }
  ensureDataFiles()
  const list = readJSON(PACIENTES_FILE)
  const now = new Date().toISOString()
  const item = { id: genId(), nome, sobrenome, dataNascimento, email, dataAdesaoPlano, endereco, telefone, documento, criadoEm: now, atualizadoEm: now }
  list.push(item)
  writeJSON(PACIENTES_FILE, list)
  res.json(item)
})

app.put("/api/pacientes/:id", authMiddleware, (req, res) => {
  const id = req.params.id
  ensureDataFiles()
  const list = readJSON(PACIENTES_FILE)
  const idx = list.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ error: "Não encontrado" })
  const prev = list[idx]
  const updated = { ...prev, ...req.body, id, atualizadoEm: new Date().toISOString() }
  list[idx] = updated
  writeJSON(PACIENTES_FILE, list)
  res.json(updated)
})

app.delete("/api/pacientes/:id", authMiddleware, (req, res) => {
  const id = req.params.id
  ensureDataFiles()
  const list = readJSON(PACIENTES_FILE)
  const idx = list.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ error: "Não encontrado" })
  const removed = list.splice(idx, 1)[0]
  writeJSON(PACIENTES_FILE, list)
  res.json(removed)
})

app.get("/api/medicos", authMiddleware, (req, res) => {
  ensureDataFiles()
  const list = readJSON(MEDICOS_FILE)
  res.json(list)
})

app.post("/api/medicos", authMiddleware, (req, res) => {
  const { nome, sobrenome, email, telefone, documento, especialidade } = req.body
  if (!nome || !sobrenome || !email || !telefone || !documento) return res.status(400).json({ error: "Campos obrigatórios ausentes" })
  ensureDataFiles()
  const list = readJSON(MEDICOS_FILE)
  const now = new Date().toISOString()
  const item = { id: genId(), nome, sobrenome, email, telefone, documento, especialidade, criadoEm: now, atualizadoEm: now }
  list.push(item)
  writeJSON(MEDICOS_FILE, list)
  res.json(item)
})

app.put("/api/medicos/:id", authMiddleware, (req, res) => {
  const id = req.params.id
  ensureDataFiles()
  const list = readJSON(MEDICOS_FILE)
  const idx = list.findIndex(m => m.id === id)
  if (idx === -1) return res.status(404).json({ error: "Não encontrado" })
  const prev = list[idx]
  const updated = { ...prev, ...req.body, id, atualizadoEm: new Date().toISOString() }
  list[idx] = updated
  writeJSON(MEDICOS_FILE, list)
  res.json(updated)
})

app.delete("/api/medicos/:id", authMiddleware, (req, res) => {
  const id = req.params.id
  ensureDataFiles()
  const list = readJSON(MEDICOS_FILE)
  const idx = list.findIndex(m => m.id === id)
  if (idx === -1) return res.status(404).json({ error: "Não encontrado" })
  const removed = list.splice(idx, 1)[0]
  writeJSON(MEDICOS_FILE, list)
  res.json(removed)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/agendamento", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/prontuario", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/financeiro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/estoque", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/relatorios", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/comunicacao", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
app.get("/portal", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})
const PORT = process.env.PORT || 3000
ensureDataFiles()
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
