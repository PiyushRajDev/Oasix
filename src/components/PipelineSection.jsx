import React, { useEffect, useState } from 'react';
import { PlatformMark } from './BrandIcons';

const NODES = [
  {
    id: 'observe', name: 'OBSERVE',
    title: 'Live signals in',
    body: (
      <>
        <div className="stream-stack" aria-hidden="true">
          <span className="stream-line"><PlatformMark platform="tiktok" size={11} /><em style={{ width: '72%' }} /><b>+1.2k/hr</b></span>
          <span className="stream-line"><PlatformMark platform="reddit" size={11} /><em style={{ width: '54%' }} /><b>640</b></span>
          <span className="stream-line"><PlatformMark platform="instagram" size={11} /><em style={{ width: '63%' }} /><b>940</b></span>
          <span className="stream-line"><PlatformMark platform="x" size={11} /><em style={{ width: '38%' }} /><b>gap</b></span>
        </div>
        <p className="node-live"><span className="pulse-dot" /> listening now</p>
      </>
    )
  },
  {
    id: 'understand', name: 'UNDERSTAND',
    title: 'Conversation cluster',
    body: (
      <>
        <p className="node-quote">“Before / after proof” — one format, 3 platforms</p>
        <div className="node-meta"><span>318 creators</span><span>rising fast / 6h</span></div>
      </>
    )
  },
  {
    id: 'decide', name: 'DECIDE',
    title: 'Should OASIX act?',
    body: (
      <>
        <div className="node-checks"><span>Audience fit · 94%</span><span>Timing · high</span><span>Competition · low</span></div>
        <div className="node-score"><b>92</b><span>opportunity score</span></div>
      </>
    )
  },
  {
    id: 'act', name: 'ACT',
    title: 'Campaign goes live',
    body: (
      <>
        <div className="node-meta"><span>TikTok concept + Reel + X thread</span><span>proof in first 15s ✓</span></div>
        <p className="node-live">publishing… watching response</p>
      </>
    )
  },
  {
    id: 'learn', name: 'LEARN',
    title: 'Result becomes signal',
    body: (
      <>
        <div className="node-meta"><span>+41% saves · +28% profile visits</span><span>strategy updated</span></div>
        <p className="node-live">fed back into the loop</p>
      </>
    )
  }
];

export const PipelineSection = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % NODES.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="how-section system system-v2 system-tight" id="how">
      <div className="container">
        <p className="quiet-kicker light">02 — The system</p>
        <h2 className="light-h">OASIX sees → understands → decides → acts → learns.</h2>
        <p className="system-sub">One signal travels the whole pipeline. Watch it become a decision, an action — then feedback.</p>
        <div className="sys-track sys-track-fixed sys-compact" aria-label="OASIX living pipeline">
          <span className="sys-rail" aria-hidden="true" />
          <span className="sys-progress-fixed" aria-hidden="true"><i style={{ width: `${(active / (NODES.length - 1)) * 100}%` }} /></span>
          {NODES.map((n, i) => (
            <article key={n.id} className={`sys-node ${active === i ? 'on' : active > i ? 'done' : ''}`}>
              <button type="button" className={`sys-bead-btn ${active === i ? 'on' : active > i ? 'done' : ''}`} onClick={() => setActive(i)} aria-label={`Go to ${n.name}`}>
                <span className="sys-bead-core" />
                {active === i && n.id === 'decide' && <span className="sys-bead-flag">score 92</span>}
              </button>
              <p className="sys-name">{n.name}</p>
              <h3>{n.title}</h3>
              {n.body}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};


