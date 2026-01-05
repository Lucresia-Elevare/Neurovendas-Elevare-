# 🔐 Integração com Stripe - Documentação Completa

## Visão Geral

O Neurovendas E-books IA possui integração completa com Stripe para gerenciar planos de assinatura (Free, Pro, Enterprise) com checkout seguro, gerenciamento de subscriptions e webhooks automáticos.

---

## 🏗️ Arquitetura

### Backend
- **stripe.router.ts** - Endpoints tRPC para gerenciar subscriptions
- **stripe.db.ts** - Database helpers para operações com Stripe
- **stripe-products.ts** - Definição centralizada de planos e preços
- **stripe-webhook.ts** - Handler para webhooks do Stripe

### Frontend
- **Pricing.tsx** - Página de planos com checkout
- **Dashboard.tsx** - Gerenciamento de subscriptions e faturas

### Database
- **stripe_customers** - Mapeia usuários para Stripe Customer IDs
- **subscriptions** - Armazena informações de subscriptions ativas
- **invoices** - Histórico de faturas para auditoria

---

## 📋 Planos Disponíveis

### Free (Grátis)
- Até 5 e-books por mês
- Templates básicos
- Suporte por email
- Sem marca d'água

### Pro ($29.99/mês)
- E-books ilimitados
- Todos os templates
- Suporte prioritário
- Analytics avançado
- Colaboração em tempo real
- Exportação em múltiplos formatos

### Enterprise ($99.99/mês)
- Tudo do Pro
- API customizada
- Suporte dedicado 24/7
- Integrações personalizadas
- SLA garantido
- Treinamento da equipe

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Stripe API Keys (fornecidas automaticamente)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs (configurar após criar produtos no Stripe)
STRIPE_FREE_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### Setup Inicial

1. **Acessar Stripe Dashboard**
   - Ir para https://dashboard.stripe.com
   - Reivindicar sandbox de teste (se necessário)

2. **Criar Produtos e Preços**
   - Criar 3 produtos: Free, Pro, Enterprise
   - Configurar preços recorrentes
   - Copiar Price IDs para `.env`

3. **Configurar Webhooks**
   - Endpoint: `https://seu-dominio.com/api/stripe/webhook`
   - Eventos: checkout.session.completed, customer.subscription.updated, invoice.paid

4. **Testar com Cartão de Teste**
   - Número: `4242 4242 4242 4242`
   - Expiração: Qualquer data futura
   - CVC: Qualquer 3 dígitos

---

## 🔄 Fluxo de Checkout

```
1. Usuário clica "Escolher Plano" em /pricing
2. Frontend chama trpc.stripe.createCheckoutSession
3. Backend cria Stripe Customer (se necessário)
4. Backend cria Checkout Session
5. Frontend redireciona para Stripe Checkout
6. Usuário completa pagamento
7. Stripe envia webhook checkout.session.completed
8. Backend cria subscription no banco de dados
9. Usuário é redirecionado para /dashboard
```

---

## 📡 Webhooks

### Eventos Tratados

#### checkout.session.completed
- Cria Stripe Customer record
- Cria subscription no banco de dados
- Sincroniza período de cobrança

#### customer.subscription.updated
- Atualiza status da subscription
- Sincroniza período de cobrança
- Detecta cancelamentos agendados

#### customer.subscription.deleted
- Marca subscription como cancelada
- Atualiza status no banco de dados

#### invoice.paid
- Cria registro de fatura
- Armazena URL da fatura
- Marca como pago

#### invoice.payment_failed
- Cria registro de fatura com status uncollectible
- Notifica usuário (futuro)

### Teste de Webhook

```bash
# Usar Stripe CLI para testar localmente
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Disparar evento de teste
stripe trigger checkout.session.completed
```

---

## 🛠️ Endpoints tRPC

### stripe.getPlans
Retorna todos os planos disponíveis.

```typescript
const plans = await trpc.stripe.getPlans.query();
```

### stripe.createCheckoutSession
Cria uma sessão de checkout para um plano.

```typescript
const { url } = await trpc.stripe.createCheckoutSession.mutate({
  planId: "PRO" // "FREE" | "PRO" | "ENTERPRISE"
});
window.open(url, "_blank");
```

