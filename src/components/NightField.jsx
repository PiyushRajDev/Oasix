import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import { gsap } from 'gsap';
import { PlatformMark } from './BrandIcons';
import { FieldClock } from './FieldClock';

/* NIGHTFIELD — Autonomous social scanning demonstration.
   Choreographed GSAP animation sequence (~7.5s total):
   1. SCAN (0-2.0s)      — Sweep line crosses field, cards flicker, header reads "SCANNING"
   2. CLASSIFY (2.0-4.0s)— Reject reasons stamp onto 6 noise cards, strikethrough applied
   3. SETTLE (4.0-6.0s)  — 6 rejected cards settle into dimmed ~0.85 ring around center; kept card centers with saffron glow & score 92%
   4. VERDICT (6.0-7.5s) — Header displays "1 KEPT / 6 REJECTED", headline resolves below cards with 48px+ space

   prefers-reduced-motion: renders final settled state directly. */

// 7 Social artifacts: 1 kept signal (Reddit), 6 rejected cards
const RAW_ARTIFACTS = [
  {
    id: 'reel-1',
    kind: 'reel',
    platform: 'TikTok',
    signal: false,
    rejectReason: 'low intent engagement',
    content: {
      user: '@skinlab.diaries',
      caption: 'week 1 vs week 4 unfiltered 🧴 no edits',
      stats: '1.2k posts/hr · 6h',
      duration: '0:15',
    },
    pos: { x: 18, y: 16 }, // Ring position: Top-Left
    rotation: -3,
  },
  {
    id: 'reel-2',
    kind: 'reel',
    platform: 'Instagram',
    signal: false,
    rejectReason: 'generic routine, no receipts',
    content: {
      user: '@glowwithpri',
      caption: '15 seconds, morning light, no filter. save this.',
      stats: '940 saves/hr',
      duration: '0:12',
    },
    pos: { x: 82, y: 14 }, // Ring position: Top-Right
    rotation: 2,
  },
  {
    id: 'reddit',
    kind: 'thread',
    platform: 'Reddit',
    signal: true, // THE KEPT SIGNAL
    content: {
      subreddit: 'r/SkincareAddiction',
      title: 'Has anyone actually tried this? Every brand claims results but nobody shows the first 2 weeks…',
      metaTpl: (relTime) => `640 comments · ${relTime} · unanswered`,
      votes: '4.2k',
    },
    pos: { x: 50, y: 40 }, // Center
    rotation: 0,
  },
  {
    id: 'x-thread',
    kind: 'xpost',
    platform: 'X',
    signal: false,
    rejectReason: 'skepticism rising',
    content: {
      user: 'competitor replies thinning',
      text: 'okay but does this brand have ANY receipts or just vibes and packaging',
      metaTpl: (relTime) => `${relTime} · skepticism rising`,
      engagement: '341 replies',
    },
    pos: { x: 84, y: 48 }, // Ring position: Mid-Right
    rotation: 1,
  },
  {
    id: 'tiktok-noise',
    kind: 'reel',
    platform: 'TikTok',
    signal: false,
    rejectReason: 'saturated, 14 brands already there',
    content: {
      user: '@unboxingwave',
      caption: 'unboxing haul 📦✨ #skincare #haul',
      stats: '4.1k posts/hr · 14 brands already there',
      duration: '0:58',
    },
    pos: { x: 28, y: 76 }, // Ring position: Bottom-Left
    rotation: -2,
  },
  {
    id: 'ig-noise',
    kind: 'igpost',
    platform: 'Instagram',
    signal: false,
    rejectReason: 'celebrity routine debate',
    content: {
      user: '@celebrity_routine',
      caption: 'morning routine ft. my favorites 💫 (ad)',
      likes: '82k likes',
      meta: 'celebrity routine debate',
    },
    pos: { x: 14, y: 52 }, // Ring position: Mid-Left
    rotation: 1,
  },
  {
    id: 'reddit-noise',
    kind: 'thread',
    platform: 'Reddit',
    signal: false,
    rejectReason: 'spike without intent',
    content: {
      subreddit: 'r/skincareobsessed',
      title: 'FREE GIVEAWAY — just follow and tag 2 friends',
      meta: 'spike without intent · saves flat',
      votes: '12',
    },
    pos: { x: 76, y: 78 }, // Ring position: Bottom-Right
    rotation: -1,
  },
];

