# updateNews

## Overview

Atualiza parcialmente uma notícia existente pelo seu ID. Apenas os campos enviados no body são modificados.

## Endpoint

`PUT /api/news/:id`

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

| Nome | Tipo   | Obrigatório | Descrição                    |
| ---- | ------ | ----------- | ---------------------------- |
| id   | string | SIM         | ObjectId do MongoDB (24 hex) |

## Request Body

Enviar apenas os campos que devem ser atualizados:

```json
{
  "destaque": true,
  "dataExpiracao": "2026-12-31T23:59:59Z"
}
```

## Response

### 200 OK

Retorna o documento completo atualizado:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titulo": "Governo Propõe Salário Mínimo de R$ 1.627 para 2026",
  "destaque": true,
  "dataExpiracao": "2026-12-31T23:59:59.000Z",
  "updatedAt": "2026-03-27T12:00:00.000Z"
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
  "message": "Erro de validação",
  "errors": ["categorias.0: `invalida` is not a valid enum value."]
}
```

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* Usa `findByIdAndUpdate` com `{ new: true, runValidators: true }` — retorna o documento pós-update e valida os campos enviados
* Merge parcial: campos não enviados no body são preservados
* Validações do schema (enum, required) são aplicadas mesmo na atualização

## Notes

* IDs inválidos retornam 400 via `CastError` tratado pelo errorHandler
