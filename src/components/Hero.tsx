import React from 'react';
import { ArrowDown, ArrowRight, ShieldCheck, Flame, Layers } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onLookbookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onLookbookClick }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Editorial Imagery with Dark Cinematic Vignette */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="/images/bangladeshi-streetwear-hero.webp"
          alt="Authentic Bangladeshi streetwear model walking through Dhaka city streets at night in oversized minimalist hoodie"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
          loading="eager"
        />
        {/* Layered Gradients for High Readability and Streetwear Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/50 to-transparent"></div>
        <div className="absolute inset-0 subtle-grid opacity-25"></div>
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full flex flex-col justify-end min-h-[85vh]">
        <div className="max-w-3xl">
          {/* Metadata Tag */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-mono tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span>
            <span>AW26 EDITORIAL // DROP 04 LIVE</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300">LIMITED TO 350 PIECES</span>
          </div>

          {/* Primary Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase text-white leading-[0.95] mb-6 drop-shadow-md">
            Streetwear <br />
            <span className="text-stroke text-white/95">Without Limits</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-neutral-300 font-normal max-w-xl mb-10 leading-relaxed drop-shadow">
            Minimal design. Premium comfort. Built for everyday movement. Engineered with custom 480&nbsp;GSM Japanese loopback terry and bonded technical hardware.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onShopClick}
              className="group px-8 py-4 bg-white text-black hover:bg-[#ccff00] transition-all duration-300 font-mono text-xs uppercase tracking-[0.2em] font-bold rounded flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onLookbookClick}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 transition-all duration-300 font-mono text-xs uppercase tracking-[0.2em] font-semibold rounded flex items-center justify-center gap-2 backdrop-blur-sm hover:border-white/40"
            >
              <span>View Lookbook</span>
            </button>
          </div>

          {/* Key Streetwear Specs / Badges */}
          <div className="grid grid-cols-3 gap-4 pt-12 mt-12 border-t border-white/10 max-w-lg">
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ccff00]" /> 480 GSM
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Japanese Fleece
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#ccff00]" /> Boxy Cut
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Modular Layers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ccff00]" /> 100% Cotton
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Pre-Shrunk Finish
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <a
        href="#collection"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors group cursor-pointer"
        aria-label="Scroll to collection"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-70 group-hover:opacity-100">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 animate-bounce text-neutral-400 group-hover:text-white" />
      </a>
    </section>
  );
};
