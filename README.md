<<<<<<< HEAD
# 🎓 Tutor de Aprendizado com IA Generativa

> Plataforma de aprendizado personalizado que usa IA Generativa para criar trilhas de estudo sob medida, curar conteúdos de múltiplas fontes e adaptar o ritmo ao perfil do aluno.

---

## 🔗 Links

| Recurso | URL |
|---------|-----|
| 🌐 **Endpoint público** | *(link do HF Space — preencher após deploy)* |
| 💻 **Repositório GitHub** | https://github.com/silviolima07/tutor_aprendizado |

---

## 📌 1. Descrição do Problema e da Solução Proposta

### O Problema

Aprender um assunto novo de forma eficiente é um desafio genuíno: não falta conteúdo na internet — falta **curadoria, sequência lógica e adaptação ao nível de quem aprende**. Um estudante que quer aprender "Machine Learning" encontra desde vídeos para iniciantes até papers técnicos, sem saber por onde começar, quanto tempo vai levar, nem se está no caminho certo.

### A Solução

O **Tutor de Aprendizado** é uma plataforma web que resolve esse problema em três camadas:

1. **Onboarding inteligente (Wizard):** O aluno informa o tema que quer aprender, seu nível atual e as fontes que prefere (YouTube, Medium, GitHub, Documentação, Artigos Acadêmicos). A IA pesquisa essas fontes e monta uma **ementa personalizada com módulos e aulas** — como um professor que preparou a aula especificamente para você.

2. **Trilha de aprendizado estruturada:** Dashboard com progresso, aulas com vídeo + resumo + materiais complementares, quiz de fixação com correção automática e sistema de badges para gamificação.

3. **Chatbot com RAG simulado:** Dentro de cada aula, o aluno pode tirar dúvidas com um chatbot que cita a fonte específica da resposta (ex: `Fonte: Vídeo aula (02:15)`), simulando o comportamento de um sistema de Recuperação Aumentada por Geração (RAG).

### Como a IA Será Integrada no Futuro

Esta versão usa dados **simulados (mock)**. Na versão com IA real, cada componente teria um LLM responsável:

| Componente | Mock atual | IA futura |
|------------|-----------|-----------|
| Geração de ementa | Lista estática de 4 módulos | GPT-4o buscando via web search nas fontes selecionadas |
| Resumo de vídeo | Texto fixo | Whisper (transcrição) + LLM (sumarização) |
| Chatbot | Regras por palavras-chave | RAG com embeddings + ChromaDB + GPT-4o |
| Quiz | Perguntas fixas | LLM gerando questões a partir do conteúdo da aula |

A arquitetura foi desenhada com essa evolução em mente: cada endpoint do backend tem um prefixo `/mock/` que será substituído por chamadas reais ao LLM na etapa seguinte.

---

## 🏗️ 2. Escolhas de Design

### Stack Tecnológica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Backend | **FastAPI (Python)** | Geração de alta qualidade por agentes de IA; suporte nativo a async; fácil integração futura com LangChain/OpenAI |
| Frontend | **React + Vite** | Componentes reutilizáveis; agentes geram JSX com consistência; Vite é mais rápido que CRA |
| Estilização | **TailwindCSS** | Permite estilo inline semântico que os agentes de IA dominam muito bem |
| Dados falsos | **Faker (Python)** | Gera dados realistas de alunos e interações sem banco de dados, mantendo o projeto leve |
| Deploy | **Docker + Hugging Face Spaces** | Gratuito, persistente, sem configuração de servidor |

### Decisão: Tudo em um único container

O Vite foi configurado para gerar o build diretamente em `backend/static/`. O FastAPI serve esses arquivos como estáticos e responde com o `index.html` em qualquer rota (necessário para o React Router funcionar em produção). Essa abordagem elimina a necessidade de um servidor web separado (Nginx), simplificando o deploy.

### Decisão: Dados Mock no Frontend (fallback offline)

O Dashboard não trava se o backend estiver offline. Ele usa dados locais como fallback e exibe um aviso amarelo para o usuário. Isso foi uma decisão deliberada para garantir que a demo sempre funcione — mesmo que o backend demmore para iniciar no HF Spaces.

