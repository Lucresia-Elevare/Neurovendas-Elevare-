/**
 * PublishStep - Step 4 of QuickCreate
 * Final review and publish
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Send } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import type { QuickCreateState } from '../types';
import { getPresetById } from '@shared/neuroPresets';

interface PublishStepProps {
  state: QuickCreateState;
  onPublish: (scheduleFor?: Date) => Promise<void>;
  onBack: () => void;
}

export default function PublishStep({ state, onPublish, onBack }: PublishStepProps) {
  const [publishing, setPublishing] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const preset = getPresetById(state.presetId!);
  
  const handlePublish = async (scheduled: boolean) => {
    setPublishing(true);
    
    try {
      const totalTime = Date.now() - state.startedAt.getTime();
      
      trackEvent(AnalyticsEvents.POST_PUBLISHED, {
        presetId: state.presetId,
        totalTime,
        scheduled,
        engagementScore: state.engagementScore
      });
      
      trackEvent(AnalyticsEvents.QUICK_CREATE_COMPLETED, {
        presetId: state.presetId,
        totalTime,
        stepTimings: state.stepTimings,
        engagementScore: state.engagementScore
      });
      
      await onPublish(scheduled ? scheduleDate : undefined);
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setPublishing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Revisar e Publicar
          </h2>
          <p className="text-slate-600">
            Tudo pronto! Publique agora ou agende
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Preview */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Preview</h3>
            
            {/* Images */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                {state.images?.map((img, i) => (
                  <div key={img.id} className="relative">
                    <img 
                      src={img.url} 
                      alt={`Image ${i + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {img.type !== 'single' && (
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {img.type === 'before' ? 'Antes' : 'Depois'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Caption */}
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Legenda</h4>
              <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">
                {state.caption}
              </p>
            </div>
          </Card>
          
          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              size="lg"
              variant="outline"
              onClick={() => handlePublish(true)}
              disabled={publishing}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Button>
            <Button 
              size="lg"
              onClick={() => handlePublish(false)}
              disabled={publishing}
            >
              <Send className="w-4 h-4 mr-2" />
              {publishing ? 'Publicando...' : 'Publicar Agora'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Score */}
          {state.engagementScore !== undefined && (
            <Card className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">
                Score de Engajamento
              </h3>
              <div className="flex items-center justify-center mb-3">
                <div className="text-4xl font-bold text-purple-600">
                  {state.engagementScore}%
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 h-3 rounded-full transition-all"
                  style={{ width: `${state.engagementScore}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-3 text-center">
                {state.engagementScore >= 80 && '🎉 Excelente! Alta chance de viralizar'}
                {state.engagementScore >= 60 && state.engagementScore < 80 && '👍 Bom! Pronto para publicar'}
                {state.engagementScore < 60 && '⚠️ Pode melhorar. Considere ajustes'}
              </p>
            </Card>
          )}
          
          {/* Preset Info */}
          {preset && (
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">
                {preset.icon} {preset.name}
              </h3>
              <p className="text-sm text-purple-700">
                Objetivo: <strong>{preset.goal.toUpperCase()}</strong>
              </p>
            </Card>
          )}
          
          {/* Time */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 mb-2">
              Tempo Total
            </h3>
            <p className="text-2xl font-bold text-cyan-600">
              {Math.round((Date.now() - state.startedAt.getTime()) / 1000 / 60)} min
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Meta: 5 minutos
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
