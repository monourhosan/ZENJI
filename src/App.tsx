import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { ProductGrid } from './components/ProductGrid';
import { BrandStory } from './components/BrandStory';
import { LookbookGallery } from './components/LookbookGallery';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';

const MainStorefront: React.FC = () => {
  const { openCart } = useCart();

  const handleShopClick = () => {
    const el = document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLookbookClick = () => {
    const el = document.getElementById('lookbook');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#121212] selection:bg-neutral-950 selection:text-white">
      {/* Header */}
      <Header onOpenCart={openCart} />

      <main id="main-content">
        {/* 1. Hero Section */}
        <Hero onShopClick={handleShopClick} onLookbookClick={handleLookbookClick} />

        {/* 2. Marquee Ticker */}
        <Marquee />

        {/* 3. Product Collection */}
        <ProductGrid />

        {/* 4. Brand Story Section */}
        <BrandStory />

        {/* 5. Campaign Lookbook */}
        <LookbookGallery />
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainStorefront />
    </CartProvider>
  );
}
