import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Clock, Calendar, Flame, Compass, Crown, Star, Gift, Moon, Sun, Coffee, Music, MapPin, Smile } from 'lucide-react';
import { Milestone } from '../../types';

interface TimelinePageProps {
  milestones: Milestone[];
  anniversaryDate: string;
  isActive?: boolean;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  milestones,
  anniversaryDate,
  isActive = false,
}) => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-rose-500" />;
      case 'Heart':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-sky-500" />;
      case 'Crown':
        return <Crown className="w-4 h-4 text-yellow-500 fill-yellow-400" />;
      case 'Star':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-300" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-pink-500" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-indigo-400 fill-indigo-300" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-amber-700" />;
      case 'Music':
        return <Music className="w-4 h-4 text-rose-600" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'Smile':
        return <Smile className="w-4 h-4 text-rose-400" />;
      default:
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center select-none pb-28">
      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold mb-2 shadow-xs border border-rose-200">
          <Calendar className="w-3.5 h-3.5 text-rose-600" />
          <span>Our Journey</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-rose-950 tracking-tight drop-shadow-xs">
          Our Journey Together
        </h2>
        <p className="text-xs sm:text-sm text-rose-800 font-medium mt-1.5">
          Every second with you is my favorite chapter.
        </p>
      </div>

      {/* Real-time Live Love Duration Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.55, delay: isActive ? 0.15 : 0 }}
        className="w-full max-w-xl glass-panel rounded-3xl p-5 sm:p-6 mb-8 shadow-lg border border-white/90"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>Falling In Love With You For</span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-rose-100 shadow-sm">
            <span className="font-serif font-bold text-xl sm:text-3xl text-rose-800 block">
              {timeElapsed.days}
            </span>
            <span className="text-[11px] text-rose-500 font-medium">Days</span>
          </div>

          <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-rose-100 shadow-sm">
            <span className="font-serif font-bold text-xl sm:text-3xl text-rose-800 block">
              {timeElapsed.hours}
            </span>
            <span className="text-[11px] text-rose-500 font-medium">Hours</span>
          </div>

          <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-rose-100 shadow-sm">
            <span className="font-serif font-bold text-xl sm:text-3xl text-rose-800 block">
              {timeElapsed.minutes}
            </span>
            <span className="text-[11px] text-rose-500 font-medium">Minutes</span>
          </div>

          <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-rose-100 shadow-sm">
            <span className="font-serif font-bold text-xl sm:text-3xl text-rose-600 block animate-pulse">
              {timeElapsed.seconds}
            </span>
            <span className="text-[11px] text-rose-500 font-medium">Seconds</span>
          </div>
        </div>
      </motion.div>

      {/* Timeline Milestones Journey */}
      <div className="relative w-full max-w-xl pl-6 sm:pl-8 border-l-2 border-dashed border-rose-300 space-y-6">
        {milestones.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -25 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
            transition={{
              duration: 0.55,
              delay: isActive ? 0.2 + idx * 0.08 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative group"
          >
            {/* Timeline Bullet Node */}
            <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-rose-300 shadow-md flex items-center justify-center group-hover:scale-110 group-hover:border-rose-500 transition-all">
              {getIcon(item.icon)}
            </div>

            {/* Milestone Card */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl hover:shadow-md hover:border-rose-300/80 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                  {item.tag}
                </span>
                <span className="text-xs text-slate-400 font-medium">{item.date}</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-rose-950">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {item.story}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
