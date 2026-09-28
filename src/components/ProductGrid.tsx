import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import type { Product, CategoryFilter } from '../types';

import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'All Releases', value: 'all' },
    { label: 'Tops & Hoodies', value: 'tops' },
    { label: 'Bottoms & Cargo', value: 'bottoms' },
    { label: 'Outerwear & Vests', value: 'outerwear' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <section id="collection" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#ccff00] text-xs font-mono uppercase tracking-[0.25em] mb-2">
            <span>SEASON 01 // ARCHIVE COLLECTION</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            Curated Silhouettes
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mt-2 font-normal">
            Precision-cut streetwear essentials crafted from Japanese heavyweight fabrics, finished with weather-resistant technical treatments.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer uppercase text-xs"
              aria-label="Sort products"
            >
              <option value="featured" className="bg-[#141414] text-white">Sort: Featured</option>
              <option value="price-asc" className="bg-[#141414] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#141414] text-white">Price: High to Low</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{filteredProducts.length} Pieces</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          const count = cat.value === 'all' 
            ? PRODUCTS.length 
            : PRODUCTS.filter((p) => p.category === cat.value).length;

          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                isActive
                  ? 'bg-white text-black border-white font-bold shadow-lg'
                  : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/25 hover:bg-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black text-white' : 'bg-white/10 text-neutral-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
