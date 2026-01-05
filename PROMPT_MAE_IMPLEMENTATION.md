# PROMPT MÃE - Sistema Premium de IA Elevare

## Visão Geral

O **PROMPT MÃE** (Mother Prompt) é o sistema de geração de conteúdo com IA que define a identidade da marca Elevare. Este não é apenas um prompt de LLM - é um framework estratégico que transforma conteúdo gerado por IA em material de consultoria premium.

## O Problema Que Resolve

### Antes do PROMPT MÃE
- Conteúdo genérico que qualquer IA poderia gerar
- Tom transacional ("compre agora")
- Sem especificidade de mercado
- Parece "conteúdo de blog"
- Zero autoridade profissional

### Depois do PROMPT MÃE
- Conteúdo estratégico específico para estética/saúde/bem-estar
- Tom educacional premium (consultoria)
- Conecta técnica a impacto financeiro
- Parece "material de mentoria avançada"
- Constrói autoridade profissional

## Princípios Fundamentais

### 1. Nunca Conteúdo Genérico
❌ **Errado:** "Neste guia você aprenderá estratégias valiosas..."  
✅ **Correto:** "A maioria dos profissionais de estética começa replicando o que funciona para outros. O problema? Essa abordagem ignora um fato crítico: seu mercado é único."

### 2. Nunca Frases Comuns de IA
❌ **Errado:** "No mundo cada vez mais competitivo..."  
✅ **Correto:** "Profissionais que constroem clínicas premium não trabalham mais. Eles trabalham melhor."

### 3. Nunca Promessas Milagrosas
❌ **Errado:** "Transforme seu negócio em 30 dias!"  
✅ **Correto:** "A diferença entre onde você está e onde quer chegar é clareza estratégica aplicada com consistência."

### 4. Sempre Conectar Técnica a Impacto
❌ **Errado:** "Aprenda a técnica X"  
✅ **Correto:** "Domínio técnico é o mínimo esperado. O que constrói autoridade é sua capacidade de traduzir técnica em impacto percebido pelo cliente."

## Estrutura Obrigatória: Neurovendas Flow

### Fluxo: Consciência → Compreensão → Nova Perspectiva → Ação

#### 1. Consciência (Introdução)
**Objetivo:** Fazer o leitor reconhecer uma dor que ele talvez ignore

**Como fazer:**
- Contextualize a dor real do profissional
- Mostre por que "o jeito comum" não funciona
- Use dados do mercado (não dados inventados)

**Exemplo:**
> "Quando você não tem clareza estratégica sobre [tema], três coisas acontecem:
> - Trabalho reativo: Você responde ao mercado em vez de defini-lo
> - Margem comprimida: Sem diferenciação clara, o preço vira a única variável
> - Posicionamento frágil: Sua autoridade depende de tendências passageiras"

#### 2. Compreensão (Desenvolvimento - Parte 1)
**Objetivo:** Mostrar os fundamentos técnicos essenciais

**Como fazer:**
- Explique conceitos de forma clara
- Use exemplos do mercado de estética/saúde
- Mostre os "erros invisíveis" que sabotam resultados

**Exemplo:**
> "Profissional mediano explica o procedimento. Profissional posicionado explica o resultado transformacional que o cliente vai experimentar — e conecta isso à técnica escolhida."

#### 3. Nova Perspectiva (Desenvolvimento - Parte 2)
**Objetivo:** Apresentar uma forma diferente de pensar

**Como fazer:**
- Contraste "jeito comum" vs "jeito estratégico"
- Mostre como profissionais de alta performance pensam
- Apresente frameworks aplicáveis

**Exemplo:**
> "Você não precisa de mais informação. Você precisa de mais clareza sobre o que ignorar.
> Profissionais de alta performance sabem que cada 'sim' para uma estratégia é um 'não' para outras."

#### 4. Ação (Encerramento)
**Objetivo:** Conduzir a uma decisão sem pressão

**Como fazer:**
- Síntese estratégica (resumo do valor)
- Passos práticos e concretos
- CTA sutil, sem pitch agressivo

**Exemplo:**
> "Mapeie seu posicionamento atual: Onde você compete por preço? Onde compete por diferenciação? A resposta mostra suas vulnerabilidades.
> 
> O próximo passo é seu."

## Tom de Voz Elevare

### Características Obrigatórias

**✅ Profissional**
- Não: corporativo robótico
- Sim: consultoria especializada

**✅ Estratégico**
- Não: táticas isoladas
- Sim: visão sistêmica

**✅ Humano**
- Não: frases de IA
- Sim: conversa inteligente

**✅ Direto**
- Não: textos longos e redundantes
- Sim: clareza objetiva

**✅ Respeitoso**
- Não: infantilizar o leitor
- Sim: tratá-lo como profissional

