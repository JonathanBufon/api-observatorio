# createTerm

## Overview

Cria um novo termo no glossário geral do site.

## Endpoint

`POST /api/glossario`

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
  "termo": "renúncia fiscal",
  "definicao": "Quando o governo abre mão de receber dinheiro de impostos."
}
```

| Campo      | Tipo   | Obrigatório | Descrição             |
| ---------- | ------ | ----------- | --------------------- |
| `termo`    | string | SIM         | O termo a ser definido (único no banco) |
| `definicao`| string | SIM         | Definição do termo    |

## Response

### 201 Created

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "termo": "renúncia fiscal",
  "definicao": "Quando o governo abre mão de receber dinheiro de impostos.",
  "createdAt": "2026-03-27T10:00:00.000Z",
  "updatedAt": "2026-03-27T10:00:00.000Z"
}
```

### 400 Client Error

```json
{
  "message": "Erro de validação",
  "errors": ["termo: Path `termo` is required."]
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

* O campo `termo` é único (`unique: true`) — tentar inserir um termo já existente retorna 409
* O `termo` passa por `trim` automático antes de ser salvo

## Notes

* O 409 é gerado pelo errorHandler ao capturar o erro de índice único do MongoDB (código `11000`)
