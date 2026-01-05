/**
 * CopyStep - Step 3 of QuickCreate
 * User writes copy with AI assistance
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import type { ImageAsset } from '../types';
import { getPresetById } from '@shared/neuroPresets';

interface CopyStepProps {
  presetId: string;
  images: ImageAsset[];
  onComplete: (caption: string, hashtags: string[], score: number) => void;
  onBack: () => void;
}

export default function CopyStep({ presetId, images, onComplete, onBack }: CopyStepProps) {
  const [caption, setCaption] = useState('');
  const [generating, setGenerating] = useState(false);
  const preset = getPresetById(presetId);
  
  const handleGenerate = async () => {
    if (!preset) return;
    
    setGenerating(true);
    trackEvent(AnalyticsEvents.IA_SUGGESTION_SHOWN, {
      presetId,
      type: 'copy_generation'
    });
    
    try {
      // Simular geração de IA (em produção, chamaria tRPC)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedCaption = generateCaptionFromPreset(preset);
      setCaption(generatedCaption);
      
      trackEvent(AnalyticsEvents.IA_SUGGESTION_APPLIED, {
        presetId,
        type: 'copy_generation'
      });
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleContinue = () => {
    const hashtags = extractHashtags(caption);
    const score = calculateBasicScore(caption, preset);
    
    trackEvent(AnalyticsEvents.COPY_GENERATED, {
      presetId,
      length: caption.length,
      hashtagCount: hashtags.length,
      score
    });
    
    onComplete(caption, hashtags, score);
  };
  
  const canContinue = caption.length >= 20;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Crie sua legenda
          </h2>
          <p className="text-slate-600">
            Escreva ou deixe a IA criar para você
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-slate-700">
                Legenda do Post
              </label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerate}
                disabled={generating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            </div>
            
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Digite sua legenda aqui ou clique em 'Gerar com IA'..."
              className="min-h-[300px] resize-none"
            />
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-slate-500">
                {caption.length} caracteres
              </span>
              {canContinue && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Legenda válida
                </span>
              )}
            </div>
          </Card>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continuar
          </Button>
        </div>
        
        <div className="space-y-4">
          {preset && (
            <>
              <Card className="p-4">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Fórmula NeuroVendas
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  {preset.copyFramework.formula}
                </p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <strong>Gatilhos:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preset.copyFramework.triggers.map(t => (
                        <span key={t} className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-cyan-50 border-cyan-200">
                <h3 className="font-semibold text-cyan-900 mb-2">
                  Exemplos
                </h3>
                <ul className="space-y-2">
                  {preset.examples.map((ex, i) => (
                    <li key={i} className="text-sm text-cyan-800">
                      "{ex}"
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Generate caption from preset (simplified)
function generateCaptionFromPreset(preset: any): string {
  const examples = preset.examples;
  const example = examples[Math.floor(Math.random() * examples.length)];
  
  return `${example}\n\n✨ Resultado incrível, não é?\n\nEsse é o poder da transformação! 💫\n\n📍 Agende sua avaliação\n💬 Comente "EU QUERO" que eu te chamo no direct\n\n#estetica #beleza #harmonizacaofacial #autoestima`;
}

// Helper: Extract hashtags
function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches || [];
}

// Helper: Calculate basic score
function calculateBasicScore(caption: string, preset: any): number {
  let score = 0;
  
  // Length check
  if (caption.length >= 80 && caption.length <= 500) score += 30;
  else if (caption.length >= 50) score += 15;
  
  // Has emoji (Unicode range for emojis)
  const emojiPattern = /[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/;
  if (emojiPattern.test(caption)) score += 20;
  
  // Has CTA
  const ctaKeywords = ['agende', 'comente', 'salve', 'compartilhe', 'link'];
  if (ctaKeywords.some(kw => caption.toLowerCase().includes(kw))) score += 30;
  
  // Has hashtags
  const hashtags = extractHashtags(caption);
  if (hashtags.length >= 5) score += 20;
  else if (hashtags.length >= 3) score += 10;
  
  return Math.min(score, 100);
}
