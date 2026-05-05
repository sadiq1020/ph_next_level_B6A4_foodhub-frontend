# KitchenClass — Frontend

A modern cooking course marketplace built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Students can browse and enroll in expert-led culinary courses, while instructors can publish and manage their own content.

**Live Demo:** [kitchenclass-frontend.vercel.app](https://kitchenclass-frontend.vercel.app)  
**Backend Repo:** [github.com/sadiq1020/kitchenclass-backend](https://github.com/sadiq1020/kitchenclass-backend)

---

## Features

### Public
- Home page with animated hero, stats counter, categories, featured courses, testimonials, FAQ, and CTA sections
- Browse and filter courses by category, difficulty, price range, and search query — with sorting and pagination
- Course detail page with YouTube preview video embed and student reviews
- Public instructor profile pages
- About and Contact pages

### Authentication
- Email/password registration and login
- Google OAuth (via Better Auth + oAuthProxy for cross-domain production support)
- Quick demo login buttons (Admin, Instructor, Student)
- Two-step instructor registration — account creation + profile setup in one flow

### Customer Dashboard
- Browse and enroll in courses via cart + checkout
- My Enrollments page with order status tracking
- Leave reviews after enrollment is activated
- Profile page with editable name and phone

### Instructor Dashboard
- Apply to become an instructor (pending admin approval)
- Create, edit, and delete courses with image, video URL, difficulty, duration, and lesson count
- Manage student enrollments and update enrollment status
- Analytics charts — enrollments per course and revenue over time (Recharts via shadcn charts)

### Admin Dashboard
- Overview stats — total users, pending instructor approvals, enrollments, categories
- Approve or reject instructor applications
- Manage all users (suspend/activate)
- View all platform enrollments
- Analytics charts — enrollment trend (30 days), monthly revenue, user role distribution

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Better Auth (email + Google OAuth) |
| State | Zustand (cart) |
| Forms | React Hook Form + Zod |
| Charts | Recharts (via shadcn charts) |
| Animation | Framer Motion |
| HTTP | Native fetch via custom `api` wrapper |
| Theme | next-themes (light/dark) |

---

## Project Structure

```
src/
├── app/
│   ├── (admin)/admin/         # Admin dashboard pages
│   ├── (auth)/                # Login & Register pages
│   ├── (customer)/            # Orders, Profile, Cart, Checkout
│   ├── (instructor)/          # Instructor dashboard pages
│   ├── about/                 # About page
│   ├── contact/               # Contact page
│   ├── courses/               # Browse + Course detail
│   ├── instructor-profiles/   # Public instructor profile
│   └── instructors/           # Public instructors list
├── components/
│   ├── admin/                 # Admin-specific components
│   ├── authentication/        # Login & Register forms
│   ├── charts/                # AdminCharts, InstructorCharts
│   ├── courses/               # CourseCard, CourseFilters, AddToCart
│   ├── home/                  # All home page sections
│   ├── instructor/            # CourseFormDialog, EnrollmentCard
│   ├── layout/                # Navbar, Footer, DashboardSidebar, PublicChrome
│   ├── orders/                # OrderCard, OrderTimeline, etc.
│   └── ui/                    # shadcn/ui base components
├── context/
│   └── CartContext.tsx
├── hooks/
│   └── usePagination.ts
├── lib/
│   ├── api.ts                 # Fetch wrapper for backend API
│   ├── auth-client.ts         # Better Auth client
│   └── utils.ts
└── types/
    └── index.ts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- The KitchenClass backend running locally on port 5000

### Installation

```bash
git clone https://github.com/sadiq1020/kitchenclass-frontend.git
cd kitchenclass-frontend
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
BETTER_AUTH_SECRET=your-secret-here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

### Environment Variables on Vercel

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` |
| `NEXT_PUBLIC_FRONTEND_URL` | `https://your-frontend.vercel.app` |
| `BACKEND_URL` | `https://your-backend.onrender.com` |
| `BETTER_AUTH_SECRET` | Your secret key |

### `.npmrc` (required for recharts compatibility with React 19)

Create a `.npmrc` file in the project root:

```
legacy-peer-deps=true
```

### `next.config.ts` note

The config includes Next.js rewrites that proxy all `/api/auth/*` and `/api/v1/*` requests to the backend. This is required for Better Auth's Google OAuth to work in production.

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@sadiq2.com | admin1234 |
| Instructor | marco@test.com | 12345678 |
| Student | student@test.com | 12345678 |

---

## Key Implementation Notes

**Google OAuth in production** — Uses Better Auth's `oAuthProxy` plugin so the OAuth callback works even when the frontend (Vercel) and backend (Render) are on different domains. `BETTER_AUTH_URL` must be set to the **frontend URL + `/api/auth`**, not the backend URL.

**Dashboard routing** — Each role group (`(admin)`, `(instructor)`, `(customer)`) has its own layout wrapping `DashboardShell` + `DashboardSidebar`. `PublicChrome` in the root layout suppresses the global Navbar/Footer on dashboard and auth routes.

**Instructor approval flow** — New instructors register → create a profile → status is PENDING. Admin must approve before the instructor can publish courses.
