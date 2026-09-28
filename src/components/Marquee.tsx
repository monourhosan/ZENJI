import React from 'react';

export const Marquee: React.FC = () => {
  const items = [
    'ZENJI // ARCHIVAL DROP 04',
    '禅時 // TOKYO • BERLIN • NEW YORK',
    '480 GSM HEAVYWEIGHT JAPANESE FLEECE',
    'WORLDWIDE CARBON-NEUTRAL EXPRESS',
    'MINIMAL LUXURY SILHOUETTES',
    'ARCHIVAL DURABILITY',
    'ZERO MASS HARDWARE',
  ];

  return (
    <div className="relative py-4 bg-[#0e0e0e] border-y border-white/10 overflow-hidden select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 mx-4">
            <span className="font-heading font-black text-xs sm:text-sm tracking-[0.25em] uppercase text-neutral-300">
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] inline-block"></span>
          </div>
        ))}
      </div>
    </div>
  );
};
