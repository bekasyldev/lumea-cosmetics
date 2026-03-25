# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server (Vite HMR)
npm run build     # Type-check (tsc -b) + production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Architecture

Single-page marketing/catalog site for a cosmetics retailer in Almaty, Kazakhstan. The ordering flow is: browse → click "Order" → pre-filled WhatsApp message to manager. No backend, no cart, no checkout.

**State management**: None — component-level `useState` only.

**Routing**: `react-router-dom` is installed but not yet wired up. Navigation currently uses plain `<a href>` links with planned paths like `/catalog`, `/favorite`, `/cart`.

**API layer**: None — all product data is hardcoded. WhatsApp integration via `https://wa.me/{number}?text={message}` deep links.

**Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin. Custom colors defined inline (brand pink `#FB6F92`, dark `#33333D`). Custom scroll animation in `index.css`.

**Icons**: `lucide-react` for UI icons; SVG files served from `public/icons/`.

## Component Structure

All components are flat under `src/components/`. Key files:

- `App.tsx` — top-level layout composition
- `HeroSlider.tsx` — auto-rotating carousel with manual controls
- `HitProducts.tsx` — product grid with hardcoded sample data
- `ProductCard.tsx` — individual product tile; handles lazy-load spinner, discount display, and triggers `OrderModal`
- `OrderModal.tsx` — modal dialog that builds and opens a WhatsApp deep link
- `constants/index.ts` — navigation items and header button definitions

## Hardcoded Values to Know

- WhatsApp number: `7053371911` (used in `OrderModal` and footer)
- Store location: Google Maps iframe with Almaty coordinates embedded in `Contact.tsx`
- All product catalog data lives directly in `HitProducts.tsx`
