import { motion } from 'framer-motion';

export default function ArcReactorRing({ size = 180, small = false }) {
  const s = small ? size * 0.6 : size;
  return (
    <motion.svg
      width={s}
      height={s}
      viewBox="0 0 200 200"
      animate={{ rotate: 360 }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      style={{ filter: 'drop-shadow(0 0 8px rgba(0,144,255,0.5))' }}
    >
      <defs>
        <radialGradient id="arcGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00C8E8" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#0090FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0090FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer segmented ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#0090FF"
        strokeWidth="2.5" strokeDasharray="22 12" opacity="0.55" />
      {/* Middle ring */}
      <circle cx="100" cy="100" r="72" fill="none" stroke="#00A8E0"
        strokeWidth="4" strokeDasharray="50 10" opacity="0.75" />
      {/* Inner ring */}
      <circle cx="100" cy="100" r="52" fill="none" stroke="#00C8E8"
        strokeWidth="1.8" strokeDasharray="10 7" opacity="0.9" />
      {/* Center glow */}
      <circle cx="100" cy="100" r="18" fill="url(#arcGlowGrad)" className="arc-pulse" />
      {/* Core dot */}
      <circle cx="100" cy="100" r="5" fill="#E0F7FF" opacity="0.9" />
    </motion.svg>
  );
}