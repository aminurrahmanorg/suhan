"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PromoBannersProps {
  settings?: any;
}

export function PromoBanners({ settings }: PromoBannersProps) {
  const { ref, isVisible } = useScrollReveal();

  const b1_image = settings?.banner1_image || "";
  const b1_badge = settings ? (settings.banner1_badge ?? "") : "Limited Time Offer";
  const b1_title = settings ? (settings.banner1_title ?? "") : "Premium Sports & Fitness Gear";
  const b1_desc = settings ? (settings.banner1_desc ?? "") : "Elevate your workouts with top-tier high-performance gear.";
  const b1_discount = settings ? (settings.banner1_discount ?? "") : "Up to 35% OFF";
  const b1_link = settings?.banner1_link || "/shop";

  const b2_image = settings?.banner2_image || "";
  const b2_badge = settings ? (settings.banner2_badge ?? "") : "New Arrivals";
  const b2_title = settings ? (settings.banner2_title ?? "") : "Next-Gen Athletic Sneakers";
  const b2_desc = settings ? (settings.banner2_desc ?? "") : "Engineered for maximum velocity, cushion, and endless comfort.";
  const b2_discount = settings ? (settings.banner2_discount ?? "") : "Run Fast";
  const b2_link = settings?.banner2_link || "/shop";

  // Check if banner text content exists
  const hasB1Content = Boolean(
    b1_badge.trim() ||
    b1_title.trim() ||
    b1_desc.trim() ||
    b1_discount.trim()
  );

  const hasB2Content = Boolean(
    b2_badge.trim() ||
    b2_title.trim() ||
    b2_desc.trim() ||
    b2_discount.trim()
  );

  return (
    <section className="py-6 md:py-8 bg-background" ref={ref}>
      <div className="container-shop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Banner 1 */}
          <div
            className={`relative overflow-hidden rounded-2xl border border-border/80 min-h-[190px] md:min-h-[220px] shadow-sm group transition-all duration-500 hover:shadow-xl hover:border-accent/50 reveal-left ${
              isVisible ? "reveal-visible" : ""
            }`}
          >
            {!hasB1Content ? (
              <Link href={b1_link} className="block w-full h-full relative cursor-pointer">
                {b1_image ? (
                  <Image
                    src={b1_image}
                    alt={b1_title || "Promo Banner"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950" />
                )}
              </Link>
            ) : (
              <>
                {/* Background Image or Modern Gradient */}
                {b1_image ? (
                  <Image
                    src={b1_image}
                    alt={b1_title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950" />
                )}

                {/* Dark Vignette Overlay for Crisp Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent z-10 pointer-events-none" />

                {/* Glowing Backdrop Accents */}
                {!b1_image && (
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/20 rounded-full blur-[70px] group-hover:scale-125 group-hover:bg-accent/30 transition-all duration-700 pointer-events-none" />
                )}

                {/* Content Layer */}
                <div className="relative z-20 p-6 md:p-8 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2 max-w-[85%] sm:max-w-[72%]">
                    {b1_badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-[10px] font-bold text-accent tracking-wider uppercase backdrop-blur-md">
                        <Sparkles className="h-3 w-3" />
                        <span>{b1_badge}</span>
                      </span>
                    )}
                    {b1_title && (
                      <h3 className="text-lg md:text-2xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                        {b1_title}
                      </h3>
                    )}
                    {b1_desc && (
                      <p className="text-xs text-white/80 leading-normal line-clamp-2">
                        {b1_desc}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    {b1_discount ? (
                      <span className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                        {b1_discount}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={b1_link}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-accent-foreground bg-accent hover:opacity-90 px-4 py-2.5 rounded-xl transition-all shadow-md group/btn cursor-pointer"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Banner 2 */}
          <div
            className={`relative overflow-hidden rounded-2xl border border-border/80 min-h-[190px] md:min-h-[220px] shadow-sm group transition-all duration-500 hover:shadow-xl hover:border-accent/50 reveal-right ${
              isVisible ? "reveal-visible" : ""
            }`}
          >
            {!hasB2Content ? (
              <Link href={b2_link} className="block w-full h-full relative cursor-pointer">
                {b2_image ? (
                  <Image
                    src={b2_image}
                    alt={b2_title || "Promo Banner"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-purple-950 to-zinc-950" />
                )}
              </Link>
            ) : (
              <>
                {/* Background Image or Modern Gradient */}
                {b2_image ? (
                  <Image
                    src={b2_image}
                    alt={b2_title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-950 via-purple-950 to-zinc-950" />
                )}

                {/* Dark Vignette Overlay for Crisp Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent z-10 pointer-events-none" />

                {/* Glowing Backdrop Accents */}
                {!b2_image && (
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-[70px] group-hover:scale-125 group-hover:bg-purple-500/30 transition-all duration-700 pointer-events-none" />
                )}

                {/* Content Layer */}
                <div className="relative z-20 p-6 md:p-8 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2 max-w-[85%] sm:max-w-[72%]">
                    {b2_badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 tracking-wider uppercase backdrop-blur-md">
                        <Sparkles className="h-3 w-3" />
                        <span>{b2_badge}</span>
                      </span>
                    )}
                    {b2_title && (
                      <h3 className="text-lg md:text-2xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                        {b2_title}
                      </h3>
                    )}
                    {b2_desc && (
                      <p className="text-xs text-white/80 leading-normal line-clamp-2">
                        {b2_desc}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    {b2_discount ? (
                      <span className="text-lg md:text-xl font-extrabold tracking-tight text-white">
                        {b2_discount}
                      </span>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={b2_link}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-xl transition-all shadow-md group/btn cursor-pointer"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
