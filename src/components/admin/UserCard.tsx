"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Mail, Phone, Shield, ShieldAlert } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
};

interface UserCardProps {
  user: User;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
}

const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    case "PROVIDER":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    case "CUSTOMER":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

export function UserCard({ user, onToggleStatus }: UserCardProps) {
  return (
    <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-1">
            {user.name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleBadgeStyle(
              user.role,
            )}`}
          >
            {user.role}
          </span>
        </div>
        {user.role === "ADMIN" ? (
          <Shield className="w-5 h-5 text-red-500 shrink-0" />
        ) : (
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              user.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Phone className="w-4 h-4 shrink-0" />
            <span>{user.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>
            Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      {user.role !== "ADMIN" && (
        <Button
          onClick={() => onToggleStatus(user.id, user.isActive)}
          variant={user.isActive ? "destructive" : "default"}
          size="sm"
          className="w-full gap-2"
        >
          <ShieldAlert className="w-4 h-4" />
          {user.isActive ? "Suspend User" : "Activate User"}
        </Button>
      )}
    </Card>
  );
}
