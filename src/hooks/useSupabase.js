import { useState, useCallback } from 'react';
import { trackEvent } from '../utils/analytics';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ---------------------------------------------------------------------------
// Email guardrails
// ---------------------------------------------------------------------------

/**
 * Known disposable / throwaway email providers.
 * Extend this list as new providers are discovered.
 */
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'guerrillamail.info', 'guerrillamail.biz', 'guerrillamailblock.com',
  'sharklasers.com', 'spam4.me', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.at', 'trashmail.io', 'dispostable.com', 'yopmail.com', 'yopmail.fr',
  'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj',
  'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf',
  'monmail.fr.nf', 'tempmail.com', 'temp-mail.org', 'throwam.com', 'throwam.net',
  'maildrop.cc', 'mailnull.com', 'mailnesia.com', 'spamgourmet.com', 'spamgourmet.net',
  'spamgourmet.org', 'spamcorptastic.com', 'fakeinbox.com', 'discard.email',
  'discardmail.com', 'discardmail.de', 'spamevader.com', 'mailexpire.com',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org', 'spamfree24.org',
  'spamfree24.de', 'spamfree24.eu', 'spamfree24.info', 'spamfree24.net',
  'spamfree24.com', 'owlpic.com', 'binkmail.com', 'bobmail.info', 'chammy.info',
  'devnullmail.com', 'letthemeatspam.com', 'mailinater.com', 'mailinator2.com',
  'smellfear.com', 'spamherelots.com', 'spamhereplease.com', 'spamthisplease.com',
  'spamthis.co.uk', 'getairmail.com', 'junk1.tk', 'meltmail.com', 'chewiemail.com',
  'uggsrock.com', 'gettempmail.com', 'incognitomail.com', 'incognitomail.net',
  'incognitomail.org', 'inoutmail.de', 'inoutmail.eu', 'inoutmail.info', 'inoutmail.net',
  'spamwc.de', 'spamwc.ga', 'spamwc.gq', 'spamwc.ml', 'spamwc.net',
  'cfl.fr', 'filzmail.com', 'fivemail.de', 'fleckens.hu', 'frapmail.com',
  'weg-werf-email.de', 'einrot.com', 'enterto.com', 'courrieltemporaire.com',
  'lortemail.dk', 'spamgob.com',
]);

/**
 * Validates an email address against format, structural, and abuse rules.
 * Returns { valid: boolean, reason?: string }
 */
const validateEmail = (email) => {
  if (!email) return { valid: false, reason: 'Please enter your work email.' };

  // RFC 5321 max lengths
  if (email.length > 254) return { valid: false, reason: 'Email address is too long.' };

  const atIdx = email.indexOf('@');
  const lastAt = email.lastIndexOf('@');
  if (atIdx === -1 || atIdx !== lastAt) {
    return { valid: false, reason: 'Email must contain exactly one @ symbol.' };
  }

  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);

  if (!local || !domain) return { valid: false, reason: 'Please enter a valid email address.' };
  if (local.length > 64) return { valid: false, reason: 'The part before @ is too long (max 64 chars).' };

  // No whitespace anywhere
  if (/\s/.test(email)) return { valid: false, reason: 'Email address cannot contain spaces.' };

  // Local-part structural rules
  if (local.startsWith('.') || local.endsWith('.')) {
    return { valid: false, reason: 'Email has an invalid format (leading/trailing dot before @).' };
  }
  if (/\.{2,}/.test(local)) {
    return { valid: false, reason: 'Email has an invalid format (consecutive dots).' };
  }
  // Only printable ASCII in local part
  if (/[^\x21-\x7E]/.test(local)) {
    return { valid: false, reason: 'Email contains unsupported characters.' };
  }
  // Abuse guard: more than one + tag is a red flag
  if ((local.match(/\+/g) || []).length > 1) {
    return { valid: false, reason: 'Please use your primary email address.' };
  }

  // Domain structural rules
  if (!domain.includes('.')) {
    return { valid: false, reason: 'Email domain is missing a TLD (e.g. .com).' };
  }
  if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
    return { valid: false, reason: 'Email domain has an invalid format.' };
  }
  if (/\.{2,}/.test(domain)) {
    return { valid: false, reason: 'Email domain has an invalid format (consecutive dots).' };
  }

  const labels = domain.split('.');
  for (const label of labels) {
    if (!label || label.startsWith('-') || label.endsWith('-')) {
      return { valid: false, reason: 'Email domain has an invalid format.' };
    }
    if (!/^[a-z0-9-]+$/.test(label)) {
      return { valid: false, reason: 'Email domain contains invalid characters.' };
    }
  }

  // TLD: 2–24 alpha characters only
  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,24}$/.test(tld)) {
    return { valid: false, reason: `".${tld}" does not look like a valid domain extension.` };
  }

  // Belt-and-suspenders RFC-ish regex
  const rfcRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!rfcRegex.test(email)) {
    return { valid: false, reason: 'Please enter a valid email address.' };
  }

  // Disposable domain check (exact match + subdomain variants)
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'Disposable email addresses are not accepted. Please use a work or personal email.' };
  }
  for (const blocked of DISPOSABLE_DOMAINS) {
    if (domain.endsWith(`.${blocked}`)) {
      return { valid: false, reason: 'Disposable email addresses are not accepted. Please use a work or personal email.' };
    }
  }

  return { valid: true };
};

