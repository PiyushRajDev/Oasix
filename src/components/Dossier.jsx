import React, { useState } from 'react';
import { DOSSIER_KEYS, DOSSIER_SCENARIOS } from '../data/dossier';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { trackEvent } from '../utils/analytics';
import { PlatformMark } from './BrandIcons';

/* DOSSIER — Case file. Opened after NightField finds the signal.
   Left: sticky source thread with visual social artifacts.
   Right: scroll-revealed build — signal > evidence > context >
   rejected (strike-through) > verdict stamp > action > learning.
   Visual artifacts: Reel mock, Instagram post, Reddit thread, X snippet. */

/* ─── Visual Evidence Artifacts ──────────────────────────────────────── */

const ReelEvidence = ({ user, caption, platform, tone }) => (
  <div className="doss-reel-artifact">
    <div className={`doss-reel-frame doss-reel-${tone}`}>
      <div className="doss-reel-play">▶</div>
      <div className="doss-reel-hud">
        <span className="doss-reel-platform" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <PlatformMark platform={platform.toLowerCase()} size={12} />
          {platform}
        </span>
        <span className="doss-reel-dur">0:15</span>
      </div>
      <div className="doss-reel-caption-strip">
        <span className="doss-reel-user">{user}</span>
        <span className="doss-reel-cap">{caption}</span>
      </div>
    </div>
  </div>
);

const IgPostEvidence = ({ user, caption, likes }) => (
  <div className="doss-ig-artifact">
    <div className="doss-ig-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <PlatformMark platform="instagram" size={16} />
      <span className="doss-ig-user">{user}</span>
      <span className="doss-ig-follow" style={{ marginLeft: 'auto' }}>Follow</span>
    </div>
    <div className="doss-ig-img" />
    <div className="doss-ig-body">
      <span className="doss-ig-likes">♥ {likes}</span>
      <p className="doss-ig-caption"><strong>{user}</strong> {caption}</p>
    </div>
  </div>
);

const RedditEvidence = ({ subreddit, title, votes, comments, meta }) => (
  <div className="doss-reddit-artifact">
    <div className="doss-reddit-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <PlatformMark platform="reddit" size={14} />
      <span className="doss-reddit-sub">{subreddit}</span>
      <span className="doss-reddit-time">{meta}</span>
    </div>
    <p className="doss-reddit-title">"{title}"</p>
    <div className="doss-reddit-stats">
      <span className="doss-reddit-votes">↑ {votes}</span>
      <span className="doss-reddit-comments">{comments} comments</span>
      <span className="doss-reddit-badge">SIGNAL ORIGIN</span>
    </div>
  </div>
);

const XSnippet = ({ user, handle, text, replies, note }) => (
  <div className="doss-x-artifact">
    <div className="doss-x-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <PlatformMark platform="x" size={16} />
      <div>
        <span className="doss-x-user">{user}</span>
        <span className="doss-x-handle">{handle}</span>
      </div>
    </div>
    <p className="doss-x-text">{text}</p>
    <div className="doss-x-footer">
      <span>{replies} replies</span>
      <span className="doss-x-note">{note}</span>
    </div>
  </div>
);

