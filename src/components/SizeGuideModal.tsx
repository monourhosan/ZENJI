import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'tops' | 'bottoms' | 'outerwear' | 'accessories';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('in');

  if (!isOpen) return null;

  const isBottom = category === 'bottoms';

  const topsData = [
    { size: 'S', chestIn: '42-44', chestCm: '106-112', lengthIn: '27.5', lengthCm: '70', shoulderIn: '21.0', shoulderCm: '53' },
    { size: 'M', chestIn: '44-46', chestCm: '112-117', lengthIn: '28.5', lengthCm: '72', shoulderIn: '22.0', shoulderCm: '56' },
    { size: 'L', chestIn: '46-48', chestCm: '117-122', lengthIn: '29.5', lengthCm: '75', shoulderIn: '23.0', shoulderCm: '58' },
    { size: 'XL', chestIn: '48-50', chestCm: '122-127', lengthIn: '30.5', lengthCm: '77', shoulderIn: '24.0', shoulderCm: '61' },
  ];

  const bottomsData = [
    { size: '30', waistIn: '30-31', waistCm: '76-79', inseamIn: '30.0', inseamCm: '76', legOpeningIn: '15.0', legOpeningCm: '38' },
    { size: '32', waistIn: '32-33', waistCm: '81-84', inseamIn: '30.5', inseamCm: '77', legOpeningIn: '15.5', legOpeningCm: '39' },
    { size: '34', waistIn: '34-35', waistCm: '86-89', inseamIn: '31.0', inseamCm: '79', legOpeningIn: '16.0', legOpeningCm: '41' },
    { size: '36', waistIn: '36-37', waistCm: '91-94', inseamIn: '31.5', inseamCm: '80', legOpeningIn: '16.5', legOpeningCm: '42' },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-2xl text-neutral-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sizing chart"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          aria-label="Close size guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-neutral-950 font-semibold">
          <Ruler className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Sizing Specifications</span>
        </div>

        <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-neutral-950 mb-2">
          {isBottom ? 'Trouser & Cargo Matrix' : 'Boxy Silhouette Matrix'}
        </h3>
        <p className="text-xs text-neutral-600 mb-6">
          ZENJI silhouettes feature an intentional relaxed street drape. For an exaggerated streetwear look, take your regular size. For a tailored fit, size down one step.
        </p>

        {/* Unit Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-lg bg-neutral-100 p-1 border border-neutral-200 font-mono text-xs">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded transition-colors ${
                unit === 'in' ? 'bg-neutral-950 text-white font-bold shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded transition-colors ${
                unit === 'cm' ? 'bg-neutral-950 text-white font-bold shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 bg-neutral-50">
                <th className="py-2.5 px-3">SIZE</th>
                {isBottom ? (
                  <>
                    <th className="py-2.5 px-3">WAIST</th>
                    <th className="py-2.5 px-3">INSEAM</th>
                    <th className="py-2.5 px-3">OPENING</th>
                  </>
                ) : (
                  <>
                    <th className="py-2.5 px-3">CHEST</th>
                    <th className="py-2.5 px-3">BODY LENGTH</th>
                    <th className="py-2.5 px-3">SHOULDER</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isBottom
                ? bottomsData.map((row) => (
                    <tr key={row.size} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-neutral-950">{row.size}</td>
                      <td className="py-3 px-3 text-neutral-700">
                        {unit === 'in' ? `${row.waistIn}"` : `${row.waistCm} cm`}
                      </td>
                      <td className="py-3 px-3 text-neutral-700">
                        {unit === 'in' ? `${row.inseamIn}"` : `${row.inseamCm} cm`}
                      </td>
                      <td className="py-3 px-3 text-neutral-700">
                        {unit === 'in' ? `${row.legOpeningIn}"` : `${row.legOpeningCm} cm`}
                      </td>
                    </tr>
                  ))
                : topsData.map((row) => (
                    <tr key={row.size} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-neutral-950">{row.size}</td>
                      <td className="py-3 px-3 text-neutral-700">
                        {unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}
                      </td>
                      <td className="py-3 px-3 text-neutral-700">
                        {unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}
                      </td>
                      <td className="py-3 px-3 text-neutral-700">
                        {unit === 'in' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>MODEL: 6'1" / 185CM WEARING SIZE L</span>
          <button onClick={onClose} className="text-neutral-950 font-bold hover:underline uppercase">
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
