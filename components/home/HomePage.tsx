"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  parseServiceDirectory,
} from "@/lib/service-directory";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Bus,
  Camera,
  Clock3,
  Droplet,
  GraduationCap,
  HeartPulse,
  Hospital,
  Home,
  Info,
  KeyRound,
  Landmark,
  Laptop,
  Menu,
  Moon,
  Newspaper,
  PartyPopper,
  Phone,
  Search,
  ShoppingBag,
  Scale,
  Sun,
  Trophy,
  Utensils,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useSliderSlides } from "@/hooks/useShopData";
import { EmergencyServices } from "@/components/main/home/EmergencyServices";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { DirectoryIcon } from "@/lib/service-directory";

const SIDE_LINKS = [
  { label: "হোম", icon: Home, target: "home" },
  { label: "জরুরী সেবা", icon: Phone, target: "emergency" },
  { label: "জেলা তথ্য", icon: Info, target: "directory" },
  { label: "জেলার ইতিহাস", icon: Clock3, target: "directory" },
  { label: "বিখ্যাত ব্যক্তিত্ব", icon: UserRound, target: "directory" },
  { label: "রক্তদাতা", icon: Droplet, target: "directory" },
  { label: "পর্যটন ও বিনোদন", icon: Camera, target: "directory" },
  { label: "নোটিশ", icon: Newspaper, target: "directory" },
  { label: "সংবাদ", icon: Newspaper, target: "directory" },
];

const DIRECTORY_ICON_COMPONENTS: Record<DirectoryIcon, LucideIcon> = {
  phone: Phone,
  heart: HeartPulse,
  hospital: Hospital,
  briefcase: Briefcase,
  wrench: Wrench,
  laptop: Laptop,
  "shopping-bag": ShoppingBag,
  home: Home,
  utensils: Utensils,
  "graduation-cap": GraduationCap,
  key: KeyRound,
  bus: Bus,
  landmark: Landmark,
  users: Users,
  scale: Scale,
  building: Building2,
  camera: Camera,
  "party-popper": PartyPopper,
  newspaper: Newspaper,
};

