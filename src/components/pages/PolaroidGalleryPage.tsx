import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, RotateCw, X, ZoomIn, Calendar, MapPin } from 'lucide-react';
import { PolaroidMemory } from '../../types';

interface PolaroidGalleryPageProps {
  memories: PolaroidMemory[];
  isActive?: boolean;
}

export const PolaroidGalleryPage: React.FC<PolaroidGalleryPageProps> = ({
  memories,
  isActive = false,
}) => {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [lightboxItem, setLightboxItem] = useState<PolaroidMemory | null>(null);

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center select-none pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, delay: isActive ? 0.1 : 0 }}
        className="text-center mb-6 pt-2"
      >
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-rose-950 tracking-tight drop-shadow-xs">
          Polaroid Memories
        </h2>
        <p className="text-xs sm:text-sm text-rose-800 font-medium mt-1.5 max-w-md mx-auto">
          Tap any polaroid to flip and read the secret memory written on the back.
        </p>
      </motion.div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-3xl">
        {memories.map((mem, index) => {
          const isFlipped = !!flippedIds[mem.id];

          return (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, y: 35, scale: 0.9 }}
              animate={
                isActive
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 35, scale: 0.9 }
              }
              transition={{
                duration: 0.55,
                delay: isActive ? 0.15 + index * 0.08 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative perspective-1000 group cursor-pointer transition-all duration-500 hover:z-20"
              style={{
                transform: `rotate(${mem.rotation}deg)`,
              }}
              onClick={(e) => toggleFlip(mem.id, e)}
            >
              {/* Cute Washi Tape at Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-rose-200/80 backdrop-blur-sm shadow-sm z-20 transform -rotate-2 rounded-sm border border-rose-300/40 transition-transform duration-500 group-hover:scale-105" />

              {/* Card Container with 3D Flip and Soft Bulge Up */}
              <div
                className={`relative w-full aspect-[4/5] rounded-2xl transition-all duration-500 transform-style-3d shadow-[0_12px_28px_rgba(0,0,0,0.08)] group-hover:shadow-[0_24px_45px_rgba(244,63,94,0.24)] group-hover:scale-[1.05] group-hover:-translate-y-3.5 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : undefined,
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* FRONT: Polaroid Photo */}
                <div
                  className="absolute inset-0 w-full h-full bg-white p-3 pb-8 rounded-2xl flex flex-col justify-between backface-hidden border border-rose-100/60"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="relative w-full h-[78%] rounded-xl overflow-hidden bg-rose-50 shadow-inner">
                    <img
                      src={mem.imageUrl}
                      alt={mem.caption}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-[1.03] transition-all duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Soft Bulge Lighting Highlight on Hover */}
                    <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Zoom button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem(mem);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
                      title="Enlarge photo"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 text-center">
                    <p className="font-handwriting text-lg sm:text-xl font-bold text-slate-800 truncate">
                      {mem.caption}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-rose-500 font-sans">
                      <span>{mem.date}</span>
                      {mem.location && <span>• {mem.location}</span>}
                    </div>
                  </div>
                </div>

                {/* BACK: Handwritten Secret Note */}
                <div
                  className="absolute inset-0 w-full h-full bg-amber-50/95 border border-amber-200/80 p-5 rounded-xl flex flex-col justify-between backface-hidden rotate-y-180 shadow-inner"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-rose-200/60 pb-1 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
                        Memory Note
                      </span>
                      <RotateCw className="w-3 h-3 text-rose-400" />
                    </div>
                    <p className="font-handwriting text-base sm:text-lg text-rose-900 leading-snug">
                      "{mem.backNote}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-rose-400 font-sans pt-2 border-t border-rose-200/40">
                    <span>{mem.date}</span>
                    <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-white p-4 pb-6 rounded-2xl shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.caption}
              className="w-full max-h-[65vh] object-contain rounded-lg"
            />
            <h3 className="mt-4 font-handwriting text-2xl font-bold text-rose-950 text-center">
              {lightboxItem.caption}
            </h3>
            <p className="text-xs text-rose-600 font-sans mt-1">
              {lightboxItem.date} {lightboxItem.location ? `• ${lightboxItem.location}` : ''}
            </p>
            <p className="mt-2 text-sm text-slate-700 font-serif italic text-center max-w-md">
              "{lightboxItem.backNote}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
