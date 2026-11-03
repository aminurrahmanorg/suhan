"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { parseTourismSection } from "@/lib/home-sections";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function TourismSection() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const section = parseTourismSection(settings?.tourism_section);
  const items = section.items.filter((item) => item.is_active);

  if (isLoading) return <p className="text-sm text-muted-foreground">পর্যটনস্থলের তথ্য লোড হচ্ছে...</p>;
  if (error) {
    return <p role="alert" className="text-sm text-destructive">পর্যটনস্থলের তথ্য লোড করা যায়নি: {error.message}</p>;
  }
  if (!items.length) return null;

  return (
    <section id="tourism" aria-labelledby="tourism-heading" className="scroll-mt-24 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="tourism-heading" className="flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
          <Camera className="h-5 w-5 text-amber-500" aria-hidden="true" />
          {section.title}
        </h2>
        <Link href="/#tourism" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
          সব দেখুন <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label="আগের পর্যটনস্থল দেখুন"
          onClick={() => document.getElementById("tourism-cards")?.scrollBy({ left: -320, behavior: "smooth" })}
          className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-emerald-700 shadow-lg sm:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div id="tourism-cards" className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 sm:px-2">
          {items.map((item) => {
            const detailHref = item.href || `/tourism/${encodeURIComponent(item.id)}`;
            const content = (
              <>
                <div className="relative h-[170px] bg-slate-200 dark:bg-slate-800">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill sizes="286px" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-slate-400"><Camera className="h-10 w-10" /></div>
                  )}
                </div>
                <div className="min-h-[132px] p-4">
                  <h3 className="line-clamp-2 font-bold text-slate-800 dark:text-slate-100">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500 dark:text-slate-400">{item.description}</p>
                  )}
                </div>
              </>
            );
            return (
              <article key={item.id} className="w-[286px] shrink-0 overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:bg-slate-900">
                {/^https?:\/\//i.test(detailHref)
                  ? <a href={detailHref} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
                  : <Link href={detailHref} className="block">{content}</Link>}
              </article>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="পরের পর্যটনস্থল দেখুন"
          onClick={() => document.getElementById("tourism-cards")?.scrollBy({ left: 320, behavior: "smooth" })}
          className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-emerald-700 shadow-lg sm:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
