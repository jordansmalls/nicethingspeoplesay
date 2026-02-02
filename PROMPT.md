You are an expert Typescript/NextJS/React  engineer. Your task is to build a complete frontend, that utilizes the backend functionality listed below. You can use shadcn/ui's login block and edit it for a signup screen, or simply set the functionality up with no styling at all (login and signup screens).

## Frontend tech
```json
{
  "frontendTech": {
    "framework": "React/Next.JS",
    "stateManagement": "Zustand",
    "toasts": "sonner",
    "icons": "huge icons",
    "httpClient": "fetch/axios",
    "routing": "Next.js App Router",
    "styling": "Shadcn/Ui & TailwindCSS",
    "motion/animation": "framer motion",
    "description": "minimal application; responsive; notion color scheme (black and white heavy), must have a sidebar, use Inter Tight font from google fonts (or plain Inter), Max content width: 900px, Use whitespace generously",
  }
}
```
## Next.js Architecture Rules
- Use **App Router only** (no /pages directory)
- Use Server Components by default
- Mark interactive components with `"use client"`
- Zustand store must live in `/stores/useAppStore.ts`
- API calls must live in `/lib/api.ts`
- Route groups allowed: `(auth)`, `(app)`

## App Routes

/app/layout.tsx → Root layout with sidebar
/app/page.tsx → Dashboard
/app/things/page.tsx → Things list
/app/things/new/page.tsx → Create thing
/app/things/[id]/page.tsx → View single thing
/app/things/[id]/edit/page.tsx → Edit thing
/app/export/page.tsx → Export screen
/app/account/page.tsx → Account settings
/app/login/page.tsx → Login
/app/signup/page.tsx → Signup


## reusable shadcn/ui components
- button
- sidebar-07 (can be installed with npx add sidebar-07)
- any other components you see fit.
- dialogs (for updating/deleting "things", confirming password update, confirming account deletion)
## schemas/models
```json
{
  "User": {
    "email": "string | required | unique | lowercase | trimmed | valid email format",
    "password": "string | required | min 8 chars | hashed on server | never returned by API",
    "createdAt": "date | auto-generated",
    "updatedAt": "date | auto-generated"
  },
  "Thing": {
    "id": "string | auto-generated",
    "userId": "string | required | reference to User",
    "thing": "string | required | max 500 chars | trimmed",
    "who": "string | required | max 100 chars | trimmed",
    "why": "string | optional | max 1000 chars | trimmed",
    "createdAt": "date | auto-generated",
    "updatedAt": "date | auto-generated"
  }
}
```
## auth controller
```json
{
  "auth endpoints": {
    "signup": {
      "route": "POST /api/auth",
      "access": "public",
      "req": { "email": "string", "password": "string (min 8 chars)" },
      "res_success_201": {
        "_id": "string",
        "email": "string",
        "created": "date",
        "updatedAt": "date",
        "auth": "JWT set in httpOnly cookie"
      },
      "res_errors": [400, 409, 500]
    },
    "checkEmailAvailability": {
      "route": "GET /api/auth/check-email/:email",
      "access": "public",
      "req": { "params": { "email": "string" } },
      "res_success_200": {
        "message": "string",
        "taken": "boolean (true if taken else false)"
      },
      "res_errors": [400, 500]
    },
    "login": {
      "route": "POST /api/auth/login",
      "access": "public",
      "req": { "email": "string", "password": "string" },
      "res_success_200": {
        "_id": "string",
        "email": "string",
        "createdAt": "date",
        "updatedAt": "date",
        "auth": "JWT set in httpOnly cookie"
      },
      "res_errors": [401, 500]
    },
    "logout": {
      "route": "POST /api/auth/logout",
      "access": "public",
      "req": {},
      "res_success_200": {
        "message": "Logged out successfully. Please come back."
      },
      "res_errors": [500]
    },
    "updateAccountPassword": {
      "route": "PUT /api/auth/password",
      "access": "private",
      "req": {
        "currentPassword": "string",
        "newPassword": "string (min 8 chars)"
      },
      "res_success_200": {
        "message": "Password updated successfully"
      },
      "res_errors": [400, 401, 404, 500]
    },
    "deleteAccount": {
      "route": "DELETE /api/auth",
      "access": "private",
      "req": {},
      "res_success_200": {
        "message": "Account deletion successful. Please come back soon."
      },
      "res_errors": [400, 404, 500]
    },
    "fetchUserAccount": {
      "route": "GET /api/auth",
      "access": "private",
      "req": {},
      "res_success_200": {
        "_id": "string",
        "email": "string",
        "createdAt": "date",
        "updatedAt": "date"
      },
      "res_errors": [404]
    }
  }
}

```
## thing controller
```json
{
  "thing endpoints": {
    "createThing": {
      "route": "POST /api/things",
      "access": "private",
      "req": {
        "thing": "string (max 500 chars)",
        "who": "string (max 100 chars)",
        "why": "string (optional, max 1000 chars)"
      },
      "res_success_201": {
        "_id": "string",
        "thing": "string",
        "who": "string",
        "why": "string | null",
        "createdAt": "date",
        "updatedAt": "date"
      },
      "res_errors": [400, 401, 500]
    },
    "getAllThings": {
      "route": "GET /api/things",
      "access": "private",
      "req": {},
      "res_success_200": [
        {
          "_id": "string",
          "thing": "string",
          "who": "string",
          "why": "string | null",
          "createdAt": "date",
          "updatedAt": "date"
        }
      ],
      "res_errors": [401, 500]
    },
    "getThing": {
      "route": "GET /api/things/:id",
      "access": "private",
      "req": { "params": { "id": "string" } },
      "res_success_200": {
        "_id": "string",
        "thing": "string",
        "who": "string",
        "why": "string | null",
        "createdAt": "date",
        "updatedAt": "date"
      },
      "res_errors": [401, 404, 500]
    },
    "updateThing": {
      "route": "PUT /api/things/:id",
      "access": "private",
      "req": {
        "thing": "string (max 500 chars)",
        "who": "string (max 100 chars)",
        "why": "string (optional, max 1000 chars)"
      },
      "res_success_200": {
        "_id": "string",
        "thing": "string",
        "who": "string",
        "why": "string | null",
        "createdAt": "date",
        "updatedAt": "date"
      },
      "res_errors": [400, 401, 404, 500]
    },
    "deleteThing": {
      "route": "DELETE /api/things/:id",
      "access": "private",
      "req": { "params": { "id": "string" } },
      "res_success_200": {
        "message": "Thing deleted successfully"
      },
      "res_errors": [401, 404, 500]
    },
    "deleteAllThings": {
      "route": "DELETE /api/things",
      "access": "private",
      "req": {},
      "res_success_200": {
        "message": "All things deleted successfully"
      },
      "res_errors": [401, 500]
    },
    "exportThings": {
      "route": "GET /api/things/export?format=json|txt",
      "access": "private",
      "req": {
        "query": { "format": "json | txt" }
      },
      "res_success_200": "file download (JSON array or plaintext report)",
      "res_errors": [400, 401, 500]
    }
  }
}
```
## auth/user context
```json
{
  "auth": {
    "type": "JWT in httpOnly cookie",
    "middleware": "protect sets req.user._id",
    "frontendImplication": "send requests without manually adding token; protected routes will auto use backend session"
  }
}
```
## sample data
```json
[
  {
    "thing": "You always make people feel welcome.",
    "who": "Alice",
    "why": "Because I'm new here",
    "createdAt": "2026-02-01T12:00:00Z"
  }
]
```

