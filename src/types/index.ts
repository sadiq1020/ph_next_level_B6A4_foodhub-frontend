// ── Course ─────────────────────────────────────────────
// Used in: CourseCard, FeaturedCourses, CoursesPage, CourseDetail
export type Course = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  isAvailable?: boolean;
  // ── KitchenClass course fields ──────────────────────
  videoUrl?: string | null;
  duration?: number | null;       // total minutes
  difficulty?: string | null;     // BEGINNER | INTERMEDIATE | ADVANCED
  lessonsCount?: number | null;
  tags?: string[];
  // ───────────────────────────────────────────────────
  averageRating?: number | null;
  totalReviews?: number | null;
  instructor: {
    id: string;
    businessName: string;
    address?: string | null;
  };
  category: {
    id: string;
    name: string;
  };
  reviews?: Review[];
};

// ── Category ───────────────────────────────────────────
// Used in: CategoriesSection, CategoryCard, CourseFilters
export type Category = {
  id: string;
  name: string;
  image?: string | null;
  _count?: {
    courses: number;  // was: meals
  };
};

// ── Review ─────────────────────────────────────────────
// Used in: CourseDetail
export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  customer: {
    name: string;
  };
  createdAt: string;
};

// ── Cart ───────────────────────────────────────────────
// Used in: CartContext, AddToCart, CartPage
export type CartItem = {
  courseId: string;   // was: mealId
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
};

// ── Orders / Enrollments ──────────────────────────────
export type Order = {
  id: string;
  orderNumber: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  total: number;
  subtotal: number;
  // deliveryFee removed — digital product
  // deliveryAddress removed
  // phone removed
  accessUntil?: string | null;  // enrollment expiry date
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  items?: EnrollmentItem[];
};

export type EnrollmentItem = {
  id: string;
  quantity: number;
  price: number;
  course: {             // was: meal
    id: string;
    name: string;
    image?: string | null;
    duration?: number | null;
    difficulty?: string | null;
  };
};

// ── Instructor Profile ────────────────────────────────
export type InstructorProfile = {
  id: string;
  businessName: string;
  description?: string | null;
  address: string;
  logo?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  _count?: {
    courses: number;
  };
};

// ── Users ─────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};