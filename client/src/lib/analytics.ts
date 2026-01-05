/**
 * Analytics tracking for QuickCreate Flow
 * Based on GUIA_TECNICO_ARQUITETURA.md
 */

export const AnalyticsEvents = {
  // Quick Create Flow
  QUICK_CREATE_STARTED: 'quick_create_started',
  QUICK_CREATE_COMPLETED: 'quick_create_completed',
  QUICK_CREATE_ABANDONED: 'quick_create_abandoned',
  
  // Steps
  PRESET_SELECTED: 'preset_selected',
  IMAGE_UPLOADED: 'image_uploaded',
  COPY_GENERATED: 'copy_generated',
  POST_PUBLISHED: 'post_published',
  
  // IA
  IA_SUGGESTION_SHOWN: 'ia_suggestion_shown',
  IA_SUGGESTION_APPLIED: 'ia_suggestion_applied',
  IA_SUGGESTION_DISMISSED: 'ia_suggestion_dismissed',
  
  // Drop-offs
  DROP_OFF_PRESET: 'drop_off_step_preset',
  DROP_OFF_UPLOAD: 'drop_off_step_upload',
  DROP_OFF_COPY: 'drop_off_step_copy',
  DROP_OFF_PUBLISH: 'drop_off_step_publish',
} as const;

interface EventProperties {
  // User context
  userId?: string;
  sessionId: string;
  
  // Timing
  timestamp: Date;
  timeFromStart?: number;
  
  // Context específico
  [key: string]: any;
}

export function trackEvent(
  eventName: string,
  properties: Partial<EventProperties>
) {
  const sessionId = getOrCreateSessionId();
  
  const fullProperties: EventProperties = {
    sessionId,
    timestamp: new Date(),
    ...properties,
  };
  
  // 1. Console (dev)
  if (import.meta.env.DEV) {
    console.log('📊 Analytics:', eventName, fullProperties);
  }
  
  // 2. Backend (produção)
  if (import.meta.env.PROD) {
    // Enviar para backend via fetch ou tRPC
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, properties: fullProperties })
    }).catch(err => console.error('Analytics error:', err));
  }
}

// Session ID management
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}
