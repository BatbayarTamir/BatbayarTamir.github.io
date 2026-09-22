import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Music, Disc3, Heart } from 'lucide-react';
import { Song } from '../../types';

interface MixtapePageProps {
  playlist: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isCollapsing?: boolean;
  isActive?: boolean;
  onSelectSongWithAnimation: (song: Song, startX: number, startY: number) => void;
}

export const MixtapePage: React.FC<MixtapePageProps> = ({
  playlist,
  currentSong,
  isPlaying,
  isCollapsing = false,
  isActive = false,
  onSelectSongWithAnimation,
}) => {
  const [selectedTasteId, setSelectedTasteId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (song: Song, e: React.MouseEvent<HTMLDivElement>) => {
    if (isCollapsing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    setSelectedTasteId(song.id);
    onSelectSongWithAnimation(song, startX, startY);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 sm:py-6 flex flex-col items-center select-none">
      {/* Morphing & Collapsing Container */}
      <motion.div
        animate={
          isCollapsing
            ? {
                scale: [1, 0.9, 0.25],
                y: [0, 50, 420],
                opacity: [1, 0.8, 0],
                filter: 'blur(3px)',
              }
            : {
                scale: 1,
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
              }
        }
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full rounded-3xl p-4 sm:p-7 flex flex-col items-center text-center shadow-2xl relative overflow-hidden bg-white/92 backdrop-blur-2xl border border-rose-200/90"
      >
        {/* Compact Vintage Cassette Tape SVG */}
        <div className="relative mb-3 sm:mb-5 animate-gentle-float">
          <svg
            width="170"
            height="110"
            viewBox="0 0 280 180"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-md sm:w-[210px] sm:h-[135px]"
          >
            {/* Outer Cassette Body */}
            <rect
              x="10"
              y="10"
              width="260"
              height="160"
              rx="20"
              fill="rgba(255, 255, 255, 0.88)"
              stroke="#fbcfe8"
              strokeWidth="2.5"
            />
            {/* Upper label window */}
            <rect
              x="30"
              y="28"
              width="220"
              height="95"
              rx="10"
              fill="#fffdfa"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            <rect x="30" y="28" width="220" height="26" fill="#ffe4e6" rx="8" />
            <text
              x="140"
              y="46"
              fontFamily="Poppins, sans-serif"
              fontSize="12"
              fontWeight="700"
              fill="#be123c"
              textAnchor="middle"
              letterSpacing="2"
            >
              OUR LOVE MIXTAPE • VOL. 1
            </text>

            {/* Tape spools window */}
            <rect
              x="70"
              y="62"
              width="140"
              height="45"
              rx="22"
              fill="rgba(255, 255, 255, 0.95)"
              stroke="#fbcfe8"
              strokeWidth="2"
            />

            {/* Left Spool with continuous rotation */}
            <g>
              <circle cx="100" cy="84" r="16" fill="#fce7f3" stroke="#e11d48" strokeWidth="1.5" />
              <circle cx="100" cy="84" r="6" fill="#ffffff" />
              <line x1="100" y1="70" x2="100" y2="76" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <line x1="100" y1="92" x2="100" y2="98" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <line x1="86" y1="84" x2="92" y2="84" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <line x1="108" y1="84" x2="114" y2="84" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 84"
                to="360 100 84"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </g>

            {/* Right Spool with continuous rotation */}
            <g>
              <circle cx="180" cy="84" r="16" fill="#fce7f3" stroke="#e11d48" strokeWidth="1.5" />
              <circle cx="180" cy="84" r="6" fill="#ffffff" />
              <line x1="180" y1="70" x2="180" y2="76" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <line x1="180" y1="92" x2="180" y2="98" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <line x1="166" y1="84" x2="172" y2="84" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <line x1="188" y1="84" x2="194" y2="84" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 180 84"
                to="360 180 84"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </g>

            {/* Tape line */}
            <line
              x1="116"
              y1="84"
              x2="164"
              y2="84"
              stroke="#fb7185"
              strokeWidth="5"
              strokeDasharray="2 4"
            />
            <circle cx="20" cy="20" r="3" fill="#cbd5e1" />
            <circle cx="260" cy="20" r="3" fill="#cbd5e1" />
            <circle cx="20" cy="160" r="3" fill="#cbd5e1" />
            <circle cx="260" cy="160" r="3" fill="#cbd5e1" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-900 tracking-tight">
          Choose Our Song
        </h2>

        {/* Romantic Musical Quote */}
        <div className="mt-1.5 mb-2 px-4 py-1 rounded-full bg-rose-100/80 border border-rose-300/70 text-xs sm:text-sm font-serif italic text-rose-900 tracking-wide inline-flex items-center gap-1.5 shadow-sm">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500 flex-shrink-0" />
          <span>“Where words leave off, music speaks for our hearts.”</span>
        </div>

        <p className="text-xs sm:text-sm text-rose-800 font-sans max-w-sm mb-3 font-medium">
          Swipe through and pick a song to accompany your special birthday journey.
        </p>

        {/* Swipeable Song Carousel Container */}
        <div className="relative w-full my-1">
          {/* Horizontally Swipeable Song List */}
          <div
            ref={scrollContainerRef}
            className="w-full flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory py-2 px-6 sm:px-4 no-scrollbar touch-pan-x"
          >
            {playlist.map((song) => {
              const isSelected = currentSong?.id === song.id;
              const isTasteActive = selectedTasteId === song.id;

              return (
                <div
                  key={song.id}
                  id={`song-card-${song.id}`}
                  onClick={(e) => handleCardClick(song, e)}
                  className={`relative flex-shrink-0 w-[230px] sm:w-[260px] snap-center p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between border text-left ${
                    isSelected
                      ? 'bg-white shadow-xl border-rose-400 ring-2 ring-rose-300 scale-[1.02]'
                      : 'bg-white/95 hover:bg-white border-rose-200/90 hover:border-rose-300 hover:scale-[1.02] shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Card Content */}
                  <div
                    className={`transition-all duration-300 ${
                      isTasteActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors ${
                          isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <Disc3 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Music className="w-4 h-4 text-rose-700" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(song.isCustomUpload || song.audioUrl) && (
                          <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            MP3
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-700 border border-rose-200">
                          {song.tone}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm text-rose-950 truncate">
                      {song.title}
                    </h3>
                    <p className="text-xs text-rose-700 font-medium truncate mt-0.5">
                      {song.artist}
                    </p>

                    <div className="mt-3 pt-2 border-t border-rose-200/80 flex items-center justify-between text-xs text-rose-700 font-medium">
                      <span>{song.duration}</span>
                      <div className="w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center transition-colors shadow-xs">
                        <Play className="w-3 h-3 fill-rose-700 translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* "Love your taste ✨" Animation Overlay */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-white/95 flex flex-col items-center justify-center gap-1.5 font-semibold text-rose-600 text-sm pointer-events-none transition-all duration-300 ${
                      isTasteActive
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-rose-500 fill-rose-300 animate-spin" />
                    <span>Love your taste ✨</span>
                    <span className="text-[11px] text-rose-400 font-normal">Starting playback...</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sweet footer note */}
        <div className="mt-3 pt-2.5 border-t border-rose-100/60 w-full text-center">
          <p className="text-[11px] sm:text-xs text-rose-500 font-sans italic flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
            <span>Swipe left or right to explore all songs</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
