import React from 'react';
import { Compass, Sparkles, Feather, ShieldCheck } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0a0a0a] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Manifesto & Values */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-[#ccff00] text-xs font-mono uppercase tracking-[0.25em] mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>Brand Manifesto // 禅時</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-[1.05]">
                Modern Street Culture <br />
                <span className="text-stroke text-white/90">&amp; Timeless Form</span>
              </h2>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                <strong className="text-white font-semibold">ZENJI</strong> represents modern street culture through clean silhouettes, premium materials, and timeless everyday pieces.
              </p>
              <p className="text-neutral-400">
                Conceived between Tokyo’s sub-street ateliers and Berlin’s industrial art districts, we reject fast-fashion trends in favor of permanent wardrobe pillars. Every garment is proportioned with intention, using high-density loopback terry, precision darting, and architectural seams designed to move with the body.
              </p>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Feather className="w-5 h-5 text-[#ccff00] mb-2" />
                <h3 className="font-heading font-bold text-sm uppercase text-white mb-1">
                  480 GSM Dense Terry
                </h3>
                <p className="text-xs text-neutral-400">
                  Custom-milled in Wakayama, Japan on vintage loopwheel knitting machines for superior density.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Sparkles className="w-5 h-5 text-[#ccff00] mb-2" />
                <h3 className="font-heading font-bold text-sm uppercase text-white mb-1">
                  Zero Deadstock
                </h3>
                <p className="text-xs text-neutral-400">
                  Produced in strictly limited batches of 350 pieces per drop to eliminate planetary textile waste.
                </p>
              </div>
            </div>

            {/* Signature Quote */}
            <div className="p-5 border-l-2 border-[#ccff00] bg-white/[0.02]">
              <p className="font-mono text-xs sm:text-sm text-neutral-300 italic">
                "We don't manufacture clothing for seasons. We engineer garments for living in the concrete metropolis."
              </p>
              <span className="block mt-2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                — ZENJI DESIGN ATELIER, TOKYO
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary High Fashion Portrait */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/15 shadow-2xl bg-[#141414]">
                <img
                  src="/images/bangladeshi-brand-story-model.webp"
                  alt="Authentic Bangladeshi high-fashion model wearing minimalist architectural luxury streetwear"
                  className="w-full h-full object-cover object-center filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Floating Tag */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[#ccff00] uppercase font-bold block text-[10px]">
                      LOOKBOOK SERIES // 04
                    </span>
                    <span className="text-white">SHIBUYA CONCRETE DIARIES</span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-neutral-400" />
                </div>
              </div>

              {/* Offset Accent Card */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 p-4 rounded-xl bg-[#161616] border border-white/15 shadow-2xl max-w-[200px] backdrop-blur-md">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                  ATELIER ORIGIN
                </span>
                <p className="font-mono font-bold text-xs text-white">
                  35°39'31"N 139°42'05"E
                </p>
                <p className="text-[10px] font-mono text-[#ccff00] mt-0.5">
                  TOKYO METROPOLIS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