export function HomePage() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const { data: slides = [], error: slidesError } = useSliderSlides();
  const directorySlides = slides.filter((slide) =>
    /হবি|রক্ত|সেবা|জেলা|তথ্য|blood|habiganj|district|emergency|service/i.test(
      `${slide.heading} ${slide.text} ${slide.cta_text}`,
    ),
  );
  const [isDark, setIsDark] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("header-dark-mode") === "true";
    document.documentElement.classList.toggle("dark", darkModeEnabled);
  }, []);

  useEffect(() => {
    if (directorySlides.length < 2) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % directorySlides.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, [directorySlides.length]);

  const directory = useMemo(
    () => parseServiceDirectory(settings?.service_directory),
    [settings?.service_directory],
  );
  const activeCategories = directory.categories.filter(
    (category) => category.is_active,
  );
  const currentSlideIndex = directorySlides.length
    ? activeSlide % directorySlides.length
    : 0;
  const toggleDarkMode = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("header-dark-mode", String(nextIsDark));
    setIsDark(nextIsDark);
  };

  const storeName =
    settings?.store_name?.trim() &&
    !["store", "my store"].includes(settings.store_name.trim().toLowerCase())
      ? settings.store_name.trim()
      : "স্মার্ট হবিগঞ্জ";
  const storeTagline =
    settings?.store_tagline?.trim() &&
    settings.store_tagline.trim() !== "Your one-stop shop"
      ? settings.store_tagline.trim()
      : "হবিগঞ্জের তথ্য ও সেবার স্মার্ট প্ল্যাটফর্ম";
  const noticeText =
    settings?.mobile_marquee_text?.trim() &&
    !settings.mobile_marquee_text.toLowerCase().includes("jersey") &&
    !settings.mobile_marquee_text.toLowerCase().includes("shipping")
      ? settings.mobile_marquee_text.trim()
      : "হবিগঞ্জের সকল তথ্য ও সেবা এখন স্মার্ট হবিগঞ্জে";

  const selectSidebarLink = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-[70] flex w-[306px] max-w-[85vw] flex-col bg-white shadow-xl transition-transform dark:bg-slate-900 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="shrink-0 bg-[#009f70] px-5 pt-5 text-white">
          <div className="flex items-center gap-3 border-b border-white/20 pb-4">
            {settings?.store_logo ? (
              <Image src={settings.store_logo} alt={storeName} width={48} height={48} className="h-12 w-12 rounded-xl bg-white object-contain p-1" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-2xl font-black">স</span>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold">{storeName}</p>
              <p className="text-[11px] leading-4 text-white/80">{storeTagline}</p>
            </div>
            <button type="button" className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="মেনু বন্ধ করুন">×</button>
          </div>
          <Link href="/admin/login" className="flex items-center gap-3 py-4">
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/75 bg-white/15"><UserRound className="h-8 w-8" /></span>
            <span>
              <span className="block font-bold">অতিথি ব্যবহারকারী</span>
              <span className="mt-1 block text-xs text-white/80">হবিগঞ্জ সদর উপজেলা</span>
            </span>
          </Link>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto py-3 pr-5">
          {SIDE_LINKS.map(({ label, icon: Icon, target }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectSidebarLink(target)}
              className={`flex min-h-[54px] w-full items-center gap-4 rounded-r-full px-6 text-left text-sm transition-colors ${index === 0 ? "bg-[#e2f2ed] font-bold text-[#00845e]" : "text-slate-600 hover:bg-emerald-50 hover:text-[#00845e] dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <Icon className="h-5 w-5 shrink-0 text-[#009f70]" />
              {label}
            </button>
          ))}
          {activeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectSidebarLink("directory")}
              className="flex min-h-[48px] w-full items-center gap-4 px-6 text-left text-sm text-slate-600 hover:bg-emerald-50 hover:text-[#00845e] dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Building2 className="h-5 w-5 shrink-0 text-[#009f70]" />
              <span className="truncate">{category.name}</span>
            </button>
          ))}
        </nav>
        <div className="shrink-0 border-t px-5 py-3 text-[11px] text-slate-500">
          <p>সংস্করণ ৬.০.৩ · {storeName}</p>
          <p className="mt-2 font-semibold text-emerald-700">〈/〉 Developed by suhan</p>
        </div>
      </aside>

      {sidebarOpen && <button type="button" aria-label="মেনু বন্ধ করুন" className="fixed inset-0 z-[60] bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="min-h-screen lg:pl-[306px]">
        <header className="sticky top-0 z-50 flex min-h-[72px] items-center justify-between bg-[#009f70] px-4 text-white shadow-sm sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="মেনু খুলুন"><Menu className="h-5 w-5" /></button>
            <Link href="/" className="min-w-0">
              <span className="block truncate text-lg font-extrabold sm:text-xl">{storeName}</span>
              <span className="block truncate text-[11px] text-white/75">{storeTagline}</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" })} aria-label="সেবা ক্যাটাগরি দেখুন" className="rounded-full p-2 hover:bg-white/10"><Search className="h-5 w-5" /></button>
            <a href="#directory" aria-label="তথ্য ডিরেক্টরি" className="rounded-full p-2 hover:bg-white/10"><Trophy className="h-5 w-5 text-yellow-300" /></a>
            <button type="button" onClick={toggleDarkMode} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full p-2 hover:bg-white/10">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
            <Link href="/admin/login" aria-label="অ্যাডমিন লগইন" className="rounded-full p-2 hover:bg-white/10"><UserRound className="h-5 w-5" /></Link>
          </div>
        </header>

        <div id="home" className="scroll-mt-[72px]">
          <section aria-label="প্রধান তথ্য" className="relative h-[260px] overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-600 to-teal-500 sm:h-[340px] xl:h-[396px]">
            {directorySlides.length > 0 && directorySlides.map((slide, index) => (
              <div key={slide.id} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlideIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <Image src={slide.image} alt={slide.heading || storeName} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, calc(100vw - 306px)" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                {(slide.heading || slide.text || slide.cta_text) && (
                  <div className="absolute inset-0 flex items-center px-6 text-white sm:px-10">
                    <div className="max-w-xl">
                      <span className="inline-flex rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs">{slide.cta_text || "হবিগঞ্জ"}</span>
                      <h1 className="mt-3 text-2xl font-black sm:text-4xl">{slide.heading}</h1>
                      <p className="mt-2 max-w-lg text-sm text-white/85 sm:text-base">{slide.text}</p>
                      <a href="#directory" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-emerald-800">তথ্য খুঁজুন <ArrowUpRight className="h-4 w-4" /></a>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {directorySlides.length === 0 && (
              <div className="absolute inset-0 flex items-center px-6 text-white sm:px-10">
                <div className="max-w-xl">
                  <span className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs">হবিগঞ্জ</span>
                  <h1 className="mt-3 text-3xl font-black sm:text-5xl">রক্তদাতা খুঁজুন</h1>
                  <p className="mt-2 text-sm text-white/85 sm:text-base">আপনার প্রয়োজনীয় রক্তের গ্রুপের দাতা খুঁজে নিন</p>
                  <button type="button" onClick={() => selectSidebarLink("directory")} className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-emerald-800">রক্তদাতা খুঁজুন →</button>
                </div>
              </div>
            )}
            {slidesError && <p role="alert" className="absolute bottom-3 left-4 rounded bg-black/60 px-3 py-2 text-xs text-white">স্লাইডার লোড করা যায়নি: {slidesError.message}</p>}
            {directorySlides.length > 1 && <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">{directorySlides.map((slide, index) => <button key={slide.id} type="button" aria-label={`স্লাইড ${index + 1}`} onClick={() => setActiveSlide(index)} className={`h-2 rounded-full ${index === currentSlideIndex ? "w-8 bg-white" : "w-2 bg-white/60"}`} />)}</div>}
          </section>
        </div>

        <div className="flex h-[54px] items-center overflow-hidden border-y bg-white dark:border-slate-800 dark:bg-slate-900">
          <span className="flex h-full shrink-0 items-center gap-2 bg-[#ff5b50] px-4 text-sm font-bold text-white"><Newspaper className="h-4 w-4" /> নোটিশ</span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-20 whitespace-nowrap px-8 text-sm text-slate-600 dark:text-slate-300">
              <span>{noticeText}</span><span>{noticeText}</span><span>{noticeText}</span>
            </div>
          </div>
        </div>

        <section id="directory" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl space-y-8 px-5 py-7 sm:px-8">
          <section id="emergency" className="scroll-mt-24">
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                জরুরি সেবার তথ্য লোড করা যায়নি: {error.message}
              </p>
            ) : isLoading ? (
              <p className="text-sm text-muted-foreground">তথ্য লোড হচ্ছে...</p>
            ) : (
              <EmergencyServices />
            )}
          </section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold sm:text-2xl">তথ্য ও সেবাসমূহ</h2>
            <button
              type="button"
              onClick={() => document.getElementById("directory-categories")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            >
              সব দেখুন <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          {activeCategories.length > 0 && (
            <div id="directory-categories" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {activeCategories.map((category) => {
                const Icon = DIRECTORY_ICON_COMPONENTS[category.icon];
                return (
                  <Link
                    key={category.id}
                    href={`/directory/${encodeURIComponent(category.slug)}`}
                    aria-label={`${category.name} খুলুন`}
                    className="group flex min-h-[130px] flex-col items-center justify-center gap-2 rounded-3xl bg-white px-3 py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-slate-900"
                  >
                    <span
                      className="grid h-16 w-16 place-items-center rounded-[20px] text-white shadow-lg transition-transform group-hover:scale-105"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium leading-5 text-slate-700 dark:text-slate-200">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
          </div>
        </section>

      <footer className="border-t bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {storeName}
            . সর্বস্বত্ব সংরক্ষিত।
          </p>
          <Link
            className="inline-flex items-center gap-2 font-semibold text-[#009f70] hover:underline"
            href="/admin/login"
          >
            অ্যাডমিন লগইন <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
      </div>
    </main>
  );
}
