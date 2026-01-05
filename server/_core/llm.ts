/**
 * LLM Integration for content generation
 * Uses Manus Forge API (Gemini 2.5 Flash)
 */

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

export interface GenerateContentOptions {
  theme: string;
  targetAudience: string;
  objective: string;
  mainPain?: string;
  realisticPromise?: string;
}

export async function generateEbookContent(options: GenerateContentOptions): Promise<string> {
  const { theme, targetAudience, objective, mainPain, realisticPromise } = options;

  const prompt = `
PROMPT MÃE — IA DO GERADOR DE EBOOKS ELEVARE | NEUROVENDAS

Você é uma IA especialista em estratégia de conteúdo, neurovendas e posicionamento profissional, focada no mercado de estética, saúde e bem-estar.

Seu papel NÃO é apenas gerar texto.
Seu papel é organizar pensamento, criar clareza estratégica e conduzir o leitor a uma nova decisão, sem vendas agressivas.

Você escreve como uma marca educacional premium.

PRINCÍPIOS INEGOCIÁVEIS:
- Nunca gerar conteúdo genérico
- Nunca repetir frases comuns de IA
- Nunca prometer resultados milagrosos
- Sempre conectar conhecimento técnico a impacto financeiro e posicionamento profissional
- Linguagem clara, segura, profissional e humana

VISÃO NEUROVENDAS (OBRIGATÓRIA):
Todo conteúdo deve seguir a lógica:
Consciência → Compreensão → Nova Perspectiva → Ação

Sem pressão. Sem gatilho barato. Com autoridade e inteligência.

INFORMAÇÕES DO E-BOOK:
Tema: ${theme}
Público-Alvo: ${targetAudience}
Objetivo: ${objective}${mainPain ? `\nDor Principal do Leitor: ${mainPain}` : ""}${realisticPromise ? `\nPromessa Realista: ${realisticPromise}` : ""}

ESTRUTURA OBRIGATÓRIA DO EBOOK:

**Introdução**
- Contextualiza a dor real do profissional
- Mostra por que "o jeito comum" não funciona

**Desenvolvimento**
- Fundamentos técnicos essenciais
- Erros invisíveis que sabotam resultados
- Nova forma de pensar e agir
- Boas práticas aplicáveis

**Encerramento**
- Síntese estratégica
- Convite à evolução profissional
- CTA sutil (sem pitch de venda)

TOM DE VOZ:
Profissional, estratégico, humano, direto. Sem infantilização. Sem jargões vazios.

IDENTIDADE ELEVARE:
Conteúdo que gera autoridade. Escrita que respeita a inteligência do leitor. Material que poderia ser usado por uma clínica premium ou mentoria avançada.

RESULTADO ESPERADO:
O leitor deve sentir: "Isso não é um ebook qualquer. Isso parece material de quem entende o mercado."

FORMATO DE SAÍDA:
Gere o conteúdo em HTML estruturado com:
- <h1> para o título principal
- <h2> para seções principais
- <h3> para subtítulos
- Parágrafos claros e objetivos
- Listas quando apropriado
- Exemplos concretos do mercado de estética/saúde/bem-estar

Priorize clareza sobre volume. Evite textos longos e cansativos.

Retorne APENAS o HTML do conteúdo (sem as tags <html>, <head> ou <body>), começando diretamente com o <h1>.
  `.trim();

  try {
    const response = await fetch(`${FORGE_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (!content) {
      throw new Error("No content generated from LLM");
    }

    return content.trim();
  } catch (error) {
    console.error("Error generating content with LLM:", error);
    
    // In production, throw error instead of using fallback
    if (process.env.NODE_ENV === "production") {
      throw new Error("Failed to generate content. Please try again.");
    }
    
    // Fallback content for development/testing only
    return generateFallbackContent(options);
  }
}

function generateFallbackContent(options: GenerateContentOptions): string {
  const { theme, targetAudience, objective } = options;

  return `
<h1>${theme}</h1>

<h2>Por Que Este Tema Importa Para ${targetAudience}?</h2>

<p>A maioria dos profissionais de estética, saúde e bem-estar começa da mesma forma: tentando replicar o que funciona para outros. O problema? Essa abordagem ignora um fato crítico: seu mercado, seu público e sua realidade são únicos.</p>

<p>Este material não é sobre fórmulas mágicas ou promessas vazias. É sobre entender os fundamentos estratégicos que separam profissionais posicionados como referência daqueles que competem apenas por preço.</p>

<h2>O Custo Invisível de Não Dominar ${theme}</h2>

<p>Quando você não tem clareza estratégica sobre ${theme}, três coisas acontecem:</p>

<ul>
  <li><strong>Trabalho reativo:</strong> Você responde ao mercado em vez de defini-lo</li>
  <li><strong>Margem comprimida:</strong> Sem diferenciação clara, o preço vira a única variável</li>
  <li><strong>Posicionamento frágil:</strong> Sua autoridade depende de tendências passageiras</li>
</ul>

<p>Esses não são apenas erros operacionais. São decisões estruturais que moldam seu teto de crescimento.</p>

<h2>Nova Perspectiva: Como Profissionais de Alta Performance Pensam Diferente</h2>

<p>Profissionais que constroem clínicas e consultórios premium não trabalham mais. Eles trabalham melhor. A diferença está em três pilares:</p>

<h3>1. Fundamentos Técnicos Como Base, Não Como Teto</h3>

<p>Domínio técnico é o mínimo esperado. O que constrói autoridade é sua capacidade de traduzir técnica em impacto percebido pelo cliente.</p>

<p>Exemplo prático: Um profissional mediano explica o procedimento. Um profissional posicionado explica o resultado transformacional que o cliente vai experimentar — e conecta isso à técnica escolhida.</p>

<h3>2. Eliminação de Ruído Estratégico</h3>

<p>Você não precisa de mais informação. Você precisa de mais clareza sobre o que ignorar.</p>

<p>Profissionais de alta performance sabem que cada "sim" para uma estratégia é um "não" para outras. Eles escolhem conscientemente onde concentrar energia — e aceitam deixar oportunidades secundárias passarem.</p>

<h3>3. Construção de Sistemas, Não Dependência de Esforço</h3>

<p>O crescimento sustentável vem de processos replicáveis. Se seu resultado depende de você estar presente em cada etapa, você construiu um emprego, não um negócio.</p>

<p>A pergunta certa: "O que precisa funcionar sem mim para eu crescer com previsibilidade?"</p>

<h2>Aplicação Prática: Como Usar Este Conhecimento Agora</h2>

<p>Este conteúdo tem valor apenas se gerar ação. Aqui está como começar:</p>

<ol>
  <li><strong>Mapeie seu posicionamento atual:</strong> Onde você compete por preço? Onde compete por diferenciação? A resposta mostra suas vulnerabilidades.</li>
  <li><strong>Identifique um ponto de ancoragem:</strong> Escolha um elemento técnico que você domina e construa narrativa de valor em torno dele.</li>
  <li><strong>Teste com seus próximos 5 clientes:</strong> Não mude tudo de uma vez. Refine sua abordagem com base em feedback real.</li>
</ol>

<h2>O Próximo Nível</h2>

<p>Você chegou até aqui porque sabe que conhecimento superficial não gera resultados profundos. ${objective}</p>

<p>A diferença entre onde você está e onde quer chegar não é sorte, networking ou "momento certo". É clareza estratégica aplicada com consistência.</p>

<p>Profissionais que constroem carreiras sólidas em ${theme} não esperam permissão. Eles tomam decisões informadas e assumem a responsabilidade pelos resultados.</p>

<p><strong>O próximo passo é seu.</strong></p>
  `.trim();
}
