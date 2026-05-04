"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { GraduationCap, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AddToCartCourse = {
  id: string;
  name: string;
  price: number;
  isAvailable?: boolean;
  image?: string | null;
};

export function AddToCart({ course }: { course: AddToCartCourse }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    if (!session?.user) {
      toast.error("Please login to enroll in courses", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    const role = (session.user as { role?: string })?.role;
    if (role && role !== "CUSTOMER") {
      toast.error("Enrollment Restricted", {
        description: "Please login as a customer to enroll in courses.",
      });
      return;
    }

    addToCart(
      {
        courseId: course.id,   // was: mealId
        name: course.name,
        price: course.price,
        image: course.image,
      },
      quantity,
    );

    toast.success(`${course.name} added to cart!`, {
      description: `৳${quantity * course.price} total`,
    });
  };

  if (course.isAvailable === false) {
    return (
      <div className="flex items-center justify-center h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <span className="text-zinc-500 font-medium">Currently Unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-full px-2 py-1">
        <button
          onClick={decrease}
          disabled={quantity === 1}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
          {quantity}
        </span>
        <button
          onClick={increase}
          disabled={quantity === 99}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Button
        onClick={handleAddToCart}
        className="flex-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white h-11 gap-2"
      >
        <GraduationCap className="w-4 h-4" />
        {session?.user
          ? `Enroll Now · ৳${quantity * course.price}`
          : "Login to Enroll"}
      </Button>
    </div>
  );
}
