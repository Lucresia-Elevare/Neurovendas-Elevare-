/**
 * QuickCreateFlow - Main component for guided post creation
 * Based on GUIA_TECNICO_ARQUITETURA.md
 */

import { useEffect } from 'react';
import { useQuickCreateMachine } from './useQuickCreateMachine';
import PresetStep from './steps/PresetStep';
import UploadStep from './steps/UploadStep';
import CopyStep from './steps/CopyStep';
import PublishStep from './steps/PublishStep';
import { Progress } from '@/components/ui/progress';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function QuickCreateFlow() {
  const {
    state,
    canAdvance,
    nextStep,
    prevStep,
    updateState,
    reset
  } = useQuickCreateMachine();
  
  const [, setLocation] = useLocation();
  
  // Track abandonment on unmount
  useEffect(() => {
    return () => {
      if (state.step !== 'publish') {
        trackEvent(AnalyticsEvents.QUICK_CREATE_ABANDONED, {
          lastStep: state.step,
          timeFromStart: Date.now() - state.startedAt.getTime()
        });
        trackEvent(`${AnalyticsEvents[`DROP_OFF_${state.step.toUpperCase()}` as keyof typeof AnalyticsEvents]}`, {
          timeFromStart: Date.now() - state.startedAt.getTime()
        });
      }
    };
  }, [state.step, state.startedAt]);
  
  const handlePublish = async (scheduleFor?: Date) => {
    try {
      const creationTimeMs = Date.now() - state.startedAt.getTime();
      
      // Upload images first if not already uploaded
      // In production, images should already be uploaded during UploadStep
      const imageUrls = state.images?.map(img => img.preview) || [];
      const imageKeys = state.images?.map(img => img.id) || [];
      
      // Create post via backend
      const result = await trpc.quickCreate.createPost.mutate({
        presetId: state.presetId!,
        caption: state.caption!,
        hashtags: state.hashtags,
        imageUrls,
        imageKeys,
        engagementScore: state.engagementScore,
        scoreBreakdown: state.scoreBreakdown,
        sessionId: state.sessionId,
        creationTimeMs,
      });
      
      if (result.success) {
        // Schedule if requested
        if (scheduleFor) {
          await trpc.quickCreate.schedulePost.mutate({
            postId: result.postId,
            scheduledFor: scheduleFor,
          });
        } else {
          // Publish immediately
          await trpc.quickCreate.publishNow.mutate({
            postId: result.postId,
          });
        }
        
        // Reset and redirect
        reset();
        setLocation('/gallery');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  };
  
  const steps = ['preset', 'upload', 'copy', 'publish'];
  const currentStepIndex = steps.indexOf(state.step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Modo Criação Rápida
          </h1>
          <p className="text-slate-600">
            4 passos simples para criar um post que vende
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, i) => (
              <div 
                key={step}
                className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-all ${
                    i <= currentStepIndex 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      i < currentStepIndex ? 'bg-purple-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-2">
            <span>Preset</span>
            <span>Imagem</span>
            <span>Legenda</span>
            <span>Publicar</span>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {state.step === 'preset' && (
            <PresetStep
              onSelect={(presetId) => {
                updateState({ presetId });
                nextStep();
              }}
            />
          )}
          
          {state.step === 'upload' && (
            <UploadStep
              presetId={state.presetId!}
              onUpload={(images) => {
                updateState({ images });
                nextStep();
              }}
              onBack={prevStep}
            />
          )}
          
          {state.step === 'copy' && (
            <CopyStep
              presetId={state.presetId!}
              images={state.images!}
              onComplete={(caption, hashtags, score, scoreBreakdown) => {
                updateState({ 
                  caption, 
                  hashtags, 
                  engagementScore: score,
                  scoreBreakdown
                });
                nextStep();
              }}
              onBack={prevStep}
            />
          )}
          
          {state.step === 'publish' && (
            <PublishStep
              state={state}
              onPublish={handlePublish}
              onBack={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}
