# getByCategory

## Overview

Retorna todas as notícias pertencentes a uma categoria específica.

## Endpoint

`GET /api/news/category/:category`

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

| Nome     | Tipo   | Obrigatório | Descrição                        |
| -------- | ------ | ----------- | -------------------------------- |
| category | string | SIM         | Nome da categoria (ver valores abaixo) |

## Request Body

Nenhum.

## Categorias válidas

| Valor          | Descrição               |
| -------------- | ----------------------- |
| `economia`     | Economia                |
| `orcamento`    | Orçamento               |
| `judiciario`   | Judiciário              |
| `legislativo`  | Legislativo             |
| `saude`        | Saúde                   |
| `educacao`     | Educação                |
| `seguranca`    | Segurança               |
| `internacional`| Internacional           |

## Response

### 200 OK

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
    "resumo": "...",
    "categorias": ["economia", "orcamento"],
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

* Busca no array `categorias` — uma notícia pode pertencer a múltiplas categorias
* Resultados ordenados por `dataPublicacao` decrescente
* Não filtra notícias expiradas

## Notes

* Retorna array vazio `[]` se nenhuma notícia pertencer à categoria informada
* Categorias são armazenadas em minúsculas sem acento — usar exatamente os valores da tabela acima
