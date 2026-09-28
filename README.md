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

### 9. Minimalist Footer & Newsletter
- VIP Newsletter signup with client-side validation, loading state, and promotional reward code (`ZENJI10`).
- Store directory, concierge links, atelier addresses, and social channels.

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
├── dist/                      # Static production output (for Wasmer)
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
├── public/                    # Static assets & favicons
├── src/
│   ├── components/            # Modular React UI components
│   │   ├── BrandStory.tsx     # Editorial manifesto & atelier story
│   │   ├── CartDrawer.tsx     # Slide-over shopping bag with qty & promo
│   │   ├── CheckoutModal.tsx  # Simulated order checkout & confirmation
│   │   ├── Footer.tsx         # Newsletter signup & social channels
│   │   ├── Header.tsx         # Sticky navigation, logo, cart indicator
│   │   ├── Hero.tsx           # Full-bleed fashion hero banner & specs
│   │   ├── LookbookGallery.tsx# Campaign lookbook & enlarged lightbox
│   │   ├── Marquee.tsx        # Infinite streetwear ticker tape
│   │   ├── ProductCard.tsx    # Interactive product card with size pills
│   │   ├── ProductGrid.tsx    # Filterable & sortable collection showcase
│   │   ├── QuickViewModal.tsx # Product details & thumbnail gallery
│   │   ├── SizeGuideModal.tsx # Inches/cm measurement charts
│   │   └── ToastContainer.tsx # Non-intrusive floating feedback toasts
│   ├── context/
│   │   └── CartContext.tsx    # Global cart state, calculations & toasts
│   ├── data/
│   │   └── products.ts        # Comprehensive mock product catalog
│   ├── types/
│   │   └── index.ts           # Strict TypeScript data models
│   ├── App.tsx                # App root layout assembler
│   ├── index.css              # Tailwind v4 theme, fonts, custom styles
│   └── main.tsx               # React application entry point
├── index.html                 # HTML template with SEO tags & Google Fonts
├── package.json               # Dependencies & build scripts
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
