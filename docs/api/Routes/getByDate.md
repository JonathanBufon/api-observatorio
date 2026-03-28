# getByDate

## Overview

Retorna notícias publicadas dentro de um intervalo de datas específico.

## Endpoint

`GET /api/news/date/:startDate/:endDate`

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

| Nome      | Tipo   | Obrigatório | Descrição                              |
| --------- | ------ | ----------- | -------------------------------------- |
| startDate | string | SIM         | Data inicial no formato ISO 8601       |
| endDate   | string | SIM         | Data final no formato ISO 8601         |

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
    "categorias": ["economia"],
    "dataPublicacao": "2026-03-15T10:00:00.000Z"
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

* Filtra pelo campo `dataPublicacao` entre `startDate` (inclusivo) e `endDate` (inclusivo)
* Resultados ordenados por `dataPublicacao` decrescente

## Notes

* Formato esperado: `YYYY-MM-DD` ou ISO 8601 completo (ex: `2026-01-01` ou `2026-01-01T00:00:00Z`)
* Exemplo de uso: `GET /api/news/date/2026-01-01/2026-12-31`
* Retorna array vazio `[]` se nenhuma notícia for encontrada no intervalo
