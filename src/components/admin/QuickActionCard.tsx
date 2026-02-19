import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  hoverBorderColor: string;
  title: string;
  description: string;
  buttonText: string;
}

export function QuickActionCard({
  href,
  icon: Icon,
  iconColor,
  iconBgColor,
  hoverBorderColor,
  title,
  description,
  buttonText,
}: QuickActionCardProps) {
  return (
    <Card
      className={`p-8 border border-zinc-200 dark:border-zinc-800 ${hoverBorderColor} transition-all cursor-pointer group`}
    >
      <Link href={href} className="block">
        <div
          className={`w-16 h-16 rounded-full ${iconBgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          {description}
        </p>
        <Button variant="outline" className="w-full rounded-full">
          {buttonText}
        </Button>
      </Link>
    </Card>
  );
}
