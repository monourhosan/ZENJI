import React, { useState } from 'react';
import { ArrowRight, Check, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const { addToast } = useCart();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubscribed(true);
    addToast('Welcome to the Inner Circle', 'Use VIP code ZENJI10 for 10% off', 'success');
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-[#f4f5f7] text-neutral-900 border-t border-neutral-200/90 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-neutral-200/90 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold block mb-2">
              INNER CIRCLE // PRIVILEGED ACCESS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-neutral-950 mb-2">
              Unlock Private Drop Access
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-mono max-w-md">
              Receive secret archive passkeys 48 hours prior to public releases, plus 10% off your initial purchase.
            </p>
          </div>

          <div className="lg:col-span-6">
            {isSubscribed ? (
              <div className="p-4 rounded-xl bg-white border border-neutral-300 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-neutral-950 uppercase tracking-wider">
                    Access Granted. Welcome to ZENJI.
                  </p>
                  <p className="font-mono text-[11px] text-neutral-600">
                    Your code <span className="font-bold underline text-neutral-950">ZENJI10</span> is active.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white border border-neutral-300 text-neutral-900 font-mono text-xs uppercase placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest font-black rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 font-mono">
                  By joining, you accept our privacy policy. No marketing spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-neutral-200/90 text-xs font-mono">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-neutral-950 text-white font-black text-base flex items-center justify-center font-heading">
                Z
              </div>
              <span className="font-heading font-black text-xl tracking-widest text-neutral-950">
                ZENJI
              </span>
            </div>
            <p className="text-neutral-600 text-xs leading-relaxed max-w-xs">
              Autonomous streetwear design studio engineered for everyday movement and modern metropolitan life.
            </p>
            <div className="flex items-center gap-3 text-neutral-600">
              <a
                href="https://www.instagram.com/zenji_shop/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-950 transition-colors p-1"
                aria-label="ZENJI Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-950 transition-colors p-1"
                aria-label="Twitter / X"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-950 transition-colors p-1"
                aria-label="Discord Community"
              >
                <DiscordIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-950 transition-colors p-1"
                aria-label="YouTube Channel"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-bold text-neutral-950 uppercase tracking-wider mb-4">Catalog</h3>
            <ul className="space-y-2.5 text-neutral-600">
              <li>
                <a href="#collection" onClick={(e) => scrollToSection(e, '#collection')} className="hover:text-neutral-950 transition-colors">
                  Drop 04 (Latest)
                </a>
              </li>
              <li>
                <a href="#collection" onClick={(e) => scrollToSection(e, '#collection')} className="hover:text-neutral-950 transition-colors">
                  Heavyweight Hoodies
                </a>
              </li>
              <li>
                <a href="#collection" onClick={(e) => scrollToSection(e, '#collection')} className="hover:text-neutral-950 transition-colors">
                  Mercerized Tees
                </a>
              </li>
              <li>
                <a href="#collection" onClick={(e) => scrollToSection(e, '#collection')} className="hover:text-neutral-950 transition-colors">
                  Ripstop Cargo
                </a>
              </li>
              <li>
                <a href="#collection" onClick={(e) => scrollToSection(e, '#collection')} className="hover:text-neutral-950 transition-colors">
                  Weatherproof Shells
                </a>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h3 className="font-bold text-neutral-950 uppercase tracking-wider mb-4">Concierge</h3>
            <ul className="space-y-2.5 text-neutral-600">
              <li>
                <a href="#collection" className="hover:text-neutral-950 transition-colors">
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-neutral-950 transition-colors">
                  Size Guide & Matrix
                </a>
              </li>
              <li>
                <span className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Global Shipping Info
                </span>
              </li>
              <li>
                <span className="hover:text-neutral-950 transition-colors cursor-pointer">
                  30-Day Returns Policy
                </span>
              </li>
              <li>
                <span className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Care Instructions
                </span>
              </li>
            </ul>
          </div>

          {/* Studio Atelier */}
          <div>
            <h3 className="font-bold text-neutral-950 uppercase tracking-wider mb-4">Atelier</h3>
            <ul className="space-y-2.5 text-neutral-600">
              <li>
                <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-neutral-950 transition-colors">
                  Brand Philosophy
                </a>
              </li>
              <li>
                <a href="#lookbook" onClick={(e) => scrollToSection(e, '#lookbook')} className="hover:text-neutral-950 transition-colors">
                  Campaign Lookbook
                </a>
              </li>
              <li>
                <span className="text-neutral-900 font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Wasmer Edge Static Deploy</span>
                </span>
              </li>
              <li className="pt-2 text-[10px] text-neutral-500">
                Atelier Tokyo: Shibuya-ku <br />
                Atelier Berlin: Mitte
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Wasmer Ready Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} ZENJI STUDIOS INC. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-950 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-950 transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-neutral-600">Deployable via Wasmer Static Web Server</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
