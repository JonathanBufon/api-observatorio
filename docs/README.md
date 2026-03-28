# **Todas as Documentações devem conter a estrutura abaixo:**

# {{ROUTE_NAME}}

## Overview

Descrição direta da rota.

## Endpoint

`{{METHOD}} /{{PATH}}`

## Authentication

* Tipo: {{NONE | JWT | API KEY | SESSION}}
* Obrigatório: {{SIM | NÃO}}

## Headers

| Nome            | Tipo     | Obrigatório | Descrição     |
| --------------- | -------- | ----------- | ------------- |
| {{header_name}} | {{type}} | {{SIM/NÃO}} | {{descrição}} |

## Query Params

| Nome           | Tipo     | Obrigatório | Descrição     |
| -------------- | -------- | ----------- | ------------- |
| {{param_name}} | {{type}} | {{SIM/NÃO}} | {{descrição}} |

## Path Params

| Nome           | Tipo     | Obrigatório | Descrição     |
| -------------- | -------- | ----------- | ------------- |
| {{param_name}} | {{type}} | {{SIM/NÃO}} | {{descrição}} |

## Request Body

```json
{
  "{{field}}": "{{value}}"
}
```

## Response

### 200 OK

```json
{
  "success": true,
  "data": {}
}
```

### 4XX Client Error

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

### 5XX Server Error

```json
{
  "success": false,
  "error": "Erro interno"
}
```

## Business Rules

* Regra 1
* Regra 2

## Notes

* Observações adicionais

---

# Exemplo: getAllTerms

## Overview

Retorna todos os termos cadastrados.

## Endpoint

`GET /terms`

## Authentication

* Tipo: JWT
* Obrigatório: SIM

## Headers

| Nome          | Tipo   | Obrigatório | Descrição    |
| ------------- | ------ | ----------- | ------------ |
| Authorization | string | SIM         | Bearer token |

## Query Params

| Nome  | Tipo   | Obrigatório | Descrição             |
| ----- | ------ | ----------- | --------------------- |
| page  | number | NÃO         | Página atual          |
| limit | number | NÃO         | Quantidade por página |

## Response

### 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Termo exemplo"
    }
  ]
}
```

## Business Rules

* Retorna lista paginada
* Ordenação padrão por ID

## Notes

* Caso não existam registros, retorna array vazio
