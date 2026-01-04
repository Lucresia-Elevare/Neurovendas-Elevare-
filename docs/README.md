# Documentação - Neurovendas-Elevare

Esta pasta contém toda a documentação técnica e de produto do projeto.

## 📁 Estrutura

### `/guides` - Guias e Tutoriais
Guias de uso, tutoriais passo a passo e documentação de usuário.

**Tipos de conteúdo:**
- Guias de instalação e configuração
- Tutoriais de uso da plataforma
- FAQs e troubleshooting
- Guias de início rápido

**Exemplo de arquivo:**
```markdown
/guides/instalacao-ambiente-desenvolvimento.md
/guides/tutorial-criacao-primeiro-prompt.md
/guides/faq-perguntas-frequentes.md
```

### `/architecture` - Arquitetura Técnica
Documentação de arquitetura, decisões técnicas e especificações.

**Tipos de conteúdo:**
- Diagramas de arquitetura (C4, UML, etc.)
- Architecture Decision Records (ADRs)
- Especificações técnicas detalhadas
- Documentação de infraestrutura

**Exemplo de arquivo:**
```markdown
/architecture/adr-001-escolha-framework-frontend.md
/architecture/diagrama-arquitetura-geral.md
/architecture/especificacao-banco-dados.md
```

### `/api` - Documentação de APIs
Documentação de APIs REST, GraphQL e integrações.

**Tipos de conteúdo:**
- Especificações OpenAPI/Swagger
- Exemplos de requisições e respostas
- Guias de integração com APIs
- Documentação de webhooks

**Exemplo de arquivo:**
```markdown
/api/openapi-v1.yaml
/api/guia-autenticacao.md
/api/exemplos-integracao.md
```

## 📝 Convenções

### Nomenclatura de Arquivos
- Use kebab-case: `meu-documento.md`
- Seja descritivo: `guia-instalacao-docker.md`
- Inclua versão quando aplicável: `api-reference-v2.md`

### Formato
- Use Markdown (`.md`) para documentos de texto
- Use formatos específicos quando apropriado (`.yaml` para OpenAPI, `.drawio` para diagramas)

### Estrutura de Documento
```markdown
# Título do Documento

Breve descrição do propósito do documento.

## Índice
- [Seção 1](#seção-1)
- [Seção 2](#seção-2)

## Seção 1
Conteúdo...

## Seção 2
Conteúdo...

## Referências
Links e recursos relacionados.
```

### ADRs (Architecture Decision Records)
Use o formato:
```markdown
# ADR-XXX: Título da Decisão

## Status
Proposto | Aceito | Rejeitado | Depreciado | Substituído por ADR-YYY

## Contexto
Descrição do problema e contexto.

## Decisão
A decisão tomada.

## Consequências
Impactos positivos e negativos da decisão.

## Alternativas Consideradas
Outras opções avaliadas.
```

## 🚀 Como Contribuir

1. Identifique a pasta apropriada para seu documento
2. Crie o arquivo seguindo as convenções
3. Use linguagem clara e objetiva
4. Inclua exemplos práticos
5. Adicione diagramas quando necessário
6. Revise ortografia e formatação
7. Submeta via Pull Request

## 📚 Recursos

- [Markdown Guide](https://www.markdownguide.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record)
- [C4 Model](https://c4model.com/)

## 🔗 Links Úteis

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guia de contribuição
- [STRUCTURE.md](../STRUCTURE.md) - Estrutura do repositório
- [VERSIONING.md](../VERSIONING.md) - Guia de versionamento
