# Guia de Contribuição - Neurovendas-Elevare

Obrigado por contribuir com o projeto Neurovendas-Elevare! Este guia ajudará você a contribuir de forma eficaz.

## 📋 Índice
- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Processo de Contribuição](#processo-de-contribuição)
- [Padrões de Código](#padrões-de-código)
- [Commits e Pull Requests](#commits-e-pull-requests)

## 🤝 Código de Conduta

Esperamos que todos os contribuidores:
- Sejam respeitosos e profissionais
- Aceitem críticas construtivas
- Foquem no que é melhor para a comunidade
- Demonstrem empatia com outros membros

## 🚀 Como Contribuir

### Tipos de Contribuição

1. **Documentação**
   - Melhorias em guias existentes
   - Novos tutoriais
   - Correções de erros
   - Tradução de documentos

2. **Prompts de IA**
   - Novos prompts para vendas
   - Prompts de criação de conteúdo
   - Otimização de prompts existentes

3. **Código**
   - Novas funcionalidades
   - Correção de bugs
   - Melhorias de performance
   - Refatoração

4. **Métodos e Frameworks**
   - Novas metodologias
   - Processos documentados
   - Workflows de automação

5. **Conteúdo Estratégico**
   - Material de marketing
   - Conteúdo de treinamento
   - Análises estratégicas

## 📁 Estrutura do Repositório

Antes de contribuir, leia o arquivo `STRUCTURE.md` para entender a organização do repositório.

### Identificando Onde Colocar Seu Conteúdo

| Se você está criando... | Coloque em... |
|--------------------------|---------------|
| Documentação técnica ou guia | `/docs/guides` |
| Documentação de arquitetura | `/docs/architecture` |
| Documentação de API | `/docs/api` |
| Prompt de vendas | `/prompts/sales` |
| Prompt de conteúdo | `/prompts/content` |
| Prompt estratégico | `/prompts/strategy` |
| Código de aplicação web | `/apps/web` |
| Código de aplicação mobile | `/apps/mobile` |
| Código de API/backend | `/apps/api` |
| Framework ou metodologia | `/methods/frameworks` |
| Processo de negócio | `/methods/processes` |
| Workflow de automação | `/methods/workflows` |
| Conteúdo estratégico | `/content/strategic` |
| Material de marketing | `/content/marketing` |
| Material de treinamento | `/content/training` |

## 🔄 Processo de Contribuição

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/Neurovendas-Elevare-.git
cd Neurovendas-Elevare-
```

### 2. Crie uma Branch
```bash
# Para novas funcionalidades
git checkout -b feature/nome-da-funcionalidade

# Para correções
git checkout -b fix/nome-da-correcao

# Para documentação
git checkout -b docs/nome-da-documentacao
```

### 3. Faça suas Alterações
- Siga os padrões de código e nomenclatura
- Adicione documentação quando necessário
- Teste suas alterações

### 4. Commit suas Alterações
```bash
git add .
git commit -m "tipo: descrição breve"
```

Veja a seção [Commits](#commits) para mais detalhes.

### 5. Push e Pull Request
```bash
git push origin sua-branch
```

Abra um Pull Request no GitHub com:
- Título claro e descritivo
- Descrição detalhada das mudanças
- Referência a issues relacionadas (se houver)

## 💻 Padrões de Código

### Para Código (Apps)
- Use JavaScript/TypeScript moderno
- Siga o padrão ESLint configurado
- Escreva código limpo e bem comentado
- Adicione testes para novas funcionalidades

### Para Documentação
- Use Markdown para todos os documentos
- Seja claro e conciso
- Inclua exemplos quando apropriado
- Use formatação consistente

### Para Prompts
- Use formato estruturado
- Inclua contexto e objetivo do prompt
- Documente variáveis e parâmetros
- Forneça exemplos de uso

### Para Métodos/Frameworks
- Documente o propósito claramente
- Inclua diagramas quando necessário
- Forneça exemplos práticos
- Liste pré-requisitos e dependências

## 📝 Commits e Pull Requests

### Formato de Commit

Use o formato Conventional Commits:

```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

#### Tipos de Commit
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de código
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

#### Exemplos
```
feat(prompts): adiciona prompt de cold calling para vendas B2B

docs(guides): atualiza guia de instalação com Docker

fix(api): corrige erro de autenticação no endpoint /login
```

### Pull Request

#### Título
Use o mesmo formato dos commits:
```
feat(prompts): adiciona novos prompts de vendas
```

#### Descrição
Inclua:
- **O que**: Descrição das mudanças
- **Por que**: Motivo da mudança
- **Como**: Detalhes da implementação
- **Testes**: Como testar as mudanças
- **Screenshots**: Se aplicável (para mudanças visuais)

#### Template de PR
```markdown
## Descrição
Breve descrição das mudanças.

## Tipo de Mudança
- [ ] Nova funcionalidade (feature)
- [ ] Correção de bug (fix)
- [ ] Documentação (docs)
- [ ] Outro (especifique)

## Checklist
- [ ] Li o guia de contribuição
- [ ] Coloquei o conteúdo na pasta correta
- [ ] Segui as convenções de nomenclatura
- [ ] Adicionei documentação se necessário
- [ ] Testei minhas mudanças

## Relacionado
Closes #issue_number
```

## ✅ Checklist de Revisão

Antes de submeter seu PR, verifique:

- [ ] O código/conteúdo está na pasta correta
- [ ] Segui as convenções de nomenclatura
- [ ] Adicionei/atualizei documentação relevante
- [ ] Os commits seguem o padrão Conventional Commits
- [ ] O PR tem título e descrição claros
- [ ] Testei as mudanças localmente
- [ ] Não há arquivos desnecessários (logs, cache, etc.)

## 🔍 Processo de Revisão

1. **Revisão Automática**: Verificações automáticas via GitHub Actions
2. **Revisão por Pares**: Pelo menos um revisor aprovará seu PR
3. **Feedback**: Responda aos comentários e faça ajustes necessários
4. **Merge**: Após aprovação, o PR será mergeado

## 🆘 Precisa de Ajuda?

- Leia a documentação em `/docs`
- Consulte o arquivo `STRUCTURE.md`
- Abra uma issue com a tag `question`
- Entre em contato com os mantenedores

## 📚 Recursos Adicionais

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Markdown Guide](https://www.markdownguide.org/)

## 🙏 Agradecimentos

Agradecemos por dedicar seu tempo para contribuir com o Neurovendas-Elevare!
