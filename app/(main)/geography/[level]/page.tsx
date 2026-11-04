"use client";

import GeographyDirectoryPage from "@/components/main/directory/GeographyDirectoryPage";
import { useParams } from "next/navigation";

export default function GeographyRoute() {
  const { level } = useParams<{ level: string }>();

  return <GeographyDirectoryPage key={level} initialLevel={level} />;
}
