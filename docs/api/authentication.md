# Autenticacao

Na v1, a API publica e somente leitura. Os endpoints de coleta RSS e analise por IA continuam disponiveis apenas via Artisan:

```bash
docker compose exec app php artisan rss:fetch
docker compose exec app php artisan ai:analyze --limit=10
```

Atalhos equivalentes do Makefile:

```bash
make fetch
make artisan CMD="ai:analyze --limit=10"
```

Essa decisao evita expor pela web operacoes que alteram dados, consomem recursos externos ou geram custo de IA.

Quando houver painel administrativo ou integracao segura, endpoints administrativos devem ficar sob `/api/v1/admin/*` e exigir autenticacao explicita.
