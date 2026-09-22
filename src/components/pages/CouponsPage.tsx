import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Ticket, CheckCircle2, RotateCcw } from 'lucide-react';
import { LoveCoupon } from '../../types';

interface CouponsPageProps {
  coupons: LoveCoupon[];
  isActive?: boolean;
  onToggleRedeem: (id: string) => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({ coupons, isActive = false, onToggleRedeem }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center select-none pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, delay: isActive ? 0.1 : 0 }}
        className="text-center mb-6 pt-2"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs mb-2 shadow-xs">
          <Ticket className="w-3.5 h-3.5 text-rose-600" />
          <span>No Expiration Date • Redeem Anytime</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-rose-950 tracking-tight drop-shadow-xs">
          Heartfelt Love Coupons
        </h2>
        <p className="text-xs sm:text-sm text-rose-800 font-medium mt-1.5 max-w-md mx-auto">
          Valid anytime, anywhere. Simply tap "Redeem Pass" whenever you want to cash one in!
        </p>
      </motion.div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {coupons.map((coupon, idx) => {
          return (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 25, scale: 0.95 }}
              transition={{
                duration: 0.5,
                delay: isActive ? 0.15 + idx * 0.08 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md ${
                coupon.redeemed
                  ? 'bg-slate-50/95 border-dashed border-slate-300 opacity-75'
                  : 'bg-white/95 backdrop-blur-md border-rose-200 hover:border-rose-400 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Ticket Notches */}
              <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#fdf8f5] border-r-2 border-rose-300" />
              <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#fdf8f5] border-l-2 border-rose-300" />

              {/* Coupon Content */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-3xl sm:text-4xl select-none filter drop-shadow-sm">{coupon.emoji}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    VIP Pass
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-rose-950 leading-snug">
                  {coupon.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {coupon.description}
                </p>
              </div>

              {/* Redeem Stamp Overlay when redeemed */}
              {coupon.redeemed && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                  <div className="transform -rotate-12 border-4 border-rose-600 rounded-2xl px-4 py-2 text-rose-600 font-serif font-extrabold text-sm sm:text-base tracking-widest uppercase shadow-md bg-white/95 flex items-center gap-1.5 animate-in zoom-in-90 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-rose-600" />
                    <span>REDEEMED WITH LOVE</span>
                  </div>
                </div>
              )}

              {/* Footer Redeem Action */}
              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
                <span className="text-[11px] text-rose-600 font-medium">
                  {coupon.redeemed ? `Used on ${coupon.redeemedAt || 'Today'}` : 'Single use with hugs'}
                </span>

                <button
                  onClick={() => onToggleRedeem(coupon.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    coupon.redeemed
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center gap-1'
                      : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md shadow-rose-500/25 active:scale-95'
                  }`}
                >
                  {coupon.redeemed ? (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-activate</span>
                    </>
                  ) : (
                    <span>Redeem Pass ✨</span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
