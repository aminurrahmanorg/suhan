import AdminLoginPage from "@/components/admin/AdminLogin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Sign In",
  description: "Sign in to access your dashboard and track orders.",
};

export default function page() {
  return (
    <div>
      <AdminLoginPage />
    </div>
  );
}
