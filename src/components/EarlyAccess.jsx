import React, { useState } from 'react';
import { useSupabaseWaitlist } from '../hooks/useSupabase';
import { trackEvent } from '../utils/analytics';

const ROLES = ['Brand team', 'Agency', 'Founder'];

export const EarlyAccess = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Brand team');
  const { submitWaitlist, status, errorMessage } = useSupabaseWaitlist();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    const success = await submitWaitlist(email, `landing_${role.toLowerCase().replace(/\s+/g, '_')}`);
    if (success) setEmail('');
  };

  return (
    <section className="access-section" id="access">
      <div className="container access-layout">
        <div>
          <p className="quiet-kicker">06 — Request access</p>
          <h2>Give your brand an agent that never stops watching.</h2>
          <p>
            Give OASIX your brand goal. It observes, reasons, acts and learns —
            so your social strategy keeps evolving while you work.
          </p>
        </div>

        <div className="access-form-wrap">
          <div className="role-row" aria-label="Organization type">
            {ROLES.map((item) => (
              <button
                type="button"
                key={item}
                className={role === item ? 'active' : ''}
                onClick={() => {
                  setRole(item);
                  trackEvent('role_select', { role: item });
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {status === 'success' ? (
            <div className="success-message" role="status">
              Access requested. We will reach out when your cohort opens.
            </div>
          ) : (
            <form className="access-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="access-email" className="sr-only">
                Work email
              </label>
              <input
                id="access-email"
                type="email"
                placeholder="Work email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={() => trackEvent('waitlist_focus')}
                disabled={status === 'loading'}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Requesting...' : 'Request access'}
              </button>
            </form>
          )}

          {errorMessage && <p className="form-error">{errorMessage}</p>}
        </div>
      </div>
    </section>
  );
};
