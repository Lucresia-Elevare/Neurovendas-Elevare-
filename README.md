# Elevare / LucresIA

**Plataforma de Neurovendas com IA para criação de conteúdo estratégico, conversão e autoridade digital no nicho de Estética.**

> "Não estamos construindo um editor. Estamos construindo uma máquina de decisão que ensina esteticistas a vender."

---

## 🎯 O que é Elevare?

Elevare é um SaaS nichado para profissionais de estética que combina:
- ✨ **QuickCreate Flow**: Criação guiada de posts em 5 minutos (vs 30min tradicionais)
- 🧠 **NeuroPresets**: Templates com lógica de vendas embutida (não apenas visuais)
- 🤖 **LucresIA**: IA proativa que avalia e sugere melhorias em tempo real
- 📊 **Analytics**: Métricas de engajamento e conversão

**USP**: NeuroVendas AI + Design Profissional + Estratégia de Conteúdo para Estética

---

## 📋 Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **MySQL** 8.0+
- **AWS Account** (para S3 storage)
- **OpenAI API Key** (para features de IA)

---

## 🚀 Setup Local

### 1. Clone o Repositório

```bash
git clone https://github.com/Lucresia-Elevare/Neurovendas-Elevare-.git
cd Neurovendas-Elevare-
```

### 2. Instale Dependências

```bash
npm install --legacy-peer-deps
```

> **Nota**: Flag `--legacy-peer-deps` necessária devido a conflito do vite-plugin-jsx-loc

### 3. Configure Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` e preencha com suas credenciais:
- `DATABASE_URL`: String de conexão MySQL
- `JWT_SECRET`: Chave secreta (mínimo 32 caracteres)
- `OPENAI_API_KEY`: Chave da OpenAI para LucresIA
- `AWS_*`: Credenciais AWS para S3
- Demais variáveis conforme `.env.example`

### 4. Configure o Banco de Dados

```bash
# Gerar e aplicar migrations
npm run db:push
```

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🏗️ Build para Produção

```bash
# Type checking
npm run check

# Build client + server
npm run build

# Inicia servidor de produção
npm run start
```

