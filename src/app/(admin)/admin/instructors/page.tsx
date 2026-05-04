"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import {
    AlertCircle,
    CheckCircle,
    ChefHat,
    MapPin,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type InstructorStatus = "PENDING" | "APPROVED" | "REJECTED";

type StatusFilter = "ALL" | InstructorStatus;

type InstructorApplication = {
  id: string;
  businessName: string;
  description?: string | null;
  address: string;
  logo?: string | null;
  status: InstructorStatus;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    isActive: boolean;
    createdAt: string;
  };
  _count: {
    courses: number;
  };
};

// ── Status badge ──────────────────────────────────────
const STATUS_STYLES: Record<InstructorStatus, string> = {
  PENDING:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  APPROVED:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border border-green-200 dark:border-green-800",
  REJECTED:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800",
};

const STATUS_ICONS: Record<InstructorStatus, React.ReactNode> = {
  PENDING: <AlertCircle className="w-3.5 h-3.5" />,
  APPROVED: <CheckCircle className="w-3.5 h-3.5" />,
  REJECTED: <XCircle className="w-3.5 h-3.5" />,
};

function StatusBadge({ status }: { status: InstructorStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
    >
      {STATUS_ICONS[status]}
      {status}
    </span>
  );
}

// ── Application card ──────────────────────────────────
function ApplicationCard({
  application,
  onApprove,
  onReject,
  isProcessing,
}: {
  application: InstructorApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: string | null;
}) {
  const loading = isProcessing === application.id;
  const isPending = application.status === "PENDING";

  return (
    <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left — instructor info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center shrink-0">
            <ChefHat className="w-6 h-6 text-orange-500" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + Status */}
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                {application.businessName}
              </h3>
              <StatusBadge status={application.status} />
            </div>

            {/* User info */}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {application.user.name} • {application.user.email}
            </p>

            {/* Address */}
            {application.address && (
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                {application.address}
              </p>
            )}

            {/* Description */}
            {application.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                {application.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
              <span>
                Applied{" "}
                {new Date(application.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>{application._count.courses} courses published</span>
            </div>
          </div>
        </div>

        {/* Right — action buttons (only shown for PENDING) */}
        {isPending && (
          <div className="flex gap-3 lg:flex-col lg:w-36 shrink-0">
            <Button
              onClick={() => onApprove(application.id)}
              disabled={loading}
              className="flex-1 lg:flex-none gap-2 rounded-full bg-green-500 hover:bg-green-600 border-0 text-white"
              size="sm"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? "..." : "Approve"}
            </Button>
            <Button
              onClick={() => onReject(application.id)}
              disabled={loading}
              variant="destructive"
              size="sm"
              className="flex-1 lg:flex-none gap-2 rounded-full"
            >
              <XCircle className="w-4 h-4" />
              {loading ? "..." : "Reject"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────
export default function AdminInstructorsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const hasFetched = useRef(false);

  // Protected route — ADMIN only
  useEffect(() => {
    if (!isPending && !session?.user) router.push("/login");
    if (!isPending && session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role !== "ADMIN") router.push("/");
    }
  }, [session, isPending, router]);

  const fetchApplications = async (showToast = false) => {
    if (!session?.user) return;
    try {
      if (showToast) setIsRefreshing(true);
      else setIsLoading(true);

      const data = await api.get("/admin/instructors");
      setApplications(data.data || data);

      if (showToast) toast.success("Refreshed");
    } catch {
      toast.error("Failed to load instructor applications");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!session?.user) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchApplications();
  }, [session?.user?.id]);

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const toastId = toast.loading("Approving instructor...");
    try {
      await api.patch(`/admin/instructors/${id}/approve`, {});
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a)),
      );
      toast.success("Instructor approved successfully", { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve";
      toast.error(msg, { id: toastId });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(id);
    const toastId = toast.loading("Rejecting application...");
    try {
      await api.patch(`/admin/instructors/${id}/reject`, {});
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a)),
      );
      toast.success("Application rejected", { id: toastId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject";
      toast.error(msg, { id: toastId });
    } finally {
      setIsProcessing(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const counts = {
    ALL: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    APPROVED: applications.filter((a) => a.status === "APPROVED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const filtered =
    statusFilter === "ALL"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Instructor Applications
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
                {counts.PENDING > 0
                  ? `${counts.PENDING} application${counts.PENDING !== 1 ? "s" : ""} waiting for review`
                  : "No pending applications"}
              </p>
            </div>
            <Button
              onClick={() => fetchApplications(true)}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as StatusFilter[]).map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full gap-2 ${
                  statusFilter === status
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-0"
                    : ""
                }`}
              >
                {status === "ALL" ? "All" : status}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    statusFilter === status
                      ? "bg-white/20 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {counts[status]}
                </span>
              </Button>
            ),
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              No {statusFilter === "ALL" ? "" : statusFilter.toLowerCase()}{" "}
              applications
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              {statusFilter === "PENDING"
                ? "All instructor applications have been reviewed"
                : "No applications match this filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}