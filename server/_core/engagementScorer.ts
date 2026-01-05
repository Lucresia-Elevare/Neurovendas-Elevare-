/**
 * Enhanced ML-Based Engagement Scorer
 * Sprint 2: AI Integration
 */

import { NEURO_PRESETS } from '../../shared/neuroPresets';

export interface EngagementBreakdown {
  text: {
    score: number;
    insights: string[];
  };
  visual: {
    score: number;
    insights: string[];
  };
  cta: {
    score: number;
    insights: string[];
  };
  hashtags: {
    score: number;
    insights: string[];
  };
  timing: {
    score: number;
    insights: string[];
    bestTime?: string;
  };
  total: number;
  suggestions: ActionableSuggestion[];
}

export interface ActionableSuggestion {
  type: 'text' | 'visual' | 'cta' | 'hashtags' | 'timing';
  action: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

interface AnalyzeContentInput {
  presetId: string;
  caption: string;
  imageUrls?: string[];
  scheduledFor?: Date;
}

/**
 * Analyzes content for engagement potential
 * Multi-factor ML-inspired scoring algorithm
 */
export function analyzeContent(input: AnalyzeContentInput): EngagementBreakdown {
  const preset = NEURO_PRESETS.find(p => p.id === input.presetId);
  
  if (!preset) {
    throw new Error(`Preset ${input.presetId} not found`);
  }

  const textScore = analyzeText(input.caption, preset);
  const visualScore = analyzeVisual(input.imageUrls || []);
  const ctaScore = analyzeCTA(input.caption);
  const hashtagScore = analyzeHashtags(input.caption);
  const timingScore = analyzeTiming(input.scheduledFor);

  // Weighted total (30% text, 25% visual, 20% CTA, 15% hashtags, 10% timing)
  const total = Math.round(
    textScore.score * 0.30 +
    visualScore.score * 0.25 +
    ctaScore.score * 0.20 +
    hashtagScore.score * 0.15 +
    timingScore.score * 0.10
  );

  const suggestions = generateSuggestions({
    text: textScore,
    visual: visualScore,
    cta: ctaScore,
    hashtags: hashtagScore,
    timing: timingScore,
  });

  return {
    text: textScore,
    visual: visualScore,
    cta: ctaScore,
    hashtags: hashtagScore,
    timing: timingScore,
    total: Math.min(total, 100),
    suggestions,
  };
}

function analyzeText(caption: string, preset: any) {
  let score = 50;
  const insights: string[] = [];

  // 1. Hook strength (first 50 characters)
  const firstLine = caption.split('\n')[0] || caption.substring(0, 50);
  const hookStrength = analyzeHook(firstLine);
  score += hookStrength.score;
  insights.push(...hookStrength.insights);

  // 2. Length optimization (optimal: 150-300 words)
  const wordCount = caption.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 300) {
    score += 10;
    insights.push('✓ Tamanho ideal para engajamento');
  } else if (wordCount < 150) {
    score -= 5;
    insights.push('Texto muito curto - considere adicionar mais valor');
  } else {
    score -= 5;
    insights.push('Texto muito longo - riscos de perder atenção');
  }

  // 3. Readability (sentence variation)
  const sentences = caption.split(/[.!?]+/).filter(s => s.trim());
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / sentences.length;
  if (avgSentenceLength >= 10 && avgSentenceLength <= 20) {
    score += 5;
    insights.push('✓ Frases bem balanceadas');
  }

  // 4. Emotional triggers
  const emotionalWords = detectEmotionalTriggers(caption);
  if (emotionalWords.length > 0) {
    score += 5;
    insights.push(`✓ ${emotionalWords.length} gatilhos emocionais detectados`);
  }

  // 5. Action words
  const actionWords = ['transforme', 'descubra', 'conquiste', 'alcance', 'realize'];
  const hasActionWords = actionWords.some(word => 
    caption.toLowerCase().includes(word)
  );
  if (hasActionWords) {
    score += 5;
    insights.push('✓ Verbos de ação presentes');
  }

  // 6. Question for engagement
  if (caption.includes('?')) {
    score += 5;
    insights.push('✓ Pergunta engaja interação');
  }

  return {
    score: Math.min(score, 100),
    insights,
  };
}

