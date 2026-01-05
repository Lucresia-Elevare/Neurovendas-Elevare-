/**
 * Types for QuickCreate Flow
 * Based on GUIA_TECNICO_ARQUITETURA.md
 */

export type QuickCreateStep = 'preset' | 'upload' | 'copy' | 'publish';

export interface ImageAsset {
  id: string;
  preview: string; // Preview URL or data URL
  url?: string; // S3 URL after upload
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
  scoreBreakdown?: {
    text: number;
    visual: number;
    cta: number;
    hashtags: number;
    timing: number;
  };
  
  // Analytics
  sessionId?: string;
  startedAt: Date;
  stepTimings: Partial<Record<QuickCreateStep, number>>;
}
