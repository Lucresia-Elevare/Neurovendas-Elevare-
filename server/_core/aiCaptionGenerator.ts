/**
 * AI Caption Generator - OpenAI integration for NeuroVendas-optimized captions
 * Sprint 2: AI Integration
 */

import OpenAI from 'openai';
import { NEURO_PRESETS, type NeuroCopyFramework } from '../../shared/neuroPresets';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface GenerateCaptionInput {
  presetId: string;
  userContext?: string;
  imageDescriptions?: string[];
}

interface GenerateCaptionOutput {
  caption: string;
  reasoning: string;
  engagementPrediction: number;
  suggestedHashtags: string[];
  appliedFormula: string;
}

/**
 * Generates NeuroVendas-optimized caption using OpenAI
 */
export async function generateCaption(
  input: GenerateCaptionInput
): Promise<GenerateCaptionOutput> {
  const preset = NEURO_PRESETS.find(p => p.id === input.presetId);
  
  if (!preset) {
    throw new Error(`Preset ${input.presetId} not found`);
  }

  try {
    const prompt = buildPrompt(preset.copyFramework, input);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a NeuroSales expert specialized in aesthetics content for Instagram. 
You create captions that sell using psychological triggers and proven copywriting formulas.
You write in Brazilian Portuguese with a professional yet warm tone.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedText = response.choices[0]?.message?.content || '';
    
    // Extract caption and reasoning from response
    const [caption, reasoning] = parseResponse(generatedText);
    
    // Validate against preset requirements
    const validated = validateCaption(caption, preset.copyFramework);
    
    if (!validated.valid) {
      console.warn('Generated caption failed validation, using fallback');
      return generateFallbackCaption(preset, input);
    }

    return {
      caption: validated.caption,
      reasoning: reasoning || 'Applied NeuroVendas formula',
      engagementPrediction: estimateEngagement(validated.caption, preset),
      suggestedHashtags: generateHashtags(preset, input),
      appliedFormula: preset.copyFramework.formula,
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to template-based generation
    return generateFallbackCaption(preset, input);
  }
}

function buildPrompt(
  framework: NeuroCopyFramework,
  input: GenerateCaptionInput
): string {
  const context = input.userContext || 'procedimento estético';
  const images = input.imageDescriptions?.join(', ') || 'resultado do tratamento';

  return `
Crie uma legenda de Instagram VENDEDORA para esteticista usando:

**Framework NeuroVendas**: ${framework.formula}

**Hook (gancho)**: ${framework.hook}
- dor: foque no problema que o cliente enfrenta
- desejo: foque no resultado que o cliente quer
- autoridade: foque na expertise da clínica
- transformacao: foque na mudança antes/depois

**Prova**: ${framework.proof || 'resultado'}
- social: depoimento ou caso real
- resultado: números, percentuais
- processo: explicação técnica
- estatistica: dados e estudos

**CTA (call-to-action)**: ${framework.cta}
- agenda: convite para agendar
- comente: pergunta para engajar
- salve: incentivo a salvar post
- compartilhe: incentivo a compartilhar
- link_bio: direcionamento para link

**Elementos obrigatórios**: ${framework.mustHave.join(', ')}
- emoji: use emojis relevantes (não exagere)
- cta_explicito: CTA claro e direto
- beneficio: foque no benefício, não na feature
- prova_social: mencione casos reais se possível

**Gatilhos psicológicos**: ${framework.triggers.join(', ')}
- escassez: "vagas limitadas", "últimos dias"
- autoridade: expertise, anos de experiência
- reciprocidade: dica valiosa, educação
- prova_social: "milhares de clientes satisfeitos"

**Contexto**: ${context}
**Imagens**: ${images}

**Requisitos**:
- Máximo 300 palavras
- Tom: profissional mas caloroso
- Idioma: português brasileiro
- Formato Instagram (quebras de linha estratégicas)
- Inclua 8-12 hashtags relevantes ao final

**Estrutura esperada**:
1. Hook forte (primeira linha que prende atenção)
2. Desenvolvimento (problema → solução)
3. Prova (resultado, testemunho ou dado)
4. CTA claro (ação específica)
5. Hashtags estratégicas

Retorne APENAS a legenda pronta para postar, sem explicações adicionais.
`;
}

function parseResponse(text: string): [string, string] {
  // Try to separate caption from reasoning if present
  const parts = text.split('---');
  if (parts.length === 2) {
    return [parts[0].trim(), parts[1].trim()];
  }
  return [text.trim(), ''];
}

function validateCaption(
  caption: string,
  framework: NeuroCopyFramework
): { valid: boolean; caption: string; issues?: string[] } {
  const issues: string[] = [];

  // Check length (Instagram limit: 2200 chars)
  if (caption.length > 2200) {
    issues.push('Caption too long');
  }

  // Check for required elements
  if (framework.mustHave.includes('emoji') && !/[\u{1F300}-\u{1F9FF}]/u.test(caption)) {
    issues.push('Missing emoji');
  }

  if (framework.mustHave.includes('cta_explicito')) {
    const ctaKeywords = ['agende', 'comente', 'salve', 'compartilhe', 'clique', 'acesse'];
    const hasCTA = ctaKeywords.some(keyword => 
      caption.toLowerCase().includes(keyword)
    );
    if (!hasCTA) {
      issues.push('Missing explicit CTA');
    }
  }

  // Check for hashtags
  const hashtagCount = (caption.match(/#\w+/g) || []).length;
  if (hashtagCount < 5) {
    issues.push('Insufficient hashtags');
  }

  return {
    valid: issues.length === 0,
    caption,
    issues: issues.length > 0 ? issues : undefined,
  };
}

function generateFallbackCaption(
  preset: any,
  input: GenerateCaptionInput
): GenerateCaptionOutput {
  const context = input.userContext || 'tratamento estético';
  
  // Template-based fallback
  const templates = {
    'transformacao-incrivel': `✨ ${context.toUpperCase()} ✨

Você já imaginou transformar aquele incômodo em resultado real?

É exatamente isso que nossos tratamentos fazem:
→ Resultados naturais e harmônicos
→ Tecnologia de ponta
→ Equipe especializada

💎 Agende sua avaliação e descubra seu potencial!

#estetica #harmonizacaofacial #resultado #transformacao`,

    'oferta-relampago': `⚡ ALERTA: OFERTA RELÂMPAGO! ⚡

${context} com condições ESPECIAIS:
→ Desconto exclusivo
→ Vagas limitadas
→ Válido até [DATA]

🔥 Últimas vagas disponíveis!

👉 Comente "QUERO" para garantir sua vaga

#estetica #oferta #promocao #ultimasvagas`,

    'depoimento-real': `💬 "Minha vida mudou depois desse tratamento!"

Esse é o depoimento de uma cliente real sobre ${context}.

Ela buscava [RESULTADO] e conseguiu muito mais:
→ Autoestima renovada
→ Confiança recuperada
→ Resultado natural

E você, está esperando o quê para ter essa transformação?

💆‍♀️ Agende sua avaliação!

#depoimento #resultado #transformacao #estetica`,
  };

  const caption = templates[preset.id as keyof typeof templates] || templates['transformacao-incrivel'];

  return {
    caption,
    reasoning: 'Fallback template (OpenAI unavailable)',
    engagementPrediction: 70,
    suggestedHashtags: generateHashtags(preset, input),
    appliedFormula: preset.copyFramework.formula,
  };
}

function estimateEngagement(caption: string, preset: any): number {
  let score = 60; // Base score

  // Length check (optimal: 150-300 words)
  const wordCount = caption.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 300) score += 10;

  // Emoji presence
  if (/[\u{1F300}-\u{1F9FF}]/u.test(caption)) score += 5;

  // CTA presence
  const ctaKeywords = ['agende', 'comente', 'salve', 'compartilhe'];
  if (ctaKeywords.some(kw => caption.toLowerCase().includes(kw))) score += 10;

  // Hashtags (optimal: 8-15)
  const hashtagCount = (caption.match(/#\w+/g) || []).length;
  if (hashtagCount >= 8 && hashtagCount <= 15) score += 10;

  // Question mark (engagement trigger)
  if (caption.includes('?')) score += 5;

  return Math.min(score, 95);
}

function generateHashtags(preset: any, input: GenerateCaptionInput): string[] {
  const baseHashtags = [
    '#estetica',
    '#esteticafacial',
    '#beleza',
    '#autoestima',
    '#cuidados',
  ];

  const goalHashtags = {
    venda: ['#promocao', '#agenda', '#tratamento'],
    autoridade: ['#especialista', '#procedimento', '#resultado'],
    engajamento: ['#dica', '#saude', '#bemestar'],
  };

  const presetSpecific = {
    'transformacao-incrivel': ['#antesedepois', '#transformacao', '#harmonizacao'],
    'oferta-relampago': ['#oferta', '#desconto', '#vagas'],
    'depoimento-real': ['#depoimento', '#clientesatisfeito', '#recomendo'],
  };

  return [
    ...baseHashtags,
    ...(goalHashtags[preset.goal as keyof typeof goalHashtags] || []),
    ...(presetSpecific[preset.id as keyof typeof presetSpecific] || []),
  ];
}
