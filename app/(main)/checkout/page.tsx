import CheckoutPage from "@/components/main/Checkout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Complete your purchase securely.",
};

export default function page() {
  return (
    <div>
      <CheckoutPage />
    </div>
  );
}
