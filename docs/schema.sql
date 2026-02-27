-- Tabelas principais
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sobrenome text not null,
  dataNascimento date not null,
  email text not null,
  dataAdesaoPlano date not null,
  endereco text not null,
  telefone text not null,
  documento text not null,
  criadoEm timestamptz not null default now(),
  atualizadoEm timestamptz not null default now()
);

create table if not exists public.medicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sobrenome text not null,
  email text not null,
  telefone text not null,
  documento text not null,
  especialidade text,
  criadoEm timestamptz not null default now(),
  atualizadoEm timestamptz not null default now()
);

create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid,
  paciente_email text,
  medico_id uuid,
  especialidade text,
  sala text,
  recurso text,
  data date not null,
  hora text not null,
  duracao integer not null default 30,
  status text default 'marcado',
  criadoEm timestamptz not null default now()
);

create table if not exists public.prontuarios (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null,
  medico_id uuid not null,
  diagnostico text,
  alergias text,
  anamnese text,
  prescricao text,
  laudo text,
  criadoEm timestamptz not null default now()
);

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  consulta_id uuid,
  convenio text,
  procedimento text,
  valor numeric not null,
  criadoEm timestamptz not null default now()
);

create table if not exists public.estoque (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  tipo text,
  lote text,
  quantidade integer not null,
  minimo integer,
  validade date,
  fornecedor text,
  criadoEm timestamptz not null default now()
);

create table if not exists public.mensagens (
  id uuid primary key default gen_random_uuid(),
  autor text,
  mensagem text not null,
  criadoEm timestamptz not null default now()
);

-- Storage
-- Criar bucket 'exames' e permitir acesso autenticado
-- select storage.create_bucket('exames', public := true);

-- RLS
alter table public.pacientes enable row level security;
alter table public.medicos enable row level security;
alter table public.agendamentos enable row level security;
alter table public.prontuarios enable row level security;
alter table public.pagamentos enable row level security;
alter table public.estoque enable row level security;
alter table public.mensagens enable row level security;

create policy "auth select" on public.pacientes for select to authenticated using (true);
create policy "auth write" on public.pacientes for insert to authenticated with check (true);
create policy "auth update" on public.pacientes for update to authenticated using (true) with check (true);
create policy "auth delete" on public.pacientes for delete to authenticated using (true);

create policy "auth select" on public.medicos for select to authenticated using (true);
create policy "auth write" on public.medicos for insert to authenticated with check (true);
create policy "auth update" on public.medicos for update to authenticated using (true) with check (true);
create policy "auth delete" on public.medicos for delete to authenticated using (true);

create policy "auth select" on public.agendamentos for select to authenticated using (true);
create policy "auth write" on public.agendamentos for insert to authenticated with check (true);
create policy "auth update" on public.agendamentos for update to authenticated using (true) with check (true);
create policy "auth delete" on public.agendamentos for delete to authenticated using (true);

create policy "auth select" on public.prontuarios for select to authenticated using (true);
create policy "auth write" on public.prontuarios for insert to authenticated with check (true);

create policy "auth select" on public.pagamentos for select to authenticated using (true);
create policy "auth write" on public.pagamentos for insert to authenticated with check (true);

create policy "auth select" on public.estoque for select to authenticated using (true);
create policy "auth write" on public.estoque for insert to authenticated with check (true);

create policy "auth select" on public.mensagens for select to authenticated using (true);
create policy "auth write" on public.mensagens for insert to authenticated with check (true);