### Frases Proibidas
❌ "No mundo atual..."  
❌ "Você vai descobrir..."  
❌ "Neste guia completo..."  
❌ "Prepare-se para transformar..."  
❌ "Chegou a hora de..."  

### Frases Recomendadas
✅ "A diferença está em..."  
✅ "Profissionais que [resultado] não [ação comum]. Eles [ação estratégica]."  
✅ "A pergunta certa: [pergunta provocativa]"  
✅ "Isso não é [erro comum]. É [visão correta]."  
✅ "O próximo passo é seu."  

## Especificidade de Mercado

### Foco: Estética, Saúde e Bem-Estar

**Sempre que possível, use:**
- Exemplos de clínicas e consultórios
- Referências a procedimentos estéticos
- Linguagem do mercado (sem jargão excessivo)
- Contexto de posicionamento profissional

**Exemplos práticos:**

❌ **Genérico:**
> "Construa autoridade no seu mercado"

✅ **Específico:**
> "Uma clínica premium não compete por volume de procedimentos. Compete por percepção de valor e resultado transformacional."

❌ **Genérico:**
> "Aumente seus preços"

✅ **Específico:**
> "Quando um cliente escolhe entre dois profissionais de harmonização facial, ele não compara técnicas. Ele compara a confiança que cada um transmite."

## Implementação Técnica

### Arquivo: `server/_core/llm.ts`

```typescript
const prompt = `
PROMPT MÃE — IA DO GERADOR DE EBOOKS ELEVARE | NEUROVENDAS

Você é uma IA especialista em estratégia de conteúdo, neurovendas e 
posicionamento profissional, focada no mercado de estética, saúde e bem-estar.

PRINCÍPIOS INEGOCIÁVEIS:
- Nunca gerar conteúdo genérico
- Nunca repetir frases comuns de IA
- Nunca prometer resultados milagrosos
- Sempre conectar conhecimento técnico a impacto financeiro
- Linguagem clara, segura, profissional e humana

VISÃO NEUROVENDAS (OBRIGATÓRIA):
Consciência → Compreensão → Nova Perspectiva → Ação

ESTRUTURA OBRIGATÓRIA:
**Introdução** - Contextualiza dor, mostra por que "jeito comum" falha
**Desenvolvimento** - Fundamentos + erros invisíveis + nova forma de pensar
**Encerramento** - Síntese + passos práticos + CTA sutil

TOM DE VOZ:
Profissional, estratégico, humano, direto. Sem infantilização.

IDENTIDADE ELEVARE:
Conteúdo que gera autoridade. Material de mentoria avançada.
`;
```

### Fallback Content (Desenvolvimento)

O conteúdo de fallback também segue os mesmos padrões:

```typescript
function generateFallbackContent(options: GenerateContentOptions): string {
  return `
<h1>${theme}</h1>

<h2>Por Que Este Tema Importa Para ${targetAudience}?</h2>
<p>A maioria dos profissionais de estética, saúde e bem-estar começa 
da mesma forma: tentando replicar o que funciona para outros. 
O problema? Essa abordagem ignora um fato crítico...</p>

<h2>O Custo Invisível de Não Dominar ${theme}</h2>
<ul>
  <li><strong>Trabalho reativo:</strong> Você responde ao mercado...</li>
  <li><strong>Margem comprimida:</strong> Sem diferenciação...</li>
  <li><strong>Posicionamento frágil:</strong> Sua autoridade...</li>
</ul>

<h2>Nova Perspectiva: Como Profissionais de Alta Performance Pensam Diferente</h2>
...
  `;
}
```

## Exemplos Reais

### Exemplo 1: Tema "Precificação Estratégica em Estética"

**Introdução (Consciência):**
> "Quando você precifica um procedimento estético pensando 'quanto o mercado cobra', você já perdeu. Não porque o preço esteja errado, mas porque a pergunta está errada.
>
> A questão não é 'quanto cobrar'. É 'por que um cliente pagaria mais por mim do que pelo concorrente que oferece o mesmo procedimento'."

**Desenvolvimento (Compreensão):**
> "Clínicas que competem por preço vivem em um ciclo de erosão de margem. Cada novo concorrente força uma pequena redução. Em 24 meses, sua margem está comprimida ao ponto onde crescer é impossível.
>
> O erro invisível: você tratou preço como variável isolada. Mas preço é consequência de posicionamento, comunicação e experiência percebida."

**Nova Perspectiva:**
> "Profissionais de alta performance não 'cobram mais caro'. Eles constroem sistemas de valor percebido que tornam o preço irrelevante para o cliente ideal.
>
> Exemplo prático: Dois profissionais fazem preenchimento labial. Um cobra R$ 800, outro R$ 1.500. A diferença não está na técnica. Está na forma como cada um comunica o resultado."

