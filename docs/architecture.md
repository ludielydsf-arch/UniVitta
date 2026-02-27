# Arquitetura do Sistema de Gestão de Clínica

## Visão Geral
- Frontend SPA leve em HTML/CSS/JS modular, servido por Node/Express.
- Supabase como backend: Auth, Postgres, Storage e Realtime.
- RLS configurado para proteção de dados e controle de acesso por perfis.
- Design responsivo com tema escuro e componentes em cards.

## Módulos
- Agendamento: calendário com visualizações diária/semanal/mensal e CRUD.
- Prontuário: registros clínicos e upload de exames/documentos em Storage.
- Financeiro: pagamentos, convênios e procedimentos com KPIs de receita.
- Estoque: medicamentos/materiais com alertas de mínimo/validade.
- Relatórios/BI: KPIs e exportação CSV.
- Comunicação: chat interno em tempo real via Realtime.
- Portal do Paciente: acesso a agendamentos e resultados.
- Acesso/Segurança: perfis, auditoria de ações (via logs), conformidade LGPD.

## Fluxo de Autenticação
- Supabase Auth com e-mail/senha.
- Perfis em user_metadata: role = admin|medico|recepcao|financeiro|paciente.
- Navegação condicionada ao perfil; RLS restringe leituras/escritas.

## Dados e Integridade
- Postgres para entidades principais; Storage para arquivos.
- Realtime para chat e atualizações de calendário.
- Políticas RLS por tabela com escopos e ownership.
