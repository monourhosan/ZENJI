import React, { useState } from 'react';
import { Camera, Maximize2, X } from 'lucide-react';

export const LookbookGallery: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const lookbookItems = [
    {
      id: 'look-1',
      title: 'Monolith Silhouette',
      subtitle: 'Oversized Hoodie & Heavyweight Beanie',
      location: 'Shibuya Underpass // 01:24 AM',
      image: '/images/bangladeshi-lookbook-monolith.webp',
      alt: 'Bangladeshi model wearing Monolith oversized hoodie and heavyweight knit beanie in Dhaka underpass',
    },
    {
      id: 'look-2',
      title: 'Tactical Ergonomics',
      subtitle: 'Midnight Street Jacket & Urban Cargo Pants',
      location: 'Ginza High-Rise Brutalism',
      image: '/images/bangladeshi-lookbook-tactical.webp',
      alt: 'Bangladeshi female streetwear model wearing tactical storm jacket and urban cargo trousers in Dhaka',
    },
    {
      id: 'look-3',
      title: 'Raw Concrete Contrast',
      subtitle: 'Shadow Essential Tee in Bone White',
      location: 'Berlin Mitte Atelier Corridor',
      image: '/images/bangladeshi-lookbook-tee.webp',
      alt: 'Bangladeshi designer wearing bone white shadow essential boxy streetwear tee in Dhaka design atelier',
    },
  ];

  return (
    <section id="lookbook" className="py-24 sm:py-32 bg-[#080808] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#ccff00] text-xs font-mono uppercase tracking-[0.25em] mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Campaign Visuals // Drop 04</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
              Shibuya Noir Lookbook
            </h2>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm font-mono max-w-md">
            Documenting the interplay between brutalist architecture, midnight downpours, and architectural drapery.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {lookbookItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#121212] border border-white/10 hover:border-white/30 cursor-pointer transition-all duration-500 shadow-xl"
              onClick={() => setActiveImage(item.image)}
            >
              <img
                src={item.image}
                alt={item.alt || item.title}
                className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* Card Meta Content */}
              <div className="absolute inset-x-5 bottom-5 flex flex-col justify-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ccff00] mb-1">
                  {item.location}
                </span>
                <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-white mb-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-300 font-mono mb-3">
                  {item.subtitle}
                </p>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>Enlarge Still</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Close lookbook still"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt={lookbookItems.find((item) => item.image === activeImage)?.alt || 'Bangladeshi streetwear editorial lookbook expanded still'}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20"
          />
        </div>
      )}
    </section>
  );
};
