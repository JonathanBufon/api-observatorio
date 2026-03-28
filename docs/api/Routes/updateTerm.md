# updateTerm

## Overview

Atualiza um termo existente no glossário geral pelo seu ID.

## Endpoint

`PUT /api/glossario/:id`

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

Enviar os campos que devem ser atualizados:

```json
{
  "definicao": "Nova definição mais detalhada do termo."
}
```

## Response

### 200 OK

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "termo": "renúncia fiscal",
  "definicao": "Nova definição mais detalhada do termo.",
  "createdAt": "2026-03-15T10:00:00.000Z",
  "updatedAt": "2026-03-27T12:00:00.000Z"
}
```

### 404 Not Found

```json
{
  "message": "Termo não encontrado"
}
```

### 400 Client Error

```json
{
  "message": "ID inválido"
}
```

### 409 Conflict

```json
{
  "message": "Registro duplicado"
}
```

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* Usa `findByIdAndUpdate` com `{ new: true, runValidators: true }` — retorna o documento atualizado
* Merge parcial: campos não enviados são preservados
* Se tentar alterar `termo` para um valor já existente, retorna 409

## Notes

* IDs inválidos retornam 400 via `CastError` tratado pelo errorHandler