const PlatformBadge = memo(({ platform }) => {
  const colors = {
    TikTok: '#1a1a1a',
    Instagram: '#c13584',
    Reddit: '#ff4500',
    X: '#1a1a2e',
  };
  return (
    <span
      className="nf-platform-badge"
      style={{ background: colors[platform] || '#333' }}
    >
      <PlatformMark platform={platform.toLowerCase()} size={12} />
      {platform}
    </span>
  );
});

const RejectStamp = memo(({ reason }) => (
  <div className="nf-reject-stamp" aria-hidden="true">
    <span className="nf-reject-tag">REJECTED</span>
    <span className="nf-reject-reason">{reason}</span>
  </div>
));

const ReelArtifact = memo(({ data, isSignal }) => (
  <div className={`nf-artifact nf-reel ${isSignal ? 'nf-is-signal' : 'nf-is-noise nf-is-rejected'}`}>
    <div className="nf-reel-body">
      <div className="nf-reel-bg" />
      <div className="nf-reel-overlay">
        <PlatformBadge platform={data.platform} />
        <div className="nf-reel-bottom nf-strikethrough-text">
          <span className="nf-reel-user">{data.content.user}</span>
          <span className="nf-reel-caption">{data.content.caption}</span>
          <span className="nf-reel-duration">{data.content.duration}</span>
        </div>
      </div>
      {isSignal ? <div className="nf-kept-glow" /> : data.rejectReason && <RejectStamp reason={data.rejectReason} />}
    </div>
    <span className="nf-reel-stats">{data.content.stats}</span>
  </div>
));

const ThreadArtifact = memo(({ data, isSignal, scoreRef }) => (
  <div className={`nf-artifact nf-thread ${isSignal ? 'nf-is-signal' : 'nf-is-noise nf-is-rejected'}`}>
    <div className="nf-card-top">
      <PlatformBadge platform={data.platform} />
      {isSignal && (
        <span className="nf-survivor-score">
          SIGNAL MATCH <strong ref={scoreRef} className="nf-score-num">92</strong>%
        </span>
      )}
    </div>
    <div className="nf-card-body">
      {!isSignal && <div className="nf-thread-votes">{data.content.votes}</div>}
      <p className={`nf-thread-title ${!isSignal ? 'nf-strikethrough-text' : ''}`}>{data.content.title}</p>
      <span className="nf-thread-meta">{data.computedMeta || data.content.meta}</span>
    </div>
    {isSignal ? <div className="nf-kept-glow" /> : data.rejectReason && <RejectStamp reason={data.rejectReason} />}
  </div>
));

const XPostArtifact = memo(({ data, isSignal }) => (
  <div className={`nf-artifact nf-xpost ${isSignal ? 'nf-is-signal' : 'nf-is-noise nf-is-rejected'}`}>
    <div className="nf-xpost-header">
      <PlatformBadge platform={data.platform} />
      <span className="nf-xpost-user">{data.content.user}</span>
    </div>
    <div className="nf-strikethrough-text">
      <p className="nf-xpost-text">{data.content.text}</p>
    </div>
    <span className="nf-xpost-meta">{data.content.engagement} · {data.computedMeta || data.content.meta}</span>
    {isSignal ? <div className="nf-kept-glow" /> : data.rejectReason && <RejectStamp reason={data.rejectReason} />}
  </div>
));

const IgPostArtifact = memo(({ data, isSignal }) => (
  <div className={`nf-artifact nf-igpost ${isSignal ? 'nf-is-signal' : 'nf-is-noise nf-is-rejected'}`}>
    <PlatformBadge platform={data.platform} />
    <div className="nf-igpost-img" />
    <div className="nf-igpost-info nf-strikethrough-text">
      <span className="nf-igpost-likes">{data.content.likes}</span>
      <p className="nf-igpost-caption">{data.content.caption}</p>
    </div>
    {isSignal ? <div className="nf-kept-glow" /> : data.rejectReason && <RejectStamp reason={data.rejectReason} />}
  </div>
));

const Artifact = memo(({ data, innerRef, scoreRef }) => {
  const isSignal = data.signal;
  const commonProps = { data, isSignal, scoreRef };
  const style = {
    position: 'absolute',
    left: `${data.pos.x}%`,
    top: `${data.pos.y}%`,
    transform: `translate(-50%, -50%) rotate(${data.rotation}deg)`,
    '--rot': `${data.rotation}deg`,
  };

  return (
    <div
      ref={innerRef}
      className={`nf-artifact-wrap ${isSignal ? 'nf-wrap-signal' : 'nf-wrap-noise'}`}
      style={style}
      data-id={data.id}
    >
      {data.kind === 'reel' && <ReelArtifact {...commonProps} />}
      {data.kind === 'thread' && <ThreadArtifact {...commonProps} />}
      {data.kind === 'xpost' && <XPostArtifact {...commonProps} />}
      {data.kind === 'igpost' && <IgPostArtifact {...commonProps} />}
    </div>
  );
});

