# Annapurna Bakehouse — Premium Indian Artisan Bakery

A full-stack premium bakery website with cinematic design, online ordering, table reservations, JWT auth, and an admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/bakery run dev` — run the bakery frontend (port from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, Framer Motion, shadcn/ui, Tailwind CSS v4
- API: Express 5 with pino logging
- DB: PostgreSQL + Drizzle ORM
- Auth: JWT (jsonwebtoken + bcryptjs), token stored in localStorage
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bakery/` — React+Vite frontend
  - `src/pages/` — all pages (Home, Menu, Cart, OrderTracking, Reserve, Login, Register, admin/*)
  - `src/components/` — Navbar, Footer, ProductCard
  - `src/contexts/` — CartContext, AuthContext
- `artifacts/api-server/` — Express backend
  - `src/routes/` — auth, products, orders, reservations, reviews, contact, admin
- `lib/db/` — Drizzle schema: users, products, orders, order_items, reservations, reviews, contact_messages
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/` — Generated React Query hooks + Zod schemas (from Orval)

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks + Zod schemas
- JWT auth with `setAuthTokenGetter` from api-client-react to auto-attach Bearer header
- Cart state persisted to localStorage; auth token also in localStorage
- Dark mode via `classList.toggle("dark")` with localStorage persistence
- Scroll progress bar via Framer Motion `useScroll` + `useSpring`

## Product

- **Homepage** — cinematic hero, animated stats, featured products, about section, testimonials, photo gallery, contact/hours
- **Menu** — searchable, filterable by category, all products from DB with real images
- **Cart + Checkout** — add/remove/quantity, coupon codes (WELCOME10, SWEET20, BAKERY15), delivery details, order placement
- **Order Tracking** — step-by-step status progress visualization
- **Reservations** — date/time/guest picker with confirmation screen
- **Auth** — JWT login/register, admin role detection, auto-redirect
- **Admin Dashboard** — stats cards, revenue bar chart by category, recent orders table, navigation to all management panels
- **Admin: Orders** — list all orders, update status (pending → confirmed → preparing → ready → delivered → cancelled)
- **Admin: Products** — CRUD with image, price, category, featured/availability toggles
- **Admin: Reservations** — confirm or cancel pending bookings
- **Admin: Reviews** — view approved customer reviews
- **Admin: Messages** — view contact form submissions

## User preferences

- Warm amber/chocolate palette with cream background
- Playfair Display (serif) for headings, Inter for body text
- Premium, editorial visual design — no cheap UI

## Seeded data

- Admin user: admin@lamaison.com / admin123
- 12 products across 6 categories
- 5 approved customer reviews
- Coupon codes: WELCOME10 (10%), SWEET20 (20%), BAKERY15 (15%)

## Gotchas

- Do not use `pnpm run dev` at workspace root — use workflow restart
- `useListProducts({ featured: "true" })` — featured param is a string not boolean
- Mutations are exported as `export const useMutation = ` (not `export function`) from Orval
- Wouter v3 Link renders its own `<a>` — don't wrap with another `<a>` tag
- API routes are served at `/api/*` via the shared proxy; frontend at `/`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- API spec: `lib/api-spec/openapi.yaml`
