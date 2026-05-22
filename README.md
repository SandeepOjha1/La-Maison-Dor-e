# La Maison Dorée — Premium Artisan Bakery

A full-stack premium bakery website with online ordering, reservations, JWT authentication, and an admin dashboard.

---

## Features

### Customer Experience

* Cinematic landing page with animated sections
* Searchable & filterable product menu
* Cart & checkout system with coupon support
* Order tracking with live status progress
* Table reservation system
* Customer reviews & testimonials
* Responsive premium editorial UI
* Dark mode support with persistence

### Authentication

* JWT-based authentication
* Register & login flows
* Role-based admin access
* Persistent auth using `localStorage`

### Admin Dashboard

* Revenue & analytics overview
* Product management (CRUD)
* Order management & status updates
* Reservation approvals/cancellations
* Review moderation
* Contact message management

---

# 🛠 Tech Stack

## Frontend

* React + Vite
* TypeScript 5.9
* Wouter Routing
* Tailwind CSS v4
* shadcn/ui
* Framer Motion

## Backend

* Express 5
* Node.js 24
* PostgreSQL
* Drizzle ORM
* Zod Validation
* Pino Logging

## API & Tooling

* OpenAPI Spec
* Orval Codegen
* React Query Hooks
* esbuild
* pnpm Workspaces

---

## State Management

* Cart persisted in `localStorage`
* Auth session persisted locally
* React Context for Cart & Auth state

---

[Website Link](https://asset-manager--sandeepojha040.replit.app)

# 🎨 Design System

### Theme

* Warm amber & chocolate palette
* Cream background tones
* Editorial premium aesthetic

### Typography

* **Playfair Display** — headings
* **Inter** — body text

### UI Goals

* Elegant
* Minimal
* Premium
* Cinematic

---

# 🧁 Product Modules

## Homepage

* Cinematic hero section
* Animated stats
* Featured products
* Testimonials
* Gallery
* Contact & opening hours

## Menu

* Dynamic product loading
* Search functionality
* Category filters
* Real product images

## Cart & Checkout

* Quantity controls
* Coupon system
* Delivery details
* Order placement

### Available Coupons Demo

| Code      | Discount |
| --------- | -------- |
| WELCOME10 | 10%      |
| SWEET20   | 20%      |
| BAKERY15  | 15%      |

## Order Tracking

* Real-time order progress visualization

## Reservations

* Date & time picker
* Guest selection
* Confirmation flow

## Admin Dashboard

* Analytics cards
* Revenue charts
* Recent orders
* Management panels

---

Built with modern TypeScript tooling and a strong focus on premium UI/UX, scalability, and developer experience.
