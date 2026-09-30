# ZENJI — Streetwear Without Limits

> **Minimal Luxury Apparel & Urban Fashion Storefront**  
> A high-performance, responsive e-commerce storefront web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, designed for static deployment on **Wasmer**.

---

## ✦ Brand Direction & Aesthetics

**ZENJI (禅時)** is an original streetwear brand identity inspired by:
- **Japanese Brutalism & Minimalist Luxury:** High-density textiles, dropped-shoulder boxy cuts, and utilitarian architectural silhouettes.
- **Editorial Fashion Composition:** Campaign lookbook visuals, high-contrast typography, and cinematic dark-mode palettes.
- **Modern Street Culture:** Small-batch releases, archival codes, and functional technical details.

### Color Direction
- **Primary Canvas:** Jet Black (`#080808`) & Deep Obsidian (`#0e0e0e`)
- **Surfaces & Cards:** Charcoal (`#141414`) & Smoked Glass (`#1c1c1c` with backdrop blur)
- **High-Vis Accent:** Acid Lime (`#CCFF00`)
- **Typography & Text:** Off-White (`#F3F3F3`) & Muted Slate (`#8E8E8E`)

### Typography
- **Headlines:** `Syne` (Bold, avant-garde high-fashion display typeface)
- **Technical Badges & Metrics:** `Space Grotesk` (Precision monospace monospace/tabular font)
- **Body & Interface:** `Inter` & `Plus Jakarta Sans` (Neutral, hyper-legible body typography)

---

## ✦ Key Features & Storefront Structure

### 1. Sticky Responsive Header
- **Dynamic Transition:** Transparent over the hero section; applies glassmorphism (`backdrop-blur-md`, subtle border) upon scrolling.
- **Brand Wordmark:** Stylized typography with Kanji submark (`禅時 • TOKYO`).
- **Smooth Navigation:** In-page smooth scrolling to `#hero`, `#collection`, `#lookbook`, `#about`, and `#footer`.
- **Live Cart Badge:** Real-time counter badge with pulse animation whenever items are added.
- **Mobile Menu Drawer:** Responsive hamburger navigation with full touch support.
- **Announcement Ticker:** Dismissible global shipping and VIP promo code banner.

### 2. Fashion Campaign Hero
- **Visuals:** Full-bleed editorial campaign photography with dark cinematic vignette and subtle ambient grid texture.
- **Typography:** Bold display headline: *"STREETWEAR WITHOUT LIMITS"*.
- **Direct Actions:** "Shop Collection" (smooth scrolls to product grid) and "View Lookbook" actions.
- **Technical Metrics:** Callouts for 480 GSM Loopback Japanese Fleece, Boxy Cut, and 100% Pre-Shrunk Cotton.

### 3. Infinite Streetwear Marquee Tape
- Animated continuous ribbon with brand keywords and Japanese typography (`禅時 // ARCHIVAL PIECES // TOKYO • BERLIN • NYC`).

### 4. Curated Product Collection & Cards
- **Product Filter Tabs:** Filter seamlessly across `All Releases`, `Tops & Hoodies`, `Bottoms & Cargo`, `Outerwear & Vests`, and `Accessories`.
- **Dynamic Sorting:** Sort by `Featured`, `Price: Low to High`, and `Price: High to Low`.
- **Interactive Product Cards:**
  - Image hover transition with alternate lookbook angle preview.
  - Interactive size selection buttons directly on each card (e.g. S, M, L, XL or 30, 32, 34, 36).
  - Multi-colorway selection swatches.
  - Instant Add to Bag feedback with micro-animation.
  - Quick View overlay trigger.
