import React from 'react';
import { PlatformMark } from './BrandIcons';

/* Real-looking source posts — the proof OASIX reads.
   Designed like actual TikTok / Reel / Reddit cards, not telemetry rows. */
export const ProofMocks = () => (
  <div className="proof-mocks" aria-label="Example source posts">
    <article className="mock">
      <div className="mock-top">
        <span className="mock-avatar" aria-hidden="true" />
        <span className="mock-meta"><b>@skinlab.diaries</b><span>TikTok · 6h ago</span></span>
        <span className="mock-plat"><PlatformMark platform="tiktok" /></span>
      </div>
      <p className="mock-body">POV: I stopped trusting ads and started filming week 1 vs week 4. Here&apos;s the unfiltered routine…</p>
      <div className="mock-media tt" aria-hidden="true" />
      <div className="mock-stats"><span><b>1.2k</b> posts/hr</span><span><b>+212%</b> 6h</span><span>proof format</span></div>
      <p className="mock-flag"><i /> <span><b>OASIX sees:</b> before/after proof accelerating</span></p>
    </article>
    <article className="mock">
      <div className="mock-top">
        <span className="mock-avatar r" aria-hidden="true" />
        <span className="mock-meta"><b>@glowwithpri</b><span>Instagram Reel · 3h ago</span></span>
        <span className="mock-plat"><PlatformMark platform="instagram" /></span>
      </div>
      <p className="mock-body">Save this if you&apos;re over 10-step routines. 15 seconds, morning light, no filter — full steps in caption.</p>
      <div className="mock-media ig" aria-hidden="true" />
      <div className="mock-stats"><span><b>940</b> saves/hr</span><span><b>2×</b> saves vs likes</span><span>demo reels</span></div>
      <p className="mock-flag"><i /> <span><b>OASIX sees:</b> saves compounding, sentiment positive</span></p>
    </article>
    <article className="mock">
      <div className="mock-top">
        <span className="mock-avatar x" aria-hidden="true" />
        <span className="mock-meta"><b>r/SkincareAddiction</b><span>Reddit · thread · 640 comments</span></span>
        <span className="mock-plat"><PlatformMark platform="reddit" /></span>
      </div>
      <p className="mock-body">“Has anyone actually tried this? Every brand claims results but nobody shows the first 2 weeks…”</p>
      <div className="mock-media rd" aria-hidden="true" />
      <div className="mock-stats"><span><b>640</b> comments</span><span>question thread</span><span>wants proof</span></div>
      <p className="mock-flag"><i /> <span><b>OASIX sees:</b> unanswered question = your opening</span></p>
    </article>
  </div>
);
