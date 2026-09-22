import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlyingSongAnimationProps {
  flyingSong: {
    title: string;
    artist: string;
    startX: number;
    startY: number;
  } | null;
  onAnimationEnd: () => void;
}

export const SongFlyingAnimation: React.FC<FlyingSongAnimationProps> = ({
  flyingSong,
  onAnimationEnd,
}) => {
  const [targetPos, setTargetPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 50 });

  useEffect(() => {
    const updateTarget = () => {
      // Find position of bottom player vinyl disc if it exists
      const discEl = document.getElementById('player-vinyl-anchor');
      if (discEl) {
        const rect = discEl.getBoundingClientRect();
        setTargetPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      } else {
        // Player target position at bottom center
        setTargetPos({ x: window.innerWidth / 2 - 140, y: window.innerHeight - 50 });
      }
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);
    return () => window.removeEventListener('resize', updateTarget);
  }, [flyingSong]);

  if (!flyingSong) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Flying Vinyl Record */}
        <motion.div
          initial={{
            left: flyingSong.startX,
            top: flyingSong.startY,
            scale: 0.9,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            left: [flyingSong.startX, (flyingSong.startX + targetPos.x) / 2 - 40, targetPos.x],
            top: [flyingSong.startY, (flyingSong.startY + targetPos.y) / 2 - 60, targetPos.y],
            scale: [1, 1.25, 0.75],
            rotate: [0, 240, 720],
            opacity: [1, 1, 0.9],
          }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={onAnimationEnd}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center filter drop-shadow-2xl"
          style={{ width: '68px', height: '68px' }}
        >
          {/* Realistic Mini Vinyl Disc */}
          <div className="relative w-full h-full rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center">
            {/* Grooves */}
            <div className="absolute inset-1.5 rounded-full border border-slate-700 opacity-60" />
            <div className="absolute inset-3 rounded-full border border-slate-700 opacity-60" />
            <div className="absolute inset-4.5 rounded-full border border-slate-700 opacity-60" />
            
            {/* Center Label */}
            <div className="w-6 h-6 rounded-full bg-rose-500 border border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Sparkle ring around it */}
            <div className="absolute -inset-2 rounded-full border-2 border-pink-400 opacity-75 animate-ping" />
          </div>
        </motion.div>

        {/* Trail notes & sparkles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{
              left: flyingSong.startX,
              top: flyingSong.startY,
              opacity: 0.8,
              scale: 0.6,
            }}
            animate={{
              left: (flyingSong.startX + targetPos.x) / 2 + (i * 24 - 36),
              top: (flyingSong.startY + targetPos.y) / 2 + (i * 18 - 20),
              opacity: 0,
              scale: 1.3,
            }}
            transition={{
              duration: 0.85,
              delay: 0.12 * i,
              ease: 'easeOut',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 font-bold text-lg select-none"
          >
            {i % 2 === 0 ? '🎵' : '✨'}
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};