// ---------------------------------------------------------------------------
// Client-side rate limiting & session dedup (module-scoped — survives re-renders)
// ---------------------------------------------------------------------------
const RATE_WINDOW_MS = 60_000; // 1-minute rolling window
const RATE_MAX = 3;            // max submissions per window
const _submissionTimestamps = [];   // ring buffer of recent submission times
const _submittedEmails = new Set(); // emails submitted this browser session

const checkRateLimit = () => {
  const now = Date.now();
  // Evict entries outside the window
  while (_submissionTimestamps.length && now - _submissionTimestamps[0] > RATE_WINDOW_MS) {
    _submissionTimestamps.shift();
  }
  if (_submissionTimestamps.length >= RATE_MAX) {
    const waitSec = Math.ceil((RATE_WINDOW_MS - (now - _submissionTimestamps[0])) / 1000);
    return { allowed: false, waitSec };
  }
  return { allowed: true };
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useSupabaseWaitlist = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const submitWaitlist = useCallback(async (email, source = 'landing_page') => {
    const trimmed = (email || '').trim().toLowerCase();

    // 1. Format + structure + abuse validation
    const { valid, reason } = validateEmail(trimmed);
    if (!valid) {
      setStatus('error');
      setErrorMessage(reason);
      trackEvent('waitlist_invalid_email', { source, reason });
      return false;
    }

    // 2. Session-scoped dedup — same email already submitted this session
    if (_submittedEmails.has(trimmed)) {
      setStatus('success');
      return true;
    }

    // 3. Client-side rate limiting (3 submissions / 60 s)
    const { allowed, waitSec } = checkRateLimit();
    if (!allowed) {
      setStatus('error');
      setErrorMessage(`Too many attempts. Please wait ${waitSec}s and try again.`);
      trackEvent('waitlist_rate_limited', { source });
      return false;
    }

    setStatus('loading');
    setErrorMessage('');
    _submissionTimestamps.push(Date.now());
    trackEvent('waitlist_submit', { source });

    // Fallback if Supabase credentials are not configured yet
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      // TODO(security): Connect Supabase for production email capture
      console.log('[Oasix Waitlist] Supabase credentials not set in .env. Emulating success for:', trimmed);
      await new Promise(r => setTimeout(r, 600));
      _submittedEmails.add(trimmed);
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
        _submittedEmails.add(trimmed);
        setStatus('success');
        trackEvent('waitlist_success', { source });
        return true;
      }

      // Handle duplicate email or PostgREST unique constraint error
      const responseData = await res.json().catch(() => ({}));
      if (res.status === 409 || responseData.code === '23505' || (responseData.message && responseData.message.includes('unique'))) {
        // Duplicate: treat as polite success — user is already on the list
        _submittedEmails.add(trimmed);
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
