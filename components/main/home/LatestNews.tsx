"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  formatHomeContentDate,
  isAllowedSectionHref,
  parseLatestNews,
} from "@/lib/home-sections";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import Image from "next/image";

export function LatestNews() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const section = parseLatestNews(settings?.latest_news);
  const items = section.items.filter((item) => item.is_active);

  if (isLoading || error || !items.length) return null;

  return (
    <section id="latest-news" aria-labelledby="latest-news-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="latest-news-heading" className="flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
          <Newspaper className="h-5 w-5 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          {section.title}
        </h2>
        {isAllowedSectionHref(section.view_all_href) && (
          <a href={section.view_all_href} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
            সব দেখুন <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const content = (
            <article className="flex min-w-0 gap-4 rounded-3xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)] dark:bg-slate-900 sm:p-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200 sm:h-24 sm:w-24 dark:bg-slate-800">
                {item.image ? (
                  <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <Newspaper className="absolute inset-0 m-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-bold leading-snug text-slate-800 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {formatHomeContentDate(item.date)}
                </p>
                {isAllowedSectionHref(item.href) && (
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    পড়ুন <ArrowUpRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </article>
          );

          return (
            <div key={item.id}>
              {isAllowedSectionHref(item.href) ? (
                <a
                  href={item.href}
                  target={/^https?:\/\//i.test(item.href) ? "_blank" : undefined}
                  rel={/^https?:\/\//i.test(item.href) ? "noopener noreferrer" : undefined}
                  className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  {content}
                </a>
              ) : content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
