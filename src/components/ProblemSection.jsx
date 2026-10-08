import React from 'react';
import { PlatformMark, PLATFORM_META } from './BrandIcons';
import { ProofMocks } from './ProofMocks';

const LANES = [
  { id: 'tiktok', feed: 'proof format · 1.2k posts/hr', count: 9 },
  { id: 'reddit', feed: 'question thread · 640 comments', count: 8 },
  { id: 'instagram', feed: 'demo reels · 940 saves/hr', count: 9 },
  { id: 'x', feed: 'competitor gap · thinning replies', count: 7 },
];

export const ProblemSection = () => (
  <section className="why-section problem-v2 problem-tight" id="why">
    <div className="container why-center">
      <p className="quiet-kicker">01 — The problem</p>
      <h2>The internet moves faster than your team can watch.</h2>
      <p className="problem-sub">Every hour, thousands of conversations scatter across the social web. Almost all of them are noise. One of them is your opening.</p>
      <div className="signal-map noise-map" aria-label="Information overload filtered into one opportunity">
        <p className="funnel-top">The social web · live</p>
        <div className="noise-lanes">
          {LANES.map((lane) => {
            const meta = PLATFORM_META.find((p) => p.id === lane.id);
            return (
              <div key={lane.id} className="noise-lane">
                <span className="signal-plat"><PlatformMark platform={lane.id} />{meta.name}</span>
                <span className="noise-track" aria-hidden="true">
                  {Array.from({ length: lane.count }).map((_, i) => (
                    <i key={i} className={`noise-bit b-${i % 4}`} style={{ animationDelay: `${(i * 0.37 + LANES.indexOf(lane) * 0.4) % 2.4}s`, animationDuration: `${1.7 + (i % 4) * 0.35}s` }} />
                  ))}
                  <em className="noise-line" />
                </span>
                <span className="noise-feed">{lane.feed}</span>
              </div>
            );
          })}
        </div>
        <div className="funnel-engine funnel-engine-v2"><strong>OASIX</strong><span>observes → understands → decides</span></div>
        <div className="signal-one-arrow" aria-hidden="true">↓</div>
        <div className="funnel-one funnel-one-v2">One opportunity<br />worth acting on</div>
      </div>
      <ProofMocks />
      <p className="funnel-close">The problem isn&apos;t lack of data.<br /><strong>It&apos;s knowing what deserves action.</strong></p>
    </div>
  </section>
);


