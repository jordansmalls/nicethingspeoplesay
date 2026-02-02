# ntps - Nice Things People Say

A beautiful, minimal web application for collecting and managing the nice things people say to you. Built with Next.js 15, TypeScript, and a Notion-inspired design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password signup and login with httpOnly cookies
- ✏️ **Full CRUD Operations** - Create, read, update, and delete your things
- 📊 **Dashboard** - View statistics and recent activity at a glance
- 📤 **Export Functionality** - Download your data in JSON or TXT format
- 🎨 **Beautiful UI** - Notion-inspired black and white design with smooth animations
- 🔒 **Protected Routes** - Automatic authentication checks and redirects
- 🌙 **Dark Mode Ready** - Built with dark mode support in mind
- ⚡ **Optimistic Updates** - Instant UI feedback for better UX
- 🎯 **Type Safe** - Fully typed with TypeScript

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend (API)
- RESTful API with JWT authentication
- httpOnly cookie-based sessions
- User and Thing resource management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Backend API** running (see Backend Setup section)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jordansmalls/nicethingspeoplesay
cd nicethingspeopelsay
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ntps-app/
│
├── app/                          # Next.js App Router
│   ├── (app)/                    # Protected routes (requires auth)
│   │   ├── layout.tsx           # Protected layout with sidebar
│   │   ├── page.tsx             # Dashboard
│   │   ├── account/             # Account settings
│   │   ├── export/              # Export & danger zone
│   │   └── things/              # Things CRUD
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
│
├── components/
│   ├── ui/                      # Reusable shadcn/ui components
│   ├── app-sidebar.tsx          # Navigation sidebar
│   └── auth-provider.tsx        # Auth middleware
│
├── lib/
│   ├── api.ts                   # API client functions
│   └── utils.ts                 # Utility functions
│
├── stores/
│   └── useAppStore.ts           # Zustand global state
│
└── [config files]               # TypeScript, Tailwind, etc.
```

## 🔌 API Integration

The frontend expects a backend API with the following endpoints:

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth` | Create new user account |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth` | Get current user |
| PUT | `/api/auth/password` | Update password |
| DELETE | `/api/auth` | Delete account |

### Things Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/things` | Get all things |
| POST | `/api/things` | Create new thing |
| GET | `/api/things/:id` | Get single thing |
| PUT | `/api/things/:id` | Update thing |
| DELETE | `/api/things/:id` | Delete thing |
| DELETE | `/api/things` | Delete all things |
| GET | `/api/things/export?format=json\|txt` | Export things |

### Authentication Flow

- Uses **httpOnly cookies** for JWT storage
- Frontend automatically includes cookies with `credentials: 'include'`
- No manual token management required
- Protected routes redirect to `/login` if not authenticated

## 🎨 Design System

### Color Scheme
The app uses a Notion-inspired monochromatic palette:
- **Light Mode**: White background, black text
- **Dark Mode**: Black background, white text
- **Accents**: Subtle grays for borders and secondary elements

### Typography
- **Font**: Inter Tight (with Inter fallback)
- **Weights**: 300, 400, 500, 600, 700

### Components
All UI components are built with [shadcn/ui](https://ui.shadcn.com/):
- Button
- Input
- Textarea
- Label
- Dialog
- Sidebar

## 📱 Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Dashboard with stats | ✅ |
| `/things` | Manage all things | ✅ |
| `/export` | Export data & danger zone | ✅ |
| `/account` | Account settings | ✅ |
| `/login` | Login page | ❌ |
| `/signup` | Signup page | ❌ |

## 🔒 Security Features

- ✅ httpOnly cookies for JWT storage
- ✅ CSRF protection via SameSite cookies
- ✅ Password minimum length enforcement (8 chars)
- ✅ Client-side route protection
- ✅ Secure password input fields
- ✅ Auto-logout on token expiration

## 🎯 State Management

### Zustand Store Structure

```typescript
{
  // User state
  user: User | null
  isAuthenticated: boolean

  // Things state
  things: Thing[]
  selectedThing: Thing | null

  // UI state
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isDeleteModalOpen: boolean

  // Loading states
  isThingsLoading: boolean
  isMutatingThing: boolean
  isExporting: boolean

  // Error state
  error: string | null
}
```

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

The build will be optimized and ready for deployment.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted

Ensure you set the `NEXT_PUBLIC_API_URL` environment variable.

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Adding New Components

This project uses [shadcn/ui](https://ui.shadcn.com/). To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## 🐛 Troubleshooting

### "Cannot connect to API"
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings on backend

### "Not redirecting after login"
- Clear browser cookies
- Check browser console for errors
- Verify backend returns correct user data

### "Components not styled correctly"
- Run `npm install` to ensure all dependencies are installed
- Check that `tailwind.config.ts` is properly configured
- Clear `.next` cache: `rm -rf .next`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Vercel](https://vercel.com/) - Hosting and deployment
- [Notion](https://notion.so/) - Design inspiration

---

Built with ❤️ using Next.js and TypeScript