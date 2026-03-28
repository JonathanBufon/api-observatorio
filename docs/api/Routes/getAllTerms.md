# getAllTerms

## Overview

Retorna todos os termos do glossário geral do site, ordenados alfabeticamente.

## Endpoint

`GET /api/glossario`

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

Nenhum.

## Request Body

Nenhum.

## Response

### 200 OK

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "termo": "PLOA",
    "definicao": "Projeto de Lei Orçamentária Anual. Define quanto o governo planeja arrecadar e gastar no ano seguinte.",
    "createdAt": "2026-03-15T10:00:00.000Z",
    "updatedAt": "2026-03-15T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "termo": "pacote fiscal",
    "definicao": "Conjunto de medidas econômicas para controle de gastos públicos.",
    "createdAt": "2026-03-15T10:00:00.000Z",
    "updatedAt": "2026-03-15T10:00:00.000Z"
  }
]
```

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* Retorna todos os termos sem paginação, ordenados por `termo` em ordem alfabética (A → Z)
* Este glossário é global — diferente do `glossario` embutido em cada notícia, que contém apenas os termos relevantes àquele relatório

## Notes

* Retorna array vazio `[]` se não houver termos cadastrados
