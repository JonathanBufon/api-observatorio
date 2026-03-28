# deleteTerm

## Overview

Remove permanentemente um termo do glossário geral pelo seu ID.

## Endpoint

`DELETE /api/glossario/:id`

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

| Nome | Tipo   | Obrigatório | Descrição                    |
| ---- | ------ | ----------- | ---------------------------- |
| id   | string | SIM         | ObjectId do MongoDB (24 hex) |

## Request Body

Nenhum.

## Response

### 200 OK

```json
{
  "message": "Termo removido"
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

### 5XX Server Error

```json
{
  "message": "Erro interno do servidor"
}
```

## Business Rules

* A remoção é permanente e irreversível
* Usa `findByIdAndDelete` — retorna 404 se o termo não existir

## Notes

* IDs inválidos (formato incorreto) retornam 400 via `CastError` tratado pelo errorHandler
* Remover um termo do glossário geral não afeta os campos `glossario` embutidos nas notícias
