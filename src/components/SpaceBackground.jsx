import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

/* ----------------- Étoiles multi-teintes ----------------- */
export function StarfieldCanvas({ starColor = '147, 197, 253' }) { // bleu clair par défaut
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0, height = 0, dpr = 1, rafId = 0, t = 0;
    const stars = [];
    const STAR_COUNT = 120;

    const seedStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + Math.random() * 1.8,
          baseOpacity: 0.15 + Math.random() * 0.5,
          twinkleSpeed: 0.4 + Math.random() * 1.4,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        const twinkle = prefersReducedMotion
          ? 1
          : 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const opacity = s.baseOpacity * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor}, ${opacity})`;
        ctx.fill();
      });
    };

    const tick = () => {
      t += 0.02;
      draw();
      rafId = requestAnimationFrame(tick);
    };

    resize();
    if (prefersReducedMotion) draw();
    else tick();

    const resizeObserver = new ResizeObserver(() => resize());
    const parent = canvas.parentElement;
    if (parent) resizeObserver.observe(parent);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [starColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

/* ----------------- Globe filaire avec couleur primaire ----------------- */
export function WireframeGlobe({ wireColor = '56, 189, 248', nodeColor = '125, 211, 248' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0, rafId = 0, angle = 0;
    const POINT_COUNT = 120;
    const points = [];
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      points.push({ x: Math.cos(theta) * radiusAtY, y, z: Math.sin(theta) * radiusAtY });
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2, cy = height / 2;
      const radius = Math.min(width, height) * 0.32;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const tilt = 0.35, cosT = Math.cos(tilt), sinT = Math.sin(tilt);

      const projected = points.map((p) => {
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;
        const scale = 1.4 / (1.4 - z2 * 0.85);
        return { sx: cx + x1 * radius * scale, sy: cy + y2 * radius * scale, depth: (z2 + 1) / 2 };
      });

      const sorted = projected.slice().sort((a, b) => a.depth - b.depth);
      const LINK_DIST = radius * 0.6;

      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i], b = sorted[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const depth = (a.depth + b.depth) / 2;
            const opacity = Math.max(0, 0.18 * (depth + 1) * (1 - dist / LINK_DIST));
            if (opacity > 0.005) {
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.strokeStyle = `rgba(${wireColor}, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      sorted.forEach((p) => {
        const depth = (p.depth + 1) / 2;
        const r = 0.9 + depth * 1.4;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor}, ${0.2 + depth * 0.6})`;
        ctx.fill();
      });
    };

    const tick = () => {
      angle += 0.0018;
      draw();
      rafId = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    const parent = canvas.parentElement;
    if (parent) resizeObserver.observe(parent);
    resize();
    tick();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [wireColor, nodeColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}

/* ----------------- Fond spatial complet (nébuleuses bleues, étoiles, globe) ----------------- */
export default function SpaceBackground({
  primaryColor = '#4A7BD4',
  accentColor = '#7C3AED',
  starColor = '147, 197, 253',
  wireColor = '56, 189, 248',
  nodeColor = '125, 211, 248',
}) {
  // Conversion des hex vers des couleurs rgba pour les nébuleuses
  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  const primaryRgb = hexToRgb(primaryColor);
  const accentRgb = hexToRgb(accentColor);

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Nébuleuses floues aux couleurs primaires et accent */}
      <Box sx={{
        position: 'absolute', top: -64, left: -64,
        width: 256, height: 256, borderRadius: '50%',
        bgcolor: `rgba(${primaryRgb}, 0.18)`, filter: 'blur(48px)',
      }} />
      <Box sx={{
        position: 'absolute', top: '30%', right: -48,
        width: 280, height: 280, borderRadius: '50%',
        bgcolor: `rgba(${accentRgb}, 0.12)`, filter: 'blur(56px)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -64, left: '30%',
        width: 320, height: 320, borderRadius: '50%',
        bgcolor: `rgba(${primaryRgb}, 0.10)`, filter: 'blur(56px)',
      }} />

      <StarfieldCanvas starColor={starColor} />

      <Box sx={{
        position: 'absolute', top: '8%', left: '4%',
        width: { xs: 180, md: 240 }, height: { xs: 180, md: 240 },
        opacity: 0.85,
      }}>
        <WireframeGlobe wireColor={wireColor} nodeColor={nodeColor} />
      </Box>
    </Box>
  );
}