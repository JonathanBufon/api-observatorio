# Observatório Cívico

Plataforma independente de transparência política que filtra narrativas, expõe mecânicas de poder e traduz o jogo político para linguagem acessível ao cidadão comum.

O sistema captura notícias automaticamente via RSS, passa por um agente de IA que analisa quem ganha, quem perde e o que está sendo escondido, e publica os relatórios em uma interface inspirada na estética de vigilância do 1984 de George Orwell.

---

## Arquitetura

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  RSS Feeds      │────→│  n8n         │────→│  API Express    │────→│  Frontend    │
│  (esq + dir)    │     │  + Agente IA │     │  + MongoDB      │     │  React       │
└─────────────────┘     └─────────────┘     └─────────────────┘     └──────────────┘

RSS Feeds: sites de notícia de diferentes espectros políticos
n8n:       orquestra o pipeline — captura, analisa via IA, salva no banco
API:       Express 5 + Mongoose + JWT — serve os dados e protege escrita
Frontend:  React + TypeScript + Tailwind — interface com tema 1984
```

---

## Stack

| Camada    | Tecnologia                                        |
|-----------|---------------------------------------------------|
| Frontend  | React 18, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend   | Node.js, Express 5, Mongoose 8, MongoDB           |
| Auth      | JWT (jsonwebtoken + bcryptjs)                     |
| Pipeline  | n8n + Agente IA (Claude/GPT)                      |
| Infra     | (a definir — Vercel/Railway/VPS)                  |

---

## Repositórios

| Repo | Descrição |
|------|-----------|
| `api-observatorio` | API REST + autenticação + models + seeds |
| (frontend — a definir) | Interface React do Observatório |

---

## Funcionalidades

### Relatórios de análise política
Cada notícia é transformada em um relatório estruturado com:

- **Resumo neutro** — reescrito sem o viés do veículo original
- **Beneficiados** — quem ganha direta e indiretamente com a medida
- **Efeitos práticos** — o que muda na vida real do cidadão
- **Cortina de fumaça** — qual narrativa está desviando atenção e do quê
- **Confronto** — discurso oficial vs o que os dados mostram
- **Raio-X** — histórico judicial e político dos agentes envolvidos
- **Glossário inline** — termos técnicos com tooltip em linguagem simples
- **Vídeo de contexto** — referência audiovisual para aprofundamento

### Grande Irmão (easter egg)
Uma TV antiga miniatura com um olho que segue o cursor do mouse. Vive nas laterais da página, foge quando você se aproxima, e desaparece temporariamente quando clicada. Referência direta à teletela do 1984.

### Pipeline automatizado
O n8n captura feeds RSS de veículos de esquerda e direita, passa o conteúdo bruto por um agente de IA com prompt apartidário, e salva o relatório estruturado no MongoDB. Termos novos são automaticamente adicionados ao glossário geral.

---

## Setup — API

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou Atlas)

### Instalação

```bash
git clone https://github.com/JonathanBufon/api-observatorio.git
cd api-observatorio
npm install
```

### Variáveis de ambiente

Criar arquivo `.env` na raiz:

```env
MONGODB_URI=mongodb://localhost:27017/observatorio-civico
JWT_SECRET=sua_chave_secreta_longa_e_aleatoria_mude_isso_em_producao
JWT_EXPIRES_IN=7d
PORT=3000
```

### Rodar

```bash
# Popular banco com dados de exemplo
node src/seed/seed.js

# Criar usuário admin
node src/seed/createAdmin.js

# Iniciar servidor
npm start
```

O servidor roda em `http://localhost:3000`.

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/register` | Criar conta | — |
| POST | `/api/auth/login` | Login (retorna token) | — |
| GET | `/api/auth/me` | Dados do usuário logado | Token |

### Notícias

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/news` | Listar todas (paginado) | — |
| GET | `/api/news/featured` | Somente destaques | — |
| GET | `/api/news/:id` | Uma notícia por ID | — |
| GET | `/api/news/title/:title` | Buscar por título | — |
| GET | `/api/news/category/:category` | Filtrar por categoria | — |
| GET | `/api/news/date/:start/:end` | Filtrar por período | — |
| POST | `/api/news` | Criar notícia | Token |
| PUT | `/api/news/:id` | Editar notícia | Token |
| DELETE | `/api/news/:id` | Remover notícia | Admin |

