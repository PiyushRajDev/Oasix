import React, { useState } from 'react';
import { trackEvent } from '../utils/analytics';
import { PlatformMark } from './BrandIcons';

const CAPS = [
  { id: 'observe', n: '01', name: 'Observe', line: 'Watches every channel at once.', demo: { stage: 'OBSERVING', title: 'Signals converging', rows: [['TikTok proof wave', 'rising'], ['Reddit question thread', 'live'], ['X competitor gap', 'opening']] } },
  { id: 'understand', n: '02', name: 'Understand', line: 'Clusters noise into meaning.', demo: { stage: 'UNDERSTANDING', title: 'One cluster from noise', rows: [['318 creators grouped', 'live'], ['Sentiment leans positive', 'live'], ['Context mapped to you', 'ready']] } },
  { id: 'decide', n: '03', name: 'Decide', line: 'Scores whether to act.', demo: { stage: 'DECIDING', title: 'Should OASIX act? Yes — 92', rows: [['Audience fit 94%', 'live'], ['Timing high', 'hot'], ['Saturation low', 'ready']] } },
  { id: 'act', n: '04', name: 'Act', line: 'Turns the opening into content.', demo: { stage: 'ACTING', title: 'Response campaign live', rows: [['15s proof reel', 'ready'], ['Instagram Reel', 'ready'], ['X conversation', 'ready']] } },
  { id: 'learn', n: '05', name: 'Learn', line: 'Feeds results back in.', demo: { stage: 'LEARNING', title: 'Response becomes signal', rows: [['Saves + follows up', 'hot'], ['Weights adjusted', 'live'], ['Next decision sharper', 'ready']] } }
];

export const FeaturesSection = () => {
  const [active, setActive] = useState('observe');
  const c = CAPS.find((x) => x.id === active) || CAPS[0];
  const pick = (id) => { setActive(id); };
  return (
    <section className="caps-section caps-v2" id="features">
      <div className="container">
        <p className="quiet-kicker">04 — Capabilities</p>
        <h2>One agent. Five capabilities.</h2>
        <p className="caps-sub">Everything OASIX does happens continuously.</p>
        <div className="caps-layout">
          <div className="caps-rail" onMouseLeave={() => {}}>
            {CAPS.map((item) => (
              <button key={item.id} type="button" className={active === item.id ? 'cap on' : 'cap'}
                onMouseEnter={() => { pick(item.id); trackEvent('cap_hover', { cap: item.id }); }}
                onFocus={() => pick(item.id)}
                onClick={() => { pick(item.id); trackEvent('cap_select', { cap: item.id }); }}>
                <span className="cap-n">{item.n}</span>
                <span className="cap-t"><strong>{item.name}</strong><em>{item.line}</em></span>
                <span className="cap-bar"><i style={{ width: active === item.id ? '100%' : '0%' }} /></span>
              </button>
            ))}
          </div>
          <div className="caps-demo" key={c.id}>
            <div className="caps-flow caps-marks"><span><PlatformMark platform="tiktok" size={11} />TikTok</span><span><PlatformMark platform="reddit" size={11} />Reddit</span><span><PlatformMark platform="instagram" size={11} />Instagram</span><span><PlatformMark platform="x" size={11} />X</span></div>
            <p className="caps-stage"><span className="pulse-dot" /> {c.demo.stage}</p>
            <h3>{c.demo.title}</h3>
            {c.demo.rows.map(([a, b]) => (
              <div key={a} className="caps-row"><span>{a}</span><b>{b}</b></div>
            ))}
            <p className="caps-note">Hover 01–05 — the same agent, shifting state.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
