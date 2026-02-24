# FoodHub — Frontend

A full-stack meal ordering platform built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Customers can browse meals, place orders, and leave reviews. Providers manage their menus and fulfil orders. Admins oversee the entire platform.

---

## 🔗 Links

| | URL |
|---|---|
| **Frontend Live** | https://ph-next-level-b6-a4-foodhub-fronten.vercel.app |
| **Backend Live** | https://ph-next-level-b6a4-foodhub-backend.onrender.com |
| **Backend Repo** | https://github.com/your-username/foodhub-backend |

---

## ✨ Features

### Public
- Animated hero section with meal search
- Browse all meals with filters (search, category, dietary, price range)
- View provider profiles and their menus
- Responsive design with dark mode support

### Customer
- Register / login with role selection
- Add meals to cart (per-user, persisted in localStorage)
- Checkout with delivery address (Cash on Delivery)
- Track order status in real-time
- Leave reviews on delivered meals
- Manage profile

### Provider
- Register with business name and address
- Add, edit, and delete menu items
- View and update incoming order statuses

### Admin
- Dashboard with platform-wide statistics
- Manage all users — suspend or activate accounts
- View all orders across the platform
- Manage meal categories (CRUD)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | App Router, Server Components, API proxy rewrites |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui + Radix UI | UI components |
| better-auth | Authentication (session cookies) |
| Zustand + persist | Cart state with per-user localStorage |
| React Hook Form + Zod | Form validation |
| Sonner | Toast notifications |
| next-themes | Dark mode |
| Lucide React | Icons |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/admin/          # Admin dashboard, users, orders, categories
│   ├── (auth)/                 # Login, Register pages
│   ├── (customer)/             # Cart, Checkout, Orders, Profile
│   ├── (provider)/provider/    # Dashboard, Menu, Orders
│   ├── meals/                  # Browse meals + meal detail
│   ├── providers/              # Providers list
│   ├── provider-profile/[id]/  # Public provider profile
│   └── page.tsx                # Home page (4 animated sections)
├── components/
│   ├── home/                   # HeroSection, CategoriesSection, FeaturedMeals, HowItWorks
│   ├── layout/                 # Navbar, Footer
│   ├── authentication/         # LoginForm, RegisterForm
│   ├── meals/                  # MealCard, MealFilters, AddToCart
│   ├── orders/                 # OrderCard, OrderTimeline, OrderStatusBadge
│   ├── reviews/                # ReviewForm
│   ├── admin/                  # CategoryFormDialog, UserCard
│   ├── provider/               # MealFormDialog, OrderCard
│   └── ui/                     # shadcn/ui base components
├── context/
│   └── CartContext.tsx         # Zustand cart store (per-user localStorage keys)
├── lib/
│   ├── api.ts                  # Axios-style fetch wrapper
│   └── auth-client.ts          # better-auth client
├── proxy.ts                    # Next.js Middleware (route protection)
└── env.ts                      # Type-safe environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Backend server running (see backend repo)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/foodhub-frontend.git
cd foodhub-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend URL (used by better-auth client)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Also used by some components
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-side only (for middleware/proxy)
BACKEND_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret_here_minimum_32_characters
NODE_ENV=development
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set the following environment variables in Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_FRONTEND_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com
BETTER_AUTH_SECRET=your_secret_here
NODE_ENV=production
```

4. Deploy — Vercel auto-detects Next.js

> **Note:** The `next.config.ts` rewrites `/api/auth/*` and `/api/v1/*` to the backend URL automatically. No separate API gateway needed.

---

## 🔐 Route Protection

The `proxy.ts` middleware protects all private routes server-side:

| Route prefix | Allowed roles |
|---|---|
| `/admin/*` | ADMIN only |
| `/provider/*` | PROVIDER only |
| `/orders/*`, `/checkout/*`, `/profile/*` | Any authenticated user |

Unauthenticated users are redirected to `/login`. Wrong-role users are redirected to their own dashboard or home.

---

## 🧑‍💻 Admin Credentials

```
Email:    admin@foodhub.com
Password: admin123456
```

---

## 📄 License

MIT
