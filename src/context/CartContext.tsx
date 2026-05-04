import { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  items: CartItem[];
  totalItems: number;
  userId: string | null;
  addToCart: (course: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setUserId: (id: string | null) => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      userId: null,

      setUserId: (id) => {
        const current = get().userId;
        if (current !== id) {
          set({ items: [], totalItems: 0, userId: id });
        }
      },

      addToCart: (course, quantity) => {
        set((state) => {
          const existing = state.items.find((i) => i.courseId === course.courseId);
          const updatedItems = existing
            ? state.items.map((i) =>
                i.courseId === course.courseId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              )
            : [...state.items, { ...course, quantity }];
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      removeFromCart: (courseId) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.courseId !== courseId);
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      updateQuantity: (courseId, quantity) => {
        set((state) => {
          const updatedItems =
            quantity <= 0
              ? state.items.filter((i) => i.courseId !== courseId)
              : state.items.map((i) =>
                  i.courseId === courseId ? { ...i, quantity } : i,
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
      name: "kitchenclass_cart",  // was: foodhub_cart
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