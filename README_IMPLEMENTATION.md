# Neurovendas E-books - Sistema de Geração com IA

Sistema completo de geração de e-books profissionais usando Inteligência Artificial, com foco em neurovendas e copywriting persuasivo.

## 🎯 Funcionalidades Principais

- ✅ **Geração de Conteúdo com IA**: Cria e-books completos usando LLM (Gemini 2.5 Flash)
- ✅ **Fluxo de 4 Passos**: Conteúdo → Diagramação → Capa → Exportação
- ✅ **3 Templates Profissionais**: Educational, Marketing e Storytelling
- ✅ **Geração de PDF**: Exportação automática com diagramação avançada
- ✅ **Gerenciamento de Projetos**: Salvar, editar e excluir projetos
- ✅ **Versionamento**: Sistema completo de histórico de versões
- ✅ **Autenticação**: Sistema de proteção de rotas
- ✅ **Validação**: Zod implementado em todos os formulários

## 🏗️ Arquitetura

```
neurovendas_ebooks/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── _core/         # Hooks e utilitários
│   └── index.html
├── server/                 # Backend Node.js
│   ├── _core/             # Serviços principais
│   │   ├── llm.ts         # Integração com LLM
│   │   ├── htmlParser.ts  # Parser de HTML
│   │   ├── htmlToPdf.ts   # Geração de PDF
│   │   └── ebookRenderer.ts # Renderização de templates
│   ├── routes/            # Rotas tRPC
│   │   └── ebooks.router.ts
│   ├── db.ts              # Conexão com banco
│   └── storage.ts         # Integração S3
├── shared/                 # Código compartilhado
│   └── ebookSchema.ts     # Schemas Zod
└── drizzle/               # ORM e migrations
    └── schema.ts          # Schema do banco de dados
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- MySQL 8+
- pnpm (recomendado) ou npm

### 1. Instalar Dependências

```bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install --legacy-peer-deps
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/neurovendas_ebooks

# Manus Forge API (fornecido automaticamente no ambiente Manus)
BUILT_IN_FORGE_API_URL=<your-forge-api-url>
BUILT_IN_FORGE_API_KEY=<your-forge-api-key>

# Server
PORT=3000
NODE_ENV=development
```

### 3. Configurar Banco de Dados

```bash
# Gerar migrations
pnpm db:push

# Ou com npm
npm run db:push
```

### 4. Iniciar Desenvolvimento

```bash
# Modo desenvolvimento
pnpm dev

# Ou com npm
npm run dev
```

O servidor estará rodando em:
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3000`
- tRPC API: `http://localhost:3000/trpc`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### `users`
- `id` (PK)
- `email`
- `name`
- `createdAt`

#### `projects`
- `id` (PK)
- `userId` (FK → users.id, CASCADE DELETE)
- `title`
- `description`
- `theme`
- `targetAudience`
- `objective`
- `assetType` (ebook | cover | audiobook)
- `status` (draft | generating | completed | error)
- `createdAt`
- `updatedAt`

#### `generated_content`
- `id` (PK)
- `projectId` (FK → projects.id, CASCADE DELETE)
- `content`
- `structuredData`
- `pdfUrl`
- `coverUrl`
- `audioUrl`
- `createdAt`

#### `content_versions`
- `id` (PK)
- `projectId` (FK → projects.id, CASCADE DELETE)
- `content`
- `versionNumber`
- `createdAt`
- `createdBy` (FK → users.id)

## 🔌 API Endpoints (tRPC)

### `ebooks.generateStructuredContent`
Gera conteúdo estruturado usando LLM.

**Input:**
```typescript
{
  theme: string;
  targetAudience: string;
  objective: string;
}
```

**Output:**
```typescript
{
  content: string;
  structuredData: object;
  wordCount: number;
  headings: Array<{ level: number; text: string }>;
}
```

### `ebooks.generatePDFFromStructured`
Gera PDF a partir de conteúdo HTML.

**Input:**
```typescript
{
  projectId?: string;
  content: string;
  structuredData?: any;
  template: "educational" | "marketing" | "storytelling";
  assetType: "ebook" | "cover" | "audiobook";
}
```

