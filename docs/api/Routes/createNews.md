# createNews

## Overview

Cria uma nova notícia no banco de dados.

## Endpoint

`POST /api/news`

## Authentication

* Tipo: JWT
* Obrigatório: SIM

## Headers

| Nome          | Tipo   | Obrigatório | Descrição        |
| ------------- | ------ | ----------- | ---------------- |
| Authorization | string | SIM         | Bearer token     |
| Content-Type  | string | SIM         | application/json |

## Query Params

Nenhum.

## Path Params

Nenhum.

## Request Body

```json
{
  "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
  "resumo": "Descrição introdutória da notícia.",
  "linkSite": "https://exemplo.com/noticia",
  "dataPublicacao": "2026-03-15T10:00:00Z",
  "dataExpiracao": "2026-09-15T23:59:59Z",
  "destaque": true,
  "categorias": ["economia", "orcamento"],
  "fontes": ["Agência Senado", "Portal da Transparência"],
  "analise": {
    "beneficiados": [
      { "tipo": "direto", "descricao": "Trabalhadores que recebem o piso." },
      { "tipo": "indireto", "descricao": "Mercado financeiro." }
    ],
    "efeitosPraticos": [
      "O aumento segue regra fiscal que limita ganho real a 2,5% ao ano."
    ]
  },
  "cortinaFumaca": {
    "titulo": "A Narrativa do Imposto para os Ricos",
    "descricao": "Descrição da cortina de fumaça.",
    "evidencias": [
      { "rotulo": "Ocultação", "texto": "Texto da evidência." }
    ]
  },
  "confronto": {
    "discursoOficial": "O orçamento é socialmente equilibrado.",
    "realidade": "O reajuste está atrelado a travas fiscais."
  },
  "agentesPublicos": [
    {
      "nome": "Luiz Inácio Lula da Silva",
      "iniciais": "L",
      "cargo": "Presidente",
      "historico": "Histórico do agente público."
    }
  ],
  "videoReferencia": {
    "titulo": "Título do vídeo",
    "descricao": "Descrição do vídeo.",
    "url": "https://youtube.com/watch?v=exemplo"
  },
  "glossario": [
    { "termo": "PLOA", "definicao": "Projeto de Lei Orçamentária Anual." }
  ]
}
```

### Campos obrigatórios

| Campo      | Tipo     | Descrição               |
| ---------- | -------- | ----------------------- |
| `titulo`   | string   | Título da notícia       |
| `resumo`   | string   | Parágrafo introdutório  |
| `categorias` | array  | Ao menos uma categoria válida |

### Campos opcionais

Todos os demais campos são opcionais. O frontend renderiza condicionalmente — seções ausentes simplesmente não aparecem.

## Response

### 201 Created

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
  "resumo": "...",
  "destaque": false,
  "categorias": ["economia"],
  "dataPublicacao": "2026-03-15T10:00:00.000Z",
  "createdAt": "2026-03-15T10:00:00.000Z",
  "updatedAt": "2026-03-15T10:00:00.000Z"
}
```

### 400 Client Error

```json
{
  "message": "Erro de validação",
  "errors": ["titulo: Path `titulo` is required."]
}
```

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* Validação feita pelo schema do Mongoose (`required`, `enum`, `trim`)
* `destaque` tem default `false` se não informado
* `dataPublicacao` tem default `Date.now` se não informada
* Valores de `categorias` devem estar entre: `economia`, `orcamento`, `judiciario`, `legislativo`, `saude`, `educacao`, `seguranca`, `internacional`
* Valores de `analise.beneficiados[].tipo` devem ser `direto` ou `indireto`

## Notes

* O documento retornado já inclui o `_id` gerado pelo MongoDB e os campos `createdAt`/`updatedAt`