**Output**:
- `dist/public/` - Frontend assets
- `dist/index.js` - Backend server

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Watch mode
npm run test:watch
```

**Nota**: Alguns testes requerem banco de dados configurado.

---

## 📁 Estrutura do Projeto

```
.
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── flows/         # Fluxos guiados (QuickCreate, etc)
│   │   ├── pages/         # Páginas principais
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── lib/           # Utils, analytics, trpc
│   └── index.html
│
├── server/                 # Backend tRPC + Express
│   ├── _core/             # Core server (index, context, env)
│   ├── routers.ts         # tRPC routers
│   ├── db.ts              # Database connection
│   └── *.test.ts          # Server tests
│
├── shared/                 # Código compartilhado
│   ├── neuroPresets.ts    # Definição de NeuroPresets
│   ├── colorPalettes.ts   # Paletas estratégicas
│   ├── templates.ts       # Templates base
│   └── types.ts           # Types compartilhados
│
├── drizzle/               # Database schema & migrations
│
├── docs/                  # Documentação estratégica
│   ├── SUMARIO_EXECUTIVO.md
│   ├── ANALISE_ESTRATEGICA_PRODUTO.md
│   ├── ROADMAP_IMPLEMENTACAO.md
│   ├── GUIA_TECNICO_ARQUITETURA.md
│   ├── ARQUITETURA_VISUAL.md
│   └── AUDITORIA_PRONTIDAO_PRODUCAO.md
│
└── package.json
```

---

## 🎨 Features Implementadas

### ✅ QuickCreate Flow
Fluxo guiado de 4 etapas para criação rápida de posts:
1. **Preset** - Escolha template estratégico (Transformação, Oferta, Depoimento)
2. **Upload** - Upload de 1-3 imagens (suporte Before/After)
3. **Copy** - Legenda + hashtags com fórmulas NeuroVendas
4. **Publish** - Revisão + publicação com score de engajamento

**Acesse**: `/quick-create`

### ✅ NeuroPresets System
3 presets estratégicos implementados:
- ✨ **Transformação Incrível**: Layout Before/After para vendas
- ⚡ **Oferta Relâmpago**: Template de urgência para conversão
- 💬 **Depoimento Real**: Layout de prova social

Cada preset inclui:
- Fórmula de copywriting NeuroVendas
- Paleta de cores com psicologia
- Triggers de conversão (escassez, autoridade, prova social)
- Contexto de IA para geração direcionada

### ✅ Analytics Tracking
14 eventos de produto implementados:
- `quick_create_started/completed/abandoned`
- `preset_selected`, `image_uploaded`, `copy_generated`
- `ia_suggestion_shown/applied`
- `post_published`
- `drop_off_step_X`

### 🔄 Em Desenvolvimento
- **LucresIA Sidebar**: Copiloto de IA com score em tempo real (Sprint 7-8)
- **9 Presets Adicionais**: Total de 12 presets estratégicos (Sprint 3-4)
- **Layer System**: Composição de imagens Before/After (Sprint 5-6)
- **Instagram Integration**: Publicação automática (Sprint 8+)

---

## 📚 Documentação

### Para Executivos
- `SUMARIO_EXECUTIVO.md` - Visão geral, ROI, timeline (15min leitura)

### Para Product Managers
- `ANALISE_ESTRATEGICA_PRODUTO.md` - Estratégia, fluxos, diferenciação (45min)
- `ARQUITETURA_VISUAL.md` - UX, mockups, design system (20min)

### Para Desenvolvedores
- `ROADMAP_IMPLEMENTACAO.md` - Specs técnicas, interfaces, sprints (45min)
- `GUIA_TECNICO_ARQUITETURA.md` - Arquitetura, state machines, eventos (30min)

### Para Tech Leads / DevOps
- `AUDITORIA_PRONTIDAO_PRODUCAO.md` - Status, bloqueadores, checklist (30min)

**Total**: 155KB de documentação estratégica + técnica

---

## 🚨 Troubleshooting

### Erro: `npm install` falha
```bash
# Use legacy peer deps para resolver conflito de versão
npm install --legacy-peer-deps
```

### Erro: Testes falhando com "Database not available"
```bash
# Verifique DATABASE_URL no .env
# Certifique-se que MySQL está rodando
mysql -u root -p
# Rode migrations
npm run db:push
```

### Erro: TypeScript "Cannot find type definition"
```bash
# Reinstale dependencies
rm -rf node_modules
npm install --legacy-peer-deps
```

### Build warnings sobre variáveis de ambiente
```bash
# Defina VITE_ANALYTICS_* no .env ou remova do index.html
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Padrões**:
- TypeScript estrito
- Commits semânticos
- Testes para novas features
- Seguir GUIA_TECNICO_ARQUITETURA.md

---

## 📊 Status do Projeto

**Versão Atual**: 1.0.0-beta  
**Sprint Atual**: Sprint 1-2 (QuickCreate Core)  
**Prontidão para Produção**: 39% (ver AUDITORIA_PRONTIDAO_PRODUCAO.md)

**Bloqueadores Críticos Resolvidos**:
- ✅ Erro TypeScript regex Unicode
- ✅ Variáveis de ambiente documentadas
- ✅ README atualizado

**Pendente para MVP**:
- ⏳ Backend integration (createPost mutation)
- ⏳ Database setup em testes
- ⏳ Instagram API connection

**Prazo Estimado para Launch**: 3-4 semanas

---

## 📞 Suporte

- **Email**: [seu-email]
- **Issues**: [GitHub Issues](https://github.com/Lucresia-Elevare/Neurovendas-Elevare-/issues)
- **Documentação**: Ver pasta `docs/`

---

## 📄 Licença

MIT License - ver arquivo LICENSE para detalhes

---

**Desenvolvido com ❤️ pela equipe Elevare**
