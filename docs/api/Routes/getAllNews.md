# getAllNews

## Overview

Retorna lista paginada de todas as notícias ativas (não expiradas), ordenadas com destaques primeiro e depois por data de publicação decrescente.

## Endpoint

`GET /api/news`

## Authentication

* Tipo: JWT
* Obrigatório: SIM

## Headers

| Nome          | Tipo   | Obrigatório | Descrição        |
| ------------- | ------ | ----------- | ---------------- |
| Authorization | string | SIM         | Bearer token     |
| Content-Type  | string | NÃO         | application/json |

## Query Params

| Nome  | Tipo   | Obrigatório | Descrição                          |
| ----- | ------ | ----------- | ---------------------------------- |
| page  | number | NÃO         | Página atual (padrão: 1)           |
| limit | number | NÃO         | Quantidade por página (padrão: 10) |

## Path Params

Nenhum.

## Request Body

Nenhum.

## Response

### 200 OK

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
      "resumo": "...",
      "destaque": true,
      "categorias": ["economia", "orcamento"],
      "dataPublicacao": "2026-03-15T10:00:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 3,
  "total": 25
}
```

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* Filtra automaticamente notícias onde `dataExpiracao` já passou ou onde o campo não existe
* Destaques (`destaque: true`) aparecem antes das demais
* Dentro de cada grupo, ordena por `dataPublicacao` decrescente (mais recente primeiro)

## Notes

* Se não houver notícias, retorna `data: []` com `total: 0`
* `totalPages` é calculado como `Math.ceil(total / limit)`
