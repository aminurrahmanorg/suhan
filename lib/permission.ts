import { ADMIN_NAVIGATION } from "@/config/admin-nav";
import { UserRole } from "@/types/admin";

export function getSidebarItems(role?: UserRole) {
  if (!role) return [];

  return ADMIN_NAVIGATION.filter((item) => item.roles.includes(role));
}
