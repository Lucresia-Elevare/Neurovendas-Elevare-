# 🚀 Guia de Deploy para Produção - Elevare/LucresIA

## Sprint 3: Production Readiness

Guia completo para deploy da aplicação QuickCreate MVP em produção.

---

## 📋 Pré-requisitos

### Infraestrutura Necessária

- **Servidor**: Node.js 18+ (recomendado: 20 LTS)
- **Banco de Dados**: PostgreSQL 14+
- **Storage**: AWS S3 (ou compatível)
- **IA**: OpenAI API key (GPT-4 Turbo recomendado)
- **Analytics**: PostHog (opcional, mas recomendado)
- **Monitoramento**: Sentry (recomendado para error tracking)

### Configurações Mínimas

**Servidor**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD

**Banco de Dados**:
- PostgreSQL: 100GB storage
- Conexões: Mínimo 20 connections

**S3**:
- Bucket público para imagens
- CDN (CloudFront) recomendado

---

## 🔧 Configuração de Ambiente

### 1. Variáveis de Ambiente

Copie `.env.example` para `.env.production`:

```bash
cp .env.example .env.production
```

**Variáveis Críticas** (obrigatórias):

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/elevare_prod?schema=public"

# Authentication
JWT_SECRET="your-secure-random-string-min-32-chars"
SESSION_SECRET="another-secure-random-string-min-32-chars"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="elevare-production"
AWS_S3_REGION="us-east-1"

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# Instagram API (para publicação)
INSTAGRAM_CLIENT_ID="your-client-id"
INSTAGRAM_CLIENT_SECRET="your-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-secret"
```

**Variáveis Opcionais** (recomendadas):

```env
# Analytics
POSTHOG_API_KEY="phc_..."

# Error Tracking
SENTRY_DSN="https://...@sentry.io/..."

# Environment
NODE_ENV="production"
PORT="3000"
```

### 2. Gerar Secrets Seguros

```bash
# JWT Secret (32+ caracteres)
openssl rand -base64 32

# Session Secret (32+ caracteres)
openssl rand -base64 32
```

---

## 📦 Build da Aplicação

### 1. Instalar Dependências

```bash
# Usar flag legacy-peer-deps (necessário para compatibilidade)
npm install --legacy-peer-deps --production
```

### 2. Executar Migrações do Banco

```bash
# Rodar todas as migrações (incluindo quick_create_posts)
npm run db:migrate:prod

# Verificar se as migrações foram aplicadas
npm run db:status
```

### 3. Build do Frontend e Backend

```bash
# Build completo
npm run build

# Verificar se o build foi bem-sucedido
ls -lh dist/
```

### 4. Verificação de Tipo

```bash
# TypeScript check (deve passar sem erros)
npm run check
```

---

## 🏗️ Deploy

### Opção 1: Deploy Manual (VPS/EC2)

#### Passo 1: Preparar Servidor

```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (process manager)
npm install -g pm2
```

#### Passo 2: Clonar e Configurar

```bash
# Clonar repositório
git clone https://github.com/Lucresia-Elevare/Neurovendas-Elevare-.git
cd Neurovendas-Elevare-

# Checkout branch production
git checkout main

# Instalar dependências
npm install --legacy-peer-deps --production

# Configurar .env
cp .env.example .env.production
nano .env.production  # Editar com valores corretos

# Build
npm run build
```

#### Passo 3: Iniciar com PM2

```bash
# Criar ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'elevare-api',
    script: './dist/server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
  }]
};
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js --env production

# Salvar configuração
pm2 save

# Configurar inicialização automática
pm2 startup
```

#### Passo 4: Configurar Nginx

```bash
# Instalar Nginx
sudo apt install nginx

# Criar configuração
sudo nano /etc/nginx/sites-available/elevare

