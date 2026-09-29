import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenLookbook?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { totalCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (totalCount > 0) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalCount]);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Collection', href: '#collection' },
    { name: 'Lookbook', href: '#lookbook' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#footer' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Top Ticker / Announcement Bar */}
      {showBanner && (
        <div className="bg-[#121212] border-b border-[#242424] text-xs py-2 px-4 text-center text-neutral-300 font-mono tracking-widest relative z-50 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
          <span className="font-medium text-white">DROP 04 LIVE</span>
          <span className="hidden sm:inline text-neutral-500">—</span>
          <span className="hidden sm:inline">FREE WORLDWIDE SHIPPING ON ORDERS OVER $120</span>
          <span className="hidden md:inline text-neutral-500">//</span>
          <span className="hidden md:inline text-[#ccff00] font-bold">USE CODE "ZENJI10" FOR 10% OFF</span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#fbfbfb]/90 backdrop-blur-md border-b border-neutral-200/80 shadow-sm py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Kanji Submark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center gap-2.5 text-neutral-950 tracking-tighter"
            aria-label="ZENJI Home"
          >
            <div className="w-8 h-8 rounded bg-neutral-950 text-white font-black text-lg flex items-center justify-center font-heading transition-transform group-hover:scale-105 shadow-sm">
              Z
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-widest text-neutral-950 leading-none">
                ZENJI
              </span>
              <span className="font-mono text-[9px] tracking-[0.28em] text-neutral-500 uppercase leading-tight">
                禅時 • TOKYO
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-neutral-600">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative py-1 text-neutral-600 hover:text-neutral-950 transition-colors duration-200 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neutral-950 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Action Icons: Currency + Bag + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* VIP Drop Pill */}
            <a
              href="#collection"
              onClick={(e) => handleNavClick(e, '#collection')}
              className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 rounded-full px-3 py-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-neutral-900" />
              <span>AW26 Collection</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-900 shadow-sm transition-all hover:scale-105 active:scale-95 group"
              aria-label={`View Shopping Bag, ${totalCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-neutral-900 transition-transform group-hover:-translate-y-0.5" />
              {totalCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-neutral-950 text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center transition-transform ${
                    badgeBump ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 px-6 py-8 transition-all animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <nav className="flex flex-col gap-5 text-sm uppercase tracking-widest font-mono">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between text-neutral-700 hover:text-neutral-950 py-2 border-b border-neutral-100"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>REGION: GLOBAL (USD $)</span>
                <span className="text-neutral-900 font-bold">DROP 04 ACTIVE</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full py-3 bg-neutral-950 text-white font-bold uppercase tracking-wider text-xs rounded flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Open Shopping Bag ({totalCount})</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