### Decisão: Dois Perfis de Usuário (RBAC simulado)

A aplicação simula dois papéis distintos:
- **Aluno:** Vê sua trilha pessoal, progresso, badges e chatbot com RAG.
- **Admin:** Vê o painel operacional (LLMOps & FinOps) com tokens consumidos, custos, e relatório mensal — invisível para alunos.

Esse design demonstra como uma plataforma real seria estruturada para um cliente empresarial (B2B), onde a empresa contrata o sistema e os administradores monitoram o uso e os custos de inferência.

### Alternativas Consideradas e Descartadas

- **Gradio / Streamlit:** Mais simples de subir, mas limitados para UX complexa com múltiplas telas e RBAC.
- **SQLite para persistência:** Planejado para a Etapa 2. Nesta versão, o estado do aluno é salvo em `localStorage` no navegador, eliminando a necessidade de banco de dados.
- **Next.js:** Considerado, mas React + Vite é mais simples de configurar com agentes de IA.

---

## ✅ 3. O que Funcionou — Experiência com o Agente de Codificação

O agente utilizado foi o **Antigravity (baseado no Google Gemini)**, acessado diretamente pelo IDE.

### O que o agente gerou com excelente qualidade

**Estrutura inicial do projeto** — O seguinte prompt gerou toda a base do projeto em uma única iteração:

> *"Crie uma aplicação web de tutor de aprendizado com IA. Use FastAPI no backend e React + Vite no frontend. O frontend deve ter as páginas: Landing, ConfigForm (formulário de configuração), Dashboard, Lesson (aula com vídeo), Quiz e Progress. O backend deve ter endpoints mock que retornam dados simulados. Use TailwindCSS."*

O agente criou corretamente: a estrutura de pastas, o `App.jsx` com rotas, os 6 componentes de página, o `main.py` com CORS e os primeiros endpoints.

**Wizard de onboarding multi-passo** — Prompt que funcionou muito bem:

> *"Transforme o ConfigForm em um wizard com 3 etapas: (1) tema e fontes de pesquisa, (2) tela de loading simulando IA buscando com mensagens rotativas em estilo terminal, (3) ementa gerada com módulos e aulas, (4) definição do prazo com slider de horas/dia. Use animações de transição entre etapas."*

O agente entregou exatamente o comportamento descrito, incluindo o `setTimeout` de 4 segundos para simular o tempo de busca da IA e o terminal verde com `animate-pulse`.

**Separação Admin vs Aluno (RBAC)** — Este foi o pedido mais complexo e funcionou bem:

> *"Crie um contexto React global (UserContext) que controla o papel do usuário (aluno ou admin). O Header deve ter um select para trocar de perfil. O Dashboard deve mostrar componentes completamente diferentes dependendo do papel: o Admin vê métricas globais da plataforma (FinOps, tokens, custos, fontes de dados), o Aluno vê seu progresso pessoal."*

**Chatbot com metadados de RAG e Judge** — Prompt preciso gerou o resultado correto:

> *"No Chatbot, após cada resposta, mostre uma citação da fonte (RAG) para todos os usuários. Para admins, mostre adicionalmente um painel de debug com métricas de qualidade (Groundedness, Relevance) e custo em tokens."*

---

## ⚠️ 4. O que Não Funcionou — Limitações Encontradas

### Problema 1: URL hardcoded do backend

O agente fixou `http://localhost:8000/api` como URL do backend em **todos os arquivos** (`ConfigForm.jsx`, `Dashboard.jsx`, `Lesson.jsx`). Em produção no HF Spaces, tudo roda no mesmo container, então as chamadas de API devem ser relativas (ex: `/api/mock/finops`). Foi necessário intervir manualmente para corrigir isso.

**Solução adotada:** O Dashboard foi refatorado para usar URLs relativas e incluir fallback com dados locais caso o fetch falhe.

### Problema 2: React Router e deploy em produção

O agente não configurou automaticamente o `main.py` para servir o `index.html` em todas as rotas. Ao acessar diretamente `/dashboard` em produção, o FastAPI retornava 404 porque não conhecia essa rota. Foi necessário adicionar manualmente a rota catch-all no backend:

