import React, { useEffect, useState } from 'react';
import { trackEvent } from '../utils/analytics';
import { PlatformMark } from './BrandIcons';

const STAGES = [
  { id: 'observe', label: 'OBSERVE' },
  { id: 'understand', label: 'UNDERSTAND' },
  { id: 'decide', label: 'DECIDE' },
  { id: 'act', label: 'ACT' },
  { id: 'learn', label: 'LEARN' }
];

const FEED = [
  { id: 'tiktok', platform: 'TikTok' },
  { id: 'reddit', platform: 'Reddit' },
  { id: 'instagram', platform: 'Instagram' },
  { id: 'x', platform: 'X' }
];

export const Hero = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStage((v) => (v + 1) % STAGES.length), 2600);
    return () => clearInterval(t);
  }, []);

  const scrollToAccess = () => {
    trackEvent('hero_cta_click', { cta_location: 'hero' });
    document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToHow = () => {
    trackEvent('hero_secondary_click', { cta_location: 'hero' });
    document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section hero-v2 hero-tight" id="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-badge"><span className="pulse-dot" /> Autonomous social media agent — live</div>
          <h1 className="hero-title">Your social media,<br />on autopilot.</h1>
          <p className="hero-lead">OASIX continuously watches what is happening across social, finds the one opportunity worth acting on, creates the response, and learns from what happens next.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={scrollToAccess}>Request access</button>
            <button type="button" className="btn btn-secondary" onClick={scrollToHow}>How OASIX works</button>
          </div>
          <p className="hero-note">Give OASIX a brand goal. It observes, reasons, acts and learns — continuously.</p>
        </div>
        <div className="hero-proof" aria-label="OASIX agent live">
          <div className="agent-shell slim agent-v2">
            <div className="agent-top"><span className="agent-status"><span className="pulse-dot" /> OASIX agent · working</span><span className="agent-time">{STAGES[stage].label}ing…</span></div>
            {/* input layer — one row */}
            <div className="agent-inputs" aria-label="Input layer">
              {FEED.map((f) => (
                <span key={f.platform} className="agent-input"><PlatformMark platform={f.id} />{f.platform}<i className="live-tick" /></span>
              ))}
            </div>
            <div className="agent-converge" aria-hidden="true">
              {FEED.map((f, i) => (<span key={f.platform} className="conv-line on" style={{ animationDelay: `${i * 0.35}s` }} />))}
            </div>
            {/* one agent, one situation */}
            <div className="agent-stages agent-stages-5" role="tablist" aria-label="Agent state">
              {STAGES.map((s, i) => (
                <button key={s.id} type="button" role="tab" aria-selected={stage === i} className={`astage ${stage === i ? 'on' : stage > i ? 'done' : ''}`} onClick={() => setStage(i)}>
                  <span className="adot" />{s.label}
                </button>
              ))}
              <span className="astage-progress"><i style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} /></span>
            </div>
            <div className="agent-flow agent-flow-one">
              <div className="aflow show aflow-situation">
                <p className="agent-label">One situation · proof-first routines</p>
                <h3>“Before / after proof” is accelerating across TikTok, Instagram and Reddit.</h3>
                <div className="aflow-state" aria-live="polite">
                  {stage === 0 && <p className="aflow-line"><strong>Observing</strong> — 4 channels streaming, signals converging…</p>}
                  {stage === 1 && <p className="aflow-line"><strong>Understood</strong> — one cluster: 318 creators, sentiment positive.</p>}
                  {stage === 2 && <p className="aflow-line"><strong>Decided</strong> — score 92 · audience fit high, timing now.</p>}
                  {stage === 3 && <p className="aflow-line"><strong>Acting</strong> — response campaign publishing across 4 channels…</p>}
                  {stage === 4 && <p className="aflow-line"><strong>Learned</strong> — strong saves + follows. Strategy updated ↺</p>}
                </div>
                <div className="adecide"><span>Audience fit · high</span><span>Timing · now</span><span>Competition · quiet</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



