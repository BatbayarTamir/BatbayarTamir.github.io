import React, { useEffect, useState } from 'react';

interface OrchidTransitionOverlayProps {
  active: boolean;
  onComplete?: () => void;
}

interface OrchidPetal {
  id: number;
  startY: number;
  isLeft: boolean;
  delay: number;
  scale: number;
  rotation: number;
  driftX: number;
  driftY: number;
}

export const OrchidTransitionOverlay: React.FC<OrchidTransitionOverlayProps> = ({ active, onComplete }) => {
  const [petals, setPetals] = useState<OrchidPetal[]>([]);

  useEffect(() => {
    if (active) {
      const generated: OrchidPetal[] = Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        startY: Math.floor(Math.random() * 75) + 10,
        isLeft: i % 2 === 0,
        delay: (i * 0.08) + Math.random() * 0.2,
        scale: 0.8 + Math.random() * 0.45,
        rotation: Math.floor(Math.random() * 360),
        driftX: (i % 2 === 0 ? 1 : -1) * (Math.floor(Math.random() * 25) + 20),
        driftY: (Math.random() - 0.5) * 30,
      }));
      setPetals(generated);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2600);

      return () => clearTimeout(timer);
    } else {
      setPetals([]);
    }
  }, [active, onComplete]);

  if (!active && petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            top: `${p.startY}vh`,
            left: p.isLeft ? '-80px' : 'auto',
            right: !p.isLeft ? '-80px' : 'auto',
            animation: `orchidSwoop 2.8s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay}s forwards`,
          }}
        >
          <svg
            width={85 * p.scale}
            height={85 * p.scale}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-lg"
          >
            {/* White Orchid Petals */}
            <path
              d="M50 30 C40 10, 10 20, 25 45 C35 55, 50 35, 50 30 Z"
              fill="#ffffff"
              stroke="#fbcfe8"
              strokeWidth="1.5"
            />
            <path
              d="M50 30 C60 10, 90 20, 75 45 C65 55, 50 35, 50 30 Z"
              fill="#ffffff"
              stroke="#fbcfe8"
              strokeWidth="1.5"
            />
            <path
              d="M50 50 C20 50, 20 80, 45 75 C50 70, 50 55, 50 50 Z"
              fill="#fff1f2"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            <path
              d="M50 50 C80 50, 80 80, 55 75 C50 70, 50 55, 50 50 Z"
              fill="#fff1f2"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            {/* Center Orchid Lip */}
            <circle cx="50" cy="42" r="7.5" fill="#f43f5e" />
            <circle cx="50" cy="42" r="3.5" fill="#fef08a" />
            <circle cx="50" cy="42" r="1.5" fill="#e11d48" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes orchidSwoop {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          25% {
            opacity: 0.95;
            transform: translate(calc(var(--drift-x, 20vw) * 0.4), calc(var(--drift-y, -5vh) * 0.4)) scale(1.15) rotate(45deg);
          }
          70% {
            opacity: 1;
            transform: translate(var(--drift-x, 25vw), var(--drift-y, 10vh)) scale(1) rotate(90deg);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--drift-x, 25vw) * 1.3), calc(var(--drift-y, 10vh) * 1.3)) scale(0.8) rotate(140deg);
          }
        }
      `}</style>
    </div>
  );
};
