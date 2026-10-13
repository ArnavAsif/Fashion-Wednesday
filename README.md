# Serotoninn — Next.js Fashion E-Commerce Website

A high-fidelity Next.js implementation of [serotoninn.com](https://serotoninn.com/) ("Where Glam Meets Grunge").

## Features

- **Next.js App Router (TypeScript)**: Clean modular architecture with custom responsive rem styling and Tailwind utilities.
- **Brand Typography**: Includes original custom fonts (`Thunder` woff2 weights 100–900 and `PP Fraktion Mono` otf).
- **Self-Contained Local Assets**: Over 160 extracted images, masks, and backgrounds stored in `/public/images/`.
- **Cinematic Video Showcases**:
  - `CampaignSection`: Campaign video background (`/videos/nastia.mp4`).
  - `BestSection`: Berlin Vibes & Witch Corsets video highlights (`/videos/corset.mp4`).
  - `MotionSection`: "A Vision in Motion" Serotoninn film showcase (`/videos/video_2.mp4`).
- **Interactive Product Catalog**: 57 products loaded into `lib/products.ts` with prices, sizes, colors, and high-res imagery.
- **Cart & Bag Drawer**: Full e-commerce cart state management (`lib/cartContext.tsx`) with real-time add to bag, quantity controls, size selection, subtotal calculation, and persistence in `localStorage`.
- **Real-Time Search Modal**: Instant filtering across all 57 products by keyword, category, and color with popular recommendations.
- **Full Navigation & Categories Menu**: Slide-out menu with category shortcuts and hover highlights.
- **Newsletter Discount Modal**: Sign-up modal for the 10% first-order discount.
- **No Custom Cursor**: Completely removed the custom mouse cursor follower in accordance with user request, preserving the clean, native OS cursor.

## Getting Started

### Development

```bash
npm run dev
# or on a specific port:
npx next dev -p 3001
```

Visit [http://localhost:3000](http://localhost:3000) (or the port specified).

### Production Build & Export

```bash
npm run build
npm start
```
