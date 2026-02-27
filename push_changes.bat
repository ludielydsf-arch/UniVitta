@echo off
set "GIT_PATH=C:\Program Files\Git\bin"
set "PATH=%GIT_PATH%;%PATH%"
git config user.email "ludielydsf-arch@users.noreply.github.com"
git config user.name "ludielydsf-arch"
git add .
git commit -m "Renomeado Pacientes/Medicos para Pacientes e removido secao de medicos"
git push origin main
