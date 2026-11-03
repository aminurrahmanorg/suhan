import ContactPage from "@/components/main/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for any questions, support, or feedback about our sports gear.",
};

export default function page() {
  return (
    <div>
      <ContactPage />
    </div>
  );
}
