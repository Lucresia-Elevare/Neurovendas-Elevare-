/**
 * UploadStep - Step 2 of QuickCreate
 * Allows user to upload images
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import type { ImageAsset } from '../types';
import { getPresetById } from '@shared/neuroPresets';

interface UploadStepProps {
  presetId: string;
  onUpload: (images: ImageAsset[]) => void;
  onBack: () => void;
}

export default function UploadStep({ presetId, onUpload, onBack }: UploadStepProps) {
  const [uploading, setUploading] = useState(false);
  const preset = getPresetById(presetId);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const images: ImageAsset[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onload = (e) => {
            const url = e.target?.result as string;
            images.push({
              id: `img_${Date.now()}_${i}`,
              url,
              type: preset?.layout.type === 'before-after' && i === 0 ? 'before' : 
                    preset?.layout.type === 'before-after' && i === 1 ? 'after' : 'single'
            });
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      }
      
      trackEvent(AnalyticsEvents.IMAGE_UPLOADED, {
        presetId,
        count: images.length
      });
      
      onUpload(images);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const maxImages = preset?.layout.type === 'before-after' ? 2 : 1;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Adicione sua{maxImages > 1 ? 's' : ''} imagem{maxImages > 1 ? 'ns' : ''}
          </h2>
          <p className="text-slate-600">
            {preset?.layout.type === 'before-after' 
              ? 'Escolha 2 imagens: antes e depois'
              : 'Escolha a imagem principal do seu post'}
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <Card className="p-12 border-2 border-dashed border-slate-300 hover:border-purple-400 transition-colors">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-16 h-16 text-slate-400 mb-4" />
          <p className="text-lg font-medium text-slate-700 mb-2">
            {uploading ? 'Carregando...' : 'Clique para fazer upload'}
          </p>
          <p className="text-sm text-slate-500">
            {maxImages > 1 ? `Selecione até ${maxImages} imagens` : 'Selecione 1 imagem'}
          </p>
          <input
            type="file"
            accept="image/*"
            multiple={maxImages > 1}
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </Card>
      
      {preset && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            <strong>💡 Dica:</strong> {preset.whenToUse}
          </p>
        </div>
      )}
    </div>
  );
}
