"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { parseBloodDonorSection } from "@/lib/home-sections";
import { ChevronLeft, ChevronRight, Droplet } from "lucide-react";

export function BloodDonorSection() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const section = parseBloodDonorSection(settings?.blood_donor_section);
  const cards = section.cards.filter((card) => card.is_active);

  if (isLoading) return <p className="text-sm text-muted-foreground">রক্তদাতার তথ্য লোড হচ্ছে...</p>;
  if (error) {
    return <p role="alert" className="text-sm text-destructive">রক্তদাতার তথ্য লোড করা যায়নি: {error.message}</p>;
  }
  if (!cards.length) return null;

  return (
    <section id="blood-donors" aria-labelledby="blood-donor-heading" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2">
        <Droplet className="h-5 w-5 fill-rose-500 text-rose-500" aria-hidden="true" />
        <h2 id="blood-donor-heading" className="text-xl font-extrabold sm:text-2xl">{section.title}</h2>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label="আগের রক্তের গ্রুপ দেখুন"
          onClick={() => document.getElementById("blood-donor-cards")?.scrollBy({ left: -280, behavior: "smooth" })}
          className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-emerald-700 shadow-lg sm:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div id="blood-donor-cards" className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 sm:px-2">
          {cards.map((card) => {
            const href = card.href || "/#directory";
            return (
              <article
                key={card.id}
                className="flex min-h-[158px] w-[158px] shrink-0 flex-col items-center justify-center gap-2 rounded-3xl bg-white px-3 py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:bg-slate-900"
              >
                <h3 className={`text-3xl font-extrabold ${card.blood_group.endsWith("+") ? "text-rose-500" : "text-violet-600"}`}>
                  {card.blood_group}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Intl.NumberFormat("bn-BD").format(card.donor_count)} জন পাওয়া যাচ্ছে
                </p>
                <a
                  href={href}
                  className="mt-1 rounded-full bg-[#ff5148] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-600"
                >
                  রক্তদাতা খুঁজুন
                </a>
              </article>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="পরের রক্তের গ্রুপ দেখুন"
          onClick={() => document.getElementById("blood-donor-cards")?.scrollBy({ left: 280, behavior: "smooth" })}
          className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-emerald-700 shadow-lg sm:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