function analyzeHook(firstLine: string) {
  let score = 0;
  const insights: string[] = [];

  // Strong hooks start with emoji, number, or power word
  if (/^[✨💎🔥⚡🌟💰]/.test(firstLine)) {
    score += 5;
    insights.push('✓ Emoji forte no início');
  }

  // Starts with number/statistic
  if (/^\d+%?/.test(firstLine.trim())) {
    score += 5;
    insights.push('✓ Número chama atenção');
  }

  // Power words in hook
  const powerWords = ['alerta', 'urgente', 'exclusivo', 'grátis', 'comprovado'];
  if (powerWords.some(word => firstLine.toLowerCase().includes(word))) {
    score += 5;
    insights.push('✓ Palavra de impacto no gancho');
  }

  // Hook length (optimal: 40-80 chars)
  if (firstLine.length >= 40 && firstLine.length <= 80) {
    score += 5;
    insights.push('✓ Gancho com tamanho ideal');
  }

  return { score, insights };
}

function analyzeVisual(imageUrls: string[]) {
  let score = 50;
  const insights: string[] = [];

  const imageCount = imageUrls.length;

  if (imageCount === 0) {
    return {
      score: 0,
      insights: ['❌ Nenhuma imagem - adicione pelo menos 1'],
    };
  }

  // Optimal: 2-3 images for Before/After
  if (imageCount >= 2 && imageCount <= 3) {
    score += 30;
    insights.push('✓ Quantidade ideal para Antes/Depois');
  } else if (imageCount === 1) {
    score += 15;
    insights.push('✓ 1 imagem - considere adicionar Antes/Depois');
  } else {
    score += 10;
    insights.push(`${imageCount} imagens - pode diluir foco`);
  }

  // Bonus for multiple images (carousel effect)
  if (imageCount > 1) {
    score += 10;
    insights.push('✓ Carrossel aumenta engajamento');
  }

  // Quality indicators (from URL patterns)
  const hasHighQuality = imageUrls.some(url => 
    url.includes('_high') || url.includes('quality=high')
  );
  if (hasHighQuality) {
    score += 10;
    insights.push('✓ Imagens de alta qualidade');
  }

  return {
    score: Math.min(score, 100),
    insights,
  };
}

function analyzeCTA(caption: string) {
  let score = 30;
  const insights: string[] = [];

  // CTA keywords
  const ctaKeywords = {
    high: ['agende agora', 'garanta sua vaga', 'clique no link'],
    medium: ['agende', 'comente', 'salve', 'compartilhe', 'marque'],
    low: ['acesse', 'veja', 'confira'],
  };

  let ctaFound = false;
  let ctaStrength = 'none';

  for (const [strength, keywords] of Object.entries(ctaKeywords)) {
    if (keywords.some(kw => caption.toLowerCase().includes(kw))) {
      ctaFound = true;
      ctaStrength = strength;
      break;
    }
  }

  if (!ctaFound) {
    insights.push('❌ CTA não encontrado - adicione chamada para ação');
    return { score: 20, insights };
  }

  // Score based on strength
  if (ctaStrength === 'high') {
    score += 40;
    insights.push('✓ CTA forte e direto');
  } else if (ctaStrength === 'medium') {
    score += 30;
    insights.push('✓ CTA presente - considere tornar mais direto');
  } else {
    score += 20;
    insights.push('CTA fraco - use verbos mais imperativos');
  }

  // CTA positioning (better in first 100 chars or last paragraph)
  const firstPart = caption.substring(0, 100);
  const lastPart = caption.split('\n\n').pop() || '';
  
  const ctaInOptimalPosition = 
    Object.values(ctaKeywords).flat().some(kw => 
      firstPart.toLowerCase().includes(kw) || 
      lastPart.toLowerCase().includes(kw)
    );

  if (ctaInOptimalPosition) {
    score += 10;
    insights.push('✓ CTA bem posicionado');
  } else {
    insights.push('CTA no meio do texto - mova para início ou fim');
  }

  // Urgency words
  const urgencyWords = ['hoje', 'agora', 'últimas vagas', 'limitado', 'até'];
  if (urgencyWords.some(word => caption.toLowerCase().includes(word))) {
    score += 10;
    insights.push('✓ Urgência aumenta conversão');
  }

  return {
    score: Math.min(score, 100),
    insights,
  };
}

