import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RefreshCw, Send, Check } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { GirlfriendSiteConfig } from '../../types';

interface LoveLetterPageProps {
  config: GirlfriendSiteConfig;
  isActive?: boolean;
  onOpenPersonalize?: () => void;
}

export const LoveLetterPage: React.FC<LoveLetterPageProps> = ({ config, isActive = false }) => {
  // Opening animation stages: 'sealed' -> 'breaking' -> 'opening' -> 'extracting' -> 'opened'
  const [animStage, setAnimStage] = useState<'sealed' | 'breaking' | 'extracting' | 'opened'>('sealed');
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Formspree connection for replying to his love letter
  const [replyFormState, handleReplySubmit] = useForm('mkjgorbk');

  const handleOpenEnvelope = () => {
    if (animStage !== 'sealed') return;
    setAnimStage('breaking');

    // Wax breaks, then flap opens and letter rises out
    setTimeout(() => {
      setAnimStage('extracting');
    }, 600);

    // Letter unfolds into full reading view
    setTimeout(() => {
      setAnimStage('opened');
    }, 1900);
  };

  const handleReseal = () => {
    setAnimStage('sealed');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center select-none">
      <AnimatePresence mode="wait">
        {animStage !== 'opened' ? (
          /* Envelope & Extraction Scene */
          <motion.div
            key="envelope-scene"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center w-full"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-rose-800 mb-2">
              My Dearest,
            </h2>
            <p className="text-xs sm:text-sm text-rose-600 mb-8 max-w-xs">
              Tap the wax seal to break it, open the envelope, and draw your letter.
            </p>

            {/* 3D Envelope Container */}
            <div
              id="wax-envelope-card"
              onClick={handleOpenEnvelope}
              className="relative w-[300px] sm:w-[380px] h-[220px] sm:h-[250px] cursor-pointer group select-none perspective-1000"
            >
              {/* Back wall of the envelope */}
              <div className="absolute inset-0 rounded-2xl bg-[#fdf2e9] border-2 border-rose-200/80 shadow-[0_20px_45px_rgba(225,29,72,0.18)]" />

              {/* Inside lining of envelope */}
              <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-rose-100 to-amber-50" />

              {/* Letter Parchment rising OUT of the envelope */}
              <motion.div
                initial={{ y: 20, scale: 0.9, opacity: 0.8 }}
                animate={
                  animStage === 'extracting'
                    ? {
                        y: [-10, -140, -110],
                        scale: [0.92, 1.05, 1.1],
                        opacity: 1,
                        boxShadow: '0 20px 35px rgba(225,29,72,0.2)',
                      }
                    : animStage === 'breaking'
                    ? { y: 10, scale: 0.92, opacity: 0.9 }
                    : { y: 20, scale: 0.9, opacity: 0.8 }
                }
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute left-6 right-6 top-6 h-[170px] bg-white rounded-xl border border-rose-200 shadow-md p-4 flex flex-col justify-start text-left z-10 overflow-hidden"
              >
                <div className="w-16 h-1.5 bg-rose-200 rounded-full mb-2" />
                <div className="w-full h-1 bg-rose-100 rounded-full mb-1.5" />
                <div className="w-4/5 h-1 bg-rose-100 rounded-full mb-1.5" />
                <div className="w-3/4 h-1 bg-rose-100 rounded-full mb-3" />
                <p className="font-serif italic text-xs text-rose-800 leading-snug">
                  "To my darling {config.herName}, from the moment you walked into my life..."
                </p>
                <div className="mt-auto flex justify-end">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300" />
                </div>
              </motion.div>

              {/* Front pocket of the envelope (holds the letter inside) */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 overflow-hidden">
                {/* Left diagonal fold */}
                <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[130px] sm:border-b-[150px] border-l-[150px] sm:border-l-[190px] border-b-rose-100/95 border-l-transparent" />
                {/* Right diagonal fold */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[130px] sm:border-b-[150px] border-r-[150px] sm:border-r-[190px] border-b-rose-100/95 border-r-transparent" />
                {/* Bottom triangular fold */}
                <div className="absolute bottom-0 left-0 right-0 h-0 border-l-[150px] sm:border-l-[190px] border-r-[150px] sm:border-r-[190px] border-b-[100px] sm:border-b-[115px] border-l-transparent border-r-transparent border-b-rose-50" />
              </div>

              {/* Top Flap with 3D folding opening animation */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={
                  animStage === 'extracting'
                    ? { rotateX: 180, zIndex: 0 }
                    : { rotateX: 0, zIndex: 30 }
                }
                transition={{
                  duration: 0.7,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
                className="absolute top-0 left-0 right-0 h-0 border-l-[150px] sm:border-l-[190px] border-r-[150px] sm:border-r-[190px] border-t-[105px] sm:border-t-[125px] border-l-transparent border-r-transparent border-t-rose-200/90 filter drop-shadow-md z-30"
              />

              {/* Red Wax Seal Button on top flap */}
              <motion.div
                animate={
                  animStage === 'breaking'
                    ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                    : animStage === 'extracting'
                    ? { opacity: 0 }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.5 }}
                className="absolute top-[80px] sm:top-[95px] left-1/2 -translate-x-1/2 z-40 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-rose-700 border-2 border-rose-900/40 shadow-lg flex items-center justify-center text-white cursor-pointer group-hover:scale-110 transition-transform"
                style={{
                  boxShadow: '0 8px 20px rgba(190, 18, 60, 0.4), inset 0 2px 6px rgba(255,255,255,0.4)',
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-rose-400/50 flex items-center justify-center">
                  <Heart className="w-7 h-7 fill-white text-white drop-shadow-sm" />
                </div>
              </motion.div>

              {/* Status Hint */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-serif italic text-rose-800 font-semibold tracking-wide whitespace-nowrap">
                {animStage === 'breaking' ? 'Breaking seal...' : animStage === 'extracting' ? 'Unfolding letter...' : 'Tap Wax Seal to Open'}
              </span>
            </div>
          </motion.div>
        ) : (
          /* Unfolded Parchment Letter View */
          <motion.div
            key="letter-paper"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-warm w-full rounded-3xl p-6 sm:p-10 shadow-2xl relative max-h-[82vh] overflow-y-auto no-scrollbar"
          >
            {/* Header & Controls */}
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3 mb-6">
              <div className="flex items-center gap-2 text-rose-700">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span className="text-xs uppercase tracking-widest font-bold text-rose-800">Handwritten with love</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReseal}
                  title="Reseal envelope"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 hover:bg-rose-200 text-rose-800 text-xs font-medium border border-rose-300 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Fold back</span>
                </button>
              </div>
            </div>

            {/* Letter Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-900 mb-4 tracking-tight">
              {config.letterTitle || `To my darling ${config.herName},`}
            </h2>

            {/* Letter Content formatted like stationery */}
            <div className="font-serif text-rose-950 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
              {config.letterBody}
            </div>

            {/* Signoff */}
            <div className="mt-8 pt-4 border-t border-rose-200/50 flex flex-col items-end">
              <div className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-800 leading-tight text-right whitespace-pre-line">
                {config.letterSignoff}
              </div>
              <span className="text-xs text-rose-400 mt-1 font-sans">
                written for your special day
              </span>
            </div>

            {/* Formspree Reply Note Drawer */}
            <div className="mt-8 pt-4 border-t border-rose-200/40">
              {!showReplyBox ? (
                <button
                  onClick={() => setShowReplyBox(true)}
                  className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-sans font-semibold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Write a love reply back to him 💌</span>
                </button>
              ) : (
                <div className="bg-white/80 p-4 rounded-2xl border border-rose-200/80 shadow-sm text-left">
                  <h4 className="font-serif font-bold text-sm text-rose-900 mb-1">
                    Send a note back to his heart
                  </h4>
                  {replyFormState.succeeded ? (
                    <div className="py-3 text-center text-rose-700 font-medium text-xs flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Your love note has flown straight to his inbox! 💕</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReplySubmit} className="space-y-2 mt-2">
                      <input
                        type="hidden"
                        name="_subject"
                        value={`Birthday Love Note from ${config.herName}!`}
                      />
                      <textarea
                        name="message"
                        rows={3}
                        required
                        placeholder="Write anything you want to say to him..."
                        className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-rose-300 focus:outline-none"
                      />
                      <ValidationError prefix="Message" field="message" errors={replyFormState.errors} />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setShowReplyBox(false)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={replyFormState.submitting}
                          className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <span>{replyFormState.submitting ? 'Sending...' : 'Send to Him 💌'}</span>
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
