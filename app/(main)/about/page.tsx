import AboutPage from "@/components/main/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our mission to provide premium quality sports gear, clothing, and accessories.",
};

export default function page() {
  return (
    <div>
      <AboutPage />
    </div>
  );
}
