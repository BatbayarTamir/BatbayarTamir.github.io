import React, { useMemo } from 'react';

export type BackgroundTheme = 'romantic' | 'nexz-cyber' | 'nexz-saucin';

interface LiveBackgroundProps {
  isIntro: boolean;
  isNexzTheme?: boolean;
  theme?: BackgroundTheme;
}

type FloatingItemType =
  | 'small-heart'
  | 'med-heart'
  | 'small-flower'
  | 'med-flower'
  | 'mustard-bottle'
  | 'sauce-bottle'
  | 'sauce-drip'
  | 'mustard-drip'
  | 'cyber-spark';

interface FloatingElement {
  id: number;
  type: FloatingItemType;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
  rotation: number;
}

export const LiveBackground: React.FC<LiveBackgroundProps> = ({
  isIntro,
  isNexzTheme = false,
  theme = isNexzTheme ? 'nexz-cyber' : 'romantic',
}) => {
  // If isNexzTheme boolean passed, map to theme if theme not explicitly saucin
  const currentTheme: BackgroundTheme = theme || (isNexzTheme ? 'nexz-cyber' : 'romantic');

  // Pre-generate collection of floating elements based on theme
  const floatingElements = useMemo<FloatingElement[]>(() => {
    let types: FloatingItemType[] = [];

    if (currentTheme === 'nexz-saucin') {
      types = [
        'mustard-bottle',
        'sauce-bottle',
        'sauce-drip',
        'mustard-drip',
        'mustard-bottle',
        'sauce-drip',
        'sauce-bottle',
        'mustard-drip',
        'mustard-bottle',
        'sauce-bottle',
        'sauce-drip',
        'mustard-drip',
        'sauce-bottle',
        'mustard-bottle',
      ];
    } else if (currentTheme === 'nexz-cyber') {
      types = [
        'cyber-spark',
        'small-heart',
        'cyber-spark',
        'med-heart',
        'cyber-spark',
        'small-heart',
        'cyber-spark',
        'med-heart',
      ];
    } else {
      types = [
        'small-heart',
        'med-heart',
        'small-flower',
        'med-flower',
        'small-heart',
        'small-flower',
        'med-heart',
        'med-flower',
        'small-heart',
        'med-heart',
        'small-flower',
        'small-heart',
        'med-flower',
        'small-flower',
      ];
    }

    return types.map((type, i) => {
      let size = 20;
      if (type === 'small-heart') size = Math.floor(Math.random() * 4) + 13;
      else if (type === 'med-heart') size = Math.floor(Math.random() * 6) + 19;
      else if (type === 'small-flower') size = Math.floor(Math.random() * 4) + 15;
      else if (type === 'med-flower') size = Math.floor(Math.random() * 6) + 24;
      else if (type === 'mustard-bottle' || type === 'sauce-bottle') size = Math.floor(Math.random() * 10) + 32; // 32-42px
      else if (type === 'sauce-drip' || type === 'mustard-drip') size = Math.floor(Math.random() * 8) + 22; // 22-30px
      else if (type === 'cyber-spark') size = Math.floor(Math.random() * 6) + 16;

      return {
        id: i,
        type,
        size,
        left: Math.floor(Math.random() * 90) + 5,
        top: Math.floor(Math.random() * 88) + 6,
        duration: Math.floor(Math.random() * 8) + 12,
        delay: Math.floor(Math.random() * 5),
        opacity: currentTheme === 'nexz-saucin' ? Math.random() * 0.35 + 0.55 : Math.random() * 0.25 + 0.3,
        rotation: Math.floor(Math.random() * 60) - 30,
      };
    });
  }, [currentTheme]);

  // Background base color
  const getBackgroundColor = () => {
    if (currentTheme === 'nexz-saucin') {
      return '#3b0a0d'; // Deep warm crimson barbecue red
    }
    if (currentTheme === 'nexz-cyber') {
      return '#080d1a'; // Deep cyberpunk indigo slate
    }
    return isIntro ? '#fce7dc' : '#fdfaf6';
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000"
      style={{ background: getBackgroundColor() }}
    >
      {/* Cyber Grid pattern if NEXZ Cyber theme */}
      {currentTheme === 'nexz-cyber' && (
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(6,182,212,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.18) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Sauce Drip Street Grid / Splatters for Saucin theme */}
      {currentTheme === 'nexz-saucin' && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(234, 179, 8, 0.4) 1.5px, transparent 1.5px), radial-gradient(circle, rgba(239, 68, 68, 0.35) 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
          }}
        />
      )}

      {/* Dynamic Animated Blobs in Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob 1 */}
        <div
          className="absolute rounded-full filter blur-3xl transition-all duration-1000 opacity-75"
          style={{
            width: isIntro ? '80vw' : '65vw',
            height: isIntro ? '80vw' : '65vw',
            background:
              currentTheme === 'nexz-saucin'
                ? 'radial-gradient(circle, rgba(220,38,38,0.92) 0%, rgba(185,28,28,0.5) 60%, transparent 100%)' // Hot Ketchup Red
                : currentTheme === 'nexz-cyber'
                ? 'radial-gradient(circle, rgba(6,182,212,0.75) 0%, rgba(14,165,233,0.3) 70%, transparent 100%)'
                : 'radial-gradient(circle, rgba(255,143,171,0.85) 0%, rgba(255,182,193,0.4) 70%, transparent 100%)',
            top: '-15%',
            left: '-10%',
            animation: isIntro
              ? 'moveBlob1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate'
              : 'moveBlobSlow 26s ease-in-out infinite alternate',
          }}
        />

        {/* Blob 2 */}
        <div
          className="absolute rounded-full filter blur-3xl transition-all duration-1000 opacity-75"
          style={{
            width: isIntro ? '85vw' : '70vw',
            height: isIntro ? '85vw' : '70vw',
            background:
              currentTheme === 'nexz-saucin'
                ? 'radial-gradient(circle, rgba(245,158,11,0.92) 0%, rgba(234,179,8,0.55) 65%, transparent 100%)' // Golden Mustard Yellow
                : currentTheme === 'nexz-cyber'
                ? 'radial-gradient(circle, rgba(16,185,129,0.7) 0%, rgba(5,150,105,0.3) 65%, transparent 100%)'
                : 'radial-gradient(circle, rgba(255,117,140,0.8) 0%, rgba(254,205,211,0.4) 65%, transparent 100%)',
            bottom: '-25%',
            right: '-15%',
            animation: isIntro
              ? 'moveBlob2 7s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate-reverse'
              : 'moveBlobSlow 28s ease-in-out infinite alternate-reverse',
          }}
        />

        {/* Blob 3 */}
        <div
          className="absolute rounded-full filter blur-3xl transition-all duration-1000 opacity-70"
          style={{
            width: '60vw',
            height: '60vw',
            background:
              currentTheme === 'nexz-saucin'
                ? 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(251,191,36,0.5) 60%, transparent 100%)' // Sizzling Flame Blend
                : currentTheme === 'nexz-cyber'
                ? 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(99,102,241,0.25) 60%, transparent 100%)'
                : 'radial-gradient(circle, rgba(255,243,230,0.95) 0%, rgba(255,228,230,0.5) 60%, transparent 100%)',
            top: '25%',
            left: '25%',
            animation: 'moveBlob3 18s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Floating Elements (Mustard bottles, Sauce bottles, Splashes, or Romantic Florals) */}
      <div className="absolute inset-0">
        {floatingElements.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-none transition-transform"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              opacity: item.opacity,
              animation: `floatFlowerHeart ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
              transform: `rotate(${item.rotation}deg)`,
            }}
          >
            {/* 1. Mustard Squeeze Bottle */}
            {item.type === 'mustard-bottle' && (
              <svg
                width={item.size * 0.9}
                height={item.size * 1.5}
                viewBox="0 0 40 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_4px_10px_rgba(234,179,8,0.4)]"
              >
                {/* Nozzle / Tip */}
                <polygon points="18,2 22,2 21,12 19,12" fill="#ef4444" />
                {/* Bottle Neck & Cap */}
                <rect x="15" y="12" width="10" height="5" rx="1.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                {/* Bottle Body */}
                <rect x="8" y="17" width="24" height="46" rx="7" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                {/* Bottle Red Label Badge */}
                <rect x="11" y="28" width="18" height="24" rx="3" fill="#b91c1c" />
                <text x="20" y="42" fill="#fef08a" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  MUSTARD
                </text>
                {/* Glossy highlight curve */}
                <path d="M12 21 Q14 38 12 55" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}

            {/* 2. Sauce / Ketchup Squeeze Bottle */}
            {item.type === 'sauce-bottle' && (
              <svg
                width={item.size * 0.9}
                height={item.size * 1.5}
                viewBox="0 0 40 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_4px_10px_rgba(220,38,38,0.45)]"
              >
                {/* Nozzle / Tip */}
                <polygon points="18,2 22,2 21,12 19,12" fill="#facc15" />
                {/* Bottle Neck & Cap */}
                <rect x="15" y="12" width="10" height="5" rx="1.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                {/* Bottle Body */}
                <rect x="8" y="17" width="24" height="46" rx="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                {/* Yellow Sauce Label Badge */}
                <rect x="11" y="28" width="18" height="24" rx="3" fill="#facc15" />
                <text x="20" y="42" fill="#991b1b" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  SAUCE
                </text>
                {/* Glossy highlight curve */}
                <path d="M12 21 Q14 38 12 55" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}

            {/* 3. Glossy Red Sauce Splash / Droplet */}
            {item.type === 'sauce-drip' && (
              <svg
                width={item.size}
                height={item.size * 1.2}
                viewBox="0 0 30 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)]"
              >
                <path
                  d="M15 2 C18 10, 28 20, 26 27 C24 33, 18 35, 15 35 C12 35, 6 33, 4 27 C2 20, 12 10, 15 2 Z"
                  fill="#ef4444"
                />
                <ellipse cx="11" cy="24" rx="2.5" ry="4" fill="rgba(255,255,255,0.55)" transform="rotate(-20 11 24)" />
              </svg>
            )}

            {/* 4. Golden Mustard Swirl / Droplet */}
            {item.type === 'mustard-drip' && (
              <svg
                width={item.size}
                height={item.size * 1.2}
                viewBox="0 0 30 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)]"
              >
                <path
                  d="M15 2 C18 10, 28 20, 26 27 C24 33, 18 35, 15 35 C12 35, 6 33, 4 27 C2 20, 12 10, 15 2 Z"
                  fill="#eab308"
                />
                <circle cx="15" cy="26" r="4" fill="#ca8a04" fillOpacity="0.4" />
                <ellipse cx="11" cy="24" rx="2.5" ry="4" fill="rgba(255,255,255,0.6)" transform="rotate(-20 11 24)" />
              </svg>
            )}

            {/* 5. Cyber Spark for NEXZ Cyber */}
            {item.type === 'cyber-spark' && (
              <svg
                width={item.size}
                height={item.size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              >
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  fill="#06b6d4"
                />
              </svg>
            )}

            {/* 6. Romantic Small/Med Heart */}
            {(item.type === 'small-heart' || item.type === 'med-heart') && (
              <svg
                width={item.size}
                height={item.size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-sm"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={currentTheme === 'nexz-cyber' ? '#06b6d4' : '#f43f5e'}
                  fillOpacity="0.75"
                />
              </svg>
            )}

            {/* 7. Romantic Sakura Flower */}
            {(item.type === 'small-flower' || item.type === 'med-flower') && (
              <svg
                width={item.size}
                height={item.size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-sm"
              >
                <ellipse cx="16" cy="8" rx="4.5" ry="6.5" fill="#fbcfe8" fillOpacity="0.85" />
                <ellipse cx="24" cy="13" rx="4.5" ry="6.5" fill="#fbcfe8" fillOpacity="0.85" transform="rotate(72 24 13)" />
                <ellipse cx="21" cy="23" rx="4.5" ry="6.5" fill="#fbcfe8" fillOpacity="0.85" transform="rotate(144 21 23)" />
                <ellipse cx="11" cy="23" rx="4.5" ry="6.5" fill="#fbcfe8" fillOpacity="0.85" transform="rotate(216 11 23)" />
                <ellipse cx="8" cy="13" rx="4.5" ry="6.5" fill="#fbcfe8" fillOpacity="0.85" transform="rotate(288 8 13)" />
                <circle cx="16" cy="16" r="3.2" fill="#fb7185" />
                <circle cx="16" cy="16" r="1.5" fill="#fef08a" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes moveBlob1 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(15vw, 12vh) scale(1.15) rotate(35deg); }
          100% { transform: translate(-10vw, -15vh) scale(0.92) rotate(-15deg); }
        }
        @keyframes moveBlob2 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-14vw, -10vh) scale(1.18) rotate(-40deg); }
          100% { transform: translate(12vw, 14vh) scale(0.9) rotate(20deg); }
        }
        @keyframes moveBlob3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-8vw, 8vh) scale(1.1); }
        }
        @keyframes moveBlobSlow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5vw, 4vh) scale(1.06); }
          100% { transform: translate(-4vw, -5vh) scale(0.96); }
        }
        @keyframes floatFlowerHeart {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-35px) translateX(12px) rotate(25deg); }
          100% { transform: translateY(-70px) translateX(-8px) rotate(-15deg); }
        }
      `}</style>
    </div>
  );
};
