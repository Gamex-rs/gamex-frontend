# Gamex — Frontend Application Specification

> **Repository:** `gamex-rs/gamex-frontend`  
> **Version:** 1.0  
> **Date:** 2026-05-12

---

## 1. Purpose

The Gamex frontend is a mobile-first single-page application (SPA) that provides the user interface for browsing the game catalog, managing a personal game library, posting and discovering listings, exchanging messages, and receiving real-time notifications.

---

## 2. Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript (strict mode) |
| Build tool | Vite |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query) v5 |
| Client state | Zustand |
| Styling | Tailwind CSS v3 |
| UI components | shadcn/ui (Radix UI primitives + Tailwind) |
| Forms | React Hook Form + Zod |
| Real-time | SignalR client (`@microsoft/signalr`) |
| i18n | react-i18next |
| HTTP client | Axios (with interceptors for JWT refresh) |
| Deployment | Cloudflare Pages |

---

## 3. Routes

| Route | Page | Auth required | Notes |
|---|---|---|---|
| `/` | Home — listing feed | No | Default filter: all active listings |
| `/games` | Game catalog browse | No | |
| `/games/:id` | Game detail + listings for this game | No | |
| `/listings` | All listings (filterable) | No | |
| `/listings/:id` | Listing detail | No | |
| `/users/:id` | Public user profile | No | |
| `/login` | Login | No | Redirect to `/` if already authenticated |
| `/register` | Register | No | Redirect to `/` if already authenticated |
| `/auth/callback` | OAuth callback handler | No | Handles Google / Facebook redirect |
| `/library` | Own game library | Yes | |
| `/library/add` | Add game to library | Yes | |
| `/messages` | Conversation list | Yes | |
| `/messages/:conversationId` | Conversation detail | Yes | |
| `/notifications` | Notification list | Yes | |
| `/profile` | Edit own profile | Yes | |
| `/admin/*` | Admin panel | Admin role | |

Unauthenticated users accessing protected routes are redirected to `/login` with a `?redirect` parameter to return after login.

---

## 4. Layout & Navigation

### Mobile (< 768px)

- **Bottom navigation bar** with 5 tabs: Home, Search, Library, Messages, Profile
- Notification badge on the Messages or Profile tab
- Hamburger menu for secondary links (About, FAQ, etc.)

### Tablet & Desktop (≥ 768px)

- **Top navigation bar** with logo, main links, notification bell, and user avatar dropdown
- Sidebar filters on catalog/listing pages

---

## 5. Key Pages

### 5.1 Home (`/`)

- Feed of active listings (exchange + sale), most recent first
- Horizontal filter chips: All / Exchange / Sale / Want to Buy
- Each listing card shows: game cover, title, platform badges, type badge, user avatar + name, city, price (if for sale), condition
- **Library status badge** on the game cover: "Owned" (green) or "Wishlist" (blue) shown for authenticated users — populated via `useGameLibraryStatuses`
- Infinite scroll pagination (cursor-based)

### 5.2 Game Catalog (`/games`)

- Search bar with autocomplete (debounced, hits `/api/v1/games/search`)
- Filter panel: platform, genre
- When authenticated and platform preferences are set, the platform filter is pre-populated with the user's preferences and the `platformIds` filter is sent automatically; the user can still override it manually
- Game card grid: cover art, title, platforms, aggregate stats (owned / wishlist / exchange counts)
- **Library status badge** on each game card cover: "Owned" or "Wishlist" for authenticated users

### 5.3 Game Detail (`/games/:id`)

- Header: cover image, title, platforms, genres, release date, metacritic score
- **Library status badge** prominently displayed on the cover (Owned / Wishlist) for authenticated users
- Aggregate stats bar: X users own this · Y have it on their wishlist · Z want to exchange
- Active listings for this game (exchange + sale) — same card component as Home
- "Add to my library" CTA button (opens library add flow); if the game is already in the user's library, shows "Edit library entry" instead