- **Products Catalog:**
  1. **ZENJI Oversized Hoodie** ($89) — Custom 480 GSM loopback French Terry.
  2. **Shadow Essential Tee** ($45) — 280 GSM mercerized compact cotton.
  3. **Urban Cargo Pants** ($110) — Cordura-reinforced ripstop with 8 tactical pockets.
  4. **Midnight Street Jacket** ($150) — 3-layer weatherproof technical storm shell.
  5. **Kuro Tactical Utility Vest** ($125) — 1000D Cordura with Fidlock magnetic buckles.
  6. **Monolith Heavyweight Beanie** ($38) — 100% Australian extra-fine Merino wool.
  7. **Shibuya Acid Wash Longsleeve** ($62) — Mineral washed vintage heavyweight.
  8. **Stealth Crossbody Sling** ($75) — Dimension-Polyant X-Pac waterproof sailcloth.

### 5. Interactive Quick View & Size Guide Modals
- **Quick View Modal:** Deep product inspection with multi-angle gallery thumbnails, detailed specs, material composition, and quantity controls.
- **Size Guide Modal:** Sizing matrix for tops, outerwear, and bottoms with **Inches** and **Centimeters (cm)** measurement toggle.

### 6. Side Cart Drawer Experience
- **Smooth Slide-Out:** Backdrop blur with smooth slide-in animation and keyboard `Escape` dismiss.
- **Real-Time Subtotal:** Automatically calculates `Subtotal = sum(product.price * quantity)`.
- **Quantity Controls:** Increment (`+`), decrement (`-`), and remove item actions.
- **Free Shipping Progress Meter:** Dynamic progress bar calculating remaining amount towards the $120 free worldwide shipping threshold.
- **Interactive Promo Code:** Enter `ZENJI10` for an instant 10% discount across the order subtotal.
- **Simulated Checkout Flow:** Modal flow with pre-filled shipping info, demo payment method selection (Apple Pay, Card, Web3), order summary, and order confirmation receipt (`ZENJI-XXXXXX`).
- **LocalStorage Persistence:** Cart items and promo codes persist across page reloads.

### 7. Brand Story & Editorial Manifesto
- Split editorial layout highlighting brand origin (Tokyo Shibuya & Berlin Mitte).
- Three core pillars: 480 GSM Dense Terry, Zero Deadstock Policy, and Ergonomic Articulation.

### 8. Shibuya Noir Campaign Lookbook
- Curated 3-column photo gallery showcasing pieces in metropolitan settings.
- Lightbox modal allowing customers to inspect high-resolution campaign stills.

### 9. Zen Flow Challenge (Daily Gamified Mindfulness)
- **Concept:** A 60-second peaceful reaction game inspired by meditation apps. Users guide a luminous "Zen Energy Orb" through undulating atmospheric waves and floating particles to collect blooming sacred objects.
- **Sacred Zen Objects:**
  - **Lotus:** Sacred petal geometry (calm rose-quartz glow).
  - **Energy Circle:** Concentric mandala rings with Acid Lime aura.
  - **Crystal:** Hexagonal quartz crystal with prismatic light.
  - **Water Drop:** Translucent droplet with caustic highlight.
  - **Leaf:** Organic botanical leaf with gentle curve.
- **Scoring & Combo System:**
  - Base Hit: `+10` points
  - Fast Reflex Reaction (< 800ms): `+20` points (`+10` base + `+10` speed bonus)
  - Combo Multipliers: Every 5 consecutive hits increases multiplier (`5 hits: x2`, `10 hits: x3`, `15+ hits: x4`)
  - Miss / Background Tap: `-5` points, breaks combo streak
- **Authoritative Anti-Cheat Engine:**
  - Zero-trust model: Client score is never accepted.
  - Generates a deterministic session with PRNG seed (`game_seed`).
  - Client sends raw interaction telemetry: click coordinates, target object IDs, and high-resolution timestamps.
  - Backend verifies:
    1. Minimum legitimate duration (rejects sessions < 55 seconds).
    2. Inhuman reaction reflexes (flags taps under 140ms as automated bots).
    3. Click rate limits and coordinates sanity.
  - Authoritatively calculates score, combo streaks, and assigns verified rankings.
