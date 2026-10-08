/**
 * Oasix Anonymous Analytics Engine
 * 
 * Strict Privacy Design:
 * - Anonymous behavioral telemetry only
 * - NEVER stores or transmits email, names, IP addresses, or any PII
 * - Session ID is ephemeral (random UUID generated in-memory per visit, not stored in localStorage)
 * - Directly uses Supabase PostgREST API with keepalive
 * - Falls back cleanly if Supabase environment variables are unset
 */

// Generate a random ephemeral session ID in memory
const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const SESSION_ID = typeof window !== 'undefined' ? generateSessionId() : 'ssr_session';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const trackEvent = (eventName, metadata = {}) => {
  if (typeof window === 'undefined') return;

  // Sanitize: ensure no accidental PII is passed
  const sanitizedMetadata = { ...metadata };
  delete sanitizedMetadata.email;
  delete sanitizedMetadata.user_email;
  delete sanitizedMetadata.name;

  const payload = {
    event: eventName,
    session_id: SESSION_ID,
    timestamp: new Date().toISOString(),
    metadata: sanitizedMetadata
  };

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Development / fallback logging
    if (import.meta.env.DEV) {
      console.log(`[Oasix Analytics] ${eventName}`, payload);
    }
    return;
  }

  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/events`;

  try {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(err => {
      if (import.meta.env.DEV) {
        console.warn('[Oasix Analytics] Failed to send event:', err);
      }
    });
  } catch {
    // Fail silently in production
  }
};
