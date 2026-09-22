import React from 'react';
import { X, HelpCircle, Heart, Music, BookOpen, Cake } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-rose-950">
                A Little Guide
              </h3>
              <p className="text-[11px] text-rose-700 font-sans">
                How to explore your birthday sanctuary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-slate-500 hover:text-rose-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Guide Content */}
        <div className="overflow-y-auto no-scrollbar space-y-3.5 pr-1 text-left flex-1 text-xs sm:text-sm text-slate-700">
          {/* Item 1: Navigating */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-900 text-xs sm:text-sm">
                Turning Pages
              </h4>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Swipe left and right on your phone, or tap the side arrows & bottom dots to move between chapters.
              </p>
            </div>
          </div>

          {/* Item 2: Music Mixtape */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
              <Music className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-900 text-xs sm:text-sm">
                Our Love Mixtape
              </h4>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Pick a song from the cassette player to accompany you. On computer screens, the music bar sits neatly in the bottom right corner!
              </p>
            </div>
          </div>

          {/* Item 3: The Love Letter */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-900 text-xs sm:text-sm">
                The Sealed Letter
              </h4>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Tap the red wax heart seal on the envelope to break the seal and unfold the handwritten letter.
              </p>
            </div>
          </div>

          {/* Item 4: Memories & Lanterns */}
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
              <Cake className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-900 text-xs sm:text-sm">
                Interactive Surprises
              </h4>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Tap polaroids to flip and read memories on the back. Blow the birthday candles and send a sky lantern wish straight to his inbox!
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-rose-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors shadow-xs"
          >
            Got it, enjoy!
          </button>
        </div>
      </div>
    </div>
  );
};
