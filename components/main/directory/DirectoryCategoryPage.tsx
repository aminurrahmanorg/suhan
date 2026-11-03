"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  type ServiceDirectoryListing,
  parseServiceDirectory,
} from "@/lib/service-directory";
import {
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplet,
  Home,
  Info,
  MapPin,
  Menu,
  Moon,
  Newspaper,
  Phone,
  Search,
  Share2,
  Sun,
  Trophy,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DirectoryCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: settings, isLoading, error } = useStoreSettings({ staleTime: 0 });
  const directory = parseServiceDirectory(settings?.service_directory);
  const categories = directory.categories.filter((item) => item.is_active);
  const category = categories.find((item) => item.slug === categorySlug);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "name">("default");
  const [shareMessage, setShareMessage] = useState<{ id: string; text: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const configuredStoreName = settings?.store_name?.trim();
  const storeName =
    configuredStoreName &&
    !["store", "my store"].includes(configuredStoreName.toLowerCase())
      ? configuredStoreName
      : "স্মার্ট হবিগঞ্জ";
  const configuredTagline = settings?.store_tagline?.trim();
  const storeTagline =
    configuredTagline && configuredTagline !== "Your one-stop shop"
      ? configuredTagline
      : "হবিগঞ্জের তথ্য ও সেবার স্মার্ট প্ল্যাটফর্ম";

  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("header-dark-mode") === "true";
    document.documentElement.classList.toggle("dark", darkModeEnabled);
  }, []);

  const toggleDarkMode = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("header-dark-mode", String(nextIsDark));
    setIsDark(nextIsDark);
  };

  const query = search.trim().toLocaleLowerCase();
  const matchingListings = directory.listings.filter((item) => {
    if (!item.is_active || item.category_id !== category?.id) return false;
    if (!query) return true;
    return [
      item.name,
      item.description,
      item.address,
      item.area,
      item.union,
      item.upazila,
      item.district,
    ]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);
  });
  const listings =
    sortBy === "name"
      ? [...matchingListings].sort((a, b) => a.name.localeCompare(b.name, "bn"))
      : matchingListings;

  const shareListing = async (listing: ServiceDirectoryListing, selectedCategorySlug: string) => {
    const url = `${window.location.origin}/directory/${encodeURIComponent(selectedCategorySlug)}/${encodeURIComponent(listing.slug)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.name, url });
        setShareMessage({ id: listing.id, text: "শেয়ার সম্পন্ন হয়েছে" });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage({ id: listing.id, text: "লিংক কপি হয়েছে" });
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      setShareMessage({ id: listing.id, text: "শেয়ার করা যায়নি। আবার চেষ্টা করুন।" });
    }
  };

  if (isLoading) return <p className="container-shop py-16 text-center">লোড হচ্ছে...</p>;
  if (error) {
    return <p className="container-shop py-16 text-center text-destructive">{error.message}</p>;
  }
  if (!category) {
    return (
      <div className="container-shop py-16 text-center">
        <h1 className="text-2xl font-bold">ক্যাটাগরি পাওয়া যায়নি</h1>
        <Link href="/" className="mt-4 inline-block text-accent">হোমে ফিরে যান</Link>
      </div>
    );
  }

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
          {[
            { label: "হোম", icon: Home, href: "/" },
            { label: "জরুরী সেবা", icon: Phone, href: "/#emergency" },
            { label: "জেলা তথ্য", icon: Info, href: "/#directory" },
            { label: "জেলার ইতিহাস", icon: Clock3, href: "/#directory" },
            { label: "বিখ্যাত ব্যক্তিত্ব", icon: UserRound, href: "/#directory" },
            { label: "রক্তদাতা", icon: Droplet, href: "/#directory" },
            { label: "পর্যটন ও বিনোদন", icon: Camera, href: "/#directory" },
            { label: "নোটিশ", icon: Newspaper, href: "/#directory" },
          ].map(({ label, icon: Icon, href }, index) => (
            <Link
              key={label}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex min-h-[54px] items-center gap-4 rounded-r-full px-6 text-sm transition-colors ${index === 0 ? "bg-[#e2f2ed] font-bold text-[#00845e]" : "text-slate-600 hover:bg-emerald-50 hover:text-[#00845e] dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <Icon className="h-5 w-5 shrink-0 text-[#009f70]" />
              {label}
            </Link>
          ))}
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/directory/${encodeURIComponent(item.slug)}`}
              onClick={() => setSidebarOpen(false)}
              className={`flex min-h-[48px] items-center gap-4 rounded-r-full px-6 text-sm transition-colors ${item.id === category.id ? "font-bold text-[#00845e]" : "text-slate-600 hover:bg-emerald-50 hover:text-[#00845e] dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              <Building2 className="h-5 w-5 shrink-0 text-[#009f70]" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="shrink-0 border-t px-5 py-4 text-xs text-slate-500 dark:border-slate-800">
          <p>সংস্করণ ৬.০.৩ · {storeName}</p>
          <p className="mt-1">〈/〉 Developed by suhan</p>
        </div>
      </aside>
      {sidebarOpen && <button type="button" aria-label="মেনু বন্ধ করুন" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-[60] bg-black/40 lg:hidden" />}
      <div className="min-h-screen lg:ml-[306px]">
        <header className="sticky top-0 z-40 flex h-[78px] items-center justify-between bg-[#009f70] px-4 text-white shadow-sm sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="মেনু খুলুন"><Menu className="h-5 w-5" /></button>
            <Link href="/" className="min-w-0">
              <span className="block truncate text-lg font-extrabold sm:text-xl">{storeName}</span>
              <span className="block truncate text-[11px] text-white/75">{storeTagline}</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => searchRef.current?.focus()} aria-label="সার্চ করুন" className="rounded-full p-2 hover:bg-white/10"><Search className="h-5 w-5" /></button>
            <Link href="/#directory" aria-label="তথ্য ডিরেক্টরি" className="rounded-full p-2 hover:bg-white/10"><Trophy className="h-5 w-5 text-yellow-300" /></Link>
            <button type="button" onClick={toggleDarkMode} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full p-2 hover:bg-white/10">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
            <Link href="/admin/login" aria-label="অ্যাডমিন লগইন" className="rounded-full p-2 hover:bg-white/10"><UserRound className="h-5 w-5" /></Link>
          </div>
        </header>
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          <Building2 className="h-7 w-7 shrink-0 text-emerald-700" />
          হবিগঞ্জের {category.name}
        </h1>

        <nav aria-label="সেবা ক্যাটাগরি" className="mb-7 flex items-center gap-3">
          <button type="button" aria-label="বাম দিকে ক্যাটাগরি দেখুন" onClick={() => document.getElementById("directory-category-pills")?.scrollBy({ left: -260, behavior: "smooth" })} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-emerald-700 shadow sm:grid">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div id="directory-category-pills" className="flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth py-1">
            <Link href="/#directory" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-bold text-white shadow">
              সব
            </Link>
            {categories.map((item) => {
              const count = directory.listings.filter(
                (listing) => listing.category_id === item.id && listing.is_active,
              ).length;
              const selected = item.id === category.id;
              return (
                <Link
                  key={item.id}
                  href={`/directory/${encodeURIComponent(item.slug)}`}
                  aria-current={selected ? "page" : undefined}
                  className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${selected ? "border-emerald-600 bg-emerald-600 text-white shadow" : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"}`}
                >
                  <Building2 className="h-4 w-4" />
                  {item.name}
                  {count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-xs ${selected ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{count}</span>}
                </Link>
              );
            })}
          </div>
          <button type="button" aria-label="ডান দিকে ক্যাটাগরি দেখুন" onClick={() => document.getElementById("directory-category-pills")?.scrollBy({ left: 260, behavior: "smooth" })} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-emerald-700 shadow sm:grid">
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>

        <div className="mb-5 flex gap-2">
          <label className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <Search className="h-5 w-5 shrink-0 text-emerald-700" />
            <input
              aria-label="সেবা খুঁজুন"
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="খুঁজুন..."
              className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
            />
          </label>
          <label className="flex h-14 shrink-0 items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <span className="sr-only">সাজানোর ক্রম</span>
            <select
              aria-label="সাজানোর ক্রম"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value === "name" ? "name" : "default")}
              className="h-full bg-transparent text-sm outline-none"
            >
              <option value="default">ডিফল্ট</option>
              <option value="name">নাম অনুযায়ী</option>
            </select>
          </label>
        </div>

        {listings.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="flex min-h-[130px] items-center gap-4 rounded-[26px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
              >
                <Link
                  href={`/directory/${encodeURIComponent(category.slug)}/${encodeURIComponent(listing.slug)}`}
                  aria-label={`${listing.name} এর বিস্তারিত`}
                  className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-50 text-emerald-700 sm:h-[86px] sm:w-[86px]"
                >
                  {listing.image ? (
                    <Image src={listing.image} alt={listing.name} fill sizes="86px" className="object-cover" />
                  ) : (
                    <Building2 className="h-9 w-9" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/directory/${encodeURIComponent(category.slug)}/${encodeURIComponent(listing.slug)}`}
                    className="line-clamp-2 font-bold leading-6 text-slate-900 hover:text-emerald-700"
                  >
                    {listing.name}
                  </Link>
                  {(listing.area || listing.upazila || listing.district || listing.address) && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="truncate">
                        {[listing.area, listing.upazila, listing.district, listing.address].filter(Boolean).join(", ")}
                      </span>
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void shareListing(listing, category.slug)}
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50"
                    >
                      <Share2 className="h-4 w-4" /> শেয়ার
                    </button>
                    {listing.phone_numbers.filter(Boolean).slice(0, 1).map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/[^\d+*#,;]/g, "")}`}
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        <Phone className="h-4 w-4" /> কল
                      </a>
                    ))}
                    {shareMessage?.id === listing.id && (
                      <span role="status" className="text-xs text-slate-500">{shareMessage.text}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            {search ? "এই অনুসন্ধানের সঙ্গে মেলে এমন কোনো সেবা পাওয়া যায়নি।" : "এই ক্যাটাগরিতে এখনো কোনো তথ্য যোগ করা হয়নি।"}
          </p>
        )}
      </div>
      </div>
    </main>
  );
}
