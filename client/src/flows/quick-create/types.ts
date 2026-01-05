/**
 * Types for QuickCreate Flow
 * Based on GUIA_TECNICO_ARQUITETURA.md
 */

export type QuickCreateStep = 'preset' | 'upload' | 'copy' | 'publish';

export interface ImageAsset {
  id: string;
  url: string;
  s3Key?: string;
  type: 'before' | 'after' | 'single';
  detectedProcedure?: string;
}

export interface AISuggestion {
  id: string;
  type: 'cta' | 'hashtags' | 'text_improvement' | 'timing';
  priority: 'high' | 'medium' | 'low';
  text: string;
  action: () => void;
  applied?: boolean;
}

export interface QuickCreateState {
  // Controle de fluxo
  step: QuickCreateStep;
  canAdvance: boolean;
  
  // Dados do post
  presetId?: string;
  images?: ImageAsset[];
  caption?: string;
  hashtags?: string[];
  
  // IA e scoring
  aiSuggestions?: AISuggestion[];
  engagementScore?: number;
  
  // Analytics
  startedAt: Date;
  stepTimings: Partial<Record<QuickCreateStep, number>>;
}
