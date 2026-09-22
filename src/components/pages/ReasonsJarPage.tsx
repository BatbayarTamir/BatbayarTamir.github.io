import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Shuffle, Eye, X } from 'lucide-react';

interface ReasonsJarPageProps {
  reasons: string[];
  isActive?: boolean;
}

export const ReasonsJarPage: React.FC<ReasonsJarPageProps> = ({ reasons, isActive = false }) => {
  const [currentReason, setCurrentReason] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [openedIndices, setOpenedIndices] = useState<number[]>([0]);
  const [isPulling, setIsPulling] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  const drawRandomReason = () => {
    if (isPulling) return;
    setIsPulling(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * reasons.length);
      setCurrentIndex(randomIndex);
      setCurrentReason(reasons[randomIndex]);
      if (!openedIndices.includes(randomIndex)) {
        setOpenedIndices((prev) => [...prev, randomIndex]);
      }
      setIsPulling(false);
    }, 450);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center select-none text-center pb-24">
      {/* Header */}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-800">
        Reasons Why I Love You
      </h2>
      <p className="text-xs sm:text-sm text-rose-600/80 mt-1 max-w-sm">
        Tap the glass jar to unfold a randomized folded heart note.
      </p>

      {/* Progress pill */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          Discovered {openedIndices.length} / {reasons.length} notes
        </span>
        <button
          onClick={() => setShowAllModal(true)}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 underline underline-offset-2"
        >
          <Eye className="w-3 h-3" />
          <span>View All</span>
        </button>
      </div>

      {/* Interactive Glass Jar Graphic */}
      <motion.div
        id="reasons-jar-graphic"
        onClick={drawRandomReason}
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 25 }}
        transition={{ duration: 0.55, delay: isActive ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
        className={`relative my-6 w-48 sm:w-56 h-60 sm:h-68 rounded-b-[48px] rounded-t-2xl border-4 border-white/90 bg-gradient-to-b from-white/30 via-pink-100/40 to-rose-200/50 backdrop-blur-md shadow-[0_20px_45px_rgba(225,29,72,0.18)] flex flex-col items-center justify-end p-4 cursor-pointer group transition-all duration-300 ${
          isPulling ? 'scale-95' : 'hover:scale-105 active:scale-95'
        }`}
      >
        {/* Cork Lid */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 sm:w-40 h-7 rounded-t-md rounded-b-sm bg-amber-700/80 border border-amber-900/30 shadow-md flex items-center justify-center">
          <span className="text-[10px] font-bold tracking-widest text-amber-100 uppercase">
            PULL WITH LOVE
          </span>
        </div>

        {/* Neck Ribbon */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-38 sm:w-42 h-3 bg-rose-400 rounded-full shadow-sm flex items-center justify-center">
          <Heart className="w-4 h-4 fill-white text-rose-400" />
        </div>

        {/* Floating Paper Origami Hearts inside the jar */}
        <div className="w-full h-full relative overflow-hidden flex items-end justify-center pb-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-lg select-none transition-all group-hover:scale-110"
              style={{
                bottom: `${(i % 4) * 24 + 10}px`,
                left: `${(i * 18) % 75 + 10}%`,
                transform: `rotate(${(i * 35) % 90 - 45}deg)`,
                opacity: 0.85,
              }}
            >
              {i % 3 === 0 ? '💖' : i % 2 === 0 ? '✨' : '🌸'}
            </span>
          ))}
        </div>

        {/* Action prompt */}
        <span className="relative z-10 text-xs font-semibold text-rose-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
          Tap to Draw a Note 💌
        </span>
      </motion.div>

      {/* Unfolded Note Card */}
      {currentReason ? (
        <div className="w-full glass-panel-warm rounded-3xl p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-300 border border-rose-200">
          <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-3 border-b border-rose-100 pb-2">
            <span>Note #{currentIndex + 1}</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Straight from the heart</span>
            </span>
          </div>

          <p className="font-serif italic text-lg sm:text-2xl text-rose-950 leading-relaxed font-semibold">
            "{currentReason}"
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={drawRandomReason}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/25 active:scale-95 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              <span>Pick Another Note</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-rose-500 font-sans italic">
          Click the jar above to reveal your first reason! ✨
        </p>
      )}

      {/* Modal: View All Reasons */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-3">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-rose-800">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>All {reasons.length} Reasons Why I Love You</span>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1 rounded-full hover:bg-rose-50 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar space-y-2.5 pr-1 text-left flex-1 py-2">
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2.5 text-xs sm:text-sm text-rose-950 font-serif"
                >
                  <span className="font-sans font-bold text-rose-500 text-xs flex-shrink-0 pt-0.5">
                    #{i + 1}
                  </span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
