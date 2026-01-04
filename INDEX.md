# Índice de Documentação - Neurovendas-Elevare

Este documento serve como índice central para toda a documentação do repositório.

## 📚 Documentação Principal

### Documentos Essenciais
| Documento | Propósito | Quando Ler |
|-----------|-----------|------------|
| [README.md](README.md) | Visão geral do projeto | Primeira leitura |
| [QUICK_START.md](QUICK_START.md) | Guia rápido de organização | Ao adicionar conteúdo |
| [STRUCTURE.md](STRUCTURE.md) | Estrutura detalhada do repositório | Ao organizar arquivos |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Como contribuir | Antes de contribuir |
| [VERSIONING.md](VERSIONING.md) | Guia de versionamento | Ao criar releases |
| [SECURITY.md](SECURITY.md) | Política de segurança | Ao lidar com código/dados sensíveis |
| [CHANGELOG.md](CHANGELOG.md) | Histórico de mudanças | Para ver o que mudou |

---

## 📁 Documentação por Pasta

### `/docs` - Documentação Técnica
**README:** [docs/README.md](docs/README.md)

**Subpastas:**
- `/docs/guides` - Guias e tutoriais de uso
- `/docs/architecture` - Arquitetura e decisões técnicas
- `/docs/api` - Documentação de APIs

**Use para:**
- Guias de instalação e configuração
- Documentação de arquitetura
- Especificações de API
- Tutoriais técnicos

---

### `/prompts` - Prompts de IA
**README:** [prompts/README.md](prompts/README.md)

**Subpastas:**
- `/prompts/sales` - Prompts de vendas
- `/prompts/content` - Prompts de criação de conteúdo
- `/prompts/strategy` - Prompts estratégicos

**Use para:**
- Scripts de vendas
- Templates de conteúdo
- Prompts de análise estratégica
- Automação com IA

---

### `/apps` - Aplicações
**README:** [apps/README.md](apps/README.md)

**Subpastas:**
- `/apps/web` - Aplicação web (frontend)
- `/apps/mobile` - Aplicações mobile
- `/apps/api` - Backend e APIs

**Use para:**
- Código de aplicações
- Componentes de UI
- Endpoints de API
- Lógica de negócio

---

### `/methods` - Métodos e Frameworks
**README:** [methods/README.md](methods/README.md)

**Subpastas:**
- `/methods/frameworks` - Frameworks proprietários
- `/methods/processes` - Processos de negócio
- `/methods/workflows` - Workflows e automações

**Use para:**
- Metodologias de vendas
- Processos documentados
- Automações e integrações
- SOPs (Standard Operating Procedures)

---

### `/content` - Conteúdo Estratégico
**README:** [content/README.md](content/README.md)

**Subpastas:**
- `/content/strategic` - Conteúdo estratégico
- `/content/marketing` - Material de marketing
- `/content/training` - Material de treinamento

**Use para:**
- Planos estratégicos
- Campanhas de marketing
- Cursos e treinamentos
- Material educacional

---

## 🔧 Configuração do Repositório

### GitHub
- **Issue Templates:** `.github/ISSUE_TEMPLATE/`
  - [bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md) - Reportar bugs
  - [feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md) - Sugerir features
  - [documentation.md](.github/ISSUE_TEMPLATE/documentation.md) - Melhorar docs
  - [question.md](.github/ISSUE_TEMPLATE/question.md) - Fazer perguntas

- **Pull Request Template:** [.github/pull_request_template.md](.github/pull_request_template.md)

- **Workflows:** `.github/workflows/` (GitHub Actions)

### Arquivos de Configuração
- **[.gitignore](.gitignore)** - Arquivos ignorados pelo Git

---

## 🎯 Fluxos Comuns

### 1. Quero Adicionar um Novo Prompt
```
1. Leia: prompts/README.md
2. Identifique categoria: sales, content ou strategy
3. Crie arquivo seguindo template
4. Submeta Pull Request
```

### 2. Quero Documentar um Processo
```
1. Leia: methods/README.md
2. Use template de processo
3. Coloque em: methods/processes/
4. Submeta Pull Request
```

### 3. Quero Contribuir com Código
```
1. Leia: CONTRIBUTING.md e apps/README.md
2. Clone o repositório
3. Crie branch: feature/nome-feature
4. Desenvolva e teste
5. Submeta Pull Request
```

