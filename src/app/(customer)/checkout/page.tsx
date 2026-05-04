"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

// ── Zod Schema ─────────────────────────────────────────
// Removed: deliveryAddress, phone (digital product — no shipping)
const checkoutSchema = z.object({
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { items, getCartTotal, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      notes: "",
    },
  });


  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user || items.length === 0) return null;

  const subtotal = getCartTotal();
  const total = subtotal; // no delivery fee for digital courses

  // Enroll in courses
  const onSubmit = async (data: CheckoutFormData) => {
    const toastId = toast.loading("Processing enrollment...");

    try {
      await api.post("/orders", {
        notes: data.notes || "",
        items: items.map((item) => ({
          courseId: item.courseId,   // was: mealId
          quantity: item.quantity,
        })),
        subtotal,
        total,
      });

      toast.success("Enrollment successful!", {
        id: toastId,
        description: "You can access your courses from My Enrollments",
      });

      clearCart();
      router.push("/orders");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to complete enrollment";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 -ml-2 mb-3"
          >
            <Link href="/cart">
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Complete Enrollment
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
            Review your courses and confirm enrollment
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <form
            id="checkout-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1"
          >
            <CheckoutForm register={register} errors={errors} />
          </form>

          {/* Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              total={total}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}