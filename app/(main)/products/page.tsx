import ShopPage from "@/components/main/Shop";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
