import TrackOrderPage from "@/components/main/TrackOrder";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your order delivery status and progress online.",
};

export default function page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TrackOrderPage />
    </Suspense>
  );
}
