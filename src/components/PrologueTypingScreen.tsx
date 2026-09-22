import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface PrologueTypingScreenProps {
  onComplete: () => void;
}

export const PrologueTypingScreen: React.FC<PrologueTypingScreenProps> = ({ onComplete }) => {
  const fullText = "Hello, Sara. I have made you website incase I couldn't meet you.";
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (index < fullText.length) {
        const char = fullText[index];
        setDisplayedText(fullText.slice(0, index + 1));
        index++;

        // Natural human typing delays:
        // Longer pauses at punctuation, slight random pauses like thinking
        let delay = 65 + Math.floor(Math.random() * 35); // 65 - 100ms base

        if (char === '.') {
          delay = 550; // Pause at end of sentence
        } else if (char === ',') {
          delay = 380; // Natural pause at comma
        } else if (index === 28) {
          // Pause after "website"
          delay = 320;
        }

        timeoutId = setTimeout(typeNextChar, delay);
      } else {
        setIsTypingComplete(true);
        // Once typing finishes, pause to let her absorb it, then smoothly transition
        timeoutId = setTimeout(() => {
          handleFinish();
        }, 1800);
      }
    };

    // Initial warm breathing pause before starting typing
    timeoutId = setTimeout(typeNextChar, 700);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 900);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="prologue-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleFinish}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 sm:px-12 bg-gradient-to-b from-[#fdfaf6] via-[#fcf0ea] to-[#fae6de] select-none cursor-pointer"
        >
          {/* Subtle warm halo */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />

          {/* Centered typed message */}
          <div className="relative z-10 max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1 rounded-full bg-white/80 border border-rose-200/80 shadow-xs text-rose-700 text-xs font-serif italic">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>For Sara</span>
            </div>

            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-rose-950 font-normal leading-relaxed sm:leading-relaxed tracking-tight min-h-[120px] sm:min-h-[140px] flex items-center justify-center flex-wrap">
              <span>{displayedText}</span>
              {/* Blinking realistic cursor */}
              <span
                className={`inline-block w-0.5 h-6 sm:h-8 bg-rose-600 ml-1.5 align-middle ${
                  isTypingComplete ? 'animate-pulse' : 'animate-[blink_0.8s_infinite]'
                }`}
              />
            </p>

            {/* Hint to tap to continue if completed or desired */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isTypingComplete ? 0.8 : 0.3 }}
              transition={{ duration: 0.6 }}
              className="mt-8 text-xs font-sans text-rose-700/80 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>{isTypingComplete ? 'Opening your birthday sanctuary...' : 'Tap anywhere to skip'}</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
