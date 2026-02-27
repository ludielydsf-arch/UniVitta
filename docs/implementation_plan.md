# Plano de Implementação e Testes

## Fases
- Fase 1: Autenticação e CRUD básico (concluída).
- Fase 2: Agendamento e Prontuário com Storage.
- Fase 3: Financeiro e Estoque.
- Fase 4: Relatórios/BI e Comunicação em tempo real.
- Fase 5: Portal do Paciente e reforço de segurança/2FA.
- Fase 6: Offline-first e API REST de integração.

## Testes
- Unitários de utilitários e validações.
- Integração Supabase: tabelas, políticas e storage.
- E2E navegando pelos módulos principais.
- Performance: carga em listagens e calendário.
- Segurança: verificação de RLS por perfil.

## Entregas
- Deploy dev local via Node/Express.
- Scripts SQL para schema e RLS no Supabase.
- Documentação de arquitetura e manual de usuário.
