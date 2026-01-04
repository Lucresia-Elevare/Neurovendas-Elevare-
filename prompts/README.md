# Prompts de IA - Neurovendas-Elevare

Esta pasta contém todos os prompts utilizados para geração de conteúdo com IA na plataforma Neurovendas.

## 📁 Estrutura

### `/sales` - Prompts de Vendas
Prompts especializados em processos de vendas e conversão.

**Tipos de conteúdo:**
- Scripts de cold calling
- Respostas a objeções
- Prompts de fechamento de vendas
- Prompts de follow-up
- Prompts de qualificação de leads

**Exemplo de arquivo:**
```
/sales/cold-calling-b2b-v1.md
/sales/objecoes-preco.md
/sales/fechamento-vendas-high-ticket.md
```

### `/content` - Prompts de Criação de Conteúdo
Prompts para geração de conteúdo de marketing e comunicação.

**Tipos de conteúdo:**
- Posts para redes sociais (LinkedIn, Instagram, Facebook)
- Artigos de blog e SEO
- E-mails marketing
- Scripts de vídeo
- Legendas e captions

**Exemplo de arquivo:**
```
/content/post-linkedin-autoridade.md
/content/artigo-blog-seo.md
/content/email-sequencia-nutricao.md
```

### `/strategy` - Prompts Estratégicos
Prompts para análise estratégica e planejamento.

**Tipos de conteúdo:**
- Análise de mercado e concorrência
- Planejamento estratégico
- Análise SWOT
- Persona e ICP (Ideal Customer Profile)
- Pesquisa de tendências

**Exemplo de arquivo:**
```
/strategy/analise-mercado-nicho.md
/strategy/criacao-persona-detalhada.md
/strategy/analise-concorrencia.md
```

## 📝 Estrutura de um Prompt

Cada prompt deve seguir este formato padrão:

```markdown
# Nome do Prompt

## 📋 Informações Gerais
- **Versão**: 1.0
- **Categoria**: Vendas/Conteúdo/Estratégia
- **Última Atualização**: YYYY-MM-DD
- **Autor**: Nome do criador

## 🎯 Objetivo
Descrição clara do que o prompt pretende alcançar.

## 📌 Contexto
Quando e como usar este prompt.

## 🤖 Prompt

```
[Seu prompt completo aqui]

Variáveis:
- {variavel1}: Descrição da variável
- {variavel2}: Descrição da variável
```
\```

## 💡 Exemplo de Uso

### Input
\```
Exemplo de entrada com variáveis preenchidas
\```

### Output Esperado
\```
Exemplo do resultado esperado
\```

## 📊 Métricas de Sucesso
Como avaliar a eficácia do prompt.

## 🔧 Otimizações e Variações
Sugestões de adaptações para diferentes contextos.

## 📚 Referências
Links e recursos relacionados.
```

## 🎯 Boas Práticas para Criação de Prompts

### 1. Seja Específico e Claro
- Use linguagem objetiva
- Defina claramente o contexto e objetivo
- Especifique o formato de saída desejado

### 2. Use Estrutura
- Divida prompts complexos em seções
- Use marcadores e numeração
- Forneça exemplos quando possível

### 3. Inclua Contexto Relevante
- Persona alvo
- Tom de voz
- Restrições e requisitos
- Informações de negócio

### 4. Documente Variáveis
- Liste todas as variáveis claramente
- Explique o que cada variável representa
- Forneça exemplos de valores válidos

### 5. Versione seus Prompts
- Use versionamento quando fizer mudanças significativas
- Documente o que mudou entre versões
- Mantenha versões anteriores como referência

### 6. Teste e Itere
- Teste o prompt com diferentes inputs
- Colete feedback de usuários
- Refine baseado em resultados reais

## 📊 Nomenclatura de Arquivos

```
categoria-descricao-v1.md
```

**Exemplos:**
- `sales-cold-calling-b2b-v1.md`
- `content-post-linkedin-autoridade-v2.md`
- `strategy-analise-concorrencia-v1.md`

## 🔄 Versionamento

### Quando criar nova versão:
- Mudanças significativas na estrutura do prompt
- Mudança no objetivo ou contexto de uso
- Otimizações importantes baseadas em resultados

### Como versionar:
```
meu-prompt-v1.md  → Primeira versão
meu-prompt-v2.md  → Versão atualizada
meu-prompt-v3.md  → Nova versão major
```

## 🚀 Como Contribuir

1. **Escolha a categoria apropriada** (`/sales`, `/content`, ou `/strategy`)
2. **Use o template padrão** descrito acima
3. **Nomeie o arquivo seguindo as convenções**
4. **Teste o prompt** antes de submeter
5. **Documente exemplos reais** de uso
6. **Submeta via Pull Request** com descrição clara

## 💡 Exemplos de Prompts Eficazes

### Exemplo: Prompt de Vendas
```markdown
# Cold Calling B2B - Tecnologia

## 🎯 Objetivo
Gerar script de cold calling para empresas B2B do setor de tecnologia.

## 🤖 Prompt
Você é um especialista em vendas B2B. Crie um script de cold calling para:
- Empresa: {nome_empresa}
- Setor: {setor}
- Dor identificada: {dor}
- Solução oferecida: {solucao}

O script deve:
1. Quebrar objeção inicial em 15 segundos
2. Fazer pergunta qualificadora
3. Apresentar proposta de valor
4. Solicitar reunião
```

### Exemplo: Prompt de Conteúdo
```markdown
# Post LinkedIn - Autoridade

## 🎯 Objetivo
Criar post de LinkedIn que estabeleça autoridade no nicho.

## 🤖 Prompt
Crie um post de LinkedIn sobre {tema} que:
- Use storytelling pessoal
- Inclua 1 insight valioso
- Termine com call-to-action
- Tom: {tom} (profissional, inspirador, educativo)
- Tamanho: 150-200 palavras
```

## 🔗 Recursos

- [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Prompt Library](https://docs.anthropic.com/claude/prompt-library)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## 📞 Suporte

Para dúvidas sobre prompts:
- Consulte exemplos existentes na pasta
- Leia o [CONTRIBUTING.md](../CONTRIBUTING.md)
- Abra uma issue com tag `prompts`
