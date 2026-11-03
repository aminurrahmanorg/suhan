"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  Building,
  BriefcaseBusiness,
  Bus,
  Camera,
  GraduationCap,
  Heart,
  House,
  Landmark,
  Laptop,
  Newspaper,
  PartyPopper,
  Phone,
  Scale,
  ShoppingBag,
  Utensils,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import {
  DIRECTORY_ICONS,
  DirectoryIcon,
  parseServiceDirectory,
} from "@/lib/service-directory";

const ICONS: Record<DirectoryIcon, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  heart: Heart,
  hospital: Building,
  briefcase: BriefcaseBusiness,
  wrench: Wrench,
  laptop: Laptop,
  "shopping-bag": ShoppingBag,
  home: House,
  utensils: Utensils,
  "graduation-cap": GraduationCap,
  key: Landmark,
  bus: Bus,
  landmark: Landmark,
  users: Users,
  scale: Scale,
  building: Building,
  camera: Camera,
  "party-popper": PartyPopper,
  newspaper: Newspaper,
};

export function ServiceDirectoryHome() {
  const { data: settings, isLoading, error } = useStoreSettings({ staleTime: 0 });
  const directory = parseServiceDirectory(settings?.service_directory);
  const categories = directory.categories.filter((category) => category.is_active);

  if (isLoading || error || categories.length === 0) return null;

  return (
    <section className="bg-slate-50 py-8 sm:py-10">
      <div className="container-shop">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            তথ্য ও সেবাসমূহ
          </h2>
          <Link
            href="/directory"
            className="text-sm font-bold text-emerald-700 hover:underline"
          >
            সব দেখুন <span aria-hidden="true">›</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => {
            const Icon = ICONS[category.icon];
            const listingCount = directory.listings.filter(
              (listing) => listing.category_id === category.id && listing.is_active,
            ).length;
            return (
              <Link
                key={category.id}
                href={`/directory/${category.slug}`}
                className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition-transform hover:-translate-y-0.5"
              >
                <span
                  className="grid h-16 w-16 place-items-center rounded-[20px] text-white shadow-lg"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <span className="line-clamp-2 text-sm font-semibold text-slate-800">
                  {category.name}
                </span>
                <span className="text-xs text-slate-500">{listingCount}টি</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { DIRECTORY_ICONS };
