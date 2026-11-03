export type UserRole = "admin" | "manager" | "order_handler";

export interface AdminNavItem {
  name: string;
  href: string;
  icon: any;
  roles: UserRole[];
  section: string;
}
