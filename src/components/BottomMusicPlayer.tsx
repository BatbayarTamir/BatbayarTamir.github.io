import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Heart, Music2, Sparkles } from 'lucide-react';
import { Song } from '../types';

interface BottomMusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onChangeVolume: (val: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenSecretSettings?: () => void;
}

export const BottomMusicPlayer: React.FC<BottomMusicPlayerProps> = ({
  currentSong,
  isPlaying,
  isMuted,
  volume,
  onTogglePlay,
  onToggleMute,
  onChangeVolume,
  onNext,
  onPrev,
  onOpenSecretSettings,
}) => {
  const [showDedication, setShowDedication] = useState(false);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const [equalizerHeights, setEqualizerHeights] = useState<number[]>([40, 70, 50, 90, 60]);

  // Hidden secret settings: click vinyl 3 times within 1.2s to trigger
  const [vinylClicks, setVinylClicks] = useState<number[]>([]);
  const [showSecretHint, setShowSecretHint] = useState<boolean>(false);

  // Dynamic equalizer simulation for visual delight
  useEffect(() => {
    if (!isPlaying) {
      setEqualizerHeights([20, 20, 20, 20, 20]);
      return;
    }

    const interval = setInterval(() => {
      setEqualizerHeights([
        Math.floor(Math.random() * 60) + 30,
        Math.floor(Math.random() * 70) + 25,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 65) + 35,
        Math.floor(Math.random() * 55) + 30,
      ]);
    }, 160);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePress = (id: string, callback: () => void) => {
    setPressedBtn(id);
    setTimeout(() => setPressedBtn(null), 350);
    callback();
  };

  // Vinyl click handler: triple click within 1.2s opens hidden settings
  const handleVinylClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const newClicks = [...vinylClicks.filter((t) => now - t < 1200), now];
    setVinylClicks(newClicks);

    if (newClicks.length === 3) {
      setVinylClicks([]);
      setShowSecretHint(true);
      setTimeout(() => setShowSecretHint(false), 2200);
      if (onOpenSecretSettings) {
        onOpenSecretSettings();
      }
    } else if (newClicks.length === 1) {
      // Single click toggles dedication note
      setShowDedication((prev) => !prev);
    }
  };

  if (!currentSong) return null;

  const isNexzCyber = currentSong.id === 'song-nexz' || currentSong.title.toLowerCase().includes('mchk');
  const isNexzSaucin = currentSong.id === 'song-saucin' || currentSong.title.toLowerCase().includes('saucin');
  const isNexz = isNexzCyber || isNexzSaucin;

  return (
    <>
      {/* Secret Settings Unlocked Toast Notification */}
      {showSecretHint && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 md:bottom-28 z-50 px-4 py-2 rounded-full bg-slate-900/95 backdrop-blur-md text-white text-xs font-sans flex items-center gap-2 shadow-2xl border border-rose-400/40 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
          <span className="font-medium">Secret Settings Unlocked 🗝️</span>
        </div>
      )}

      {/* Dedication Card Popover */}
      {showDedication && (
        <div
          id="music-dedication-card"
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:right-6 lg:right-8 md:translate-x-0 md:bottom-28 z-40 w-[90%] max-w-md md:w-[380px] p-4 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            isNexzSaucin
              ? 'bg-red-950/98 border-2 border-yellow-400/90 text-yellow-100 shadow-[0_0_30px_rgba(234,179,8,0.4)]'
              : isNexzCyber
              ? 'bg-slate-950/98 border border-cyan-400/80 text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
              : 'bg-white/98 border border-rose-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className={`flex items-center gap-2 font-semibold text-sm ${
              isNexzSaucin ? 'text-yellow-300' : isNexzCyber ? 'text-cyan-300' : 'text-rose-700'
            }`}>
              <Heart className={`w-4 h-4 ${
                isNexzSaucin
                  ? 'fill-yellow-400 text-yellow-400'
                  : isNexzCyber
                  ? 'fill-cyan-400 text-cyan-400'
                  : 'fill-rose-500 text-rose-500'
              }`} />
              <span>
                {isNexzSaucin
                  ? '🥫 NEXZ Saucin Easter Egg'
                  : isNexzCyber
                  ? '⚡ NEXZ Cyber Easter Egg'
                  : 'Special Dedication'}
              </span>
            </div>
            <button
              onClick={() => setShowDedication(false)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                isNexzSaucin
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-red-950 font-bold'
                  : isNexzCyber
                  ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
              }`}
            >
              Close
            </button>
          </div>
          <p className={`mt-2.5 text-sm font-serif italic leading-relaxed ${
            isNexzSaucin ? 'text-yellow-100' : isNexzCyber ? 'text-cyan-100' : 'text-rose-950'
          }`}>
            "{currentSong.dedication}"
          </p>
          {currentSong.lyricsSnippet && (
            <p className={`mt-2 text-xs font-sans flex items-center gap-1.5 font-medium ${
              isNexzSaucin ? 'text-yellow-400 font-bold' : isNexzCyber ? 'text-emerald-400' : 'text-rose-600'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSong.lyricsSnippet}</span>
            </p>
          )}
        </div>
      )}

      {/* Persistent Floating Bottom Bar - Centered on Mobile, Anchored to Bottom Right on PC */}
      <div
        id="bottom-floating-player"
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-6 lg:right-8 md:translate-x-0 md:bottom-6 z-40 w-[calc(100%-2rem)] max-w-md md:w-[380px] h-[72px] px-3.5 sm:px-4 rounded-full backdrop-blur-2xl flex items-center justify-between transition-all duration-500 ${
          isNexzSaucin
            ? 'bg-gradient-to-r from-red-950/98 via-red-900/98 to-amber-950/98 border-2 border-yellow-400 shadow-[0_16px_40px_rgba(234,179,8,0.45)] text-yellow-100'
            : isNexzCyber
            ? 'bg-slate-950/95 border-2 border-cyan-400 shadow-[0_16px_40px_rgba(6,182,212,0.4)] text-white'
            : 'bg-white/95 border border-rose-200/90 shadow-[0_16px_40px_rgba(225,29,72,0.18)]'
        }`}
      >
        {/* Left: Vinyl Disc & Info */}
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {/* Rotating Vinyl Disc with Secret Triple-Click Feature */}
          <div
            id="player-vinyl-anchor"
            onClick={handleVinylClick}
            title="Vinyl Record"
            className="relative w-12 h-12 flex-shrink-0 cursor-pointer group"
          >
            <div
              className={`w-full h-full rounded-full border-2 shadow-md flex items-center justify-center transition-transform ${
                isNexzSaucin
                  ? 'border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                  : isNexzCyber
                  ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'border-white'
              } ${isPlaying ? 'spinning-vinyl' : 'paused-vinyl'}`}
              style={{
                background: isNexzSaucin
                  ? 'radial-gradient(circle, #991b1b 16%, #450a0a 24%, #b45309 42%, #1f0406 55%, #facc15 72%, #0a0102 88%)'
                  : isNexzCyber
                  ? 'radial-gradient(circle, #022c22 16%, #064e3b 20%, #082f49 38%, #0f172a 48%, #0284c7 68%, #030712 85%)'
                  : 'radial-gradient(circle, #333 16%, #111 20%, #222 38%, #111 48%, #2a2a2a 68%, #181818 85%)',
              }}
            >
              {/* Vinyl Center Grooves */}
              <div
                className="w-4.5 h-4.5 rounded-full border border-white flex items-center justify-center shadow-inner"
                style={{ backgroundColor: currentSong.accentColor || (isNexzSaucin ? '#eab308' : '#f43f5e') }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Tonearm needle preview on hover */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Music2 className={`w-2 h-2 ${
                isNexzSaucin ? 'text-yellow-400' : isNexzCyber ? 'text-cyan-400' : 'text-rose-700'
              }`} />
            </div>
          </div>

          {/* Song Info */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className={`font-sans font-bold text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[140px] ${
                isNexzSaucin
                  ? 'text-yellow-300 tracking-wide font-mono'
                  : isNexzCyber
                  ? 'text-cyan-200 tracking-wide font-mono'
                  : 'text-rose-950'
              }`}>
                {currentSong.title}
              </span>
              {(currentSong.isCustomUpload || currentSong.audioUrl) && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex-shrink-0" title="Playing your uploaded MP3">
                  MP3
                </span>
              )}
              <button
                onClick={() => setShowDedication(!showDedication)}
                className={
                  isNexzSaucin
                    ? 'text-yellow-400 hover:text-yellow-200'
                    : isNexzCyber
                    ? 'text-cyan-400 hover:text-cyan-200'
                    : 'text-rose-500 hover:text-rose-700'
                }
                title="Song Dedication"
              >
                <Heart className={`w-3.5 h-3.5 ${
                  isNexzSaucin
                    ? 'fill-yellow-500/40 hover:fill-yellow-400 text-yellow-400'
                    : isNexzCyber
                    ? 'fill-cyan-500/40 hover:fill-cyan-400 text-cyan-400'
                    : 'fill-rose-100 hover:fill-rose-400'
                }`} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-sans text-[11px] sm:text-xs font-medium truncate max-w-[95px] sm:max-w-[120px] ${
                isNexzSaucin
                  ? 'text-red-400 font-mono font-bold'
                  : isNexzCyber
                  ? 'text-emerald-400 font-mono'
                  : 'text-rose-700'
              }`}>
                {currentSong.artist}
              </span>
              {/* Equalizer Bars */}
              <div className="flex items-end gap-0.5 h-3">
                {equalizerHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`w-0.5 rounded-full transition-all duration-150 ${
                      isNexzSaucin
                        ? 'bg-gradient-to-t from-red-500 to-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]'
                        : isNexzCyber
                        ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                        : 'bg-rose-600'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls with press effect */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Previous Track */}
          <button
            id="player-prev-btn"
            onClick={() => handlePress('prev', onPrev)}
            aria-label="Previous Song"
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center shadow-xs border transition-all ${
              isNexzSaucin
                ? 'bg-red-900/80 text-yellow-300 border-yellow-500/50 hover:bg-red-800'
                : isNexzCyber
                ? 'bg-slate-900 text-cyan-300 border-cyan-700/60 hover:bg-slate-800'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
            } ${
              pressedBtn === 'prev' ? 'scale-75 opacity-70' : 'hover:scale-105 active:scale-90'
            }`}
          >
            <SkipBack className={`w-3.5 h-3.5 ${
              isNexzSaucin ? 'fill-yellow-300 text-yellow-300' : isNexzCyber ? 'fill-cyan-300' : 'fill-rose-700'
            }`} />
          </button>

          {/* Play / Pause with ripple */}
          <button
            id="player-play-btn"
            onClick={() => handlePress('play', onTogglePlay)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
              isNexzSaucin
                ? 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 text-red-950 shadow-yellow-500/40 font-bold'
                : isNexzCyber
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-cyan-500/40'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-600/30'
            } ${
              pressedBtn === 'play' ? 'scale-80' : 'hover:scale-105 active:scale-90'
            }`}
          >
            {isPlaying ? (
              <Pause className={`w-4 h-4 ${isNexzSaucin ? 'fill-red-950' : 'fill-white'}`} />
            ) : (
              <Play className={`w-4 h-4 translate-x-0.5 ${isNexzSaucin ? 'fill-red-950' : 'fill-white'}`} />
            )}
            {/* Ripple ring on click */}
            {pressedBtn === 'play' && (
              <span className={`absolute inset-0 rounded-full border-2 animate-ping pointer-events-none ${
                isNexzSaucin ? 'border-yellow-400' : isNexzCyber ? 'border-cyan-400' : 'border-rose-400'
              }`} />
            )}
          </button>

          {/* Next Track */}
          <button
            id="player-next-btn"
            onClick={() => handlePress('next', onNext)}
            aria-label="Next Song"
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center shadow-xs border transition-all ${
              isNexzSaucin
                ? 'bg-red-900/80 text-yellow-300 border-yellow-500/50 hover:bg-red-800'
                : isNexzCyber
                ? 'bg-slate-900 text-cyan-300 border-cyan-700/60 hover:bg-slate-800'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
            } ${
              pressedBtn === 'next' ? 'scale-75 opacity-70' : 'hover:scale-105 active:scale-90'
            }`}
          >
            <SkipForward className={`w-3.5 h-3.5 ${
              isNexzSaucin ? 'fill-yellow-300 text-yellow-300' : isNexzCyber ? 'fill-cyan-300' : 'fill-rose-700'
            }`} />
          </button>

          {/* Volume / Mute Toggle */}
          <div className="relative flex items-center group">
            <button
              id="player-volume-btn"
              onClick={() => handlePress('mute', onToggleMute)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center shadow-xs border transition-all ${
                isNexzSaucin
                  ? 'bg-red-900/80 text-yellow-300 border-yellow-500/50 hover:bg-red-800'
                  : isNexzCyber
                  ? 'bg-slate-900 text-cyan-300 border-cyan-700/60 hover:bg-slate-800'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
              } ${
                pressedBtn === 'mute' ? 'scale-75' : 'hover:scale-105 active:scale-90'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Volume2 className={`w-3.5 h-3.5 ${
                  isNexzSaucin ? 'text-yellow-300' : isNexzCyber ? 'text-cyan-300' : 'text-rose-700'
                }`} />
              )}
            </button>

            {/* Desktop Volume Slider on hover */}
            <div className="hidden sm:group-hover:flex absolute right-0 bottom-full pb-2 z-50">
              <div className={`p-2.5 rounded-xl backdrop-blur-md shadow-xl border flex flex-col items-center ${
                isNexzSaucin
                  ? 'bg-red-950/98 border-yellow-400'
                  : isNexzCyber
                  ? 'bg-slate-950/98 border-cyan-500'
                  : 'bg-white/98 border-rose-200'
              }`}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className={`w-20 cursor-pointer ${
                    isNexzSaucin ? 'accent-yellow-400' : isNexzCyber ? 'accent-cyan-400' : 'accent-rose-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