**Ação (Encerramento):**
> "Mapeie sua proposta de valor atual:
> 1. Liste os 3 principais benefícios que você oferece
> 2. Para cada um, pergunte: 'Um cliente leigo entenderia isso como diferencial?'
> 3. Se a resposta for não, você tem uma oportunidade de reposicionamento.
>
> O próximo passo é seu."

### Exemplo 2: Tema "Fidelização de Clientes em Consultórios"

**Introdução (Consciência):**
> "A maioria dos consultórios perde 40% dos clientes após o primeiro atendimento. Não por falha técnica. Por falta de sistema de continuidade.
>
> O problema? Você investiu tempo e dinheiro para atrair um cliente, ofereceu um serviço de qualidade, e ele... simplesmente não volta. E você não sabe por quê."

**Desenvolvimento (Compreensão):**
> "Fidelização não acontece no atendimento. Acontece nos 90 dias seguintes. É o que você faz (ou deixa de fazer) nesse período que define se o cliente vira recorrente ou estatística.
>
> Erro invisível comum: acreditar que 'bom atendimento' é suficiente. Não é. Seu concorrente também atende bem."

**Nova Perspectiva:**
> "Consultórios com alta taxa de retenção têm uma diferença: sistema de pós-atendimento estruturado.
>
> Não é 'enviar mensagem no WhatsApp'. É ter uma sequência planejada de pontos de contato que reforçam o valor do relacionamento."

**Ação (Encerramento):**
> "Pegue os últimos 10 clientes que não retornaram. Pergunte-se:
> 1. Quantos pontos de contato você teve com eles após o atendimento?
> 2. Algum desses contatos agregou valor educacional?
> 3. Você ofereceu um motivo concreto para eles voltarem?
>
> Se a resposta é zero ou um, você sabe onde começar."

## Checklist de Qualidade

Use este checklist para validar se o conteúdo gerado segue o PROMPT MÃE:

### Princípios ✓
- [ ] Conteúdo é específico (não genérico)
- [ ] Nenhuma frase "comum de IA"
- [ ] Sem promessas milagrosas
- [ ] Conecta técnica a impacto financeiro
- [ ] Linguagem profissional e humana

### Estrutura ✓
- [ ] Introdução contextualiza dor real
- [ ] Desenvolvimento mostra erros invisíveis
- [ ] Nova perspectiva apresentada
- [ ] Ação concreta no encerramento
- [ ] CTA sutil (sem pitch agressivo)

### Tom de Voz ✓
- [ ] Profissional (não corporativo)
- [ ] Estratégico (não tático)
- [ ] Humano (não robótico)
- [ ] Direto (não prolixo)
- [ ] Respeitoso (não condescendente)

### Especificidade ✓
- [ ] Exemplos do mercado de estética/saúde
- [ ] Linguagem do setor (sem jargão excessivo)
- [ ] Contexto de clínicas/consultórios
- [ ] Foco em posicionamento profissional

## Resultado Esperado

Quando o PROMPT MÃE é bem executado, o leitor deve sentir:

> **"Isso não é um ebook qualquer. Isso parece material de quem realmente entende o mercado e poderia estar cobrando consultoria por esse conhecimento."**

Se o conteúdo gera essa percepção, o sistema está funcionando corretamente.

## Métricas de Sucesso

### Qualitativas
- Autoridade percebida (feedback de clientes)
- Compartilhamento orgânico (profissionais compartilham)
- Uso profissional (clínicas usam internamente)

### Quantitativas
- Taxa de conclusão de leitura &gt; 70%
- Tempo médio de leitura &gt; 8 minutos
- Downloads repetidos (mesmo usuário baixa múltiplos e-books)
- Conversão para próxima ação &gt; 15%

## Manutenção e Evolução

### Quando Atualizar o PROMPT MÃE

1. **Feedback consistente:** Se 3+ clientes mencionarem o mesmo tipo de falha
2. **Nova tendência de mercado:** Quando houver mudança significativa no setor
3. **Evolução da marca:** Se o posicionamento Elevare mudar
4. **Dados de engajamento:** Se métricas caírem &gt; 20% por 2 meses

### Como Testar Mudanças

1. Gere 5 e-books com prompt atual
2. Gere 5 e-books com prompt modificado
3. Blind test com 10 profissionais do setor
4. Compare métricas de engajamento
5. Implemente se houver melhoria &gt; 15%

## Conclusão

O PROMPT MÃE não é apenas um prompt de IA. É a codificação da identidade Elevare em um sistema replicável e escalável.

Quando bem executado:
- Conteúdo se distingue de concorrentes
- Constrói autoridade de marca
- Gera percepção de valor premium
- Profissionais veem material como investimento (não commodity)

**Regra final:** Se o conteúdo pudesse ser gerado por qualquer IA genérica, o PROMPT MÃE falhou. Se parece consultoria premium, acertamos.

---

**Documento criado:** Janeiro 2026  
**Versão:** 1.0  
**Status:** Implementado e em produção  
**Responsável:** Sistema de IA Elevare
