import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlowerBloomTransitionOverlayProps {
  active: boolean;
  onComplete?: () => void;
}

export const FlowerBloomTransitionOverlay: React.FC<FlowerBloomTransitionOverlayProps> = ({
  active,
  onComplete,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
      const cleanTimer = setTimeout(() => {
        setShouldRender(false);
      }, 2600);

      return () => {
        clearTimeout(timer);
        clearTimeout(cleanTimer);
      };
    } else {
      setShouldRender(false);
    }
  }, [active, onComplete]);

  if (!shouldRender) return null;

  // 8 Flower buds in a bouquet forming a ring and center bloom
  const outerPetalCount = 12;
  const innerPetalCount = 8;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Background soft glow wash expanding as flowers open and gently dissolving */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.9, 0] }}
        transition={{ duration: 2.5, times: [0, 0.35, 0.65, 1], ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-b from-rose-50/95 via-pink-100/90 to-rose-100/95 backdrop-blur-md"
      />

      {/* Center Bouquet Bloom Opening Container */}
      <motion.div
        initial={{ scale: 0.1, rotate: -20, opacity: 0 }}
        animate={{
          scale: [0.1, 1.25, 4.2],
          rotate: [-20, 20, 55],
          opacity: [0, 1, 1, 0],
          filter: ['blur(0px)', 'blur(0px)', 'blur(6px)'],
        }}
        transition={{
          duration: 2.4,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.5, 1],
        }}
        className="relative w-80 h-80 flex items-center justify-center"
      >
        {/* Outer Ring of Blooming Rose & Orchid Petals */}
        {Array.from({ length: outerPetalCount }).map((_, i) => {
          const angle = (360 / outerPetalCount) * i;
          return (
            <motion.div
              key={`outer-petal-${i}`}
              initial={{ scale: 0, x: 0, y: 0, rotate: angle }}
              animate={{
                scale: [0, 1.2, 1.6],
                x: [0, Math.cos((angle * Math.PI) / 180) * 110],
                y: [0, Math.sin((angle * Math.PI) / 180) * 110],
                rotate: [angle, angle + 15],
              }}
              transition={{
                duration: 1.8,
                delay: i * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute origin-bottom"
            >
              <svg width="70" height="95" viewBox="0 0 70 95" fill="none" className="filter drop-shadow-md">
                <path
                  d="M35 5 C55 20, 70 50, 50 85 C35 95, 15 85, 5 60 C-5 35, 15 15, 35 5 Z"
                  fill="url(#outerRoseGrad)"
                  stroke="#f43f5e"
                  strokeWidth="0.8"
                />
              </svg>
            </motion.div>
          );
        })}

        {/* Middle Ring of Blush Cherry Blossoms Blooming Open */}
        {Array.from({ length: innerPetalCount }).map((_, i) => {
          const angle = (360 / innerPetalCount) * i + 22.5;
          return (
            <motion.div
              key={`inner-petal-${i}`}
              initial={{ scale: 0, rotate: angle }}
              animate={{
                scale: [0, 1.3, 1.8],
                x: [0, Math.cos((angle * Math.PI) / 180) * 65],
                y: [0, Math.sin((angle * Math.PI) / 180) * 65],
                rotate: [angle, angle - 20],
              }}
              transition={{
                duration: 1.6,
                delay: 0.12 + i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute origin-bottom"
            >
              <svg width="55" height="75" viewBox="0 0 55 75" fill="none" className="filter drop-shadow-sm">
                <path
                  d="M27 3 C42 15, 52 40, 38 68 C27 75, 12 68, 5 48 C-2 28, 12 12, 27 3 Z"
                  fill="url(#innerRoseGrad)"
                  stroke="#fda4af"
                  strokeWidth="0.8"
                />
              </svg>
            </motion.div>
          );
        })}

        {/* Center Bud unfurling with golden pollen and heart */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.4, 2.5], rotate: [0, 180] }}
          transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-200 shadow-xl flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-white/90 blur-[1px] animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Swirling flower petals bursting across the screen edges */}
      {Array.from({ length: 24 }).map((_, i) => {
        const rad = (Math.PI * 2 * i) / 24;
        const targetDist = 450 + (i % 5) * 80;
        const targetX = Math.cos(rad) * targetDist;
        const targetY = Math.sin(rad) * targetDist;
        const spin = (i % 2 === 0 ? 1 : -1) * (360 + i * 20);

        return (
          <motion.div
            key={`scatter-${i}`}
            initial={{ scale: 0, x: 0, y: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.2, 0.8],
              x: [0, targetX],
              y: [0, targetY],
              opacity: [0, 1, 0],
              rotate: [0, spin],
            }}
            transition={{
              duration: 1.8 + (i % 4) * 0.15,
              delay: 0.1 + (i % 6) * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute"
          >
            <svg width="34" height="46" viewBox="0 0 34 46" fill="none" className="filter drop-shadow-sm">
              <path
                d="M17 2 C28 10, 34 26, 25 42 C17 46, 8 42, 3 30 C-2 18, 7 8, 17 2 Z"
                fill={i % 3 === 0 ? '#f43f5e' : i % 2 === 0 ? '#fbcfe8' : '#ffffff'}
                stroke="#fda4af"
                strokeWidth="0.6"
              />
            </svg>
          </motion.div>
        );
      })}

      {/* SVG Linear Gradient Definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="outerRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="innerRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