const RejectedEvidence = ({ items }) => (
  <div className="doss-rejected-list">
    {items.map((r) => (
      <div key={r.text} className="doss-rejected-item">
        <div className="doss-rejected-content">
          <s className="doss-rejected-text">{r.text}</s>
          <span className="doss-rejected-reason">{r.reason}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ─── Build Step ──────────────────────────────────────────────────────── */

const BuildStep = ({ index, kicker, children }) => {
  const [ref, visible] = useScrollReveal({ threshold: 0.15, once: true });
  return (
    <div ref={ref} className={visible ? 'w-step show' : 'w-step'} style={{ transitionDelay: `${Math.min(index * 0.06, 0.3)}s` }}>
      <p className="w-kicker">{kicker}</p>
      {children}
    </div>
  );
};

/* ─── Main Dossier ───────────────────────────────────────────────────── */

export const Dossier = () => {
  const [key, setKey] = useState('launch');
  const s = DOSSIER_SCENARIOS[key] || DOSSIER_SCENARIOS.launch;
  const pick = (k) => {
    setKey(k);
    trackEvent('dossier_select', { scenario: k });
  };

  return (
    <section className="w-paper w-dossier" id="dossier" aria-label="One opportunity dossier">
      <div className="w-wrap">
        <div className="doss-entry-kicker">
          <span className="doss-entry-label">CASE FILE OPENED</span>
          <span className="doss-entry-arrow">— from the field above</span>
        </div>
        <h2 className="w-display sm">
          One thread in. <em>A decision out.</em>
        </h2>
        <p className="w-standfirst">
          This is what OASIX produces while working — not a dashboard, not a score.
          A trace you can audit: what it saw, what it kept, what it refused.
        </p>

        <div className="w-tabs" role="tablist" aria-label="Signal selector">
          {DOSSIER_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={key === k}
              className={key === k ? 'w-tab on' : 'w-tab'}
              onClick={() => pick(k)}
            >
              {DOSSIER_SCENARIOS[k].label}
            </button>
          ))}
        </div>

        <div className="w-grid" key={key}>
          {/* Left: Sticky source panel with visual artifacts */}
          <aside className="w-source doss-source-visual" id="dossier-source" aria-label="Source evidence">
            <p className="w-kicker">SOURCE THREAD</p>

            {/* Primary Reddit evidence */}
            <RedditEvidence
              subreddit={s.source.meta.split(' · ')[0]}
              title={s.source.quote}
              votes="4.2k"
              comments={s.source.meta.match(/\d+ comments/) ? s.source.meta.match(/(\d+) comments/)[1] : '640'}
              meta={s.source.meta}
            />

            {/* Signal reel evidence */}
            {key === 'launch' || key === 'trend' ? (
              <ReelEvidence
                platform="TikTok"
                tone="dark"
                user="@skinlab.diaries"
                caption="week 1 vs week 4 — no edits, no filter"
              />
            ) : (
              <IgPostEvidence
                user="@glowwithpri"
                caption="15 seconds, morning light, no filter. Save this."
                likes="12.4k"
              />
            )}

            {/* X skepticism snippet */}
            <XSnippet
              user="Competitor"
              handle="replies thinning"
              text="okay but does this brand have ANY receipts or just vibes and packaging 🤔"
              replies="341"
              note="skepticism rising"
            />

            <div className="w-goal">
              <p className="w-kicker">BRAND GOAL</p>
              <p className="w-goal-text">{s.goal}</p>
            </div>
            <p className="w-mono dim">signal → evidence → context → verdict · auditable</p>
          </aside>

          {/* Right: Scroll-revealed build */}
          <div className="w-build">
            <BuildStep index={0} kicker="01 — SIGNAL FOUND">
              <p className="w-signal">"{s.signal}"</p>
              <div className="w-fraglist">
                {s.fragments.map((f) => (
                  <p key={f.time} className="w-fragline">
                    <span className="w-mono">{f.src} · {f.time}</span>
                    <span>{f.text}</span>
                  </p>
                ))}
              </div>
            </BuildStep>

            <BuildStep index={1} kicker="02 — EVIDENCE COLLECTED">
              <ul className="w-evid">
                {s.evidence.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </BuildStep>

            <BuildStep index={2} kicker="03 — CONTEXT CHECK">
              <div className="w-ctx">
                {s.context.map(([a, b]) => (
                  <p key={a} className="w-ctxrow">
                    <strong>{a}</strong>
                    <span>{b}</span>
                  </p>
                ))}
              </div>
            </BuildStep>

            <BuildStep index={3} kicker="04 — REFUSED · THE PROOF OF JUDGMENT">
              <RejectedEvidence items={s.rejected} />
              <p className="w-note">A rejection is more convincing than another 92 score. OASIX says no — on record.</p>
            </BuildStep>

            <BuildStep index={4} kicker="05 — VERDICT">
              <p className="w-verdict">"{s.verdict}"</p>
              <p className="w-stamp">ACT</p>
              <p className="w-mono">{s.confidence}</p>
            </BuildStep>

            <BuildStep index={5} kicker="06 — ACTION SHIPPED">
              <ul className="w-act">
                {s.action.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="w-mono dim">{s.learning}</p>
            </BuildStep>
          </div>
        </div>
      </div>
    </section>
  );
};
