import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { CelestialAtmosphere } from './components/CelestialAtmosphere';
import { DayNightCycleWidget } from './components/DayNightCycleWidget';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { ProductGrid } from './components/ProductGrid';
import { BrandStory } from './components/BrandStory';
import { LookbookGallery } from './components/LookbookGallery';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { ZenFlowModal } from './features/zen-flow';

const MainStorefront: React.FC = () => {
  const { openCart } = useCart();
  const [isZenFlowOpen, setIsZenFlowOpen] = React.useState(false);

  const handleShopClick = () => {
    const el = document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLookbookClick = () => {
    const el = document.getElementById('lookbook');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="zenji-app-wrapper relative min-h-screen bg-[#fbfbfb] text-[#121212] selection:bg-neutral-950 selection:text-white transition-colors duration-[2600ms]">
      {/* 27-second Celestial Atmosphere (Dawn & Dusk ambient wave) */}
      <CelestialAtmosphere />

      {/* Floating 27-second Day / Night Cycle Controller HUD */}
      <DayNightCycleWidget />

      {/* Header */}
      <Header
        onOpenCart={openCart}
        onOpenZenFlow={() => setIsZenFlowOpen(true)}
      />

      <main id="main-content" className="relative z-10">
        {/* 1. Hero Section */}
        <Hero
          onShopClick={handleShopClick}
          onLookbookClick={handleLookbookClick}
          onOpenZenFlow={() => setIsZenFlowOpen(true)}
        />

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
      <Footer onOpenZenFlow={() => setIsZenFlowOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Zen Flow Daily Challenge Modal */}
      <ZenFlowModal
        isOpen={isZenFlowOpen}
        onClose={() => setIsZenFlowOpen(false)}
      />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <MainStorefront />
      </CartProvider>
    </ThemeProvider>
  );
}
