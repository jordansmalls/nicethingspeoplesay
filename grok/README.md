# ntps — Nice Things People Say

A simple, private web app to collect and cherish the kind words, compliments, and meaningful messages people have said to you.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Zustand**, **shadcn/ui**, **Tailwind CSS**, **Sonner** (toasts), and **Framer Motion**.

## Features

- Secure user authentication (email + password, httpOnly JWT cookies)
- Create, read, update, delete (CRUD) "nice things"
- List view, detail view, edit & delete with confirmation dialogs
- Optimistic updates + rollback on failure
- Export your collection as JSON or plain text
- Responsive sidebar (collapses to mobile sheet)
- Protected routes with automatic session check
- Notion-inspired minimal black/white aesthetic
- Sonner toasts for success/error feedback
- Date formatting with `Intl.DateTimeFormat` / `date-fns`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Tailwind CSS
- **Toasts**: Sonner
- **Icons**: Lucide React (or Huge Icons)
- **Animations**: Framer Motion
- **HTTP Client**: native `fetch` with `credentials: "include"`
- **Font**: Inter (Google Fonts)
- **Routing**: Next.js App Router with route groups `(auth)` & `(app)`
- **Backend** (assumed): Separate API at `http://localhost:4000` (or proxied)

## Project Structure

```
app/
├── (app)/                  # Protected routes (require login)
│   ├── layout.tsx          # Sidebar + auth guard + modals
│   ├── page.tsx            # Dashboard (/)
│   ├── things/
│   │   ├── page.tsx
│   │   ├── new/
│   │   └── [id]/
│   ├── export/
│   └── account/
├── (auth)/                 # Public routes
│   ├── login/
│   └── signup/
├── layout.tsx              # Root layout (Toaster, fonts…)
components/
├── ui/                     # shadcn/ui components
├── Sidebar.tsx
├── SidebarContent.tsx
├── ThingForm.tsx
├── CreateThingModal.tsx
├── EditThingModal.tsx
├── DeleteThingModal.tsx
lib/
└── api.ts                  # All API fetch wrappers
stores/
└── useAppStore.ts          # Zustand global store
```

## Prerequisites

- Node.js ≥ 18
- pnpm / npm / yarn
- Backend API running at `http://localhost:4000` (or adjust `API_BASE` in `lib/api.ts`)

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/jordansmalls/nicethingspeoplesay
   cd nicethingspeoplesay
   ```

2. Install dependencies

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Copy `.env.example` to `.env.local` (if you have one) and configure if needed

   ```env
   # .env.local
   NEXT_PUBLIC_API_BASE=http://localhost:4000
   ```

4. Start the development server

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

5. (Recommended) Set up proxy in `next.config.mjs` to avoid CORS in dev:

   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'http://localhost:4000/api/:path*',
         },
       ];
     },
   };

   export default nextConfig;
   ```

## Available Scripts

- `npm run dev` / `pnpm dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production build

## Development Notes

- All protected routes are under `(app)` group → automatic auth check in layout
- Modals are used for create/edit/delete (optimistic UI)
- Page-based `/things/new` and `/things/[id]/edit` also exist (optional fallback)
- Never store JWT manually — relies on httpOnly cookie + `credentials: "include"`
- Errors & successes use Sonner toasts
- Empty states + friendly CTAs implemented

## Deployment

1. Deploy frontend to Vercel / Netlify / Render
2. Deploy backend separately (or same host)
3. Update CORS on backend to allow your production domain
4. Set environment variables (especially API base URL)

## License

MIT

---
© 2026 jordan (@jsmallsdev)
```