function analyzeHashtags(caption: string) {
  let score = 40;
  const insights: string[] = [];

  const hashtags = caption.match(/#\w+/g) || [];
  const count = hashtags.length;

  if (count === 0) {
    return {
      score: 0,
      insights: ['❌ Sem hashtags - adicione 8-15 para alcance'],
    };
  }

  // Optimal: 8-15 hashtags
  if (count >= 8 && count <= 15) {
    score += 30;
    insights.push('✓ Quantidade ideal de hashtags');
  } else if (count < 8) {
    score += 15;
    insights.push(`Apenas ${count} hashtags - adicione mais para alcance`);
  } else {
    score += 10;
    insights.push(`${count} hashtags - pode parecer spam, reduza para 15`);
  }

  // Niche relevance (aesthetics-specific)
  const nicheHashtags = ['#estetica', '#harmonizacao', '#botox', '#peeling', '#tratamento'];
  const hasNiche = nicheHashtags.some(tag => 
    hashtags.some(h => h.toLowerCase() === tag.toLowerCase())
  );
  
  if (hasNiche) {
    score += 15;
    insights.push('✓ Hashtags relevantes ao nicho');
  } else {
    insights.push('Adicione hashtags específicas de estética');
  }

  // Mix of popular and niche
  const popularCount = hashtags.filter(h => 
    ['#beleza', '#saude', '#autoestima'].includes(h.toLowerCase())
  ).length;
  
  if (popularCount > 0 && popularCount < count / 2) {
    score += 10;
    insights.push('✓ Bom mix de tags populares e nicho');
  }

  // Branded hashtag
  if (hashtags.some(h => h.toLowerCase().includes('elevare') || h.toLowerCase().includes('clinica'))) {
    score += 5;
    insights.push('✓ Hashtag de marca presente');
  }

  return {
    score: Math.min(score, 100),
    insights,
  };
}

function analyzeTiming(scheduledFor?: Date) {
  let score = 50;
  const insights: string[] = [];

  if (!scheduledFor) {
    insights.push('Agendamento não definido');
    return {
      score,
      insights,
      bestTime: '19h-21h (horário nobre)',
    };
  }

  const hour = scheduledFor.getHours();
  const day = scheduledFor.getDay();

  // Best times for aesthetics: 12h-14h, 19h-21h
  const isPeakTime = 
    (hour >= 12 && hour <= 14) || 
    (hour >= 19 && hour <= 21);

  if (isPeakTime) {
    score += 30;
    insights.push('✓ Horário de pico de engajamento');
  } else if (hour >= 7 && hour <= 23) {
    score += 15;
    insights.push('Horário ok - picos: 12h-14h, 19h-21h');
  } else {
    score -= 20;
    insights.push('❌ Horário com baixo engajamento');
  }

  // Best days: Tuesday-Thursday
  if (day >= 2 && day <= 4) {
    score += 10;
    insights.push('✓ Dia da semana ideal');
  } else if (day === 1 || day === 5) {
    score += 5;
    insights.push('Bom dia - ter-qui tem mais engajamento');
  } else {
    insights.push('Fim de semana - engajamento pode ser menor');
  }

  return {
    score: Math.min(score, 100),
    insights,
    bestTime: isPeakTime ? 'Horário ótimo!' : '19h-21h recomendado',
  };
}

function detectEmotionalTriggers(text: string): string[] {
  const triggers = {
    'desejo': ['sonho', 'desejo', 'quero', 'imagine'],
    'medo': ['preocup', 'ansied', 'medo', 'risco'],
    'alegria': ['feliz', 'alegr', 'satisf', 'encant'],
    'urgência': ['agora', 'hoje', 'últim', 'rápid'],
    'exclusividade': ['exclusiv', 'único', 'especial', 'vip'],
  };

  const found: string[] = [];
  const lowerText = text.toLowerCase();

  for (const [trigger, keywords] of Object.entries(triggers)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      found.push(trigger);
    }
  }

  return found;
}

function generateSuggestions(scores: {
  text: { score: number; insights: string[] };
  visual: { score: number; insights: string[] };
  cta: { score: number; insights: string[] };
  hashtags: { score: number; insights: string[] };
  timing: { score: number; insights: string[] };
}): ActionableSuggestion[] {
  const suggestions: ActionableSuggestion[] = [];

  // Text improvements
  if (scores.text.score < 70) {
    suggestions.push({
      type: 'text',
      action: 'Adicione gatilhos emocionais e verbos de ação',
      impact: '+10-15%',
      priority: 'high',
    });
  }

  // Visual improvements
  if (scores.visual.score < 70) {
    suggestions.push({
      type: 'visual',
      action: 'Adicione imagem Antes/Depois para maior impacto',
      impact: '+20%',
      priority: 'high',
    });
  }

  // CTA improvements
  if (scores.cta.score < 70) {
    suggestions.push({
      type: 'cta',
      action: 'Adicione CTA direto: "Agende agora pelo link da bio"',
      impact: '+15%',
      priority: 'high',
    });
  }

  // Hashtag improvements
  if (scores.hashtags.score < 70) {
    suggestions.push({
      type: 'hashtags',
      action: 'Adicione hashtags nicho: #harmonizacaofacial #estetica',
      impact: '+10%',
      priority: 'medium',
    });
  }

  // Timing improvements
  if (scores.timing.score < 70) {
    suggestions.push({
      type: 'timing',
      action: 'Agende para 19h-21h (horário de pico)',
      impact: '+8%',
      priority: 'medium',
    });
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