### 5.4 Library Add / Edit (`/library/add`, edit via `/library`)

Multi-step form:

1. **Search game** — autocomplete from Game Catalog; selecting a game captures the snapshot (title, release date, score, platforms, cover URL)
2. **Set statuses** — toggle: Owned / Wishlist / For Exchange / For Sale / Want to Buy
3. **Listing details** (shown only if For Exchange or For Sale is active):
   - Format: Physical / Digital
   - Condition (if Physical): New / Like New / Good / Acceptable
   - Price (if For Sale): number input
   - Preferred games (if For Exchange): free text
   - Notes: free text
4. **Confirm** — preview and submit

### 5.5 Platform Preferences — Registration & Profile

**During registration** (step shown after email/password entry):

- Grid of platform checkboxes loaded from `GET /api/v1/platforms` (Game Catalog Service)
- User selects one or more platforms of interest
- Step is skippable — platforms can be set later
- Selected `platformIds` are submitted with the registration request

**In profile settings (`/profile`):**

- "My Platforms" section with the same checkbox grid, pre-checked with current preferences
- Saving calls `PUT /api/v1/users/me/platforms`
- `authStore` platform preferences are updated immediately on success so filtering takes effect without requiring a re-login

On submit, the full game snapshot plus statuses are sent to `POST /api/v1/users/me/library`.

### 5.5 Messages (`/messages`, `/messages/:conversationId`)

- Left panel (desktop) / own page (mobile): conversation list with unread badge
- Right panel (desktop) / own page (mobile): message thread
- Text input at bottom with send button
- Real-time updates via SignalR (`MessageReceived` event)
- Opening a conversation calls `PUT /conversations/{id}/read`

### 5.6 Notifications (`/notifications`)

- List of notifications grouped by date
- Unread notifications highlighted
- Each notification links to the relevant resource (conversation, listing, user profile)
- "Mark all as read" button
- Unread count badge in top navigation updated in real time via SignalR (`UnreadCountUpdated` event)

---

## 6. Authentication Flow

### Email / Password

1. User submits login form → `POST /api/v1/auth/login`
2. Store `accessToken` in memory (Zustand), `refreshToken` in `HttpOnly` cookie (or `localStorage` with XSS considerations — decision to be made before implementation)
3. Axios request interceptor: attach `Authorization: Bearer <accessToken>` to every request
4. Axios response interceptor: on 401, attempt silent refresh via `POST /api/v1/auth/refresh`, retry original request once

### OAuth (Google / Facebook)

1. User clicks "Continue with Google/Facebook" → frontend redirects to `/api/v1/auth/oauth/google` (or facebook)
2. User authenticates with provider → provider redirects to `/api/v1/auth/oauth/google/callback`
3. Backend issues JWT pair → redirects to `/auth/callback?token=<accessToken>&refreshToken=<refreshToken>`
4. Frontend `/auth/callback` page extracts tokens from URL, stores them, redirects to `/` or the original `?redirect` destination

### Sign Out

Call `POST /api/v1/auth/logout` → clear tokens from storage → redirect to `/`

---

## 7. State Management

| Store | Responsibility |
|---|---|
| `authStore` (Zustand) | Current user, access token, login/logout actions, **user's platform preferences** |
| `notificationStore` (Zustand) | Unread notification count, SignalR connection state |
| Server state | All API data managed by TanStack Query (no duplication in Zustand) |

### Platform Preference Auto-Filter

When a user logs in, the frontend fetches `GET /api/v1/users/me/platforms` and stores the result in `authStore`. Every hook that queries game listings (`useGames`, `useListings`) reads the platform preferences from `authStore` and automatically appends `platformIds` to the request when the user is authenticated and has preferences set. Guest users and users with no preferences set receive unfiltered results.

```ts
// Example in useGames hook
const { platformIds } = useAuthStore();
const params = {
  ...filters,
  ...(platformIds.length > 0 && { platformIds }),
};
```

