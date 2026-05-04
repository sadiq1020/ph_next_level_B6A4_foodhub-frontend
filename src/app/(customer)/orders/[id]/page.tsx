"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import { OrderItemsList } from "@/components/orders/OrderItemsList";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Order } from "@/types";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.user) return;

      try {
        setIsLoading(true);
        const data = await api.get(`/orders/${id}`);
        setOrder(data.data || data);
      } catch {
        toast.error("Enrollment not found");
        router.push("/orders");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchOrder();
    }
  }, [session, id, router]);

  const handleCancelOrder = async () => {
    if (!order) return;

    const toastId = toast.loading("Cancelling enrollment...");
    setIsCancelling(true);

    try {
      await api.put(`/orders/${order.id}/cancel`, {});
      toast.success("Enrollment cancelled successfully", { id: toastId });
      setOrder({ ...order, status: "CANCELLED" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel enrollment";
      toast.error(message, { id: toastId });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReviewSuccess = (courseId: string) => {
    toast.success("Thank you for your review!");
    router.push(`/courses/${courseId}`);
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user || !order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancel = order.status === "PENDING";
  const canReview = order.status === "ACTIVE" || order.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 -ml-2 mb-3"
          >
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
              Back to My Enrollments
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Enrollment #{order.orderNumber}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />

              {canCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isCancelling}
                      className="rounded-full"
                    >
                      Cancel Enrollment
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Cancel Enrollment?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this enrollment? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Enrollment</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelOrder}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderTimeline status={order.status} />
            {order.items && (
              <OrderItemsList
                items={order.items}
                canReview={canReview}
                onReviewClick={(courseId: string, courseName: string) => {
                  setSelectedCourse({ id: courseId, name: courseName });
                  setReviewDialogOpen(true);
                }}
              />
            )}
          </div>

          {/* Sidebar — removed OrderDeliveryInfo, kept summary with accessUntil */}
          <div className="space-y-6">
            {order.notes && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  Notes
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {order.notes}
                </p>
              </div>
            )}
            <OrderSummaryCard
              subtotal={order.subtotal}
              total={order.total}
              accessUntil={order.accessUntil}
            />
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      {selectedCourse && (
        <ReviewForm
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          courseId={selectedCourse.id}
          courseName={selectedCourse.name}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}