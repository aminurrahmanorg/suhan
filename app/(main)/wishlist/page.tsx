import WishlistPage from "@/components/main/Wishlist";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your favorite saved products.",
};

export default function page() {
  return (
    <div>
      <WishlistPage />
    </div>
  );
}
