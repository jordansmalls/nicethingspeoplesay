# NTPS — Nice Things People Say

A minimal, elegant web application for collecting and cherishing nice things people say about you. Built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Features

- **Collect nice things** — Record compliments, kind words, and positive feedback
- **Organize effortlessly** — View all your things in a clean, scannable list
- **Export anytime** — Download your collection as JSON or plain text
- **Secure by default** — JWT-based authentication with httpOnly cookies
- **Responsive design** — Works beautifully on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Animation | Framer Motion |
| Notifications | Sonner |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on `localhost:4000` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

```bash
# Clone the repository
git clone https://github.com/jordansmalls/nicethingspeoplesay
cd nicethingspeoplesay

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000  # Backend API base URL
```

## Project Structure

```
app/
├── (app)/              # Protected routes with sidebar layout
│   ├── things/         # Thing management routes
│   ├── export/         # Data export page
│   ├── account/        # Account settings
│   └── page.tsx        # Dashboard
├── (auth)/             # Authentication routes (no sidebar)
│   ├── login/
│   └── signup/
components/
├── ui/                 # shadcn/ui components
├── app-sidebar.tsx     # Main navigation sidebar
├── thing-card.tsx      # Thing display component
├── create-thing-dialog.tsx
├── edit-thing-dialog.tsx
├── delete-thing-dialog.tsx
└── empty-state.tsx
lib/
├── api.ts              # API client (all backend endpoints)
└── utils.ts            # Utilities (cn, formatDate)
stores/
└── useAppStore.ts      # Zustand store (auth, things, UI state)
types/
└── index.ts            # TypeScript interfaces
```

## API Integration

The frontend expects a REST API with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth` | Sign up |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth` | Fetch current user |
| PUT | `/api/auth/password` | Update password |
| DELETE | `/api/auth` | Delete account |
| GET | `/api/auth/check-email/:email` | Check email availability |
| GET | `/api/things` | List all things |
| POST | `/api/things` | Create thing |
| GET | `/api/things/:id` | Get single thing |
| PUT | `/api/things/:id` | Update thing |
| DELETE | `/api/things/:id` | Delete thing |
| DELETE | `/api/things` | Delete all things |
| GET | `/api/things/export?format=json\|txt` | Export things |

Authentication uses JWT in httpOnly cookies. All requests include `credentials: "include"`.

## Design Principles

- **Minimal aesthetic** — Black, white, and subtle grays. No distractions.
- **Generous whitespace** — Content breathes at 900px max-width.
- **Motion with purpose** — Subtle Framer Motion transitions for polish.
- **Accessibility first** — Keyboard navigable, screen reader friendly.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT