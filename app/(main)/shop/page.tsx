import ShopPage from "@/components/main/Shop";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of premium sports gear, clothing, and accessories.",
};

export default function page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
