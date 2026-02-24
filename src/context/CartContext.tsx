import { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  items: CartItem[];
  totalItems: number;
  userId: string | null; // ✅ Track which user owns this cart
  addToCart: (meal: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // ✅ Called on login/logout to switch carts between users
  setUserId: (id: string | null) => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      userId: null,

      // ✅ When user changes (login/logout), clear the in-memory cart
      // localStorage still holds each user's cart under their own key
      setUserId: (id) => {
        const current = get().userId;
        if (current !== id) {
          set({ items: [], totalItems: 0, userId: id });
        }
      },

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

      removeFromCart: (mealId) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.mealId !== mealId);
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

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

      clearCart: () => set({ items: [], totalItems: 0 }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),

    {
      // ✅ Dynamic key based on userId — each user gets their own localStorage slot
      name: "foodhub_cart",
      // Partition the storage so each user ID gets a separate key
      storage: {
        getItem: (name) => {
          const userId = useCart.getState().userId;
          const key = userId ? `${name}_${userId}` : name;
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          const userId = useCart.getState().userId;
          const key = userId ? `${name}_${userId}` : name;
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (name) => {
          const userId = useCart.getState().userId;
          const key = userId ? `${name}_${userId}` : name;
          localStorage.removeItem(key);
        },
      },
    },
  ),
);
