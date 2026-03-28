# getById

## Overview

Retorna uma notícia específica pelo seu ID do MongoDB.

## Endpoint

`GET /api/news/:id`

## Authentication

* Tipo: JWT
* Obrigatório: SIM

## Headers

| Nome          | Tipo   | Obrigatório | Descrição        |
| ------------- | ------ | ----------- | ---------------- |
| Authorization | string | SIM         | Bearer token     |
| Content-Type  | string | NÃO         | application/json |

## Query Params

Nenhum.

## Path Params

| Nome | Tipo   | Obrigatório | Descrição                   |
| ---- | ------ | ----------- | --------------------------- |
| id   | string | SIM         | ObjectId do MongoDB (24 hex) |

## Request Body

Nenhum.

## Response

### 200 OK

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
  "resumo": "...",
  "destaque": true,
  "categorias": ["economia", "orcamento"],
  "fontes": ["Agência Senado"],
  "analise": {
    "beneficiados": [],
    "efeitosPraticos": []
  },
  "dataPublicacao": "2026-03-15T10:00:00.000Z",
  "createdAt": "2026-03-15T10:00:00.000Z",
  "updatedAt": "2026-03-15T10:00:00.000Z"
}
```

### 404 Not Found

```json
{
  "message": "Notícia não encontrada"
}
```

### 400 Client Error

```json
{
  "message": "ID inválido"
}
```

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* O `id` deve ser um ObjectId válido do MongoDB (24 caracteres hexadecimais)
* Não filtra por expiração — retorna a notícia mesmo que esteja expirada

## Notes

* IDs inválidos (formato incorreto) retornam 400 via `CastError` tratado pelo errorHandler
