import { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────
// type CartItem = {
//   mealId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string | null;
// };

type CartStore = {
  items: CartItem[];
  totalItems: number;
  addToCart: (meal: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

// ── Store ─────────────────────────────────────────────
export const useCart = create<CartStore>()(
  //  persist middleware handles localStorage automatically
  // No useEffect needed - Zustand does it for you!
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      //  Add to cart - update quantity if already exists
      addToCart: (meal, quantity) => {
        set((state) => {
          const existing = state.items.find((i) => i.mealId === meal.mealId);

          const updatedItems = existing
            ? state.items.map((i) =>
                i.mealId === meal.mealId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [...state.items, { ...meal, quantity }];

          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      //  Remove item from cart
      removeFromCart: (mealId) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.mealId !== mealId);
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      //  Update quantity - remove if 0
      updateQuantity: (mealId, quantity) => {
        set((state) => {
          const updatedItems =
            quantity <= 0
              ? state.items.filter((i) => i.mealId !== mealId)
              : state.items.map((i) =>
                  i.mealId === mealId ? { ...i, quantity } : i,
                );

          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      //  Clear entire cart
      clearCart: () => set({ items: [], totalItems: 0 }),

      //  Calculate total price
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),

    {
      name: "foodhub_cart", // localStorage key
    },
  ),
);
