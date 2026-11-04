"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { parseStatisticsSection } from "@/lib/home-sections";
import Link from "next/link";
import {
  ChartNoAxesColumnIncreasing,
  Droplet,
  Eye,
  Globe,
  Grid3X3,
  House,
  ListChecks,
  Map,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  map: Map,
  grid: Grid3X3,
  home: House,
  users: Users,
  list: ListChecks,
  droplet: Droplet,
  eye: Eye,
  globe: Globe,
};

const COLORS: Record<string, string> = {
  emerald: "text-emerald-600",
  blue: "text-blue-600",
  teal: "text-teal-500",
  violet: "text-violet-600",
  rose: "text-rose-500",
  sky: "text-sky-600",
};

export function StatisticsSection() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const section = parseStatisticsSection(settings?.statistics_section);
  const items = section.items.filter((item) => item.is_active);

  if (isLoading || error || !items.length) return null;

  return (
    <section id="statistics" aria-labelledby="statistics-heading" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2">
        <ChartNoAxesColumnIncreasing className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <h2 id="statistics-heading" className="text-xl font-extrabold sm:text-2xl">
          {section.title}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const geographyLevel =
            item.id === "upazilas" ? "upazilas" :
            item.id === "unions" ? "unions" :
            item.id === "areas" ? "areas" :
            null;
          const card = (
            <article
              className={`flex min-h-[172px] flex-col items-center justify-center gap-3 rounded-3xl bg-white px-4 py-5 text-center shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:bg-slate-900 ${geographyLevel ? "transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]" : ""}`}
            >
              <Icon className={`h-8 w-8 ${COLORS[item.color]}`} aria-hidden="true" />
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {item.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            </article>
          );
          return geographyLevel ? (
            <Link
              key={item.id}
              href={`/geography/${geographyLevel}`}
              aria-label={`${item.label} দেখুন`}
              className="rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {card}
            </Link>
          ) : (
            <div key={item.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
