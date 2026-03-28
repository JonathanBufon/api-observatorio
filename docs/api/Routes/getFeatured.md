# getFeatured

## Overview

Retorna todas as notícias marcadas como destaque que ainda não expiraram.

## Endpoint

`GET /api/news/featured`

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
    "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
    "resumo": "...",
    "destaque": true,
    "categorias": ["economia", "orcamento"],
    "dataPublicacao": "2026-03-15T10:00:00.000Z",
    "dataExpiracao": "2026-09-15T23:59:59.000Z"
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

* Filtra `destaque: true` combinado com notícias não expiradas (`dataExpiracao >= now` ou campo ausente)
* Resultados ordenados por `dataPublicacao` decrescente

## Notes

* Esta rota deve estar registrada **antes** de `GET /api/news/:id` no arquivo de rotas, caso contrário o Express interpreta `featured` como um parâmetro de ID
* Retorna array vazio `[]` se não houver destaques ativos
