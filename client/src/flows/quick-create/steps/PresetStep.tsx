/**
 * PresetStep - Step 1 of QuickCreate
 * Allows user to select a NeuroPreset
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NEURO_PRESETS } from '@shared/neuroPresets';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';

interface PresetStepProps {
  onSelect: (presetId: string) => void;
}

export default function PresetStep({ onSelect }: PresetStepProps) {
  const handleSelect = (presetId: string) => {
    trackEvent(AnalyticsEvents.PRESET_SELECTED, {
      presetId,
      timeFromStart: Date.now()
    });
    onSelect(presetId);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Qual é seu objetivo?
        </h2>
        <p className="text-slate-600">
          Escolha o template estratégico ideal para seu post
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEURO_PRESETS.map(preset => (
          <Card
            key={preset.id}
            className="p-4 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all"
            onClick={() => handleSelect(preset.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{preset.icon}</div>
              <Badge 
                variant={
                  preset.goal === 'venda' ? 'default' :
                  preset.goal === 'autoridade' ? 'secondary' :
                  'outline'
                }
              >
                {preset.goal.toUpperCase()}
              </Badge>
            </div>
            
            <h3 className="font-bold text-lg mb-2">{preset.name}</h3>
            <p className="text-sm text-slate-600 mb-3">{preset.whenToUse}</p>
            
            <div className="text-xs text-slate-500 mb-2">
              <strong>Fórmula:</strong> {preset.copyFramework.formula}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {preset.copyFramework.triggers.slice(0, 2).map(trigger => (
                <Badge key={trigger} variant="outline" className="text-xs">
                  {trigger}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
