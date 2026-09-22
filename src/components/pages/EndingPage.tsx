import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCcw, Music, Stars, Gift, Check, Flame, Send } from 'lucide-react';

interface EndingPageProps {
  herName: string;
  hisName?: string;
  herNickname?: string;
  isActive?: boolean;
  onRestart: () => void;
  onGoToMixtape: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  emoji?: string;
  rotation: number;
  vx: number;
  vy: number;
}

const FULL_CLOSING_TEXT = "That's it, A heartfelt gift for you.";

export const EndingPage: React.FC<EndingPageProps> = ({
  herName,
  hisName = 'Batbayar',
  herNickname,
  isActive = false,
  onRestart,
  onGoToMixtape,
}) => {
  // Typing Effect State
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);
  const [isGiftOpened, setIsGiftOpened] = useState<boolean>(false);

  // Particles & Celebration
  const [particles, setParticles] = useState<Particle[]>([]);
  const [heartsCount, setHeartsCount] = useState<number>(0);
  const [showHeartburst, setShowHeartburst] = useState<boolean>(false);

  // Auto-typing animation effect: triggers ONLY when user reaches this page (isActive = true)
  useEffect(() => {
    if (!isActive) {
      setTypedText('');
      setIsTypingComplete(false);
      setShowGiftAnimation(false);
      setIsGiftOpened(false);
      setParticles([]);
      return;
    }

    let typingInterval: NodeJS.Timeout | null = null;
    let giftStage1Timer: NodeJS.Timeout | null = null;
    let giftStage2Timer: NodeJS.Timeout | null = null;

    // Small delay allowing the page slide animation to settle before starting typing
    const startDelayTimer = setTimeout(() => {
      let index = 0;
      setTypedText('');
      setIsTypingComplete(false);
      setShowGiftAnimation(false);
      setIsGiftOpened(false);

      typingInterval = setInterval(() => {
        if (index < FULL_CLOSING_TEXT.length) {
          setTypedText(FULL_CLOSING_TEXT.slice(0, index + 1));
          index++;
        } else {
          if (typingInterval) clearInterval(typingInterval);
          setIsTypingComplete(true);
          // After typing finishes, trigger complex gift unfolding
          giftStage1Timer = setTimeout(() => {
            setShowGiftAnimation(true);
            giftStage2Timer = setTimeout(() => {
              setIsGiftOpened(true);
              triggerInitialCelebration();
            }, 800);
          }, 600);
        }
      }, 65);
    }, 450);

    return () => {
      clearTimeout(startDelayTimer);
      if (typingInterval) clearInterval(typingInterval);
      if (giftStage1Timer) clearTimeout(giftStage1Timer);
      if (giftStage2Timer) clearTimeout(giftStage2Timer);
    };
  }, [isActive]);

  const triggerInitialCelebration = () => {
    const emojis = ['💖', '🌸', '✨', '🎂', '💌', '🤍', '🎉', '⭐', '💎', '🌷'];
    const newParticles: Particle[] = Array.from({ length: 32 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 20,
      color: ['#f43f5e', '#ec4899', '#fb7185', '#f59e0b', '#fbbf24', '#e11d48'][i % 6],
      size: Math.random() * 18 + 18,
      emoji: emojis[i % emojis.length],
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 160,
      vy: -100 - Math.random() * 150,
    }));
    setParticles((prev) => [...prev.slice(-40), ...newParticles]);
  };

  const handleCelebrate = () => {
    setHeartsCount((prev) => prev + 1);
    setShowHeartburst(true);
    setTimeout(() => setShowHeartburst(false), 800);

    const emojis = ['💖', '🌸', '✨', '🎂', '💌', '🤍', '🎉', '🌹', '👑', '🕊️'];
    const newParticles: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 70 + (Math.random() - 0.5) * 15,
      color: ['#f43f5e', '#ec4899', '#fb7185', '#f59e0b', '#fbbf24'][i % 5],
      size: Math.random() * 18 + 18,
      emoji: emojis[i % emojis.length],
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 200,
      vy: -120 - Math.random() * 180,
    }));

    setParticles((prev) => [...prev.slice(-50), ...newParticles]);
  };

  const handleReplayAnimation = () => {
    setTypedText('');
    setIsTypingComplete(false);
    setShowGiftAnimation(false);
    setIsGiftOpened(false);
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < FULL_CLOSING_TEXT.length) {
        setTypedText(FULL_CLOSING_TEXT.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setShowGiftAnimation(true);
          setTimeout(() => {
            setIsGiftOpened(true);
            triggerInitialCelebration();
          }, 800);
        }, 600);
      }
    }, 60);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center select-none text-center min-h-[80vh] relative overflow-hidden">
      {/* Floating Celebration Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0.4, y: 0, x: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0.4, 1.3, 0.8],
            y: p.vy,
            x: p.vx,
            rotate: p.rotation + 180,
          }}
          transition={{ duration: 2.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute pointer-events-none text-2xl sm:text-3xl z-40 filter drop-shadow-sm"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* ===================== COMPLEX CLOSING ANIMATION CONTAINER ===================== */}

      {/* 1. Concentric Aurora Rings in Background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 overflow-hidden">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ rotate: { duration: 35, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
          className="w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] rounded-full border border-rose-300/30 border-dashed"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1.05, 0.95, 1.05] }}
          transition={{ rotate: { duration: 45, repeat: Infinity, ease: 'linear' }, scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' } }}
          className="w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full border border-pink-400/25"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-72 h-72 rounded-full bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-amber-100/20 blur-3xl"
        />
      </div>

      {/* 2. Top Typing Effect Hero Presentation */}
      <div className="flex flex-col items-center mb-6 z-20">
        {/* Soft Golden Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200/90 text-rose-800 text-xs font-semibold shadow-xs mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Handcrafted For {herName} {herNickname ? `(${herNickname})` : ''}</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
        </motion.div>

        {/* TYPING EFFECT HEADING: "That's it, A heartfelt gift for you." */}
        <div className="min-h-[72px] sm:min-h-[88px] flex items-center justify-center">
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-rose-950 tracking-tight leading-tight">
            {typedText}
            {/* Romantic Pulsing Cursor */}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block ml-1 w-1 sm:w-1.5 h-7 sm:h-12 bg-rose-600 align-middle rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            />
          </h2>
        </div>

        {/* Subtitle that fades in once typing begins to finish */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isTypingComplete ? 1 : 0.4, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif italic text-sm sm:text-base text-rose-700/80 mt-2 max-w-md"
        >
          Every melody, photo, memory, and word was woven together for you.
        </motion.p>
      </div>

      {/* 3. Central Complex Blossoming Gift Capsule Animation */}
      <AnimatePresence>
        {showGiftAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-4 flex items-center justify-center z-20"
          >
            {/* Shockwave halo rings when opened */}
            {isGiftOpened && (
              <>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{ scale: [0.8, 2.2], opacity: [0.8, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute w-40 h-40 rounded-full border-2 border-rose-400 pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: [0.6, 2.8], opacity: [0.9, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                  className="absolute w-48 h-48 rounded-full border border-pink-300 pointer-events-none"
                />
              </>
            )}

            {/* Central Heartbeat Hologram / Gift Center */}
            <div
              onClick={handleCelebrate}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 shadow-2xl shadow-rose-500/35 flex items-center justify-center cursor-pointer border-2 border-white/80 group hover:scale-105 transition-transform"
              title="Tap to shower with love!"
            >
              {/* Inner ambient glow */}
              <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Pulsing Central Heart with Heartbeat sequence */}
              <motion.div
                animate={
                  isGiftOpened
                    ? {
                        scale: [1, 1.16, 1, 1.08, 1],
                        rotate: [-2, 2, -2],
                      }
                    : {
                        scale: 1,
                        rotate: 0,
                      }
                }
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center text-white"
              >
                <Heart className="w-14 h-14 sm:w-16 sm:h-16 fill-white drop-shadow-md" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin" />
              </motion.div>

              {/* Little Floating Orbiting Keepsake Charms */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-14px] pointer-events-none"
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-sm">✨</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm">🌸</span>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm">💖</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm">⭐</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Keepsake Plaque with Personal Letter & Signoff */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: isGiftOpened ? 1 : 0, y: isGiftOpened ? 0 : 24 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-xl mx-auto mt-4 p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-200/90 shadow-xl text-left space-y-4 relative z-20"
      >
        <div className="flex items-center justify-between pb-2 border-b border-rose-100">
          <span className="font-serif font-bold text-xs uppercase tracking-widest text-rose-600">
            A Keepsake For Sara
          </span>
          <span className="text-[11px] font-sans text-slate-400">
            Forever Cherished
          </span>
        </div>

        <p className="font-serif text-base sm:text-lg text-rose-950 leading-relaxed">
          Even if distance, busy schedules, or circumstance keep us apart right now, I built this sanctuary so you would always have a place to come back to—a quiet reminder of how deeply loved and appreciated you truly are.
        </p>

        <p className="font-serif text-base sm:text-lg text-rose-950 leading-relaxed">
          May your year ahead be showered with endless laughter, gentle days, and every secret dream you hold in your heart. You deserve all the tenderness this world can offer.
        </p>

        {/* Signature & Wax Seal */}
        <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-rose-700">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Always & forever in my heart</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Embossed Wax Seal Badge */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-700 text-white font-serif font-black text-xs flex items-center justify-center shadow-md border-2 border-red-300/60 rotate-[-6deg]">
              <span>B♡S</span>
            </div>
            <span className="font-serif font-bold text-lg sm:text-xl text-rose-950">
              {hisName} ♡
            </span>
          </div>
        </div>
      </motion.div>

      {/* 5. Interactive Celebration Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: isGiftOpened ? 1 : 0, y: isGiftOpened ? 0 : 16 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-7 flex flex-wrap items-center justify-center gap-3 z-20"
      >
        {/* Love Shower Celebration Cannon */}
        <motion.button
          type="button"
          onClick={handleCelebrate}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>Shower {herName} with Love {heartsCount > 0 ? `(${heartsCount})` : '🎉'}</span>
        </motion.button>

        {/* Replay Closing Animation Button */}
        <button
          type="button"
          onClick={handleReplayAnimation}
          className="px-4 py-3 rounded-full bg-white/90 hover:bg-white text-rose-800 text-xs font-semibold border border-rose-200/90 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          title="Replay closing typing and gift animation"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Replay Animation</span>
        </button>

        {/* Revisit Chapter 1 */}
        <button
          type="button"
          onClick={onRestart}
          className="px-4 py-3 rounded-full bg-white/90 hover:bg-white text-rose-800 text-xs font-semibold border border-rose-200/90 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Revisit Chapter 1</span>
        </button>

        {/* Jump to Mixtape */}
        <button
          type="button"
          onClick={onGoToMixtape}
          className="px-4 py-3 rounded-full bg-white/90 hover:bg-white text-rose-800 text-xs font-semibold border border-rose-200/90 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Music className="w-3.5 h-3.5 text-rose-600" />
          <span>Our Mixtape</span>
        </button>
      </motion.div>
    </div>
  );
};

