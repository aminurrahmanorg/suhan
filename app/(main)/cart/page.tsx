import CartPage from "@/components/main/Cart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review items in your shopping cart before checkout.",
};

export default function page() {
  return (
    <div>
      <CartPage />
    </div>
  );
}
