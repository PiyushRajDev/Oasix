import React, { useState } from 'react';
import { trackEvent } from '../utils/analytics';
import { PlatformMark } from './BrandIcons';

const SCENARIOS = {
  launch: {
    label: 'Product launch',
    goal: 'Launch a new product to a younger audience.',
    detects: 'A creator format around "before / after proof" is accelerating across TikTok, Instagram and Reddit.',
    reasons: [['Audience fit','94%','High overlap, under-30 buyers'],['Timing','High','+212% velocity / 6h'],['Competition','Low','Only 2 brands active'],['Brand fit','Strong','Proof-first voice match']],
    recommends: 'Create a proof-led response showing the product in use within the first 15 seconds.',
    creates: [['tiktok','TikTok concept','15s proof cut'],['instagram','Instagram Reel','4:5 + 9:16'],['x','X thread','Reply + breakdown'],['reddit','FAQ response','Evidence answer']],
    results: [['+41%','saves'],['+28%','profile visits'],['+19%','qualified traffic']],
    score: 92
  },
  trend: {
    label: 'Trend response',
    goal: 'Join a fast-moving conversation without looking late.',
    detects: 'An unfiltered teardown thread is spreading from Reddit to TikTok — your category is named directly.',
    reasons: [['Audience fit','91%','Question matches buyers'],['Timing','Now','Crossing 2 platforms'],['Competition','Low','No good brand answer'],['Brand fit','Strong','Evidence-led tone']],
    recommends: 'Answer the exact audience question with evidence — one clear demonstration, no hype.',
    creates: [['tiktok','TikTok stitch','Direct answer'],['instagram','Carousel','Step-by-step'],['x','X thread','Evidence chain'],['reddit','FAQ response','Source + proof']],
    results: [['+36%','saves'],['+24%','shares'],['+17%','qualified traffic']],
    score: 89
  },
  competitor: {
    label: 'Competitor move',
    goal: 'Respond when a rival launches without starting a price war.',
    detects: 'A competitor launch is getting attention — but replies are thinning and skepticism is rising on X and Reddit.',
    reasons: [['Audience fit','88%','Buyers comparing options'],['Timing','High','Skepticism window open'],['Competition','Med','One rival active'],['Brand fit','Strong','Calm proof edge']],
    recommends: 'Enter with calm proof: side-by-side evidence where the rival over-claimed.',
    creates: [['tiktok','Comparison cut','Side-by-side'],['instagram','Creator duet','Independent voice'],['x','X thread','Breakdown'],['reddit','Context reply','Full picture']],
    results: [['+33%','saves'],['+21%','profile visits'],['+15%','qualified traffic']],
    score: 87
  },
  creator: {
    label: 'Creator opportunity',
    goal: 'Find the right creator before everyone else does.',
    detects: 'A mid-size creator format is compounding — high saves, low brand saturation, strong overlap with your buyers.',
    reasons: [['Audience fit','96%','Core buyer overlap'],['Timing','Early','Pre-peak velocity'],['Competition','Low','Unsponsored so far'],['Brand fit','Strong','Native to category']],
    recommends: 'Seed three creators with the proof format first — then amplify the winner within 48 hours.',
    creates: [['tiktok','Creator brief','Proof format'],['instagram','Hook + demo','Reel cutdown'],['x','Seed thread','Distribution'],['reddit','Amplify plan','48h window']],
    results: [['+44%','saves'],['+31%','follows'],['+22%','qualified traffic']],
    score: 94
  }
};

const KEYS = Object.keys(SCENARIOS);

export const OpportunitySection = () => {
  const [key, setKey] = useState('launch');
  const [done, setDone] = useState(false);
  const s = SCENARIOS[key];
  const pick = (k) => { setKey(k); setDone(false); trackEvent('scenario_select', { scenario: k }); };
  return (
    <section className="product-section decision-v2 decision-pro" id="product">
      <div className="container">
        <p className="quiet-kicker">03 — The decision</p>
        <h2>Not another dashboard. A decision.</h2>
        <p className="decision-sub">One memo per situation — goal, evidence, reasoning, and what OASIX will ship.</p>
        <div className="scenario-row" role="tablist" aria-label="Situation selector">
          {KEYS.map((k) => (
            <button key={k} type="button" role="tab" aria-selected={key === k} className={key === k ? 'scenario-btn on' : 'scenario-btn'} onClick={() => pick(k)}>{SCENARIOS[k].label}</button>
          ))}
        </div>
        <div className="opp-shell opp-shell-v2 opp-memo" key={key}>
          <div className="opp-top"><span className="opp-flag"><span className="pulse-dot" /> Opportunity detected · just now</span><span className="opp-conf">score {s.score} · reasoning attached</span></div>
          <div className="memo-grid">
            <div className="memo-main">
              <div className="opp-goal"><p className="opp-label">BRAND GOAL</p><p className="opp-goal-text">{s.goal}</p></div>
              <h3 className="memo-signal">“{s.detects}”</h3>
              <div className="memo-reasons">
                {s.reasons.map(([a,b,c]) => (
                  <div key={a} className="memo-reason"><div><span>{a}</span><em>{c}</em></div><b>{b}</b></div>
                ))}
              </div>
              <div className="memo-rec">
                <p className="opp-label">OASIX RECOMMENDS</p>
                <p className="opp-quote">“{s.recommends}”</p>
              </div>
              <p className="opp-label">SOURCE SIGNALS</p>
              <div className="opp-sources">
                <span><PlatformMark platform="tiktok" size={12} /> TikTok</span>
                <span><PlatformMark platform="reddit" size={12} /> Reddit</span>
                <span><PlatformMark platform="instagram" size={12} /> Instagram</span>
                <span><PlatformMark platform="x" size={12} /> X</span>
              </div>
            </div>
            <div className="memo-side">
              <div className="opp-rec">
                <p className="opp-label">OASIX CREATES</p>
                <div className="opp-creates memo-creates">
                  {s.creates.map(([pid, c, sub]) => (
                    <span key={c}><PlatformMark platform={pid} size={12} /><i>{c}<em>{sub}</em></i></span>
                  ))}
                </div>
                <div className="opp-actions">
                  <button type="button" className="btn btn-primary" disabled={done} onClick={() => { setDone(true); trackEvent('opportunity_create_click', { scenario: key }); }}>{done ? 'Campaign launched ✓' : 'Launch response'}</button>
                  {!done && <span>Prepared · safeguards on</span>}
                </div>
                <div className={done ? 'opp-after show' : 'opp-after'} aria-live="polite">
                  <p className="opp-label">RESULT</p>
                  <div className="opp-results">{s.results.map(([v,l]) => (<div key={l} className="opp-result"><b>{v}</b><span>{l}</span></div>))}</div>
                  <p className="opp-watch">Watching response… strategy updating</p>
                </div>
              </div>
            </div>
          </div>
          <p className="opp-disc">Illustrative example — not real campaign data.</p>
        </div>
      </div>
    </section>
  );
};
