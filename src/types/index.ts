// ── Meal ──────────────────────────────────────────────
// Used in: MealCard, FeaturedMeals, MealsPage, MealDetail
export type Meal = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  dietary?: string | null;
  spiceLevel?: string | null;
  isAvailable?: boolean;
  averageRating?: number | null;
  totalReviews?: number | null;
  provider: {
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
// Used in: CategoriesSection, CategoryCard, MealFilters
export type Category = {
  id: string;
  name: string;
  image?: string | null;
  _count?: {
    meals: number;
  };
};

// ── Review ─────────────────────────────────────────────
// Used in: MealDetail
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
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
};
