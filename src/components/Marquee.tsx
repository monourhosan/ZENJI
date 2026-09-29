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
    <div className="relative py-4 bg-white border-y border-neutral-200/90 overflow-hidden select-none shadow-sm">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 mx-4">
            <span className="font-heading font-black text-xs sm:text-sm tracking-[0.25em] uppercase text-neutral-800">
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 inline-block"></span>
          </div>
        ))}
      </div>
    </div>
  );
};
