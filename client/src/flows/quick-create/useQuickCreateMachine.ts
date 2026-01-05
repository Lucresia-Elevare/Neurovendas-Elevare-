/**
 * QuickCreate State Machine Hook
 * Based on GUIA_TECNICO_ARQUITETURA.md
 */

import { useState, useCallback, useEffect } from 'react';
import type { QuickCreateState, QuickCreateStep } from './types';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';

const STEP_ORDER: QuickCreateStep[] = ['preset', 'upload', 'copy', 'publish'];

export function useQuickCreateMachine() {
  const [state, setState] = useState<QuickCreateState>({
    step: 'preset',
    canAdvance: false,
    startedAt: new Date(),
    stepTimings: {}
  });
  
  // Track start
  useEffect(() => {
    trackEvent(AnalyticsEvents.QUICK_CREATE_STARTED, {
      timestamp: state.startedAt
    });
  }, []);
  
  // Validação por step
  const validateStep = useCallback((step: QuickCreateStep, data: Partial<QuickCreateState>) => {
    switch (step) {
      case 'preset':
        return !!data.presetId;
      case 'upload':
        return (data.images?.length ?? 0) > 0;
      case 'copy':
        return (data.caption?.length ?? 0) >= 20; // Mínimo de caracteres
      case 'publish':
        return true; // Sempre pode publicar se chegou aqui
      default:
        return false;
    }
  }, []);
  
  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.step);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      const timeElapsed = Date.now() - state.startedAt.getTime();
      
      setState(prev => ({
        ...prev,
        step: nextStep,
        stepTimings: {
          ...prev.stepTimings,
          [prev.step]: timeElapsed
        }
      }));
      
      // Track transition
      trackEvent(`step_${nextStep}_viewed`, {
        previousStep: state.step,
        timeFromStart: timeElapsed
      });
    }
  }, [state.step, state.startedAt]);
  
  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.step);
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, step: STEP_ORDER[currentIndex - 1] }));
    }
  }, [state.step]);
  
  const updateState = useCallback((updates: Partial<QuickCreateState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      const canAdvance = validateStep(prev.step, newState);
      return { ...newState, canAdvance };
    });
  }, [validateStep]);
  
  const reset = useCallback(() => {
    setState({
      step: 'preset',
      canAdvance: false,
      startedAt: new Date(),
      stepTimings: {}
    });
  }, []);
  
  return {
    state,
    canAdvance: state.canAdvance,
    nextStep,
    prevStep,
    updateState,
    reset
  };
}