### 4. Quero Melhorar Documentação
```
1. Leia: CONTRIBUTING.md
2. Identifique documento a melhorar
3. Faça alterações
4. Submeta Pull Request
```

### 5. Quero Reportar um Bug
```
1. Vá para: Issues > New Issue
2. Use template: Bug Report
3. Preencha todas as informações
4. Submeta issue
```

---

## 🔍 Busca Rápida

### Por Tipo de Ação

| Quero... | Documento | Pasta |
|----------|-----------|-------|
| Entender o projeto | [README.md](README.md) | - |
| Adicionar conteúdo rapidamente | [QUICK_START.md](QUICK_START.md) | - |
| Contribuir pela primeira vez | [CONTRIBUTING.md](CONTRIBUTING.md) | - |
| Entender a estrutura | [STRUCTURE.md](STRUCTURE.md) | - |
| Criar um release | [VERSIONING.md](VERSIONING.md) | - |
| Reportar vulnerabilidade | [SECURITY.md](SECURITY.md) | - |
| Ver histórico de mudanças | [CHANGELOG.md](CHANGELOG.md) | - |
| Adicionar prompt | [prompts/README.md](prompts/README.md) | `/prompts` |
| Escrever documentação | [docs/README.md](docs/README.md) | `/docs` |
| Desenvolver aplicação | [apps/README.md](apps/README.md) | `/apps` |
| Documentar processo | [methods/README.md](methods/README.md) | `/methods` |
| Criar conteúdo estratégico | [content/README.md](content/README.md) | `/content` |

---

## 📖 Guias Temáticos

### Para Novos Contribuidores
1. [README.md](README.md) - Visão geral
2. [QUICK_START.md](QUICK_START.md) - Começar rápido
3. [CONTRIBUTING.md](CONTRIBUTING.md) - Como contribuir
4. [STRUCTURE.md](STRUCTURE.md) - Organização

### Para Desenvolvedores
1. [apps/README.md](apps/README.md) - Desenvolvimento
2. [docs/README.md](docs/README.md) - Documentação técnica
3. [VERSIONING.md](VERSIONING.md) - Versionamento
4. [SECURITY.md](SECURITY.md) - Segurança

### Para Criadores de Conteúdo
1. [prompts/README.md](prompts/README.md) - Prompts
2. [content/README.md](content/README.md) - Conteúdo
3. [methods/README.md](methods/README.md) - Métodos
4. [CONTRIBUTING.md](CONTRIBUTING.md) - Contribuição

### Para Gestores de Projeto
1. [STRUCTURE.md](STRUCTURE.md) - Estrutura
2. [VERSIONING.md](VERSIONING.md) - Releases
3. [CHANGELOG.md](CHANGELOG.md) - Histórico
4. [methods/README.md](methods/README.md) - Processos

---

## 🆘 Precisa de Ajuda?

### Perguntas Frequentes
- **Onde coloco meu arquivo?** → [QUICK_START.md](QUICK_START.md)
- **Como contribuo?** → [CONTRIBUTING.md](CONTRIBUTING.md)
- **Como versiono?** → [VERSIONING.md](VERSIONING.md)
- **Como reporto bugs?** → [.github/ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md)

### Canais de Suporte
1. **Issues**: Para bugs e perguntas técnicas
2. **Discussions**: Para conversas gerais
3. **Pull Requests**: Para contribuições de código/conteúdo

---

## 📊 Mapa Mental do Repositório

```
Neurovendas-Elevare
│
├─── 📋 Começar Aqui
│    ├─ README.md (visão geral)
│    ├─ QUICK_START.md (guia rápido)
│    └─ INDEX.md (este arquivo)
│
├─── 📚 Guias de Processo
│    ├─ CONTRIBUTING.md (como contribuir)
│    ├─ STRUCTURE.md (estrutura)
│    └─ VERSIONING.md (versionamento)
│
├─── 🔒 Segurança e Histórico
│    ├─ SECURITY.md (segurança)
│    └─ CHANGELOG.md (mudanças)
│
└─── 📁 Conteúdo do Projeto
     ├─ /docs (documentação)
     ├─ /prompts (prompts de IA)
     ├─ /apps (aplicações)
     ├─ /methods (métodos e processos)
     └─ /content (conteúdo estratégico)
```

---

**Última atualização:** 2026-01-04  
**Versão:** 1.0
