import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { LiveBackground } from './components/LiveBackground';
import { OrchidTransitionOverlay } from './components/OrchidTransitionOverlay';
import { FlowerBloomTransitionOverlay } from './components/FlowerBloomTransitionOverlay';
import { PrologueTypingScreen } from './components/PrologueTypingScreen';
import { SongFlyingAnimation } from './components/SongFlyingAnimation';
import { BottomMusicPlayer } from './components/BottomMusicPlayer';
import { PersonalizeModal } from './components/PersonalizeModal';
import { HelpModal } from './components/HelpModal';

// Pages
import { IntroPage } from './components/pages/IntroPage';
import { MixtapePage } from './components/pages/MixtapePage';
import { LoveLetterPage } from './components/pages/LoveLetterPage';
import { PolaroidGalleryPage } from './components/pages/PolaroidGalleryPage';
import { TimelinePage } from './components/pages/TimelinePage';
import { ReasonsJarPage } from './components/pages/ReasonsJarPage';
import { BirthdayCakePage } from './components/pages/BirthdayCakePage';
import { CouponsPage } from './components/pages/CouponsPage';
import { EndingPage } from './components/pages/EndingPage';

// Data & Audio
import {
  initialConfig,
  defaultPlaylist,
  defaultMemories,
  defaultMilestones,
  defaultReasonsWhy,
  defaultCoupons,
} from './data/mockData';
import { romanticAudio } from './utils/audioSynthesizer';
import { loadAllSavedAudios } from './utils/audioStorage';
import { loadAllSavedPolaroidImages } from './utils/imageStorage';
import { setupMobileAudioUnlock, resolveSongAudioUrl } from './utils/audioResolver';
import { fetchPublishedContentManifest } from './utils/contentResolver';
import { Song, PolaroidMemory, LoveCoupon, GirlfriendSiteConfig, Milestone, SanctuaryData } from './types';

const TOTAL_PAGES = 9;