### stripe.getSubscription
Retorna a subscription ativa do usuário.

```typescript
const subscription = await trpc.stripe.getSubscription.query();
```

### stripe.cancelSubscription
Cancela a subscription ao final do período.

```typescript
await trpc.stripe.cancelSubscription.mutate();
```

### stripe.updateSubscriptionPlan
Faz upgrade/downgrade para outro plano.

```typescript
await trpc.stripe.updateSubscriptionPlan.mutate({
  newPlanId: "ENTERPRISE"
});
```

### stripe.getInvoices
Retorna histórico de faturas do usuário.

```typescript
const invoices = await trpc.stripe.getInvoices.query();
```

### stripe.getCheckoutSession
Retorna detalhes de uma sessão de checkout.

```typescript
const session = await trpc.stripe.getCheckoutSession.query({
  sessionId: "cs_test_..."
});
```

---

## 💾 Schema do Banco de Dados

### stripe_customers
```sql
CREATE TABLE stripe_customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT UNIQUE NOT NULL,
  stripeCustomerId VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### subscriptions
```sql
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  stripeSubscriptionId VARCHAR(255) UNIQUE NOT NULL,
  stripePriceId VARCHAR(255) NOT NULL,
  status ENUM('active', 'past_due', 'canceled', 'unpaid') NOT NULL,
  currentPeriodStart TIMESTAMP,
  currentPeriodEnd TIMESTAMP,
  canceledAt TIMESTAMP,
  cancelAtPeriodEnd BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### invoices
```sql
CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  stripeInvoiceId VARCHAR(255) UNIQUE NOT NULL,
  stripeSubscriptionId VARCHAR(255),
  amount INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('draft', 'open', 'paid', 'void', 'uncollectible') NOT NULL,
  paidAt TIMESTAMP,
  invoiceUrl VARCHAR(512),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🧪 Testes

### Executar Testes
```bash
pnpm test
```

### Cobertura
- ✅ Criar Stripe Customer
- ✅ Criar Subscription
- ✅ Atualizar Status
- ✅ Cancelar Subscription
- ✅ 19/19 testes passando

---

## 🚀 Deploy em Produção

### Antes de Publicar

1. **Ativar Modo Produção no Stripe**
   - Completar KYC verification
   - Obter chaves de produção
   - Adicionar chaves em Settings → Payment

2. **Configurar Domínio**
   - Atualize webhook endpoint para domínio de produção
   - Configure SSL/TLS

3. **Testar Fluxo Completo**
   - Criar subscription de teste
   - Fazer upgrade/downgrade
   - Cancelar subscription
   - Verificar webhooks

4. **Monitorar**
   - Verificar logs de webhook
   - Monitorar taxa de erro
   - Acompanhar conversões

### Chaves de Produção

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🐛 Troubleshooting

### Webhook não está sendo recebido
- Verificar URL do webhook em Stripe Dashboard
- Verificar se STRIPE_WEBHOOK_SECRET está correto
- Verificar logs do servidor

### Checkout não funciona
- Verificar se Price IDs estão configurados
- Verificar se VITE_STRIPE_PUBLISHABLE_KEY está correto
- Verificar console do navegador para erros

### Subscription não está sincronizando
- Verificar se webhook está sendo recebido
- Verificar logs do servidor
- Executar `pnpm db:push` para sincronizar schema

### Erro "Price ID not configured"
- Adicionar Price IDs em `.env`
- Reiniciar dev server
- Verificar se IDs estão corretos

---

## 📚 Recursos Adicionais

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## ✅ Checklist de Produção

- [ ] Chaves de produção configuradas
- [ ] Webhooks testados
- [ ] Planos de preço criados
- [ ] Fluxo de checkout validado
- [ ] Upgrade/downgrade testado
- [ ] Cancelamento testado
- [ ] Histórico de faturas verificado
- [ ] Monitoramento configurado
- [ ] Documentação atualizada
- [ ] Suporte ao cliente preparado

---

**Versão:** 1.0.0  
**Última atualização:** 03 de Janeiro de 2026  
**Status:** ✅ Pronto para Produção
