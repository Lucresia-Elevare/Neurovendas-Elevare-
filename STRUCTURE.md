# Estrutura do Repositório Neurovendas-Elevare

## 📁 Visão Geral da Estrutura

Este documento descreve a organização de pastas e arquivos do repositório Neurovendas-Elevare, garantindo clareza, organização e escalabilidade futura.

## 🗂️ Estrutura de Pastas

### `/docs` - Documentação
Toda documentação técnica e de produto do projeto.

- **`/docs/guides`** - Guias de uso e tutoriais
  - Guias de instalação
  - Tutoriais passo a passo
  - FAQs e troubleshooting
  
- **`/docs/architecture`** - Documentação de arquitetura
  - Diagramas de arquitetura
  - Decisões técnicas (ADRs)
  - Especificações técnicas
  
- **`/docs/api`** - Documentação de APIs
  - Especificações OpenAPI/Swagger
  - Exemplos de uso de API
  - Guias de integração

### `/prompts` - Prompts de IA
Todos os prompts utilizados para geração de conteúdo com IA.

- **`/prompts/sales`** - Prompts de vendas
  - Scripts de vendas
  - Respostas a objeções
  - Fechamento de vendas
  
- **`/prompts/content`** - Prompts de criação de conteúdo
  - Posts para redes sociais
  - Artigos de blog
  - E-mails marketing
  
- **`/prompts/strategy`** - Prompts estratégicos
  - Análise de mercado
  - Planejamento estratégico
  - Análise de concorrência

### `/apps` - Aplicações
Código-fonte das aplicações da plataforma.

- **`/apps/web`** - Aplicação web
  - Frontend da plataforma
  - Interface de usuário
  
- **`/apps/mobile`** - Aplicação mobile
  - Apps iOS/Android
  - Aplicativos nativos
  
- **`/apps/api`** - APIs e serviços backend
  - Serviços REST/GraphQL
  - Microserviços
  - Integrações

### `/methods` - Métodos e Frameworks
Metodologias, frameworks e processos de negócio.

- **`/methods/frameworks`** - Frameworks proprietários
  - Framework de Neurovendas
  - Metodologias de conversão
  - Frameworks de autoridade digital
  
- **`/methods/processes`** - Processos de negócio
  - Processos de vendas
  - Processos de onboarding
  - Processos de suporte
  
- **`/methods/workflows`** - Workflows e automações
  - Fluxos de trabalho documentados
  - Automações de processos
  - Integrações entre sistemas

### `/content` - Conteúdo Estratégico
Conteúdo de marketing, treinamento e estratégia.

- **`/content/strategic`** - Conteúdo estratégico
  - Planos estratégicos
  - Posicionamento de marca
  - Análises de mercado
  
- **`/content/marketing`** - Material de marketing
  - Campanhas
  - Copy de vendas
  - Material promocional
  
- **`/content/training`** - Material de treinamento
  - Cursos e módulos
  - Materiais didáticos
  - Certificações

### `/.github` - Configurações do GitHub
Arquivos de configuração do GitHub.

- **`/.github/ISSUE_TEMPLATE`** - Templates de issues
- **`/.github/workflows`** - GitHub Actions workflows

## 📝 Convenções de Nomenclatura

### Arquivos
- Use nomes descritivos em português ou inglês
- Use kebab-case para nomes de arquivos: `meu-arquivo.md`
- Use snake_case para scripts: `deploy_script.sh`
- Inclua a data em arquivos versionados: `relatorio-2026-01.md`

### Pastas
- Use nomes em minúsculas
- Use nomes singulares quando apropriado
- Seja específico e descritivo

### Branches
- `main` - branch principal de produção
- `develop` - branch de desenvolvimento
- `feature/nome-da-feature` - novas funcionalidades
- `fix/nome-do-fix` - correções
- `docs/nome-da-doc` - documentação

## 🔖 Versionamento

### Semantic Versioning (SemVer)
Seguimos o padrão SemVer: `MAJOR.MINOR.PATCH`

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

### Tags
- Use tags para releases: `v1.0.0`, `v1.1.0`, etc.
- Use tags para marcos importantes: `v1.0.0-beta`, `v1.0.0-rc1`

## 📋 README em Cada Pasta

Cada pasta principal deve conter um arquivo `README.md` explicando:
- Propósito da pasta
- Tipo de conteúdo que deve ser armazenado
- Convenções específicas da pasta
- Exemplos de uso

## 🔍 Identificação de Tipo de Conteúdo

Ao adicionar novos arquivos, identifique o tipo:

| Tipo | Pasta de Destino | Exemplos |
|------|------------------|----------|
| Documentação técnica | `/docs` | Guias, ADRs, especificações |
| Prompts de IA | `/prompts` | Templates de prompts, scripts |
| Código de aplicação | `/apps` | Frontend, backend, mobile |
| Métodos/Frameworks | `/methods` | Metodologias, processos |
| Conteúdo estratégico | `/content` | Marketing, treinamento |

## 🚀 Próximos Passos

Para contribuir com este repositório:
1. Leia o arquivo `CONTRIBUTING.md`
2. Leia o arquivo `VERSIONING.md`
3. Identifique o tipo de conteúdo que deseja adicionar
4. Coloque o arquivo na pasta apropriada
5. Siga as convenções de nomenclatura
6. Abra um Pull Request com descrição clara

## 📞 Suporte

Para dúvidas sobre a organização do repositório, abra uma issue com a tag `question`.