### Library Status Tags

To annotate game cards with "Owned" or "Wishlist" badges, the frontend uses a `useGameLibraryStatuses(gameIds: string[])` hook. This hook calls `GET /api/v1/users/me/library/statuses?gameIds=...` with the IDs of games currently visible on the page (typically 20 per page). The result is cached by TanStack Query and reused across components for the same game IDs. The hook returns `null` and skips the API call when the user is not authenticated.

---

## 8. Real-Time (SignalR)

Two persistent SignalR connections are established after login:

| Hub | URL | Purpose |
|---|---|---|
| Messaging | `{API_BASE}/hubs/messaging` | Receive new messages |
| Notifications | `{API_BASE}/hubs/notifications` | Receive notification badges and alerts |

Both connections pass the JWT as `?access_token=<token>`. On token refresh, connections are restarted with the new token.

Connections are managed by a single React context provider mounted at the app root, active only when the user is authenticated.

---

## 9. Internationalisation

- Default language: **Serbian (Latin script)** — locale code `sr-Latn`
- All user-visible strings are externalised into JSON translation files from day one
- Language files: `src/locales/sr-Latn.json` (Phase 1), additional locales added in Phase 2
- Date/number formatting via `Intl` API using the active locale
- No Cyrillic toggle in Phase 1 — Latin script only

---

## 10. API Integration

All API calls go through a typed service layer (`src/services/`) wrapping Axios. TanStack Query hooks are defined in `src/hooks/` and call into the service layer. Components never call Axios directly.

```
src/
  services/
    games.service.ts       # /games, /platforms, /genres
    library.service.ts     # /users/me/library, /listings
    auth.service.ts        # /auth/*
    messaging.service.ts   # /conversations, /messages
    notifications.service.ts
  hooks/
    useGames.ts
    useListings.ts
    useLibrary.ts
    useConversations.ts
    useNotifications.ts
```

---

## 11. Project Structure

```
src/
  assets/           # Static images, icons
  components/       # Shared UI components (Button, Card, Badge, Avatar, etc.)
  features/         # Feature-scoped components and logic
    auth/
    catalog/
    library/
    listings/
    messaging/
    notifications/
    profile/
    admin/
  hooks/            # TanStack Query hooks
  services/         # API service layer (Axios)
  stores/           # Zustand stores
  lib/              # Utility functions, constants, Axios instance
  locales/          # i18n JSON files
  router/           # React Router route definitions and guards
  types/            # Shared TypeScript types and API response types
  App.tsx
  main.tsx
```

---

## 12. Environment Variables

Vite exposes env vars prefixed `VITE_` to the client bundle.

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for all API calls (e.g. `https://api.gamex.rs`) |
| `VITE_MEDIA_BASE_URL` | Cloudflare media base URL (e.g. `https://media.gamex.rs`) |

For local development, set these in `.env.local` (not committed to git):

```
VITE_API_BASE_URL=http://localhost:5002
VITE_MEDIA_BASE_URL=http://localhost:5001
```

---

## 13. Local Development

```bash
npm install
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run typecheck # tsc --noEmit
npm run lint      # ESLint
```

Vite dev server is configured to proxy `/api` to the local backend port and `/hubs` to the SignalR services.

---

## 14. Build & Deployment

| Step | Command / Action |
|---|---|
| Build | `npm run build` → `dist/` |
| Deploy | `wrangler pages deploy dist/ --project-name gamex-{env}` |

CI/CD runs these steps in GitHub Actions:

| Workflow | Trigger | Target |
|---|---|---|
| `ci.yml` | Push / PR | Type check + lint + build (no deploy) |
| `deploy-dev.yml` | Merge to `main` | Deploy to Cloudflare Pages (`gx-dev`) |
| `deploy-prod.yml` | Tag `v*.*.*` | Manual approval → deploy to Cloudflare Pages (`gx-prod`) |