**Output:**
```typescript
{
  pdfUrl: string;
  success: boolean;
}
```

### `ebooks.saveProject`
Salva ou atualiza um projeto.

**Input:**
```typescript
{
  id?: string;
  title: string;
  description?: string;
  theme?: string;
  targetAudience?: string;
  objective?: string;
  assetType?: "ebook" | "cover" | "audiobook";
  status?: "draft" | "generating" | "completed" | "error";
}
```

### `ebooks.getProjects`
Lista todos os projetos do usuário.

**Input:**
```typescript
{
  search?: string;
  status?: "draft" | "generating" | "completed" | "error";
  limit?: number;
  offset?: number;
}
```

### `ebooks.getProjectById`
Busca um projeto específico por ID.

**Input:**
```typescript
{
  id: string;
}
```

### `ebooks.deleteProject`
Exclui um projeto (com cascade delete).

**Input:**
```typescript
{
  id: string;
}
```

## 🎨 Templates de E-book

### Educational
- Cor principal: Azul (#2563eb)
- Foco: Conteúdo educativo e didático
- Estilo: Profissional e acadêmico

### Marketing
- Cor principal: Vermelho (#dc2626)
- Foco: Vendas e conversão
- Estilo: Persuasivo e direto

### Storytelling
- Cor principal: Roxo (#7c3aed)
- Foco: Narrativa e engajamento
- Estilo: Criativo e envolvente

## 🔐 Autenticação e Segurança

- **Proteção de Rotas**: Todas as rotas de geração e gerenciamento são protegidas pelo hook `useAuth`
- **Validação de Entrada**: Zod schemas validam todos os inputs do usuário
- **Sanitização HTML**: O parser remove scripts e atributos perigosos
- **Cascade Delete**: Exclusão de projetos remove automaticamente conteúdo relacionado

## 🎯 Fluxo de Uso Principal

1. **Login**: Usuário faz login (desenvolvimento: quick login)
2. **Novo E-book**: Acessa `/generate-ebook`
3. **Passo 1 - Conteúdo**: Define tema, público-alvo e objetivo
4. **Passo 2 - Diagramação**: Edita o conteúdo gerado pela IA
5. **Passo 3 - Template**: Escolhe o template visual
6. **Passo 4 - Exportação**: Gera e baixa o PDF

## 📝 Modo de Edição

Para editar um projeto existente, acesse:
```
/generate-ebook?projectId=<project-id>
```

O sistema carregará automaticamente os dados do projeto e permitirá edição.

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Build
pnpm build        # Compila frontend e backend

# Produção
pnpm start        # Inicia servidor em produção

# Type checking
pnpm check        # Verifica tipos TypeScript

# Formatação
pnpm format       # Formata código com Prettier

# Testes
pnpm test         # Executa testes com Vitest

# Database
pnpm db:push      # Aplica schema ao banco de dados
```

## 🚧 Troubleshooting

### Erro ao instalar Puppeteer
```bash
PUPPETEER_SKIP_DOWNLOAD=true npm install --legacy-peer-deps
```

### Erro de conexão com banco de dados
Verifique se o MySQL está rodando e se a `DATABASE_URL` está correta no `.env`.

### Erro de importação de módulos
Execute:
```bash
pnpm check
```
Para verificar erros de TypeScript.

## 📦 Tecnologias Utilizadas

### Frontend
- **React 19** - UI library
- **Wouter** - Roteamento
- **TailwindCSS** - Estilização
- **React Hook Form** - Formulários
- **Zod** - Validação
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Server
- **tRPC** - API type-safe
- **Drizzle ORM** - Database ORM
- **Puppeteer** - PDF generation
- **JSDOM** - HTML parsing

### Infraestrutura
- **MySQL** - Banco de dados
- **S3** - Armazenamento de arquivos
- **Manus Forge API** - LLM e geração de imagens

## 📄 Licença

MIT License - © 2026 Neurovendas Elevare

## 👥 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `pnpm dev`
2. Execute testes: `pnpm test`
3. Verifique TypeScript: `pnpm check`

---

**Desenvolvido com ❤️ pela equipe Elevare**