export const NightField = () => {
  const [scanCycle, setScanCycle] = useState(0);
  const [isReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hasResolved, setHasResolved] = useState(() => isReduced);

  const [relativeTimes] = useState(() => ({
    reddit: '3m ago',
    xThread: '4m ago',
  }));

  const artifacts = useMemo(() => {
    return RAW_ARTIFACTS.map((item) => {
      let computedMeta = null;
      if (item.content.metaTpl) {
        if (item.id === 'reddit') computedMeta = item.content.metaTpl(relativeTimes.reddit);
        if (item.id === 'x-thread') computedMeta = item.content.metaTpl(relativeTimes.xThread);
      }
      return { ...item, computedMeta };
    });
  }, [relativeTimes]);

  const sectionRef = useRef(null);
  const fieldRef = useRef(null);
  const sweepLineRef = useRef(null);
  const statusRef = useRef(null);
  const connectorsRef = useRef(null);
  const payoffRef = useRef(null);
  const scoreValRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);

  const cardRefs = useRef({});
  const tlRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const cards = artifacts.map((a) => cardRefs.current[a.id]).filter(Boolean);
    const noiseCards = artifacts.filter((a) => !a.signal).map((a) => cardRefs.current[a.id]).filter(Boolean);
    const keptCards = artifacts.filter((a) => a.signal).map((a) => cardRefs.current[a.id]).filter(Boolean);
    const rejectStamps = noiseCards.map((el) => el?.querySelector('.nf-reject-stamp')).filter(Boolean);

    if (tlRef.current) {
      tlRef.current.kill();
    }

    if (isReduced) {
      // Prefers-reduced-motion: static snapshot of final settled state
      if (statusRef.current) {
        statusRef.current.innerHTML = '<span class="nf-status-kept">1 KEPT</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span class="nf-status-rejected">6 REJECTED</span>';
      }
      if (scoreValRef.current) scoreValRef.current.textContent = '92';
      noiseCards.forEach((c) => {
        if (c) {
          c.style.opacity = '0.35';
          c.style.transform = `translate(-50%, -50%) scale(0.85)`;
        }
      });
      keptCards.forEach((c) => {
        if (c) {
          c.style.opacity = '1';
          c.style.transform = `translate(-50%, -50%) scale(1)`;
        }
      });
      if (payoffRef.current) payoffRef.current.style.opacity = '1';
      if (headlineRef.current) headlineRef.current.style.opacity = '1';
      if (subRef.current) subRef.current.style.opacity = '1';
      return;
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        setHasResolved(true);
      },
    });

    tlRef.current = tl;

    // Reset at t=0
    tl.set(sweepLineRef.current, { y: 0, opacity: 0 });
    tl.set(rejectStamps, { opacity: 0, scale: 0.6 });
    tl.set(connectorsRef.current, { opacity: 0 });
    tl.set(cards, { opacity: 1, scale: 1 });
    tl.set(scoreValRef.current, { textContent: '0' });
    tl.set(payoffRef.current, { opacity: 0, y: 16 });

    // Initial status: SCANNING
    tl.call(() => {
      if (statusRef.current) {
        statusRef.current.className = 'nf-status nf-status-scanning';
        statusRef.current.textContent = 'SCANNING 0 SOURCES';
      }
    }, null, 0);

    /* 1. SCAN PHASE (0.1s - 2.0s) */
    const scanCount = { val: 0 };
    tl.to(scanCount, {
      val: 847,
      duration: 1.8,
      ease: 'power1.out',
      roundProps: 'val',
      onUpdate: () => {
        if (statusRef.current) {
          statusRef.current.textContent = `SCANNING ${scanCount.val} SOURCES`;
        }
      },
    }, 0.1);

    tl.to(sweepLineRef.current, { opacity: 0.9, duration: 0.15 }, 0.1);
    tl.to(sweepLineRef.current, {
      y: () => (fieldRef.current ? fieldRef.current.offsetHeight : 480),
      duration: 1.8,
      ease: 'power1.inOut',
    }, 0.15);
    tl.to(sweepLineRef.current, { opacity: 0, duration: 0.2 }, 1.95);

    /* 2. CLASSIFY PHASE (2.0s - 4.0s) */
    tl.call(() => {
      if (statusRef.current) {
        statusRef.current.className = 'nf-status nf-status-rejecting';
        statusRef.current.textContent = 'CLASSIFYING · FILTERING NOISE';
      }
    }, null, 2.0);

    tl.to(rejectStamps, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(2)',
      stagger: 0.08,
    }, 2.15);

    /* 3. SETTLE PHASE (4.0s - 6.0s) — Rejected cards dim & scale down into ring around center kept card */
    tl.call(() => {
      if (statusRef.current) {
        statusRef.current.className = 'nf-status';
        statusRef.current.innerHTML = '<span class="nf-status-kept">1 KEPT</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span class="nf-status-rejected">6 REJECTED</span>';
      }
    }, null, 4.0);

    tl.to(connectorsRef.current, { opacity: 0.25, duration: 0.6 }, 4.1);

    tl.to(noiseCards, {
      opacity: 0.35,
      scale: 0.85,
      duration: 1.2,
      ease: 'power2.inOut',
      stagger: 0.06,
    }, 4.2);

    tl.to(keptCards, {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: 'power2.out',
    }, 4.2);

    const scoreCounter = { val: 0 };
    tl.to(scoreCounter, {
      val: 92,
      duration: 1.2,
      ease: 'power2.out',
      roundProps: 'val',
      onUpdate: () => {
        if (scoreValRef.current) {
          scoreValRef.current.textContent = scoreCounter.val;
        }
      },
    }, 4.4);

    /* 4. VERDICT & HEADLINE (6.0s - 7.5s) */
    tl.to(payoffRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, 6.0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            tl.play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (tlRef.current) tlRef.current.kill();
    };
  }, [artifacts, isReduced, scanCycle]);

  const handleReplay = () => {
    if (isReduced) return;
    setHasResolved(false);
    setScanCycle((prev) => prev + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="nf-section"
      id="field"
      aria-label="OASIX social scan"
    >
      <div className="nf-header">
        <div className="container nf-header-inner">
          <div className="nf-log">
            <span className="nf-brand">OASIX — FIELD SCAN</span>
            <span className="nf-sep">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <FieldClock key={scanCycle} />
            <span className="nf-sep">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <span ref={statusRef} className="nf-status nf-status-scanning">
              SCANNING 847 SOURCES
            </span>
            <button
              type="button"
              className="nf-replay-btn"
              onClick={handleReplay}
              aria-label="Replay scan sequence"
              title="Replay scan sequence"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 8a6 6 0 1 1 1.76 4.24l-2.4 2.4" />
                <path d="M1 10.5V15h4.5" />
              </svg>
              <span>REPLAY</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container nf-stage-container">
        <div
          ref={fieldRef}
          className="nf-field-canvas"
          role="img"
          aria-label="Social media scan identifying 1 signal and 6 rejected noise items"
        >
          {/* Horizontal sweep line */}
          <div ref={sweepLineRef} className="nf-sweep-line" aria-hidden="true" />

          {/* 7 Artifact cards */}
          {artifacts.map((a) => (
            <Artifact
              key={a.id}
              data={a}
              innerRef={(el) => {
                cardRefs.current[a.id] = el;
              }}
              scoreRef={a.signal ? scoreValRef : null}
            />
          ))}

          {/* Connector lines connecting center kept card to rejected ring */}
          <svg ref={connectorsRef} className="nf-connectors" aria-hidden="true">
            <line className="nf-conn-line" x1="50%" y1="40%" x2="18%" y2="16%" />
            <line className="nf-conn-line" x1="50%" y1="40%" x2="82%" y2="14%" />
            <line className="nf-conn-line" x1="50%" y1="40%" x2="14%" y2="52%" />
            <line className="nf-conn-line" x1="50%" y1="40%" x2="84%" y2="48%" />
            <line className="nf-conn-line" x1="50%" y1="40%" x2="28%" y2="76%" />
            <line className="nf-conn-line" x1="50%" y1="40%" x2="76%" y2="78%" />
          </svg>
        </div>

        {/* Headline block sits strictly below cards with 48px+ space */}
        <div ref={payoffRef} className="nf-payoff-block">
          <h2 ref={headlineRef} className="nf-headline">
            One deserves <em>you.</em>
          </h2>
          <p ref={subRef} className="nf-sub">
            <a href="#early-access" className="nf-act">
              open the case ↓
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

