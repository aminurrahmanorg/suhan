"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  formatHomeContentDate,
  isAllowedSectionHref,
  parseNoticeBoard,
} from "@/lib/home-sections";
import { ArrowUpRight, ExternalLink, Megaphone } from "lucide-react";

export function NoticeBoard() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const section = parseNoticeBoard(settings?.notice_board);
  const items = section.items.filter((item) => item.is_active);

  if (isLoading || error || !items.length) return null;

  return (
    <section id="notice-board" aria-labelledby="notice-board-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="notice-board-heading" className="flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
          <Megaphone className="h-5 w-5 text-amber-500" aria-hidden="true" />
          {section.title}
        </h2>
        {isAllowedSectionHref(section.view_all_href) && (
          <a href={section.view_all_href} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
            সব দেখুন <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const content = (
            <>
              <span className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
                {formatHomeContentDate(item.date)}
              </span>
              <span className="min-w-0 flex-1 break-words font-medium text-slate-800 dark:text-slate-100">
                {item.title}
              </span>
              {/^https?:\/\//i.test(item.href) && <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />}
            </>
          );
          const className = "flex min-h-[76px] items-center gap-3 rounded-3xl bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.07)] sm:gap-4 sm:px-8 dark:bg-slate-900";

          return (
            <article key={item.id}>
              {isAllowedSectionHref(item.href) ? (
                <a
                  href={item.href}
                  target={/^https?:\/\//i.test(item.href) ? "_blank" : undefined}
                  rel={/^https?:\/\//i.test(item.href) ? "noopener noreferrer" : undefined}
                  className={`${className} transition-colors hover:bg-emerald-50 dark:hover:bg-slate-800`}
                >
                  {content}
                </a>
              ) : (
                <div className={className}>{content}</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
