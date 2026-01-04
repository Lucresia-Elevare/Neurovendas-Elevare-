# Guia de Versionamento - Neurovendas-Elevare

Este documento define as práticas de versionamento para todos os componentes do projeto Neurovendas-Elevare.

## 📋 Índice
- [Semantic Versioning](#semantic-versioning)
- [Versionamento por Tipo de Conteúdo](#versionamento-por-tipo-de-conteúdo)
- [Branches e Releases](#branches-e-releases)
- [Tags e Releases](#tags-e-releases)
- [Changelog](#changelog)

## 🔢 Semantic Versioning

Seguimos o padrão [Semantic Versioning 2.0.0](https://semver.org/) para versionamento de código e aplicações.

### Formato: MAJOR.MINOR.PATCH

```
v1.2.3
│ │ │
│ │ └─ PATCH: Correções de bugs compatíveis
│ └─── MINOR: Novas funcionalidades compatíveis
└───── MAJOR: Mudanças incompatíveis com versões anteriores
```

### Quando incrementar cada número:

#### MAJOR (v1.0.0 → v2.0.0)
- Mudanças que quebram compatibilidade com versões anteriores
- Remoção de funcionalidades públicas
- Mudanças significativas na API
- Reestruturação completa de métodos/frameworks

**Exemplos:**
- Mudança na estrutura de API que requer alterações no cliente
- Remoção de endpoints ou métodos públicos
- Mudança fundamental na arquitetura

#### MINOR (v1.0.0 → v1.1.0)
- Novas funcionalidades mantendo compatibilidade
- Adição de novos endpoints/métodos
- Melhorias significativas mantendo compatibilidade
- Novos prompts ou métodos que não afetam os existentes

**Exemplos:**
- Adicionar novos prompts de vendas
- Adicionar nova seção de documentação
- Adicionar novo método de framework
- Novos recursos opcionais na API

#### PATCH (v1.0.0 → v1.0.1)
- Correções de bugs
- Melhorias de performance sem mudanças de comportamento
- Correções de documentação
- Ajustes de prompts existentes

**Exemplos:**
- Corrigir erro de digitação em prompt
- Corrigir bug em validação
- Atualizar documentação com informação faltante
- Otimização de código sem mudança de comportamento

### Versões Pré-lançamento

Para versões em desenvolvimento:

```
v1.0.0-alpha.1    # Versão alpha (primeiras iterações)
v1.0.0-beta.1     # Versão beta (feature complete, em testes)
v1.0.0-rc.1       # Release candidate (quase pronto para produção)
```

## 📦 Versionamento por Tipo de Conteúdo

### Aplicações (`/apps`)
- **Seguem SemVer estritamente**
- Cada aplicação tem seu próprio versionamento
- Versionamento em `package.json` ou arquivo equivalente

```json
{
  "name": "@neurovendas/web-app",
  "version": "1.2.3"
}
```

### Documentação (`/docs`)
- Versionamento por data ou marco
- Pode usar SemVer para documentação de API

**Exemplos:**
```
/docs/api/v1/
/docs/api/v2/
/docs/guides/2026-01-instalacao.md
```

### Prompts (`/prompts`)
- Versionamento por data ou iteração
- Incluir versão no nome do arquivo quando houver mudanças significativas

**Exemplos:**
```
/prompts/sales/cold-calling-v1.md
/prompts/sales/cold-calling-v2.md
/prompts/sales/cold-calling-2026-01.md
```

**Convenções:**
- `v1`, `v2`, `v3`: Para versões major
- Data `YYYY-MM`: Para versões mensais
- Sem sufixo: Versão atual/latest

### Métodos e Frameworks (`/methods`)
- Versionamento semântico ou por iteração
- Documentar mudanças significativas

**Exemplos:**
```
/methods/frameworks/neurovendas-framework-v1.0.md
/methods/frameworks/neurovendas-framework-v2.0.md
```

### Conteúdo Estratégico (`/content`)
- Versionamento por data ou período
- Útil para rastreabilidade histórica

**Exemplos:**
```
/content/strategic/plano-estrategico-2026-q1.md
/content/marketing/campanha-lancamento-jan-2026.md
```

## 🌿 Branches e Releases

### Estratégia de Branching

```
main
├── develop
│   ├── feature/nova-funcionalidade
│   ├── feature/novo-prompt
│   └── fix/correcao-bug
└── hotfix/correcao-urgente
```

#### Branch `main`
- Código de produção
- Sempre estável e pronto para deploy
- Apenas aceita merges de `develop` ou `hotfix`
- Protegida: requer aprovação de PR

#### Branch `develop`
- Integração de desenvolvimento
- Base para novas features
- Testes contínuos
- Mergeada em `main` para releases

#### Branches de Feature
- `feature/nome-da-feature`
- Criadas a partir de `develop`
- Mergeadas de volta em `develop`
- Deletadas após merge

#### Branches de Fix
- `fix/nome-do-fix`
- Para correções não urgentes
- Criadas a partir de `develop`
- Mergeadas em `develop`

#### Branches de Hotfix
- `hotfix/nome-do-hotfix`
- Para correções urgentes em produção
- Criadas a partir de `main`
- Mergeadas em `main` E `develop`

### Fluxo de Release

1. **Preparação**: Criar branch `release/v1.2.0` de `develop`
2. **Ajustes finais**: Correções de última hora, atualização de changelog
3. **Tag**: Criar tag `v1.2.0`
4. **Merge**: Mergear em `main` e `develop`
5. **Deploy**: Deploy automático ou manual para produção

## 🏷️ Tags e Releases

### Criando Tags

```bash
# Tag anotada (recomendado)
git tag -a v1.2.3 -m "Release version 1.2.3"

# Push da tag
git push origin v1.2.3

# Push de todas as tags
git push origin --tags
```

### Convenções de Tags

- Use prefixo `v`: `v1.0.0`, `v2.1.3`
- Tags anotadas para releases oficiais
- Tags leves para marcos internos

### Releases no GitHub

Ao criar release no GitHub, inclua:

1. **Título**: `v1.2.3 - Nome da Release`
2. **Descrição**:
   ```markdown
   ## O que há de novo
   - Nova funcionalidade X
   - Melhoria em Y
   
   ## Correções
   - Corrigido bug em Z
   
   ## Breaking Changes
   - Mudança incompatível em W
   
   ## Notas de Upgrade
   - Instruções para atualização
   ```
3. **Anexos**: Binários ou arquivos de build, se aplicável

## 📝 Changelog

Mantenha um arquivo `CHANGELOG.md` na raiz do projeto.

### Formato

```markdown
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/),
e este projeto adere ao [Semantic Versioning](https://semver.org/).

## [Unreleased]
### Added
- Nova funcionalidade em desenvolvimento

## [1.2.0] - 2026-01-15
### Added
- Novos prompts de vendas B2B
- Documentação de API v2
- Framework de autoridade digital

### Changed
- Melhorias na performance da API
- Atualização de dependências

### Fixed
- Correção de bug em autenticação
- Correção de typos na documentação

## [1.1.0] - 2025-12-20
### Added
- Primeira versão de prompts de conteúdo

## [1.0.0] - 2025-12-01
### Added
- Release inicial
- Estrutura base do projeto
```

### Categorias do Changelog

- **Added**: Novas funcionalidades
- **Changed**: Mudanças em funcionalidades existentes
- **Deprecated**: Funcionalidades que serão removidas
- **Removed**: Funcionalidades removidas
- **Fixed**: Correções de bugs
- **Security**: Correções de segurança

## 🔄 Versionamento de Dependências

### Para Aplicações Node.js

```json
{
  "dependencies": {
    "react": "^18.0.0",        // Permite MINOR e PATCH
    "express": "~4.18.2",      // Permite apenas PATCH
    "lodash": "4.17.21"        // Versão exata
  }
}
```

**Convenções:**
- `^` (caret): Permite updates MINOR e PATCH
- `~` (tilde): Permite apenas updates PATCH
- Sem símbolo: Versão exata fixa

## 📊 Matriz de Compatibilidade

Mantenha uma matriz de compatibilidade quando houver múltiplos componentes:

| Web App | Mobile App | API | Status |
|---------|------------|-----|--------|
| v2.0.x  | v2.0.x     | v2.x| ✅ Atual |
| v1.5.x  | v1.5.x     | v1.x| ⚠️ Legacy |
| v1.0.x  | v1.0.x     | v1.x| ❌ EOL |

## 🎯 Melhores Práticas

1. **Sempre documente breaking changes**
2. **Mantenha o CHANGELOG atualizado**
3. **Use tags anotadas para releases**
4. **Teste antes de incrementar versão**
5. **Comunique mudanças à equipe**
6. **Mantenha compatibilidade quando possível**
7. **Deprecie antes de remover**
8. **Versione APIs separadamente**

## 📞 Dúvidas

Para dúvidas sobre versionamento, consulte:
- Este documento
- [Semantic Versioning](https://semver.org/)
- Abra uma issue com tag `question`
