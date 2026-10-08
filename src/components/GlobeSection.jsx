import React, { useEffect, useRef, useState } from 'react';
import { PlatformMark } from './BrandIcons';

const HOTSPOTS = [
  { id: 'tiktok', city: 'New York', lat: 40.7, lon: -74, label: 'TikTok · proof wave', detail: '+212% in 6h · 1.2k posts/hr' },
  { id: 'instagram', city: 'Mumbai', lat: 19, lon: 72.8, label: 'Instagram · demo reels', detail: '940 saves/hr · positive' },
  { id: 'reddit', city: 'London', lat: 51.5, lon: -0.12, label: 'Reddit · question thread', detail: '640 comments · wants proof' },
  { id: 'x', city: 'Sao Paulo', lat: -23.5, lon: -46.6, label: 'X · competitor gap', detail: 'replies thinning · opening' },
  { id: 'tiktok', city: 'Tokyo', lat: 35.7, lon: 139.7, label: 'TikTok · creator move', detail: '318 creators compounding' },
  { id: 'instagram', city: 'Sydney', lat: -33.9, lon: 151.2, label: 'Instagram · reaction', detail: 'saves 2x likes' },
];

const LAND = [
  // North America
  [64, -150, 7, 22], [56, -100, 14, 35], [72, -40, 10, 18],
  [40, -118, 10, 14], [38, -88, 12, 18], [24, -102, 8, 12], [14, -86, 6, 8],
  // South America
  [3, -64, 10, 16], [-10, -48, 11, 14], [-20, -64, 14, 12], [-42, -68, 14, 8],
  // Europe
  [44, -2, 9, 10], [54, -4, 5, 5], [62, 16, 10, 12], [49, 15, 8, 12], [54, 32, 9, 15],
  // Africa
  [26, 15, 9, 28], [10, 0, 8, 15], [2, 22, 12, 16], [8, 40, 10, 10], [-24, 25, 12, 14], [-19, 47, 8, 4],
  // Asia & Middle East
  [62, 90, 13, 48], [62, 140, 12, 30], [46, 68, 10, 24], [28, 46, 9, 14],
  [20, 78, 12, 11], [34, 106, 13, 20], [36, 134, 8, 8], [15, 103, 9, 9], [0, 118, 8, 18],
  // Oceania
  [-25, 122, 11, 12], [-26, 140, 12, 12], [-41, 173, 7, 5],
];

const inLand = (lat, lon) => LAND.some(([la, lo, ra, ro]) => {
  const dLa = (lat - la) / ra;
  let dLo = Math.abs(lon - lo);
  if (dLo > 180) dLo = 360 - dLo;
  return (dLa * dLa + (dLo / ro) * (dLo / ro)) < 1;
});

const project = (lat, lon, rot, R, cx, cy) => {
  const la = (lat * Math.PI) / 180;
  const lo = ((lon + rot) * Math.PI) / 180;
  const x = Math.cos(la) * Math.cos(lo);
  const y = Math.sin(la);
  const z = Math.cos(la) * Math.sin(lo);
  return { x: cx + R * x, y: cy - R * y * 1.02, z };
};

