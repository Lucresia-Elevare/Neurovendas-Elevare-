# Guia Rápido de Organização - Neurovendas-Elevare

## 🎯 Propósito deste Guia

Este guia rápido ajuda você a identificar onde colocar novos arquivos e conteúdos no repositório Neurovendas-Elevare.

## 📋 Fluxo de Decisão Rápido

### Passo 1: Identifique o Tipo de Conteúdo

Faça as seguintes perguntas:

1. **É código executável?** → Vá para [Apps](#apps)
2. **É um prompt para IA?** → Vá para [Prompts](#prompts)
3. **É documentação técnica?** → Vá para [Docs](#docs)
4. **É um método, framework ou processo?** → Vá para [Methods](#methods)
5. **É conteúdo estratégico ou marketing?** → Vá para [Content](#content)

---

## 📁 Guia por Categoria

### Apps
**Use quando:** Você está criando código executável (frontend, backend, mobile)

```
/apps/web/     → Interface web da plataforma
/apps/mobile/  → Aplicativos iOS/Android
/apps/api/     → Backend, APIs REST/GraphQL
```

**Exemplos:**
- Componente React → `/apps/web/src/components/`
- Endpoint de API → `/apps/api/src/routes/`
- Tela de app mobile → `/apps/mobile/src/screens/`

📚 **Leia:** [apps/README.md](apps/README.md)

---

### Prompts
**Use quando:** Você está criando prompts para uso com IA

```
/prompts/sales/     → Scripts de vendas, objeções, fechamento
/prompts/content/   → Posts, artigos, emails
/prompts/strategy/  → Análises, planejamento, pesquisa
```

**Exemplos:**
- Prompt de cold calling → `/prompts/sales/cold-calling-b2b-v1.md`
- Prompt de post LinkedIn → `/prompts/content/post-linkedin-autoridade.md`
- Prompt de análise SWOT → `/prompts/strategy/analise-swot-completa.md`

📚 **Leia:** [prompts/README.md](prompts/README.md)

---

### Docs
**Use quando:** Você está criando documentação técnica

```
/docs/guides/        → Tutoriais, guias de uso, FAQs
/docs/architecture/  → Diagramas, ADRs, specs técnicas
/docs/api/          → Docs de API, OpenAPI/Swagger
```

**Exemplos:**
- Tutorial de instalação → `/docs/guides/instalacao-docker.md`
- Decisão de arquitetura → `/docs/architecture/adr-001-escolha-database.md`
- Especificação de API → `/docs/api/openapi-v1.yaml`

📚 **Leia:** [docs/README.md](docs/README.md)

---

### Methods
**Use quando:** Você está documentando metodologias, processos ou workflows

```
/methods/frameworks/  → Frameworks proprietários e metodologias
/methods/processes/   → Processos de negócio, SOPs
/methods/workflows/   → Automações, integrações
```

**Exemplos:**
- Framework de vendas → `/methods/frameworks/neurovendas-framework-v1.md`
- Processo de onboarding → `/methods/processes/onboarding-cliente-premium.md`
- Workflow de automação → `/methods/workflows/automacao-lead-nurturing.md`

📚 **Leia:** [methods/README.md](methods/README.md)

---

### Content
**Use quando:** Você está criando conteúdo estratégico, marketing ou treinamento

```
/content/strategic/  → Planos estratégicos, análises de mercado
/content/marketing/  → Campanhas, copy, material promocional
/content/training/   → Cursos, módulos, certificações
```

**Exemplos:**
- Plano estratégico → `/content/strategic/plano-2026-q1.md`
- Campanha de marketing → `/content/marketing/campanha-lancamento-jan.md`
- Módulo de curso → `/content/training/curso-neurovendas-modulo-1.md`

📚 **Leia:** [content/README.md](content/README.md)

---

## 🔍 Exemplos Práticos

### Exemplo 1: Novo Prompt de Vendas
**Tenho:** Um novo script de cold calling para vendas B2B  
**Categoria:** Prompt de Vendas  
**Local:** `/prompts/sales/cold-calling-b2b-tech-v1.md`

### Exemplo 2: Documentação de API
**Tenho:** Documentação do endpoint de autenticação  
**Categoria:** Documentação de API  
**Local:** `/docs/api/authentication-guide.md`

### Exemplo 3: Componente React
**Tenho:** Novo componente de dashboard  
**Categoria:** Código Web  
**Local:** `/apps/web/src/components/Dashboard.tsx`

### Exemplo 4: Framework de Neurovendas
**Tenho:** Nova versão do framework proprietário  
**Categoria:** Framework  
**Local:** `/methods/frameworks/neurovendas-framework-v2.md`

### Exemplo 5: Material de Treinamento
**Tenho:** Slides de apresentação sobre técnicas de fechamento  
**Categoria:** Conteúdo de Treinamento  
**Local:** `/content/training/apresentacao-tecnicas-fechamento.md`

---

## 📝 Convenções Rápidas

### Nomenclatura de Arquivos
```
✅ BOM: meu-arquivo-descritivo.md
❌ RUIM: MeuArquivo.md

✅ BOM: prompt-cold-calling-v1.md
❌ RUIM: Prompt_Cold_Calling.md

✅ BOM: processo-onboarding-2026.md
❌ RUIM: processo onboarding.md
```

### Versionamento
```
v1.0.0 → Primeira versão
v1.1.0 → Nova funcionalidade compatível
v2.0.0 → Mudança incompatível (breaking change)

arquivo-v1.md → Primeira versão
arquivo-v2.md → Segunda versão
```

---

## ✅ Checklist Antes de Adicionar Conteúdo

- [ ] Identifiquei o tipo de conteúdo corretamente
- [ ] Escolhi a pasta apropriada
- [ ] Usei nomenclatura em kebab-case
- [ ] Li o README da pasta de destino
- [ ] Segui o template sugerido (se houver)
- [ ] Incluí documentação/comentários necessários
- [ ] Não incluí secrets ou informações sensíveis
- [ ] Estou pronto para submeter Pull Request

---

## 🚀 Próximos Passos

1. **Primeira vez contribuindo?**
   - Leia [CONTRIBUTING.md](CONTRIBUTING.md)
   - Entenda [STRUCTURE.md](STRUCTURE.md)

2. **Pronto para contribuir?**
   - Crie uma branch: `git checkout -b feature/minha-feature`
   - Adicione seu conteúdo na pasta correta
   - Commit: `git commit -m "feat: adiciona novo conteúdo"`
   - Push e abra Pull Request

3. **Dúvidas?**
   - Consulte os READMEs específicos de cada pasta
   - Abra uma issue com tag `question`
   - Entre em contato com a equipe

---

## 📚 Documentação Completa

- **[STRUCTURE.md](STRUCTURE.md)** - Estrutura detalhada do repositório
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guia completo de contribuição
- **[VERSIONING.md](VERSIONING.md)** - Guia de versionamento
- **[SECURITY.md](SECURITY.md)** - Política de segurança
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de mudanças

---

## 🎯 Dica Final

> **Quando em dúvida:** Coloque na pasta mais específica possível. É melhor ter estrutura granular e bem organizada do que tudo misturado na raiz!

**Ainda com dúvida?** Abra uma issue e perguntaremos! 😊
