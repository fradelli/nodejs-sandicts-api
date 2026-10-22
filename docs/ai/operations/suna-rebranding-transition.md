---
title: Suna Backend Rebranding Transition
doc-type: implementation-guide
role: source-of-truth
priority: high
canonical: docs/ai/operations/suna-rebranding-transition.md
scope: backend, docker, brand, migration
read-when:
  - changing backend, Docker, observability, OpenAPI, or email brand identity
  - migrating a local Sandicts development environment to Suna
---

# Transição do backend para Suna

Suna é o nome do backend, dos serviços locais e da marca apresentada pela API.
Esta etapa não muda os domínios nem o contrato de autenticação existente.

## Identidade Suna

- pacote e serviço: `suna-api`;
- título do contrato: `Suna API`;
- artefato OpenAPI: `openapi/suna-api.json`;
- containers locais: `suna-postgres` e `suna-mailpit`;
- volume padrão para novos ambientes: `suna-postgres-18-data`;
- imagem e container de CI: `suna-api-ci`;
- remetente visível e conteúdo de magic link: Suna.

## Compatibilidade Sandicts preservada

- domínios, origens CORS e URLs implantadas;
- endereços de e-mail já verificados no domínio Sandicts;
- nome do cookie `sandicts_refresh_token` para não encerrar sessões existentes;
- slugs atuais da Vercel e nomes dos repositórios até a migração própria;
- variáveis e segredos existentes que referenciam infraestrutura implantada.

## Migração do PostgreSQL local

O Compose usa `POSTGRES_VOLUME_NAME`, com padrão
`suna-postgres-18-data`. Quem já possui dados no volume anterior deve manter no
arquivo `.env` local:

```env
POSTGRES_VOLUME_NAME=sandicts-postgres-18-data
```

Nesse cenário, mantenha também `POSTGRES_DB`, `POSTGRES_PASSWORD` e
`DATABASE_URL` compatíveis com o banco existente. Novas instalações usam os
defaults Suna. Essa compatibilidade evita criar um volume vazio que pareça perda
de dados; a cópia definitiva para o novo volume pode ser feita separadamente.
