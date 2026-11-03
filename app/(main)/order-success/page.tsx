import OrderSuccessPage from "@/components/main/OrderSuccess";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OrderSuccessPage />
    </Suspense>
  );
}
