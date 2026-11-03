import AdminRegisterPage from "@/components/admin/AdminRegister";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register a new account to track orders and save products.",
};

export default function page() {
  return (
    <div>
      <AdminRegisterPage />
    </div>
  );
}
