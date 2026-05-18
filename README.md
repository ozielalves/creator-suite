<img src="public/assets/logo-oziel.svg" alt="logo" width="48" align="right">

# Creator Studio &middot; [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.x-FF4154?style=flat-square)](https://tanstack.com/start) [![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev) [![Bun](https://img.shields.io/badge/Bun-latest-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh)

## Table of Contents

- [Overview](#overview)
- [Architecture Philosophy](#architecture-philosophy)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Module Organization](#module-organization)
- [Key Design Decisions](#key-design-decisions)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [License](#license)

## Overview

Creator Studio is a multi-feature creator platform with:

- **Authentication** — Login, register, forgot-password flows with token-based session management
- **Creator Dashboard** — Revenue charts, statistics cards, and activity feeds
- **Messaging** — Conversation list and real-time-style message threads
- **Analytics** — Traffic overview with views/signups charts and top referral sources
- **Notifications** — Notification center with read/unread states
- **Subscription Management** — Plan tiers, billing history, and renewal status

All backend data is mocked in-memory via an interceptor layer, making the app fully runnable without any external services.

## Architecture Philosophy

This project prioritizes **architecture quality over flashy features**. It is organized as a **modular monolith** where each business domain owns its components, hooks, services, types, and constants. The goal is to demonstrate how a senior/staff engineer might structure a front-end platform for a high-growth company.

Core principles:

- **Modularity by domain** — Features are self-contained modules, not scattered folders
- **Clean separation of concerns** — UI components are presentational; services hold business logic
- **Single source of truth** — Services are singletons; state is centralized
- **Testability** — Business logic is decoupled from React; utilities have colocated tests
- **Design system thinking** — Reusable UI primitives with variants, accessibility, and consistent tokens
- **No over-engineering** — No unnecessary abstractions; every layer has a clear purpose

## Tech Stack

| Layer          | Choice                    | Rationale                                                                             |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| Framework      | React 19 + TanStack Start | Full-stack React with file-based routing, SSR/SSG support, and typed server functions |
| Language       | TypeScript (strict)       | Compile-time safety; self-documenting APIs                                            |
| Styling        | Tailwind CSS v4           | Utility-first, design-token-driven, minimal CSS overhead                              |
| Components     | Radix UI primitives       | Accessible, unstyled headless components as building blocks                           |
| State (server) | SWR                       | Lightweight data fetching with caching, deduping, and revalidation                    |
| State (client) | Zustand                   | Minimal, scalable global state without boilerplate                                    |
| Charts         | Recharts                  | Declarative React charting for dashboard analytics                                    |
| Forms          | React Hook Form + Zod     | Performant forms with schema validation                                               |
| Icons          | Lucide React              | Consistent, lightweight SVG icon set                                                  |
| Testing        | Vitest + Playwright       | Unit tests with Testing Library; E2E flows with Playwright                            |
| Linting        | ESLint + Prettier         | Consistent code style and catch-at-build-time errors                                  |

### Why TanStack Start?

TanStack Start provides file-based routing, type-safe navigation, and server-function capabilities in a single cohesive framework. It removes the need to manually wire up React Router while giving us SSR, code-splitting, and API route support out of the box.

### Why SWR over React Query?

Both are excellent. SWR was chosen for its minimal API surface and lighter bundle footprint. The project demonstrates that either can be plugged into the `HttpClient` layer without touching components.

### Why Zustand over Redux / Context?

Auth state is simple (user + token + login/logout). Zustand provides exactly what's needed with zero boilerplate. For more complex domains, Redux Toolkit or TanStack Store could be substituted without touching UI code.

## Project Structure

```text
src/
├── config/
│   └── env.ts              # App-wide constants (API_BASE, APP_NAME, latency)
├── hooks/
│   └── use-mobile.tsx      # Shared responsive hook
├── lib/
│   ├── utils.ts            # cn() utility for Tailwind class merging
│   ├── error-capture.ts    # Error tracking utilities
│   └── error-page.ts       # Error page helpers
├── modules/                # Domain-driven modules (see below)
├── routes/                 # TanStack Start file-based routes
│   ├── __root.tsx          # Root layout (HTML shell)
│   ├── index.tsx           # Home redirect → /dashboard
│   ├── login.tsx           # Login page
│   ├── register.tsx        # Register page
│   ├── forgot-password.tsx # Forgot password page
│   └── _app.*.tsx          # Authenticated app routes (with AppShell layout)
├── router.tsx              # Router configuration
├── server.ts               # Server entry
├── start.ts                # Start instance configuration
└── styles.css              # Tailwind v4 entry + design tokens
```

## Module Organization

Every feature lives in `src/modules/<Domain>/` and exports a public API via `index.ts`. Internal files are never imported across module boundaries — only the public barrel export.

```text
modules/
├── UI/                     # Design system — presentational components only
│   ├── primitives/         # shadcn/ui (CLI: `npx shadcn add <name>`)
│   ├── Avatar/             # App-facing wrappers with product API + tests
│   ├── Badge/
│   ├── Button/
│   ├── Card/
│   ├── EmptyState/
│   ├── Input/
│   ├── PageHeader/
│   ├── Skeleton/
│   ├── Spinner/
│   └── Stat/
├── Common/                 # Shared infrastructure
│   ├── components/
│   │   └── AppShell.tsx    # Layout shell with sidebar + mobile nav
│   ├── providers/
│   │   └── SwrProvider.tsx  # Global SWR configuration
│   ├── services/
│   │   ├── HttpClient.ts   # Typed fetch wrapper with interceptors, retries
│   │   ├── MockBackend.ts  # fetch interceptor for in-memory backend
│   │   └── bootstrap.ts    # Seed data + route handlers for all features
│   └── utils/
│       ├── format.ts       # Currency, date, number formatting
│       └── format.spec.ts  # Colocated unit tests
├── Auth/
│   ├── components/
│   │   └── AuthGate.tsx    # Route guard — redirects unauthenticated users
│   ├── hooks/
│   │   └── useAuthStore.ts # Zustand store: user, token, login, logout
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPasswordPage.tsx
│   ├── services/
│   │   └── AuthService.ts  # Singleton: login, register, me, logout, token storage
│   ├── types.ts            # AuthUser, LoginCredentials, RegisterCredentials, etc.
│   └── constants.ts        # AUTH_TOKEN_STORAGE_KEY
├── CreatorDashboard/
│   ├── components/
│   │   ├── StatsCards.tsx
│   │   ├── RevenueChart.tsx
│   │   └── ActivityFeed.tsx
│   ├── hooks/
│   │   └── useDashboard.ts # SWR hooks delegating to DashboardService
│   ├── pages/
│   │   └── DashboardPage.tsx
│   └── services/
│       └── DashboardService.ts
├── Messaging/
│   ├── hooks/
│   │   └── useMessaging.ts
│   ├── pages/
│   │   └── MessagingPage.tsx
│   └── services/
│       └── MessagingService.ts
├── Analytics/
│   ├── hooks/
│   │   └── useAnalytics.ts
│   ├── pages/
│   │   └── AnalyticsPage.tsx
│   └── services/
│       └── AnalyticsService.ts
├── Notifications/
│   ├── hooks/
│   │   └── useNotifications.ts
│   ├── pages/
│   │   └── NotificationsPage.tsx
│   └── services/
│       └── NotificationsService.ts
└── Subscription/
    ├── hooks/
    │   └── useSubscription.ts
    ├── pages/
    │   └── SubscriptionPage.tsx
    └── services/
        └── SubscriptionService.ts
```

## Key Design Decisions

### 1. Service Layer

All business logic lives in singleton **Service** classes (e.g., `AuthService`, `DashboardService`). Components never call `fetch` directly — they call Services. This means:

- Business logic is testable without rendering React
- Swapping from mock backend to real API requires changing only `HttpClient.configure()`
- Components stay thin and presentational

### 2. HttpClient with Interceptors

`HttpClient` is a typed wrapper around native `fetch` supporting:

- Request/response interceptors
- Automatic `Authorization` header injection
- Retry logic with exponential backoff
- Centralized `HttpError` handling

The mock backend registers itself as a `fetch` interceptor, so the entire request pipeline (auth headers, retries, error handling) runs exactly as it would in production.

### 3. Mock Backend Architecture

`MockBackend.ts` intercepts `window.fetch` for URLs matching `API_BASE`. `bootstrap.ts` seeds in-memory data and registers route handlers for every feature. This gives us:

- Full app functionality without a backend
- Artificial network latency (`NETWORK_LATENCY_MS = 220`) for realistic loading states
- Easy migration path: remove the interceptor and point `HttpClient` at a real API

### 4. State Separation

| State Type   | Tool    | Used For                                        |
| ------------ | ------- | ----------------------------------------------- |
| Server state | SWR     | API data (dashboard stats, messages, analytics) |
| Client state | Zustand | Auth session, UI toggles, ephemeral selections  |

This separation prevents server data from being duplicated in global stores and ensures SWR's caching/deduping works correctly.

### 5. UI / Design System

`modules/UI` is the single UI home:

- **`primitives/`** — shadcn/ui building blocks (`npx shadcn add dialog`, etc.). Import via `@/modules/UI/primitives/<name>` when you need a primitive directly.
- **Top-level folders** (`Button/`, `Card/`, …) — app-facing components that wrap primitives with product APIs (`isLoading`, `label`/`error` on inputs, `tone` on badges). Feature code imports from `@/modules/UI` only.

Wrappers stay thin; primitives stay CLI-updatable. Colocated tests live on the app-facing components.

### 6. Route Guards

Authentication is enforced via `AuthGate` and the `_app` layout route. Unauthenticated users are redirected to `/login`. The auth state hydrates from `localStorage` on app boot, so returning users stay logged in.

### 7. Strict TypeScript

`tsconfig.json` enables:

- `strict: true`
- `noUncheckedSideEffectImports: true`
- Path mapping via `@/*` for clean imports

Every import must resolve. Unresolved imports cause hard build failures — this catches missing files immediately.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+

### Install

```bash
bun install
```

### Run development server

```bash
bun run dev
```

Open `http://localhost:3000`. Copy `.env.example` to `.env`, then sign in with the demo account (`oziel@test.com` / `12345!@`) or register a new account (password must meet complexity rules).

### Build for production

```bash
bun run build
```

### Preview production build

```bash
bun run preview
```

## Scripts

| Script      | Command             | Description                      |
| ----------- | ------------------- | -------------------------------- |
| Dev         | `bun run dev`       | Start Vite dev server with HMR   |
| Build       | `bun run build`     | Production build (SSR + static)  |
| Build (dev) | `bun run build:dev` | Development mode build           |
| Preview     | `bun run preview`   | Preview production build locally |
| Lint        | `bun run lint`      | ESLint check                     |
| Format      | `bun run format`    | Prettier write                   |
| Test        | `bun run test`      | Vitest unit/component suite      |
| E2E         | `bun run test:e2e`  | Playwright end-to-end tests      |

---

## Testing

Tests are colocated with the code they verify (e.g., `format.spec.ts` lives next to `format.ts`). Vitest suites use the `*.spec.ts(x)` suffix so Bun's native test runner does not pick them up.

Run tests (recommended):

```bash
bun run test
```

Watch mode:

```bash
bun run test:watch
```

`bun test` also works: it runs a bridge in `src/test/` that delegates to Vitest (`bunfig.toml` limits Bun's scanner to that folder). Prefer `bun run test` for direct execution without the extra process.

### End-to-end (Playwright)

Install the Chromium browser once:

```bash
bun run test:e2e:install
```

Run E2E tests (starts the dev server automatically on port 3000):

```bash
bun run test:e2e
```

Interactive UI mode:

```bash
bun run test:e2e:ui
```

Specs live in `e2e/` and use the demo account from `.env.example` by default.

Example test locations:

- `src/modules/Common/utils/format.spec.ts` — Date, currency, and number formatting
- `src/modules/UI/Button/Button.spec.tsx` — Component rendering and interaction

## Design Tokens

Colors, spacing, and typography are defined as CSS custom properties in `src/styles.css` using `oklch` color space. Components consume these via Tailwind utilities (e.g., `bg-primary`, `text-muted-foreground`) — never hardcoded hex values.

This ensures:

- Consistent theming across the app
- Easy dark-mode extension (add a `dark` variant to `:root`)
- Single source of truth for visual design

## License

MIT — feel free to use as a reference or starting point for your own projects.
