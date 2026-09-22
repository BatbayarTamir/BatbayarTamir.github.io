import React from 'react';
import { Sparkles, Heart, Settings, Music, Volume2, VolumeX, Cake, Image, BookOpen, Clock, Gift, Ticket } from 'lucide-react';

interface TopNavbarProps {
  currentPage: number;
  totalPages: number;
  onSelectPage: (index: number) => void;
  herName: string;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onOpenPersonalize: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentPage,
  onSelectPage,
  herName,
  isPlaying,
  isMuted,
  onTogglePlay,
  onOpenPersonalize,
}) => {
  const navItems = [
    { id: 0, label: 'Cover', icon: Heart },
    { id: 1, label: 'Mixtape', icon: Music },
    { id: 2, label: 'Love Letter', icon: BookOpen },
    { id: 3, label: 'Memories', icon: Image },
    { id: 4, label: 'Our Story', icon: Clock },
    { id: 5, label: '50 Reasons', icon: Sparkles },
    { id: 6, label: 'Make a Wish', icon: Cake },
    { id: 7, label: 'Coupons', icon: Ticket },
  ];

  return (
    <header className="fixed top-3 left-0 right-0 z-40 px-3 sm:px-6 flex items-center justify-between pointer-events-none">
      {/* Left: Brand Badge */}
      <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm">
        <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
          <Heart className="w-3 h-3 fill-rose-500 animate-pulse" />
        </div>
        <span className="font-serif font-semibold text-xs sm:text-sm text-rose-950 truncate max-w-[140px] sm:max-w-none">
          For {herName}
        </span>
      </div>

      {/* Center: Desktop Page Tabs (Hidden on very small screens, scrolls horizontally on medium) */}
      <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm overflow-x-auto no-scrollbar max-w-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm scale-105'
                  : 'text-rose-900/70 hover:text-rose-900 hover:bg-rose-50'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Quick Actions */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Quick Audio Control */}
        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause music' : 'Play sweet birthday music'}
          className={`px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm flex items-center gap-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-all ${
            isPlaying ? 'text-rose-600 ring-1 ring-rose-200' : 'text-slate-500'
          }`}
        >
          {isPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-rose-500 rounded-full animate-pulse" />
                <span className="w-0.5 h-2 bg-rose-500 rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-3.5 bg-rose-500 rounded-full animate-pulse delay-150" />
              </div>
              <span className="hidden sm:inline">Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Music Off</span>
            </>
          )}
        </button>

        {/* Personalize Button */}
        <button
          onClick={onOpenPersonalize}
          title="Personalize names, anniversary, and letter"
          className="p-2 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-sm text-rose-700 hover:bg-rose-50 hover:text-rose-900 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