export default function App() {
  // Config & State with localStorage persistence
  const [config, setConfig] = useState<GirlfriendSiteConfig>(() => {
    try {
      const saved = localStorage.getItem('girlfriend_site_config');
      return saved ? JSON.parse(saved) : initialConfig;
    } catch {
      return initialConfig;
    }
  });

  const [playlist, setPlaylist] = useState<Song[]>(() => {
    try {
      const savedFull = localStorage.getItem('girlfriend_playlist_full');
      if (savedFull) {
        const parsed = JSON.parse(savedFull);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      const saved = localStorage.getItem('girlfriend_playlist_meta');
      if (saved) {
        const parsed = JSON.parse(saved);
        return defaultPlaylist.map((def) => {
          const matched = parsed.find((p: Song) => p.id === def.id);
          return matched ? { ...def, title: matched.title, artist: matched.artist } : def;
        });
      }
      return defaultPlaylist;
    } catch {
      return defaultPlaylist;
    }
  });
  const [currentSong, setCurrentSong] = useState<Song>(defaultPlaylist[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);

  // Requirement: Hide song player on intro (page 0) and mixtape (page 1).
  // After she chooses a song, the div will transition into the song player (hasSelectedSong becomes true).
  const [hasSelectedSong, setHasSelectedSong] = useState<boolean>(false);

  const [memories, setMemories] = useState<PolaroidMemory[]>(() => {
    try {
      const saved = localStorage.getItem('girlfriend_memories');
      return saved ? JSON.parse(saved) : defaultMemories;
    } catch {
      return defaultMemories;
    }
  });

  const [reasons, setReasons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('girlfriend_reasons');
      return saved ? JSON.parse(saved) : defaultReasonsWhy;
    } catch {
      return defaultReasonsWhy;
    }
  });

  const [coupons, setCoupons] = useState<LoveCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('girlfriend_coupons');
      return saved ? JSON.parse(saved) : defaultCoupons;
    } catch {
      return defaultCoupons;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('girlfriend_milestones');
      return saved ? JSON.parse(saved) : defaultMilestones;
    } catch {
      return defaultMilestones;
    }
  });

  // Navigation & Animation State
  const [showPrologue, setShowPrologue] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [orchidActive, setOrchidActive] = useState<boolean>(false);
  const [flowerBloomActive, setFlowerBloomActive] = useState<boolean>(false);
  const [isCollapsingMixtape, setIsCollapsingMixtape] = useState<boolean>(false);
  const [flyingSong, setFlyingSong] = useState<{
    title: string;
    artist: string;
    startX: number;
    startY: number;
  } | null>(null);

  // Hidden secret settings modal & help modal
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Swipe gesture tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDraggingRef = useRef(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('girlfriend_site_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('girlfriend_memories', JSON.stringify(memories));
    } catch (e) {
      console.warn('Could not save memories', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('girlfriend_reasons', JSON.stringify(reasons));
    } catch (e) {
      console.warn('Could not save reasons', e);
    }
  }, [reasons]);

  useEffect(() => {
    try {
      localStorage.setItem('girlfriend_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.warn('Could not save coupons', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('girlfriend_milestones', JSON.stringify(milestones));
    } catch (e) {
      console.warn('Could not save milestones', e);
    }
  }, [milestones]);

  // Persist customized playlist metadata and song list
  useEffect(() => {
    try {
      const serializable = playlist.map((s) => ({
        ...s,
        audioUrl: s.audioUrl && s.audioUrl.startsWith('blob:') ? undefined : s.audioUrl,
      }));
      localStorage.setItem('girlfriend_playlist_full', JSON.stringify(serializable));
      const meta = playlist.map(({ id, title, artist }) => ({ id, title, artist }));
      localStorage.setItem('girlfriend_playlist_meta', JSON.stringify(meta));
    } catch (e) {
      console.warn('Could not save playlist', e);
    }
  }, [playlist]);

  // Restore saved Polaroid images from IndexedDB on startup
  useEffect(() => {
    loadAllSavedPolaroidImages()
      .then((savedImages) => {
        if (savedImages && Object.keys(savedImages).length > 0) {
          setMemories((prev) =>
            prev.map((m) => {
              const savedUrl = savedImages[m.id];
              return savedUrl ? { ...m, imageUrl: savedUrl } : m;
            })
          );
        }
      })
      .catch((err) => {
        console.warn('Could not load saved polaroid images from IndexedDB:', err);
      });
  }, []);

  // Audio playback with auto-discovery and cross-device resolution
  const playSongWithFallback = useCallback(async (song: Song) => {
    let url = song.audioUrl;
    // If no active audioUrl or if it's a blob url that doesn't exist on this device
    if (!url || url.startsWith('blob:')) {
      const resolved = await resolveSongAudioUrl(song);
      if (resolved) {
        url = resolved;
        setPlaylist((prev) =>
          prev.map((s) => (s.id === song.id ? { ...s, audioUrl: resolved, isCustomUpload: true } : s))
        );
        setCurrentSong((curr) =>
          curr.id === song.id ? { ...curr, audioUrl: resolved, isCustomUpload: true } : curr
        );
      }
    }
    romanticAudio.playTrack(song.id, url);
    setIsPlaying(true);
  }, []);

  const applyRemoteData = useCallback((data: SanctuaryData) => {
    if (data.config) {
      setConfig((prev) => ({ ...prev, ...data.config }));
    }
    if (data.playlist && data.playlist.length > 0) {
      setPlaylist(data.playlist);
      setCurrentSong((curr) => {
        const found = data.playlist!.find((p) => p.id === curr.id);
        return found || data.playlist![0];
      });
    }
    if (data.memories && data.memories.length > 0) {
      setMemories(data.memories);
    }
    if (data.milestones && data.milestones.length > 0) {
      setMilestones(data.milestones);
    }
    if (data.reasons && data.reasons.length > 0) {
      setReasons(data.reasons);
    }
    if (data.coupons && data.coupons.length > 0) {
      setCoupons((prev) =>
        data.coupons!.map((c) => {
          const localMatch = prev.find((p) => p.id === c.id);
          return localMatch && localMatch.redeemed
            ? { ...c, redeemed: true, redeemedAt: localMatch.redeemedAt }
            : c;
        })
      );
    }
  }, []);

  const handleReloadFromGitHub = useCallback(async (): Promise<boolean> => {
    const data = await fetchPublishedContentManifest();
    if (data) {
      applyRemoteData(data);
      return true;
    }
    return false;
  }, [applyRemoteData]);

  const handleApplyCustomJson = useCallback(
    (data: SanctuaryData) => {
      applyRemoteData(data);
    },
    [applyRemoteData]
  );

  // Setup mobile audio unlocking, manifest sync, and audio auto-discovery across devices
  useEffect(() => {
    // 1. Enable instant tap unlock for iOS Safari and mobile browsers
    setupMobileAudioUnlock();

    // 2. Sync published content and playlist manifest (public/content.json & public/playlist.json) from GitHub
    fetchPublishedContentManifest().then((data) => {
      if (data) {
        applyRemoteData(data);
      }
    });

    // 3. Restore saved MP3 audio files from local IndexedDB if available
    loadAllSavedAudios()
      .then((savedAudios) => {
        if (!savedAudios || Object.keys(savedAudios).length === 0) return;
        setPlaylist((prev) =>
          prev.map((s) => {
            const saved = savedAudios[s.id];
            if (saved) {
              return {
                ...s,
                audioUrl: saved.audioUrl,
                fileName: saved.fileName,
                fileSize: saved.fileSize,
                isCustomUpload: true,
              };
            }
            return s;
          })
        );
      })
      .catch((err) => {
        console.warn('Could not load saved audios from IndexedDB:', err);
      });
  }, [applyRemoteData]);

  // Audio Handlers
  const handlePlay = useCallback(() => {
    if (!romanticAudio.getIsPlaying()) {
      playSongWithFallback(currentSong);
    } else {
      romanticAudio.resume();
      setIsPlaying(true);
    }
  }, [currentSong, playSongWithFallback]);

  const handlePause = useCallback(() => {
    romanticAudio.pause();
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePause, handlePlay]);

  const handleToggleMute = useCallback(() => {
    const muted = romanticAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleChangeVolume = useCallback((val: number) => {
    setVolume(val);
    romanticAudio.setVolume(val);
  }, []);

  // Page Navigation Handlers
  const goToPage = useCallback(
    (pageIndex: number) => {
      const target = Math.max(0, Math.min(TOTAL_PAGES - 1, pageIndex));
      setCurrentPage(target);
      if (target > 0) {
        setIsIntroActive(false);
      } else {
        setIsIntroActive(true);
      }
    },
    []
  );

  // When a song is selected on Mixtape page
  const handleSelectSongWithAnimation = useCallback(
    (song: Song, startX: number, startY: number) => {
      setCurrentSong(song);

      // Trigger collapsing animation on the mixtape choice card
      setIsCollapsingMixtape(true);

      // Trigger flying animation
      setFlyingSong({
        title: song.title,
        artist: song.artist,
        startX,
        startY,
      });

      // Reveal and transition into player
      setHasSelectedSong(true);

      // Start audio playback
      setTimeout(() => {
        playSongWithFallback(song);
      }, 500);

      // Fluidly transition to the next page automatically after the collapse finishes
      setTimeout(() => {
        goToPage(2);
        setIsCollapsingMixtape(false);
      }, 1100);
    },
    [goToPage, playSongWithFallback]
  );

  const handleNextTrack = useCallback(() => {
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    setCurrentSong(nextSong);
    playSongWithFallback(nextSong);
  }, [playlist, currentSong, playSongWithFallback]);

  const handlePrevTrack = useCallback(() => {
    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevSong = playlist[prevIndex];
    setCurrentSong(prevSong);
    playSongWithFallback(prevSong);
  }, [playlist, currentSong, playSongWithFallback]);

  const handleNextPage = useCallback(() => {
    // Prevent advancing from intro page via keyboard; user must click Dive In
    if (currentPage > 0 && currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Dive In Action with Blooming Flower Transition Opening Up The Next Page
  const handleDiveIn = () => {
    setFlowerBloomActive(true);

    // Soften background
    setTimeout(() => {
      setIsIntroActive(false);
    }, 600);

    // Smoothly transition slide to Mixtape page as flowers blossom and part
    setTimeout(() => {
      goToPage(1);
    }, 1400);
  };

  // Keyboard navigation & Secret tinker hotkey (~ or Ctrl/Cmd + P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret tinker shortcut for creator
      if (
        e.key === '`' ||
        e.key === '~' ||
        ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P' || e.key === 'k' || e.key === 'K'))
      ) {
        e.preventDefault();
        setIsPersonalizeOpen((prev) => !prev);
        return;
      }

      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, handleTogglePlay]);

  // Touch Swipe Handlers for fluid page swiping
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStartX(clientX);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || touchStartX === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - touchStartX;
    // On intro page, disable dragging towards next page (negative diff)
    if (currentPage === 0 && diff < 0) {
      setDragOffset(0);
      return;
    }
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // On intro page, swiping to next page is strictly disabled (must click Dive In)
    if (currentPage === 0) {
      setDragOffset(0);
      setTouchStartX(null);
      return;
    }

    const threshold = 60; // minimum swipe distance
    if (dragOffset < -threshold && currentPage < TOTAL_PAGES - 1) {
      goToPage(currentPage + 1);
    } else if (dragOffset > threshold && currentPage > 0) {
      goToPage(currentPage - 1);
    }

    setDragOffset(0);
    setTouchStartX(null);
  };

  const handleToggleRedeemCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === couponId) {
          const isNowRedeemed = !c.redeemed;
          return {
            ...c,
            redeemed: isNowRedeemed,
            redeemedAt: isNowRedeemed ? new Date().toLocaleDateString() : undefined,
          };
        }
        return c;
      })
    );
  };

  // Condition to display the song player:
  // Hidden on intro (page 0) and hidden on page 1 until she chooses a song.
  // On pages 2+, if she has selected a song (or once chosen), it remains active.
  const showSongPlayer = currentPage !== 0 && (currentPage >= 2 ? true : hasSelectedSong);

  // Easter eggs: check which NEXZ song or theme is selected
  const isNexzCyber =
    currentSong?.id === 'song-nexz' ||
    currentSong?.title?.toLowerCase().includes('mchk');

  const isNexzSaucin =
    currentSong?.id === 'song-saucin' ||
    currentSong?.title?.toLowerCase().includes('saucin');

  const activeTheme: 'romantic' | 'nexz-cyber' | 'nexz-saucin' = isNexzSaucin
    ? 'nexz-saucin'
    : isNexzCyber
    ? 'nexz-cyber'
    : 'romantic';

  const isNexzTheme = isNexzCyber || isNexzSaucin;

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden font-sans select-none theme-${activeTheme} transition-colors duration-700 ${
        activeTheme === 'nexz-saucin'
          ? 'text-yellow-100'
          : activeTheme === 'nexz-cyber'
          ? 'text-cyan-50'
          : 'text-slate-800'
      }`}
    >
      {/* Prologue Typing Screen Animation On First Load */}
      {showPrologue && (
        <PrologueTypingScreen onComplete={() => setShowPrologue(false)} />
      )}

      {/* Dynamic Animated Background with Saucin / Cyber / Romantic Theme support */}
      <LiveBackground isIntro={isIntroActive} theme={activeTheme} isNexzTheme={isNexzTheme} />

      {/* NEXZ Theme Easter Egg Badge for Saucin & Cyber */}
      {activeTheme === 'nexz-saucin' && (
        <div className="fixed top-3.5 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-red-950/95 text-yellow-300 border-2 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.5)] text-[10px] sm:text-xs font-mono font-bold tracking-wider flex items-center gap-2 animate-pulse backdrop-blur-md">
          <span className="text-red-400 text-sm">🥫</span>
          <span>NEXZ EASTER EGG // 'SAUCIN' KETCHUP & MUSTARD THEME</span>
          <span className="text-yellow-400 text-sm">🌭</span>
        </div>
      )}

      {activeTheme === 'nexz-cyber' && (
        <div className="fixed top-3.5 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-slate-950/95 text-cyan-300 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-[10px] sm:text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 animate-pulse backdrop-blur-md">
          <span className="text-emerald-400">⚡</span>
          <span>NEXZ EASTER EGG // 'MCHK MCHK' CYBER THEME</span>
          <span className="text-emerald-400">⚡</span>
        </div>
      )}

      {/* Unique Bouquet of Flowers Blooming Transition to Next Page */}
      <FlowerBloomTransitionOverlay
        active={flowerBloomActive}
        onComplete={() => setFlowerBloomActive(false)}
      />

      {/* White Orchid Ambient Blooming Transition Effect */}
      <OrchidTransitionOverlay
        active={orchidActive}
        onComplete={() => setOrchidActive(false)}
      />

      {/* Immersive Flying Song Vinyl Animation */}
      <SongFlyingAnimation
        flyingSong={flyingSong}
        onAnimationEnd={() => setFlyingSong(null)}
      />

      {/* Transparent Swipe Guide Button (Left) - Hidden on Intro, only clean floating icon */}
      {currentPage > 0 && (
        <button
          id="prev-page-swipe-button"
          onClick={handlePrevPage}
          aria-label="Previous Page"
          className={`fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 bg-transparent border-0 transition-all duration-300 hover:scale-125 active:scale-90 group cursor-pointer ${
            activeTheme === 'nexz-saucin'
              ? 'text-yellow-400 hover:text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.5)]'
              : activeTheme === 'nexz-cyber'
              ? 'text-cyan-400 hover:text-cyan-200 drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]'
              : 'text-rose-500/70 hover:text-rose-700 drop-shadow-[0_2px_8px_rgba(225,29,72,0.3)]'
          }`}
        >
          <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {/* Transparent Swipe Guide Button (Right) - Hidden on Intro, only clean floating icon */}
      {currentPage > 0 && currentPage < TOTAL_PAGES - 1 && (
        <button
          id="next-page-swipe-button"
          onClick={handleNextPage}
          aria-label="Next Page"
          className={`fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 bg-transparent border-0 transition-all duration-300 hover:scale-125 active:scale-90 group cursor-pointer ${
            activeTheme === 'nexz-saucin'
              ? 'text-yellow-400 hover:text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.5)]'
              : activeTheme === 'nexz-cyber'
              ? 'text-cyan-400 hover:text-cyan-200 drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]'
              : 'text-rose-500/70 hover:text-rose-700 drop-shadow-[0_2px_8px_rgba(225,29,72,0.3)]'
          }`}
        >
          <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Small Help Button on Top Right Corner */}
      <button
        id="top-right-help-button"
        onClick={() => setIsHelpOpen(true)}
        aria-label="How to explore (Help)"
        title="Guide & Secret Functions"
        className={`fixed top-3.5 right-3.5 sm:top-5 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 group cursor-pointer ${
          activeTheme === 'nexz-saucin'
            ? 'bg-red-950/95 border-yellow-400/80 text-yellow-300 hover:bg-red-900 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
            : activeTheme === 'nexz-cyber'
            ? 'bg-slate-950/95 border-cyan-400/80 text-cyan-300 hover:bg-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'bg-white/95 border-rose-200/90 text-rose-700 hover:text-rose-950 hover:bg-rose-50'
        }`}
      >
        <HelpCircle className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Main Swipeable Slider Track with Custom Spring Transition */}
      <main
        className="w-full h-full relative z-10 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            width: `${TOTAL_PAGES * 100}vw`,
            transform: `translateX(calc(-${currentPage * 100}vw + ${dragOffset}px))`,
          }}
        >
          {/* Page 0: Cover / Intro */}
          <section className="w-screen h-full flex-shrink-0 flex items-center justify-center pt-8 sm:pt-12 pb-20 px-3 sm:px-6 overflow-y-auto no-scrollbar">
            <div
              className={`w-full h-full flex items-center justify-center transition-all duration-700 ease-out ${
                currentPage === 0
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
              }`}
            >
              <IntroPage
                herName={config.herName}
                herNickname={config.herNickname}
                isActive={currentPage === 0}
                onDiveIn={handleDiveIn}
              />
            </div>
          </section>

          {/* Page 1: Mixtape Lounge */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full flex items-center justify-center transition-all duration-700 ease-out ${
                  currentPage === 1
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <MixtapePage
                  playlist={playlist}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  isCollapsing={isCollapsingMixtape}
                  isActive={currentPage === 1}
                  onSelectSongWithAnimation={handleSelectSongWithAnimation}
                />
              </div>
            </div>
          </section>

          {/* Page 2: Love Letter */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full flex items-center justify-center transition-all duration-700 ease-out ${
                  currentPage === 2
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <LoveLetterPage config={config} isActive={currentPage === 2} />
              </div>
            </div>
          </section>

          {/* Page 3: Polaroid Gallery */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full transition-all duration-700 ease-out ${
                  currentPage === 3
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <PolaroidGalleryPage
                  memories={memories}
                  isActive={currentPage === 3}
                />
              </div>
            </div>
          </section>

          {/* Page 4: Our Journey Together & Live Ticker */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full transition-all duration-700 ease-out ${
                  currentPage === 4
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <TimelinePage
                  milestones={milestones}
                  anniversaryDate={config.anniversaryDate}
                  isActive={currentPage === 4}
                />
              </div>
            </div>
          </section>

          {/* Page 5: 50 Reasons Why I Love You */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full transition-all duration-700 ease-out ${
                  currentPage === 5
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <ReasonsJarPage
                  reasons={reasons}
                  isActive={currentPage === 5}
                />
              </div>
            </div>
          </section>

          {/* Page 6: Birthday Cake & Make A Wish */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full transition-all duration-700 ease-out ${
                  currentPage === 6
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <BirthdayCakePage herName={config.herName} isActive={currentPage === 6} />
              </div>
            </div>
          </section>

          {/* Page 7: Heartfelt Love Coupons */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full transition-all duration-700 ease-out ${
                  currentPage === 7
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <CouponsPage
                  coupons={coupons}
                  isActive={currentPage === 7}
                  onToggleRedeem={handleToggleRedeemCoupon}
                />
              </div>
            </div>
          </section>

          {/* Page 8: And Finally (Ending Page) */}
          <section className="w-screen h-full flex-shrink-0 overflow-y-auto no-scrollbar">
            <div className="w-full min-h-full flex flex-col items-center justify-start pt-12 sm:pt-16 pb-36 md:pb-28 px-3 sm:px-6">
              <div
                className={`w-full transition-all duration-700 ease-out ${
                  currentPage === 8
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                }`}
              >
                <EndingPage
                  herName={config.herName}
                  hisName={config.hisName || 'Batbayar'}
                  herNickname={config.herNickname}
                  isActive={currentPage === 8}
                  onRestart={() => goToPage(0)}
                  onGoToMixtape={() => goToPage(1)}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Floating Bottom Persistent Song Player with Smooth Transition */}
      <AnimatePresence>
        {showSongPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
            }}
            className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <BottomMusicPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                isMuted={isMuted}
                volume={volume}
                onTogglePlay={handleTogglePlay}
                onToggleMute={handleToggleMute}
                onChangeVolume={handleChangeVolume}
                onNext={handleNextTrack}
                onPrev={handlePrevTrack}
                onOpenSecretSettings={() => setIsPersonalizeOpen(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal Guide */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Secret Control Panel Modal (Tinkered via ~ hotkey, Ctrl+P, or 3 vinyl clicks) */}
      <PersonalizeModal
        config={config}
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        onSaveConfig={(newCfg) => setConfig(newCfg)}
        playlist={playlist}
        memories={memories}
        milestones={milestones}
        reasons={reasons}
        coupons={coupons}
        onReloadFromGitHub={handleReloadFromGitHub}
        onApplyCustomJson={handleApplyCustomJson}
      />

      {/* Bottom Page Indicator: Flat lines that shift into the other lines as pages move */}
      {currentPage > 0 && (
        <div
          id="flat-lines-navigation"
          className={`fixed bottom-24 sm:bottom-26 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full backdrop-blur-xl border shadow-md pointer-events-auto transition-all duration-300 ${
            activeTheme === 'nexz-saucin'
              ? 'bg-red-950/95 border-2 border-yellow-400/90 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
              : activeTheme === 'nexz-cyber'
              ? 'bg-slate-950/90 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              : 'bg-white/95 border-rose-200/90 shadow-md'
          }`}
        >
          {Array.from({ length: TOTAL_PAGES }).map((_, idx) => {
            const isActive = currentPage === idx;
            return (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                aria-label={`Jump to page ${idx + 1}`}
                className="relative py-1 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`h-[3px] sm:h-[3.5px] rounded-full transition-all duration-500 ease-out ${
                    isActive
                      ? activeTheme === 'nexz-saucin'
                        ? 'w-7 sm:w-9 bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.9)]'
                        : activeTheme === 'nexz-cyber'
                        ? 'w-7 sm:w-9 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                        : 'w-7 sm:w-9 bg-gradient-to-r from-rose-500 to-pink-500 shadow-xs'
                      : activeTheme === 'nexz-saucin'
                      ? 'w-3 sm:w-3.5 bg-red-900/80 group-hover:w-5 group-hover:bg-yellow-400'
                      : activeTheme === 'nexz-cyber'
                      ? 'w-3 sm:w-3.5 bg-cyan-900/70 group-hover:w-5 group-hover:bg-cyan-600'
                      : 'w-3 sm:w-3.5 bg-rose-200/90 group-hover:w-5 group-hover:bg-rose-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
