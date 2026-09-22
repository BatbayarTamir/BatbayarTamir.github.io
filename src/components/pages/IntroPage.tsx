import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IntroPageProps {
  herName: string;
  herNickname: string;
  isActive?: boolean;
  onDiveIn: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ herName, herNickname, isActive = true, onDiveIn }) => {
  const [clicked, setClicked] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; top: string; left: string; size: number; delay: number }>>([]);
  const [noClickCount, setNoClickCount] = useState(0);

  const NO_BUTTON_TEXTS = [
    "No",
    "Are you sure? 🥺",
    "Pleasee?? 🥺👉👈",
    "Why not?? 💔",
    "You really don't wanna see your gift? 😭",
    "Just tap Dive In already haha! ❤️",
    "Pretty please with a cherry on top? 🍒",
    "Okay you're definitely teasing me now! 🥰 Tap Dive In!",
  ];

  // Typewriter states
  const title1Full = "Happy Birthday,";
  const title2Word = herNickname || herName || "Beloved";
  const subtitleFull = "To my favorite person in the entire world. A quiet, loving corner designed to celebrate the magic of you.";

  const [title1Text, setTitle1Text] = useState("");
  const [title2Text, setTitle2Text] = useState("");
  const [showDot, setShowDot] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  const [isTypingFinished, setIsTypingFinished] = useState(false);

  useEffect(() => {
    // Gentle twinkling stardust
    const generated = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 85 + 5}%`,
      left: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3,
    }));
    setStars(generated);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTitle1Text("");
      setTitle2Text("");
      setShowDot(false);
      setSubtitleText("");
      setIsTypingFinished(false);
      return;
    }

    let t1Idx = 0;
    let t2Idx = 0;
    let subIdx = 0;

    let timeoutId: NodeJS.Timeout;

    // Step 1: Type "Happy Birthday,"
    const typeTitle1 = () => {
      if (t1Idx < title1Full.length) {
        setTitle1Text(title1Full.slice(0, t1Idx + 1));
        t1Idx++;
        timeoutId = setTimeout(typeTitle1, 55 + Math.floor(Math.random() * 25));
      } else {
        timeoutId = setTimeout(typeTitle2, 250);
      }
    };

    // Step 2: Type "Beloved"
    const typeTitle2 = () => {
      if (t2Idx < title2Word.length) {
        setTitle2Text(title2Word.slice(0, t2Idx + 1));
        t2Idx++;
        timeoutId = setTimeout(typeTitle2, 70 + Math.floor(Math.random() * 30));
      } else {
        setShowDot(true);
        timeoutId = setTimeout(typeSubtitle, 350);
      }
    };

    // Step 3: Type Subtitle
    const typeSubtitle = () => {
      if (subIdx < subtitleFull.length) {
        setSubtitleText(subtitleFull.slice(0, subIdx + 1));
        subIdx++;
        const char = subtitleFull[subIdx - 1];
        const delay = char === '.' || char === ',' ? 180 : 25 + Math.floor(Math.random() * 15);
        timeoutId = setTimeout(typeSubtitle, delay);
      } else {
        setIsTypingFinished(true);
      }
    };

    timeoutId = setTimeout(typeTitle1, 300);

    return () => clearTimeout(timeoutId);
  }, [title2Word, isActive]);

  const handleClickDiveIn = () => {
    setClicked(true);
    onDiveIn();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center select-none relative z-10 overflow-hidden">
      {/* Ambient Twinkling Floating Stardust Elements */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.15, 0.8, 0.15],
            scale: [0.8, 1.25, 0.8],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3.5 + (star.id % 3),
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute pointer-events-none text-rose-300/60"
          style={{ top: star.top, left: star.left }}
        >
          <Sparkles style={{ width: star.size, height: star.size }} />
        </motion.div>
      ))}

      {/* Floating Glowing Heart Halo behind title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-rose-200/40 via-pink-200/30 to-amber-100/20 blur-3xl pointer-events-none"
      />

      <div className="max-w-2xl mx-auto flex flex-col items-center relative z-10">
        {/* Grand Romantic Typewritten Title */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-rose-800 tracking-tight leading-[1.08] drop-shadow-sm min-h-[140px] sm:min-h-[190px]">
          <span className="block">{title1Text}</span>
          <span className="inline-block text-rose-950 italic underline decoration-rose-300 decoration-wavy decoration-2 sm:decoration-4 relative mt-1 sm:mt-2">
            {title2Text}
            {/* Blinking dot at the end of Beloved */}
            {showDot && (
              <span className="inline-block text-rose-600 font-serif font-black ml-0.5 animate-[pulse_0.8s_infinite] select-none">
                .
              </span>
            )}
            {!showDot && title1Text.length > 0 && (
              <span className="inline-block w-1 h-8 sm:h-12 bg-rose-500 ml-1 animate-pulse align-middle" />
            )}
          </span>
        </h1>

        {/* Intimate Subtitle with Typewriter typing */}
        <p className="mt-6 sm:mt-8 text-base sm:text-xl text-rose-800/85 font-sans max-w-lg leading-relaxed font-light min-h-[60px] sm:min-h-[70px]">
          {subtitleText}
          {!isTypingFinished && showDot && (
            <span className="inline-block w-0.5 h-4 sm:h-5 bg-rose-500 ml-1 animate-pulse align-middle" />
          )}
        </p>

        {/* Pulsing Dive In Button & Humorous No Button */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{
            opacity: isTypingFinished ? 1 : 0,
            y: isTypingFinished ? 0 : 24,
            scale: isTypingFinished ? (1 + Math.min(noClickCount * 0.03, 0.22)) : 0.9,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`mt-10 sm:mt-12 flex flex-col items-center gap-3 ${!isTypingFinished ? 'pointer-events-none' : ''}`}
        >
          <motion.button
            id="dive-in-button"
            onClick={handleClickDiveIn}
            disabled={clicked}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="group relative inline-flex items-center gap-3.5 px-12 sm:px-16 py-4 sm:py-5 rounded-full bg-white text-rose-600 font-sans font-semibold text-base sm:text-lg border-2 border-white shadow-[0_14px_36px_rgba(225,29,72,0.22)] hover:shadow-[0_20px_45px_rgba(225,29,72,0.32)] transition-all duration-300 cursor-pointer"
          >
            {/* Shimmer effect inside button */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-rose-100/50 to-transparent skew-x-12"
              />
            </div>

            <span className="relative z-10 tracking-wide">Dive In</span>
            <span className="text-xl group-hover:rotate-12 transition-transform duration-300 relative z-10">✨</span>
            <ArrowRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />

            {/* Glowing outer pulse */}
            <span className="absolute -inset-1 rounded-full border border-rose-300/60 animate-ping pointer-events-none opacity-40" />
          </motion.button>

          {/* Humorous Playful "No" button */}
          <motion.button
            id="intro-no-button"
            type="button"
            onClick={() => setNoClickCount((prev) => prev + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92, rotate: [-2, 2, 0] }}
            className="mt-1 px-4 py-1.5 rounded-full bg-transparent hover:bg-white/40 text-xs sm:text-sm text-rose-600/70 hover:text-rose-800 font-medium transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-200/60 flex items-center gap-1.5"
          >
            <span>{NO_BUTTON_TEXTS[Math.min(noClickCount, NO_BUTTON_TEXTS.length - 1)]}</span>
          </motion.button>
        </motion.div>

        {/* Soft breathing note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingFinished ? [0.4, 0.8, 0.4] : 0 }}
          transition={{ duration: 3, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-8 text-xs sm:text-sm text-rose-600/70 font-sans flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>Made with all my heart</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        </motion.div>
      </div>
    </div>
  );
};