### Glossário

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/glossario` | Listar todos os termos | — |
| POST | `/api/glossario` | Criar termo | Token |
| PUT | `/api/glossario/:id` | Editar termo | Token |
| DELETE | `/api/glossario/:id` | Remover termo | Token |

### Categorias disponíveis

`economia` · `orcamento` · `judiciario` · `legislativo` · `saude` · `educacao` · `seguranca` · `internacional`

---

## Estrutura do JSON de uma notícia

```json
{
  "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
  "resumo": "Texto neutro resumindo o fato...",
  "linkSite": "https://...",
  "dataPublicacao": "2026-03-15T10:00:00Z",
  "dataExpiracao": "2026-09-15T23:59:59Z",
  "destaque": true,
  "categorias": ["economia", "orcamento"],
  "fontes": ["Agência Senado", "Agência Câmara"],
  "analise": {
    "beneficiados": [
      { "tipo": "direto", "descricao": "..." },
      { "tipo": "indireto", "descricao": "..." }
    ],
    "efeitosPraticos": ["...", "..."]
  },
  "cortinaFumaca": {
    "titulo": "...",
    "descricao": "...",
    "evidencias": [
      { "rotulo": "Ocultação", "texto": "..." },
      { "rotulo": "Manipulação", "texto": "..." }
    ]
  },
  "confronto": {
    "discursoOficial": "...",
    "realidade": "..."
  },
  "agentesPublicos": [
    {
      "nome": "Nome Completo",
      "iniciais": "NC",
      "cargo": "Cargo",
      "historico": "Fatos verificáveis..."
    }
  ],
  "videoReferencia": {
    "titulo": "...",
    "descricao": "...",
    "url": "https://..."
  },
  "glossario": [
    { "termo": "PLOA", "definicao": "..." }
  ]
}
```

Todos os campos exceto `titulo`, `resumo`, `categorias` e `dataPublicacao` são opcionais. O frontend renderiza condicionalmente — se um campo não existir, a seção correspondente simplesmente não aparece.

---

## Estrutura da API

```
api-observatorio/
├── server.js
├── package.json
├── .env.example
├── src/
│   ├── config/
│   │   └── mongoose.js
│   ├── models/
│   │   ├── Noticia.js
│   │   ├── Glossario.js
│   │   └── Usuario.js
│   ├── controllers/
│   │   ├── newsController.js
│   │   ├── glossarioController.js
│   │   └── authController.js
│   ├── routes/
│   │   ├── newsRoutes.js
│   │   ├── glossarioRoutes.js
│   │   └── authRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── seed/
│       ├── seed.js
│       └── createAdmin.js
```

---

## Estrutura do frontend

```
src/
├── components/
│   ├── layout/        → Header, Footer, MainLayout
│   ├── bigbrother/    → BigBrotherTV (olho que segue o mouse)
│   ├── report/        → ReportCard, AnalysisGrid, SmokeScreen,
│   │                    Confrontation, PublicProfile, VideoReference
│   ├── ui/            → VocabTag, MetaTag, SectionLabel
│   └── glossary/      → TacticalGlossary
├── data/              → Tipos TypeScript e dados estáticos
├── services/          → Comunicação com a API (fetch + JWT)
├── pages/             → HomePage, LoginPage
└── App.tsx
```

---

## Pipeline n8n

O fluxo automatizado segue estas etapas:

1. **RSS Trigger** — captura feeds de múltiplos veículos a cada 15-30 min
2. **Preparação** — extrai título, link, data e conteúdo bruto
3. **Agente IA** — analisa com prompt apartidário e retorna JSON estruturado
4. **Deduplicação** — verifica se o link já existe no banco
5. **Salvar notícia** — POST na API com token de autenticação
6. **Glossário** — compara termos novos e salva no glossário geral

Os prompts do agente estão documentados em `PROMPTS-AGENTE-N8N.md`.

---

## Design

A interface usa estética inspirada nas capas de 1984 de George Orwell:

- **Paleta escura** — fundo quase preto com acentos em vermelho carmesim e dourado âmbar
- **Tipografia** — Playfair Display (títulos), DM Sans (corpo), JetBrains Mono (labels)
- **Atmosfera de vigilância** — gradientes vermelho→dourado, ícone de olho, TV do Grande Irmão
- **Legibilidade** — apesar da atmosfera, espaçamento generoso e contraste adequado

O mockup de referência está em `/mockups/observatorio-civico.html`.

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `CONTRATO-API.md` | Schema completo, mapeamento campo→componente, JSON de exemplo |
| `PROMPT-CLAUDE-CODE.md` | Prompt para implementar o frontend React |
| `PROMPT-API-CLAUDE-CODE.md` | Prompt para completar a API |
| `PROMPTS-AGENTE-N8N.md` | Prompts do agente IA para o pipeline n8n |
| `TODO-JWT.md` | Guia educativo de implementação de JWT |
| `mockups/observatorio-civico.html` | Mockup HTML interativo com a TV do Grande Irmão |

---

## Princípios editoriais

O Observatório Cívico opera sob estas regras:

1. **Apartidário** — trata esquerda e direita com o mesmo ceticismo
2. **Factual** — dados verificáveis, nunca opinião disfarçada de análise
3. **Acessível** — linguagem que o cidadão comum entende, glossário para termos técnicos
4. **Transparente** — fontes sempre citadas, metodologia aberta
5. **Sem ads** — sem publicidade, sem patrocínio, sem conflito de interesse

---

## Contribuindo

O projeto está em desenvolvimento ativo. Para contribuir:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: descrição'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## Licença

A definir.

---

## Time

Desenvolvido por Jonathan Bufon e colaboradores.