```python
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse(os.path.join(static_dir, "index.html"))
```

### Problema 3: `.gitignore` incompleto

O agente criou um `.gitignore` básico que ignorava `.venv` e `__pycache__`, mas esqueceu de `node_modules/`, `dist/`, `backend/static/` (build do Vite) e os arquivos de metadados gerados pelo IDE. Precisou de correção manual.

### Problema 4: Componentes muito acoplados

Nos primeiros rascunhos, o `Dashboard.jsx` misturava lógica de admin e aluno no mesmo componente, tornando o código confuso. O agente não propôs espontaneamente a separação em `AdminDashboard` e `StudentDashboard` — isso foi solicitado explicitamente em um prompt de refinamento.

### Problema 5: Tailwind não instalado por padrão

O agente gerou código usando classes do Tailwind sem verificar se as dependências (`tailwindcss`, `postcss`, `autoprefixer`) estavam corretamente instaladas e configuradas. O `postcss.config.cjs` e `tailwind.config.js` precisaram ser revisados manualmente.

### O que faria diferente

- Separaria o prompt inicial em partes menores: primeiro a estrutura, depois a estilização, depois a lógica de cada tela.
- Pediria explicitamente URLs relativas desde o início.
- Pediria ao agente para criar um arquivo `.env` ou `config.js` centralizado para a URL da API.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (desenvolvimento)

```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

### Build para produção (opcional)

```bash
cd frontend
npm run build
# O build vai para backend/static/
# Depois acesse: http://localhost:8000
```

---

## 🐳 Deploy no Hugging Face Spaces

O projeto usa um `Dockerfile` multi-stage:
1. **Stage 1 (Node):** Instala dependências e faz o build do React → `backend/static/`
2. **Stage 2 (Python):** Instala o FastAPI e serve o build estático + API na porta 7860

```bash
# Adicionar o Space como remote
git remote add space https://huggingface.co/spaces/SEU_USUARIO/tutor-aprendizado

# Push para o Space
git push space main
```

---

## 📁 Estrutura do Projeto

```
tutor_aprendizado/
├── backend/
│   ├── main.py           # FastAPI app + serve estáticos
│   ├── routers.py        # Todos os endpoints /api/mock/*
│   ├── faker_mock.py     # Geração de dados falsos realistas
│   ├── requirements.txt
│   └── static/           # Build do React (gerado pelo Vite)
├── frontend/
│   ├── src/
│   │   ├── pages/        # Landing, ConfigForm, Dashboard, Lesson, Quiz, Progress
│   │   ├── components/   # Header (com RBAC), Footer, Chatbot
│   │   └── context/      # UserContext (controle de perfil)
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🤖 Agente de Codificação Utilizado

**Antigravity IDE** (baseado no Google Gemini — modelo Claude Sonnet via interface do Gemini Advanced)

O desenvolvimento foi feito inteiramente através de prompts em linguagem natural no IDE. Todas as telas, componentes, endpoints e o Dockerfile foram gerados pelo agente com supervisão e ajustes manuais pontuais documentados na seção "O que não funcionou".
=======
# tutor_aprendizado
Uma aplicação para auxiliar o aluno no aprendizado de assuntos diversos.


<img width="766" height="345" alt="image" src="https://github.com/user-attachments/assets/f4ad4f85-59db-4d06-877e-4ab8b434e87c" />

<img width="839" height="393" alt="image" src="https://github.com/user-attachments/assets/8aa1a224-6fda-4fdd-ae8c-24eec1aa5818" />

<img width="994" height="557" alt="image" src="https://github.com/user-attachments/assets/c098ac9b-59cc-43ba-aeb8-5116c63d9c7e" />

<img width="834" height="522" alt="image" src="https://github.com/user-attachments/assets/d63c9b34-b53a-4295-8246-9da13650207e" />

<img width="1146" height="583" alt="image" src="https://github.com/user-attachments/assets/b4888d3f-d536-4133-a2f8-e66ca966e504" />




>>>>>>> b8b581ef1bc51c581aa7914224f1a8f6004a7f98
