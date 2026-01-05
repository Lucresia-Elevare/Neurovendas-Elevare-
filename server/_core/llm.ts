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
}

export async function generateEbookContent(options: GenerateContentOptions): Promise<string> {
  const { theme, targetAudience, objective } = options;

  const prompt = `
Você é um especialista em neurovendas e copywriting. Crie um conteúdo de e-book profissional e persuasivo com base nas seguintes informações:

Tema: ${theme}
Público-Alvo: ${targetAudience}
Objetivo: ${objective}

Gere um conteúdo estruturado em HTML com:
1. Um título principal (h1)
2. Uma introdução envolvente
3. 3-5 seções principais (h2) com conteúdo detalhado
4. Subtítulos (h3) quando necessário
5. Parágrafos bem escritos e persuasivos
6. Listas e bullet points quando apropriado
7. Uma conclusão com call-to-action

Use técnicas de neurovendas, gatilhos mentais e storytelling. O conteúdo deve ser profissional, educativo e engajador.

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
    
    // Fallback content for development/testing
    return generateFallbackContent(options);
  }
}

function generateFallbackContent(options: GenerateContentOptions): string {
  const { theme, targetAudience, objective } = options;

  return `
<h1>${theme}</h1>

<p>Este e-book foi criado especialmente para <strong>${targetAudience}</strong> com o objetivo de ${objective}.</p>

<h2>Introdução</h2>
<p>Bem-vindo a este guia completo sobre ${theme}. Nas próximas páginas, você descobrirá insights valiosos e estratégias práticas que transformarão sua abordagem.</p>

<h2>Por Que Isso Importa?</h2>
<p>Em um mercado cada vez mais competitivo, entender ${theme} não é mais opcional – é essencial. Este conhecimento pode ser o diferencial entre o sucesso e a estagnação.</p>

<h3>Benefícios Principais</h3>
<ul>
  <li>Domínio completo do assunto</li>
  <li>Aplicação prática imediata</li>
  <li>Resultados mensuráveis</li>
  <li>Vantagem competitiva</li>
</ul>

<h2>Estratégias Fundamentais</h2>
<p>Vamos explorar as estratégias essenciais que você precisa conhecer:</p>

<h3>Estratégia 1: Fundamentos Sólidos</h3>
<p>Construir uma base forte é crucial. Sem fundamentos sólidos, qualquer estrutura desmorona. Dedique tempo para dominar os conceitos básicos antes de avançar.</p>

<h3>Estratégia 2: Implementação Consistente</h3>
<p>Conhecimento sem ação é inútil. A chave está na implementação consistente das técnicas aprendidas, criando um hábito de excelência.</p>

<h3>Estratégia 3: Medição e Otimização</h3>
<p>O que não é medido não pode ser melhorado. Estabeleça métricas claras e monitore seu progresso regularmente.</p>

<h2>Próximos Passos</h2>
<p>Agora que você tem as ferramentas e o conhecimento necessários, é hora de agir. Comece implementando uma estratégia por vez e observe os resultados.</p>

<h2>Conclusão</h2>
<p>O caminho para o sucesso em ${theme} está claro. Você tem o mapa, as ferramentas e o conhecimento. O único ingrediente que falta é a ação.</p>

<p><strong>Está pronto para começar sua transformação?</strong></p>
  `.trim();
}
