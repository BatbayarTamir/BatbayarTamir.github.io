import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Cake, Wind, Send, RotateCcw, Check } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

interface BirthdayCakePageProps {
  herName: string;
  isActive?: boolean;
}

export const BirthdayCakePage: React.FC<BirthdayCakePageProps> = ({ herName, isActive = false }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishText, setWishText] = useState('');
  const [lanterns, setLanterns] = useState<{ id: number; text: string; x: number }[]>([]);
  const [wishMade, setWishMade] = useState(false);

  // Formspree Integration using @formspree/react
  const [formState, handleSubmit] = useForm('mkjgorbk');

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);

    // Celebratory confetti cannons
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#ff758c', '#ff8fab', '#ffe4e6', '#ffd166', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.7 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.7 },
      });
    }, 250);
  };

  const handleRelight = () => {
    setCandlesLit(true);
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    // Release visual sky lantern
    const newLantern = {
      id: Date.now(),
      text: wishText.trim(),
      x: Math.floor(Math.random() * 60) + 20,
    };
    setLanterns((prev) => [...prev, newLantern]);
    setWishMade(true);

    // Extra gentle golden confetti
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.5 },
      colors: ['#fef08a', '#fbbf24', '#f43f5e'],
    });

    // Submit to Formspree endpoint
    await handleSubmit(e);
    setWishText('');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center select-none text-center pb-28 relative">
      {/* Floating Sky Lanterns in Background */}
      {lanterns.map((l) => (
        <div
          key={l.id}
          className="fixed pointer-events-none z-30 flex flex-col items-center animate-[floatSky_12s_ease-out_forwards]"
          style={{
            left: `${l.x}%`,
            bottom: '100px',
          }}
        >
          {/* Glowing paper lantern */}
          <div className="w-14 h-18 rounded-t-xl rounded-b-md bg-gradient-to-t from-amber-400 via-rose-300 to-amber-200 border border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.8)] flex items-center justify-center p-2 text-center text-[10px] font-serif font-bold text-amber-950">
            <span>{l.text}</span>
          </div>
          {/* Lantern Flame bottom */}
          <div className="w-3 h-3 rounded-full bg-yellow-300 animate-ping mt-0.5" />
        </div>
      ))}

      {/* Clean Header without floating badge */}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-800">
        Make A Birthday Wish!
      </h2>
      <p className="text-xs sm:text-sm text-rose-600/80 mt-1 max-w-sm">
        Close your eyes, make a heartfelt wish in your mind, and blow out the candles.
      </p>

      {/* Handcrafted Virtual Birthday Cake SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.6, delay: isActive ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
        className="relative my-6 flex flex-col items-center"
      >
        <svg
          width="260"
          height="230"
          viewBox="0 0 260 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-xl"
        >
          {/* Cake Stand / Plate */}
          <ellipse cx="130" cy="205" rx="115" ry="18" fill="#ffffff" stroke="#fbcfe8" strokeWidth="3" />
          <ellipse cx="130" cy="203" rx="100" ry="14" fill="#fff5f7" />

          {/* Bottom Cake Tier */}
          <rect x="40" y="140" width="180" height="60" rx="12" fill="#ffe4e6" stroke="#f472b6" strokeWidth="2" />
          {/* Frosting drips bottom tier */}
          <path
            d="M40 140 C55 158, 65 142, 80 156 C95 142, 105 160, 120 144 C135 158, 145 142, 160 156 C175 142, 185 158, 200 144 C210 154, 215 142, 220 140 Z"
            fill="#ffffff"
          />
          {/* Strawberry rosettes bottom tier */}
          <circle cx="65" cy="180" r="5" fill="#f43f5e" />
          <circle cx="105" cy="180" r="5" fill="#f43f5e" />
          <circle cx="155" cy="180" r="5" fill="#f43f5e" />
          <circle cx="195" cy="180" r="5" fill="#f43f5e" />

          {/* Top Cake Tier */}
          <rect x="65" y="90" width="130" height="50" rx="10" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
          {/* Frosting drips top tier */}
          <path
            d="M65 90 C78 104, 88 92, 100 102 C112 92, 120 106, 130 94 C142 104, 150 92, 162 102 C174 92, 182 104, 195 90 Z"
            fill="#ffffff"
          />
          {/* Sprinkles on top tier */}
          <rect x="85" y="120" width="8" height="2" rx="1" fill="#fb7185" transform="rotate(25 85 120)" />
          <rect x="115" y="118" width="8" height="2" rx="1" fill="#fbbf24" transform="rotate(-30 115 118)" />
          <rect x="145" y="122" width="8" height="2" rx="1" fill="#38bdf8" transform="rotate(45 145 122)" />
          <rect x="175" y="118" width="8" height="2" rx="1" fill="#a855f7" transform="rotate(-15 175 118)" />

          {/* 3 Birthday Candles */}
          {/* Left Candle */}
          <rect x="90" y="55" width="8" height="35" rx="3" fill="#fbcfe8" stroke="#f43f5e" strokeWidth="1" />
          <line x1="94" y1="55" x2="94" y2="48" stroke="#71717a" strokeWidth="1.5" />

          {/* Center Candle */}
          <rect x="126" y="50" width="8" height="40" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
          <line x1="130" y1="50" x2="130" y2="43" stroke="#71717a" strokeWidth="1.5" />

          {/* Right Candle */}
          <rect x="162" y="55" width="8" height="35" rx="3" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="166" y1="55" x2="166" y2="48" stroke="#71717a" strokeWidth="1.5" />

          {/* Candle Flames */}
          {candlesLit ? (
            <>
              {/* Flame 1 */}
              <g className="animate-candle-flame" style={{ transformOrigin: '94px 48px' }}>
                <ellipse cx="94" cy="38" rx="5" ry="9" fill="#fde047" />
                <ellipse cx="94" cy="40" rx="2.5" ry="5" fill="#f97316" />
                <circle cx="94" cy="38" r="7" fill="rgba(254, 240, 138, 0.4)" />
              </g>

              {/* Flame 2 */}
              <g className="animate-candle-flame" style={{ transformOrigin: '130px 43px', animationDelay: '0.2s' }}>
                <ellipse cx="130" cy="33" rx="6" ry="10" fill="#fde047" />
                <ellipse cx="130" cy="35" rx="3" ry="6" fill="#f97316" />
                <circle cx="130" cy="33" r="8" fill="rgba(254, 240, 138, 0.4)" />
              </g>

              {/* Flame 3 */}
              <g className="animate-candle-flame" style={{ transformOrigin: '166px 48px', animationDelay: '0.4s' }}>
                <ellipse cx="166" cy="38" rx="5" ry="9" fill="#fde047" />
                <ellipse cx="166" cy="40" rx="2.5" ry="5" fill="#f97316" />
                <circle cx="166" cy="38" r="7" fill="rgba(254, 240, 138, 0.4)" />
              </g>
            </>
          ) : (
            /* Delicate smoke puffs */
            <g className="opacity-60">
              <circle cx="94" cy="42" r="3" fill="#cbd5e1" />
              <circle cx="130" cy="37" r="4" fill="#cbd5e1" />
              <circle cx="166" cy="42" r="3" fill="#cbd5e1" />
            </g>
          )}
        </svg>

        {/* Glow halo under the cake */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pink-300/30 to-amber-200/20 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Blow / Relight Action Buttons */}
      <div className="flex items-center gap-3">
        {candlesLit ? (
          <button
            id="blow-candles-button"
            onClick={handleBlowCandles}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-sans font-bold text-sm sm:text-base shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Wind className="w-5 h-5 animate-pulse" />
            <span>Blow Out The Candles 🎂</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-300">
            <span className="text-sm font-serif font-bold text-rose-700">
              🎉 Happy Birthday, {herName}! May all your wishes come true!
            </span>
            <button
              onClick={handleRelight}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-rose-600 text-xs font-semibold border border-rose-200 shadow-sm hover:bg-rose-50 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight Candles</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Sky Lantern: Formspree Connected Form */}
      <div className="mt-8 w-full glass-panel p-5 rounded-3xl text-left border border-white/90 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Release A Birthday Sky Lantern</span>
        </div>
        <p className="text-xs text-rose-900/80 mb-3">
          Type a secret birthday wish or dream. It floats into the night sky and sends directly to his inbox!
        </p>

        {formState.succeeded ? (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Your wish has been released to the stars and delivered straight to his heart! ✨🏮</span>
          </div>
        ) : (
          <form onSubmit={onFormSubmit} className="space-y-2">
            <input
              type="hidden"
              name="_subject"
              value={`Birthday Wish from ${herName}!`}
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="birthdayWish"
                required
                placeholder="e.g. Endless laughter, good health, and our next adventure together..."
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-xs sm:text-sm text-slate-800"
              />
              <button
                type="submit"
                disabled={formState.submitting}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 active:scale-95 transition-all flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                <span>{formState.submitting ? 'Releasing...' : 'Release'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <ValidationError prefix="Wish" field="birthdayWish" errors={formState.errors} />
          </form>
        )}

        {wishMade && !formState.succeeded && (
          <p className="mt-2 text-[11px] text-amber-600 font-medium italic">
            ✨ Your lantern is floating towards the stars...
          </p>
        )}
      </div>

      <style>{`
        @keyframes floatSky {
          0% {
            transform: translateY(0) scale(0.9) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-50vh) scale(0.95) rotate(4deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-110vh) scale(0.6) rotate(-6deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
