# Correção de Nested Anchor Tags

## Data: 02/01/2026

### Problema Identificado

Erro no console do navegador: `<a> cannot contain a nested <a>`

**Causa:** O componente Wouter's `<Link>` já renderiza um `<a>` tag internamente. Ao colocar um `<a>` dentro de `<Link>`, criava-se uma estrutura inválida de HTML com anchors aninhados.

### Código Problemático (ANTES)

```tsx
// ❌ ERRADO - Nested anchor tags
<Link href="/">
  <a className="...">
    <Home className="w-4 h-4" />
  </a>
</Link>
```

### Código Corrigido (DEPOIS)

```tsx
// ✅ CORRETO - Link com className diretamente
<Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
  <Home className="w-4 h-4" />
  <span className="sr-only">Home</span>
</Link>
```

### Componentes Corrigidos

#### 1. Breadcrumbs.tsx
- **Linha 21-26**: Link Home corrigido
- **Linha 36-40**: Links de breadcrumb items corrigidos
- **Mudança**: Removido `<a>` wrapper, classes movidas para `<Link>` diretamente

#### 2. ProgressStepper.tsx
- **Linha 48-57**: Links de steps corrigidos
- **Mudança**: Removido `<a>` wrapper, classes movidas para `<Link>` diretamente

### Resultado

✅ Erro de nested anchors eliminado
✅ Navegação funcionando corretamente
✅ Estilização mantida
✅ Acessibilidade preservada
✅ Sem erros no console do navegador

### Lição Aprendida

**Regra:** Quando usar `<Link>` do Wouter (ou qualquer biblioteca de roteamento que renderize `<a>` internamente), NUNCA adicionar um `<a>` child. As classes CSS devem ser aplicadas diretamente no componente `<Link>`.

```tsx
// ✅ PADRÃO CORRETO
<Link href="/path" className="...">
  Conteúdo
</Link>

// ❌ PADRÃO ERRADO
<Link href="/path">
  <a className="...">
    Conteúdo
  </a>
</Link>
```
