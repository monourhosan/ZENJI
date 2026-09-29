import React, { useState, useEffect } from 'react';
import type { Product } from '../types';

import { useCart } from '../context/CartContext';
import { X, Check, ShoppingBag, Shield, Truck, RefreshCw, Ruler } from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, openCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]?.name || 'Standard');
      setSelectedImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSizeGuide) {
          setShowSizeGuide(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showSizeGuide]);

  if (!product) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
      openCart();
    }, 450);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl text-white overflow-hidden my-auto max-h-[90vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/10 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Imagery with Alternate Thumbnails */}
          <div className="w-full md:w-1/2 bg-[#0c0c0c] flex flex-col relative">
            <div className="relative aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full overflow-hidden bg-[#181818]">
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} - worn by authentic Bangladeshi model (angle ${selectedImageIndex + 1})`}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              {product.tag && (
                <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-widest text-[#ccff00] uppercase rounded font-bold">
                  {product.tag}
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            <div className="flex gap-2 p-4 bg-[#0e0e0e] border-t border-white/10">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-[#ccff00] scale-105' : 'border-white/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1} with authentic Bangladeshi model`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details & Purchase Options */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#ccff00] mb-1">
                {product.category} // ARCHIVAL SPEC
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-1">
                {product.name}
              </h2>
              <p className="text-xs text-neutral-400 font-mono mb-4">{product.subtitle}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-mono text-2xl font-bold text-white">${product.price}</span>
                {product.originalPrice && (
                  <span className="font-mono text-sm text-neutral-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                  Tax Incl.
                </span>
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-neutral-400 uppercase tracking-wider">Color:</span>
                    <span className="text-white font-semibold">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`group relative p-1 rounded-full transition-all ${
                          selectedColor === c.name ? 'ring-2 ring-[#ccff00]' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.name}
                        aria-label={`Select color ${c.name}`}
                      >
                        <span
                          className="block w-6 h-6 rounded-full border border-white/20 shadow"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-neutral-400 uppercase tracking-wider">Select Size:</span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-[11px] text-[#ccff00] hover:underline"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 font-mono text-xs uppercase font-bold rounded border transition-all ${
                        selectedSize === s
                          ? 'bg-white text-black border-white shadow-lg'
                          : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Add to Bag CTA */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-white/15 rounded bg-white/5 font-mono">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-neutral-400 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 py-3.5 px-6 bg-white hover:bg-[#ccff00] text-black font-mono text-xs uppercase tracking-[0.2em] font-black rounded flex items-center justify-center gap-2 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Adding to Bag...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • ${(product.price * quantity).toFixed(0)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description & Specs */}
              <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
                <p className="text-neutral-300 leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 pt-2 border-t border-white/5">
                  <div>
                    <span className="text-neutral-500 uppercase">Weight:</span> {product.weight}
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase">Fabric:</span> {product.fabric}
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 uppercase">Fit:</span> {product.fit}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-white/10 text-[10px] font-mono text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Express Ship</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Authentic Zenji</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </>
  );
};
