import React, { useState } from 'react';
import type { Product } from '../types';

import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product, selectedSize, selectedColor, 1);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 600);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#0e0e0e] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Zoom & Alternate Angle */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#161616] cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={`${product.name} - worn by authentic Bangladeshi streetwear model`}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Secondary / Alternate Angle Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate angle on authentic Bangladeshi streetwear model`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Status Badge */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase font-bold rounded backdrop-blur-md border ${
                product.tag === 'LIMITED DROP'
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : product.tag === 'BESTSELLER'
                  ? 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/30'
                  : 'bg-white/15 text-white border-white/20'
              }`}
            >
              {product.tag}
            </span>
          </div>
        )}

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2.5 px-4 bg-black/80 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 transition-all shadow-lg hover:border-white/40"
          >
            <Eye className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>Quick View & Specs</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Weight Pill */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
            <span>{product.category}</span>
            <span className="text-neutral-500">{product.weight.split(' ')[0]} {product.weight.split(' ')[1]}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-[#ccff00] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-neutral-400 font-mono truncate mb-3">
            {product.subtitle}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-mono text-lg font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-neutral-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Pill Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase mb-2">
            <span>Size:</span>
            <span className="text-white font-bold">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`min-w-[34px] py-1 px-2 text-[11px] font-mono uppercase font-semibold rounded border transition-all ${
                  selectedSize === size
                    ? 'bg-white text-black border-white shadow'
                    : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
                aria-label={`Select size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Color Selector Pills if multiple colors */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-4">
              <span className="text-[10px] font-mono text-neutral-400 uppercase mr-1">Color:</span>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === c.name ? 'ring-2 ring-[#ccff00] ring-offset-1 ring-offset-[#0e0e0e]' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`Color ${c.name}`}
                />
              ))}
            </div>
          )}

          {/* Add to Cart CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-3 px-4 font-mono text-xs uppercase tracking-widest font-bold rounded flex items-center justify-center gap-2 transition-all duration-300 ${
              isAdded
                ? 'bg-[#ccff00] text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]'
                : 'bg-white/10 hover:bg-white text-white hover:text-black border border-white/15 hover:border-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