## tiny helpers
- Format dates: Intl.DateTimeFormat


## State
Things are normalized for CRUD UX. You need to support: list all, create, edit, delete, delete all, and export. So you keep:
- `things[]` → main list
- `selectedThing` → for edit/delete modals
- `isThingsLoading` → fetching list
- `isMutatingThing` → create/update/delete spinner
What You Should NOT Put in Zustand: Do **not** store: Form input values (React local state), Temporary draft text, Inline loading spinners for a single button.
### global app store shape (Zustand)
```ts
type User = {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

type Thing = {
  _id: string
  thing: string
  who: string
  why?: string
  createdAt: string
  updatedAt: string
}
```
### Store: `useAppStore`
```ts
type AppStore = {
  /* ================= USER STATE ================= */
  user: User | null
  isAuthLoading: boolean
  isAuthenticated: boolean

  setUser: (user: User | null) => void
  logoutUser: () => void


  /* ================= THINGS STATE ================= */
  things: Thing[]
  selectedThing: Thing | null

  isThingsLoading: boolean
  isMutatingThing: boolean

  setThings: (things: Thing[]) => void
  addThing: (thing: Thing) => void
  updateThingInState: (thing: Thing) => void
  removeThing: (thingId: string) => void
  clearThings: () => void

  setSelectedThing: (thing: Thing | null) => void


  /* ================= UI STATE ================= */
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isDeleteModalOpen: boolean

  openCreateModal: () => void
  closeCreateModal: () => void
  openEditModal: (thing: Thing) => void
  closeEditModal: () => void
  openDeleteModal: (thing: Thing) => void
  closeDeleteModal: () => void


  /* ================= EXPORT STATE ================= */
  exportFormat: "json" | "txt"
  isExporting: boolean

  setExportFormat: (format: "json" | "txt") => void
  setExporting: (state: boolean) => void


  /* ================= ERROR STATE ================= */
  error: string | null
  setError: (message: string | null) => void
}

```

## State Rules
- Zustand = server cache + global UI only
- React local state = form inputs & transient UI
- Do NOT duplicate server data in component state
## Auth Flow Requirements
- On app load, call `GET /api/auth` to determine session
- If 401/404 → user is logged out
- Store user in Zustand
- Protected routes must redirect to `/login` if `user === null`
- Never store JWT manually — rely on httpOnly cookie
## sidebar (shadcn/ui sidebar-07)
- brand top left (ntps -> "short for nice things people say" + icon from huge icons)
- dashboard
- things
- export
- ___
- account (no profile picture but does display email) -> when clicked settings option (takes to settings screen), logout button (logs user out and directs them to login page)

## UX Rules
- All mutations show loading spinner on button
- All success actions trigger Sonner toast
- All errors show Sonner error toast using error.message
- Delete actions require confirmation dialog
- After create/update → optimistic update in Zustand

## API Client Rules (`/lib/api.ts`)
- Use `fetch`
- Always include `credentials: "include"`
- Throw errors for non-2xx responses
- Export one function per backend endpoint
Example:
```ts
export const login = (data: { email: string; password: string }) =>
  request<User>("/api/auth/login", { method: "POST", body: JSON.stringify(data) })
```
## export behavior
Export buttons must trigger file download via browser, not render JSON on screen

## Define empty states
If no things exist → show friendly empty state with CTA button “Add your first thing”


##  Deliverables
- Fully typed Next.js 15 codebase
- Every controller endpoint wired via lib/api.ts
- Zustand store manages all server state
- All UI built with shadcn/ui classes only (no custom CSS) with basic animation using framer-motion
- Responsive (sidebar collapses on mobile)
- Optimistic updates for better UX


Generate the complete code for the above spec, without verbose affirming text.