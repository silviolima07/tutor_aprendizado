# Tarefas: Refatoração Admin vs Aluno

- `[/]` **Dashboard Admin**
  - `[ ]` Atualizar `/mock/finops` no backend (`routers.py`) para incluir métricas do sistema (Total de Alunos, Aproveitamento Global, Ranking de Fontes).
  - `[ ]` Reescrever `Dashboard.jsx` para exibir apenas os cards do sistema quando o perfil for Admin (remover dados de estudante).
- `[ ]` **Dashboard Aluno**
  - `[ ]` Ocultar FinOps.
  - `[ ]` Exibir saudação pessoal e métricas de estudo exclusivas do aluno.
- `[ ]` **Wizard do Aluno (Onboarding)**
  - `[ ]` Refatorar `ConfigForm.jsx` para um modelo de passos (Etapas).
  - `[ ]` Etapa 1: Definir o que aprender e fontes.
  - `[ ]` Etapa 2: Simular busca e mostrar ementa gerada baseada na escolha.
  - `[ ]` Etapa 3: Definir Data Final de Estudos (Deadline).
  - `[ ]` Salvar preferências simuladas para visualização no Progresso.
