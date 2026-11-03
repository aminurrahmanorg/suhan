"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export type UserRole = "admin" | "manager" | "order_handler";
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  order_handler: "Order Handler",
};
export function AdminHeader() {
  const { user, userRole } = useAuth();
  return (
    <header
      className="
      hidden
      lg:flex
      sticky
      top-0
      z-40
      h-16
      border-b
      bg-background
      items-center
      justify-between
      px-6
    "
    >
      <div className="relative w-full max-w-md">
        <Search
          className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          h-4
          w-4
        "
        />

        <Input placeholder="Search..." className="pl-10" />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell className="h-5 w-5" />

          <span
            className="
            absolute
            -top-1
            -right-1
            h-2
            w-2
            rounded-full
            bg-red-500
          "
          />
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>FA</AvatarFallback>
            </Avatar>

            <div className="hidden md:block">
              <p className="text-sm font-medium"> {user?.email}</p>
              {userRole && (
                <p className="text-xs text-muted-foreground">
                  {" "}
                  {userRole in ROLE_LABELS
                    ? ROLE_LABELS[userRole as UserRole]
                    : userRole}
                </p>
              )}
            </div>

            <ChevronDown className="h-4 w-4" />
          </div>
        )}
      </div>
    </header>
  );
}