- **Daily Competition & Midnight Reset:**
  - Dynamic daily leaderboards partitioned by server UTC date (`YYYY-MM-DD`).
  - Resets automatically every midnight (`00:00:00` UTC) with a live countdown timer.
  - Daily podium (#1, #2, #3) with user avatars, ranks, and badges.
  - Historical Winners Archive preserving previous champions (e.g. September 30 Winner: Rahim, Score: 5420).
- **Scalable Rewards Architecture:**
  - Relational schema in `db/schema.sql` supporting `badge`, `coins`, `coupons`, `nft`, and `premium_days`.
  - Daily victor receives the prestigious `ZEN MASTER` badge and exclusive 15% VIP store coupon code (`ZENFLOW15`).
- **Synthesized Web Audio Soundscapes:**
  - 100% self-contained Web Audio API synthesizer with zero external audio assets.
  - 432Hz & 528Hz Tibetan singing bowl harmonics, gentle water drops, and crystal chimes.
  - Persistent audio mute toggle saved to user preferences.
- **Accessibility & Mobile-First:**
  - Full touch and cursor interaction (responsive down to 320px screen widths).
  - Strict compliance with `@media (prefers-reduced-motion)` for calming, gentle transitions.

---

## ✦ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Modern Tailwind CSS v4 (`@tailwindcss/vite`) with custom `@theme` tokens
- **Icons:** Lucide React & inline SVGs
- **State Management:** Custom React Context (`useCart`) with `localStorage` synchronization
- **Target Platform:** Wasmer Static Web Server (Edge CDN / WASI)

---

## ✦ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
npm install
```

### Run Locally (Development)
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
This generates optimized static production files in the `dist/` directory:
- `dist/index.html`
- `dist/assets/index-[hash].css`
- `dist/assets/index-[hash].js`

To preview the production build locally:
```bash
npm run preview
```

### Automated Verification & Testing
To execute the automated test suite verifying anti-cheat validation, scoring formulas, combos, and daily leaderboard resets:
```bash
npm test
```

---

## ✦ Wasmer Deployment Guide

ZENJI is architected as a lightweight, 100% static frontend application without server dependencies, making it directly deployable on **Wasmer**.

The repository includes a ready-to-deploy `wasmer.toml` configuration using the official `wasmer/static-web-server`:

### `wasmer.toml`
```toml
[package]
name = "zenji-streetwear"
version = "0.1.0"
description = "ZENJI — Minimal Luxury Streetwear Storefront"
license = "MIT"

[dependencies]
"wasmer/static-web-server" = "^1"

[fs]
"/public" = "dist"

[[command]]
name = "serve"
module = "wasmer/static-web-server:webserver"
runner = "wasi"

[command.annotations.wasi]
env = { "SERVER_ROOT" = "/public", "SERVER_PORT" = "80" }
```

### Steps to Deploy to Wasmer:

1. **Install the Wasmer CLI** (if not already installed):
   - **macOS / Linux:**
     ```bash
     curl https://get.wasmer.io -sSfL | sh
     ```
   - **Windows (PowerShell):**
     ```powershell
     iwr -useb https://win.wasmer.io | iex
     ```

2. **Authenticate with Wasmer:**
   ```bash
   wasmer login
   ```

3. **Build the production bundle:**
   ```bash
   npm run build
   ```

4. **Deploy to Wasmer Edge:**
   ```bash
   wasmer deploy
   ```
   Wasmer will package the static files in `dist/` and launch the storefront on a global edge URL.

---

## ✦ Project Directory Structure

```text
ZENJI/
├── db/                        # Database schemas & migrations
│   └── schema.sql             # Relational PostgreSQL/SQLite tables & anti-cheat audit
├── dist/                      # Static production output (for Wasmer)
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
├── public/                    # Static assets & favicons
├── src/
│   ├── components/            # Modular Storefront UI components
│   │   ├── BrandStory.tsx     # Editorial manifesto & atelier story
│   │   ├── CartDrawer.tsx     # Slide-over shopping bag with qty & promo
│   │   ├── CheckoutModal.tsx  # Simulated order checkout & confirmation
│   │   ├── Footer.tsx         # Newsletter signup, social channels & Zen Flow link
│   │   ├── Header.tsx         # Sticky navigation, logo, cart indicator & Zen Flow trigger
│   │   ├── Hero.tsx           # Full-bleed fashion hero banner & Zen Flow callout
│   │   ├── LookbookGallery.tsx# Campaign lookbook & enlarged lightbox
│   │   ├── Marquee.tsx        # Infinite streetwear ticker tape
│   │   ├── ProductCard.tsx    # Interactive product card with size pills
│   │   ├── ProductGrid.tsx    # Filterable & sortable collection showcase
│   │   ├── QuickViewModal.tsx # Product details & thumbnail gallery
│   │   ├── SizeGuideModal.tsx # Inches/cm measurement charts
│   │   └── ToastContainer.tsx # Non-intrusive floating feedback toasts
│   ├── features/
│   │   └── zen-flow/          # Zen Flow Challenge daily gamified mindfulness
│   │       ├── GameCanvas.tsx # 60 FPS Canvas with particles, waves & Zen Energy Orb
│   │       ├── Leaderboard.tsx# Today's Zen Masters podium, ranks & history archive
│   │       ├── RewardCard.tsx # Scalable rewards display & VIP coupon redemption
│   │       ├── ScoreBoard.tsx # Dynamic score, combo multiplier & mute toggle
│   │       ├── Timer.tsx      # Circular SVG breathing countdown meter
│   │       ├── UserProfileCard.tsx # Zen Level progression & player statistics
│   │       ├── ZenAudio.ts    # Pure Web Audio synthesized 432Hz/528Hz meditation sound
│   │       ├── ZenFlowGame.tsx# Game coordinator managing game loop & screens
│   │       ├── ZenFlowModal.tsx# Accessible dialog wrapper with backdrop blur
│   │       ├── animations.css # Object spawn, glow & combo keyframes
│   │       ├── types.ts       # Feature-specific component interfaces
│   │       └── index.ts       # Clean public module export
│   ├── context/
│   │   └── CartContext.tsx    # Global cart state, calculations & toasts
│   ├── data/
│   │   └── products.ts        # Comprehensive mock product catalog
│   ├── services/
│   │   ├── zenFlowService.ts  # Authoritative anti-cheat & scoring engine
│   │   └── zenFlowService.test.ts # Automated test suite for anti-cheat & scoring
│   ├── types/
│   │   ├── index.ts           # Storefront product & cart data models
│   │   └── zenFlow.ts         # Zen Flow domain models & relational entities
│   ├── App.tsx                # App root layout assembler & Zen Flow modal coordinator
│   ├── index.css              # Tailwind v4 theme, fonts, custom styles
│   └── main.tsx               # React application entry point
├── index.html                 # HTML template with SEO tags & Google Fonts
├── package.json               # Dependencies, build scripts & test runner
├── tsconfig.app.json          # TypeScript compiler configuration
├── vite.config.ts             # Vite configuration with Tailwind CSS v4
├── wasmer.toml                # Wasmer Edge static web server deployment
└── README.md                  # Complete documentation
```

---

## ✦ Accessibility & Performance Checklist

- [x] **Semantic HTML:** Native `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<button>`, and `<table>` elements.
- [x] **Keyboard Navigation:** Modals and drawer dismissible via the `Escape` key; focus states enabled.
- [x] **Responsive Breakpoints:** Tested across Mobile (320px–430px), Tablet (768px), and Desktop (1280px+).
- [x] **Fast Image Optimization:** Responsive Unsplash CDN assets with WebP rendering, lazy loading, and dimension ratios.
- [x] **Zero Server Dependencies:** Static client-side routing and state management ready for CDN distribution.
