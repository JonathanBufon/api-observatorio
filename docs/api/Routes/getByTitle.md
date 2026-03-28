# getByTitle

## Overview

Busca notícias cujo título contenha o termo informado, com correspondência parcial e sem distinção de maiúsculas/minúsculas.

## Endpoint

`GET /api/news/title/:title`

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

| Nome  | Tipo   | Obrigatório | Descrição                             |
| ----- | ------ | ----------- | ------------------------------------- |
| title | string | SIM         | Termo a ser buscado no campo `titulo` |

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

* A busca usa regex com a flag `i` (case-insensitive) no campo `titulo`
* Retorna todas as correspondências parciais (ex: `salario` encontra `Salário Mínimo`)
* Resultados ordenados por `dataPublicacao` decrescente

## Notes

* Retorna array vazio `[]` caso nenhuma notícia corresponda ao termo
* Não filtra notícias expiradas