# Adicionar:
server {
    listen 80;
    server_name elevare.com.br www.elevare.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/elevare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Instalar SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d elevare.com.br -d www.elevare.com.br
```

### Opção 2: Deploy com Docker

#### Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/server/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      # ... outras variáveis
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: elevare
      POSTGRES_USER: elevare
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy com Docker

```bash
# Build
docker-compose build

# Rodar migrações
docker-compose run app npm run db:migrate:prod

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### Opção 3: Deploy na Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configurações no Vercel**:
- Build Command: `npm run build`
- Output Directory: `dist/client`
- Environment Variables: Adicionar todas as variáveis frontend

#### Backend (Railway)

1. Conectar repositório no [Railway.app](https://railway.app)
2. Adicionar PostgreSQL addon
3. Configurar variáveis de ambiente
4. Deploy automático no push para main

---

## ✅ Validação Pós-Deploy

### 1. Health Checks

```bash
# Basic ping
curl https://elevare.com.br/api/trpc/health.ping

# Detailed health check
curl https://elevare.com.br/api/trpc/health.check

# Ready check (para load balancer)
curl https://elevare.com.br/api/trpc/health.ready

# Live check
curl https://elevare.com.br/api/trpc/health.live
```

### 2. Validar Funcionalidades Críticas

**QuickCreate Flow**:
- [ ] Acessar `/quick-create`
- [ ] Selecionar preset (deve mostrar 12 opções)
- [ ] Upload de imagens (testar 1, 2 e 3 imagens)
- [ ] Gerar caption com IA (deve chamar OpenAI)
- [ ] Ver análise de engajamento em tempo real
- [ ] Aplicar sugestões da IA
- [ ] Publicar post

**Backend**:
- [ ] Criar post (deve salvar no banco)
- [ ] Agendar post (status = scheduled)
- [ ] Publicar no Instagram (se configurado)

### 3. Monitoramento

```bash
# Ver logs PM2
pm2 logs elevare-api

# Monitorar recursos
pm2 monit

# Status da aplicação
pm2 status
```

---

## 📊 Configuração de Monitoramento

### Sentry (Error Tracking)

1. Criar projeto no [sentry.io](https://sentry.io)
2. Copiar DSN
3. Adicionar ao `.env.production`:

```env
SENTRY_DSN="https://...@sentry.io/..."
```

4. Reiniciar aplicação

### PostHog (Analytics)

1. Criar projeto no [posthog.com](https://posthog.com)
2. Copiar API key
3. Adicionar ao `.env.production`:

```env
POSTHOG_API_KEY="phc_..."
```

### Logs

```bash
# Configurar rotação de logs (logrotate)
sudo nano /etc/logrotate.d/elevare

# Adicionar:
/home/ubuntu/Neurovendas-Elevare-/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 ubuntu ubuntu
}
```

---

## 🔒 Segurança

### Checklist de Segurança

- [ ] HTTPS configurado (SSL/TLS)
- [ ] Secrets em `.env`, nunca no código
- [ ] JWT secrets com 32+ caracteres
- [ ] Database com senha forte
- [ ] S3 bucket com permissões corretas
- [ ] Rate limiting configurado
- [ ] CORS configurado
- [ ] Firewall ativo (apenas portas 80, 443, 22)

### Rate Limiting

Adicionar ao Nginx:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # ... resto da config
}
```

---

## 📈 Performance

### Otimizações Recomendadas

**CDN**:
- Usar CloudFront para S3
- Cache de assets estáticos

**Database**:
- Indexes em `userId`, `status`, `scheduledFor`
- Connection pooling configurado

**Node.js**:
- PM2 em cluster mode (2+ instâncias)
- Memory limit: 1GB por instância

### Cache

```bash
# Instalar Redis (para cache futuro)
sudo apt install redis-server
sudo systemctl enable redis-server
```

---

## 🔄 CI/CD (Configuração Manual)

### GitHub Actions

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: TypeScript Check
        run: npm run check
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /home/ubuntu/Neurovendas-Elevare-
            git pull origin main
            npm install --legacy-peer-deps --production
            npm run build
            npm run db:migrate:prod
            pm2 reload elevare-api
```

**GitHub Secrets** a configurar:
- `HOST`: IP ou hostname do servidor
- `USERNAME`: usuário SSH
- `SSH_KEY`: chave privada SSH

---

## 🆘 Troubleshooting

### Problema: Build falha

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Verificar versão do Node
node --version  # Deve ser 18+
```

### Problema: Migrações falham

```bash
# Verificar conexão com banco
psql $DATABASE_URL

# Ver migrações aplicadas
npm run db:status

# Reverter última migração (se necessário)
npm run db:migrate:rollback
```

### Problema: OpenAI timeout

- Verificar API key válida
- Aumentar timeout no código
- Verificar rate limits da OpenAI

### Problema: S3 upload falha

- Verificar permissões do bucket
- Verificar IAM user permissions
- Testar upload manual com AWS CLI

---

## 📞 Suporte

**Documentação**:
- Técnica: `GUIA_TECNICO_ARQUITETURA.md`
- Produto: `ANALISE_ESTRATEGICA_PRODUTO.md`
- Roadmap: `ROADMAP_IMPLEMENTACAO.md`

**Logs Úteis**:
```bash
# Logs da aplicação
pm2 logs elevare-api --lines 100

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
journalctl -u nginx -f
```

---

## 🎯 Checklist Final

Antes de declarar produção operacional:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Migrações do banco aplicadas
- [ ] Build da aplicação bem-sucedido
- [ ] Health checks retornando OK
- [ ] SSL/HTTPS funcionando
- [ ] Testes funcionais passando
- [ ] Monitoramento configurado (Sentry)
- [ ] Analytics configurado (PostHog)
- [ ] Backups do banco configurados
- [ ] Domínio DNS configurado
- [ ] Logs rotacionando corretamente
- [ ] PM2 configurado para restart automático
- [ ] Firewall configurado
- [ ] Rate limiting ativo

---

## 📅 Timeline de Deploy

**Tempo estimado**: 4-6 horas

1. **Preparação** (1h): Criar contas, configurar AWS/OpenAI
2. **Configuração** (1h): Servidor, banco, variáveis
3. **Deploy** (1h): Build, migrações, iniciar app
4. **Validação** (1h): Testes funcionais, health checks
5. **Monitoramento** (1h): Sentry, PostHog, logs
6. **Documentação** (1h): Anotar credenciais, procedimentos

---

**Última atualização**: Sprint 3 - Production Readiness
**Versão**: 1.0.0
**Status**: ✅ MVP Pronto para Deploy