export const GlobeSection = () => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rotRef = useRef(-40);
  const hotRef = useRef(0);
  const [hot, setHot] = useState(0);
  const [count, setCount] = useState(147);
  useEffect(() => {
    const t = setInterval(() => {
      setHot((v) => {
        const n = (v + 1) % HOTSPOTS.length;
        hotRef.current = n;
        return n;
      });
      setCount((v) => v + 1);
    }, 3200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = [];
    for (let lat = -58; lat <= 78; lat += 2.6) {
      for (let lon = -180; lon < 180; lon += 2.6) {
        const jLat = lat + Math.sin(lon * 12.9898) * 0.35;
        const jLon = lon + Math.cos(lat * 78.233) * 0.35;
        if (inLand(jLat, jLon)) dots.push([lat, lon]);
      }
    }
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) { raf = requestAnimationFrame(draw); return; }
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.42;
      const rot = rotRef.current;
      const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.8);
      halo.addColorStop(0, 'rgba(20,20,18,0.07)');
      halo.addColorStop(0.6, 'rgba(20,20,18,0.025)');
      halo.addColorStop(1, 'rgba(20,20,18,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(20,20,18,0.24)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(20,20,18,0.09)';
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.stroke();
      dots.forEach(([lat, lon]) => {
        const p = project(lat, lon, rot, R, cx, cy);
        const front = p.z > 0;
        ctx.fillStyle = front ? `rgba(26,26,24,${(0.30 + p.z * 0.50).toFixed(2)})` : 'rgba(26,26,24,0.07)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, front ? 1.15 + p.z * 0.9 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      const t = performance.now() / 1000;
      const activeHot = hotRef.current;
      HOTSPOTS.forEach((hs, i) => {
        const p = project(hs.lat, hs.lon, rot, R, cx, cy);
        if (p.z < -0.15) return;
        const isHot = i === activeHot;
        const hubX = cx;
        const hubY = cy - R * 0.94;
        const lift = 34 + (i % 3) * 14;
        const midX = (p.x + hubX) / 2;
        const midY = Math.min(p.y, hubY) - lift;
        ctx.strokeStyle = isHot ? 'rgba(23,23,19,0.55)' : 'rgba(23,23,19,0.15)';
        ctx.lineWidth = isHot ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(midX, midY, hubX, hubY);
        ctx.stroke();
        const ph = (t * 0.22 + i * 0.17) % 1;
        const qx = (1 - ph) * (1 - ph) * p.x + 2 * (1 - ph) * ph * midX + ph * ph * hubX;
        const qy = (1 - ph) * (1 - ph) * p.y + 2 * (1 - ph) * ph * midY + ph * ph * hubY;
        ctx.fillStyle = isHot ? '#171713' : 'rgba(23,23,19,0.5)';
        ctx.beginPath();
        ctx.arc(qx, qy, isHot ? 2.6 : 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isHot ? '#171713' : 'rgba(23,23,19,0.65)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHot ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
        if (isHot) {
          ctx.strokeStyle = 'rgba(23,23,19,0.16)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7 + ((t * 10) % 10), 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      if (!reduced) rotRef.current += 0.12;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section className="globe-section globe-3d" id="loop">
      <div className="container globe-center">
        <p className="quiet-kicker light">05 — Global intelligence</p>
        <h2 className="light-h">The internet doesn&apos;t stop moving. Neither does OASIX.</h2>
        <p className="system-sub">Every second, opinions rise in a thousand cities. OASIX watches them converge — and tells your brand exactly when to act.</p>
        <div className="world-grid">
          <div className="globe-wrap globe-canvas-wrap" ref={wrapRef} aria-label="Live opinion globe">
            <canvas ref={canvasRef} className="globe-canvas" />
            <div className="globe-hub" aria-hidden="true">
              <strong>OASIX</strong>
              <span>always on · {(count / 1000).toFixed(1)}k opinions today</span>
            </div>
            <div className="globe-alert" aria-live="polite">
              <p>Opportunity detected</p>
              <strong>{HOTSPOTS[hot % HOTSPOTS.length].label} → Act now</strong>
            </div>
          </div>
          <aside className="world-feed" aria-label="Live opinions feeding OASIX">
            <p className="world-feed-title"><span className="pulse-dot" /> Live opinions → OASIX decision</p>
            {HOTSPOTS.map((s, i) => (
              <button key={s.city} type="button" onClick={() => { setHot(i); hotRef.current = i; }} className={hot % HOTSPOTS.length === i ? 'world-row on' : 'world-row'}>
                <PlatformMark platform={s.id} size={12} />
                <span className="world-row-t"><b>{s.city} — {s.label}</b><em>{s.detail}</em></span>
                <span className="world-row-s">{hot % HOTSPOTS.length === i ? '→ acting' : 'watching'}</span>
              </button>
            ))}
            <div className="world-verdict">
              <b>OASIX verdict</b>
              <p>One cluster wins: proof-first routines. Score 92 · ship the 15s proof cut first.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
