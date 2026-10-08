import { useState, useCallback } from 'react';
import { trackEvent } from '../utils/analytics';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const useSupabaseWaitlist = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const submitWaitlist = useCallback(async (email, source = 'landing_page') => {
    const trimmed = (email || '').trim().toLowerCase();
    
    // Strict email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    setStatus('loading');
    setErrorMessage('');
    trackEvent('waitlist_submit', { source });

    // Fallback if Supabase credentials are not configured yet
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // TODO(security): Connect Supabase for production email capture
      console.log('[Oasix Waitlist] Supabase credentials not set in .env. Emulating success for:', trimmed);
      // Small simulated latency for UX feedback
      await new Promise(r => setTimeout(r, 600));
      setStatus('success');
      trackEvent('waitlist_success', { source });
      return true;
    }

    try {
      const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/waitlist`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email: trimmed,
          source: source
        })
      });

      if (res.ok) {
        setStatus('success');
        trackEvent('waitlist_success', { source });
        return true;
      }

      // Handle duplicate email or PostgREST error
      const responseData = await res.json().catch(() => ({}));
      if (res.status === 409 || responseData.code === '23505' || (responseData.message && responseData.message.includes('unique'))) {
        // Duplicate: treat as polite success so user is assured they are already on the list
        setStatus('success');
        trackEvent('waitlist_success', { source, duplicate: true });
        return true;
      }

      setStatus('error');
      setErrorMessage(responseData.message || 'Something went wrong. Please try again.');
      return false;
    } catch (err) {
      console.error('[Oasix Waitlist] Network submission error:', err);
      setStatus('error');
      setErrorMessage('Unable to connect. Please check your connection and try again.');
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
  }, []);

  return { submitWaitlist, status, errorMessage, reset };
};
