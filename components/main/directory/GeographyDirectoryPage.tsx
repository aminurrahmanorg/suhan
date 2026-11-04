"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { parseServiceDirectory, type ServiceDirectoryListing } from "@/lib/service-directory";
import {
  Building2,
  Camera,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  Droplet,
  Grid3X3,
  House,
  Info,
  Map as MapIcon,
  MapPin,
  Menu,
  Moon,
  Newspaper,
  Phone,
  Search,
  Sun,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type GeographyLevel = "upazilas" | "unions" | "areas";

interface GeographyEntry {
  key: string;
  name: string;
  district: string;
  upazila: string;
  union: string;
  listingCount: number;
  listings: ServiceDirectoryListing[];
}

const LEVELS: { id: GeographyLevel; label: string; icon: LucideIcon }[] = [
  { id: "upazilas", label: "উপজেলা", icon: MapIcon },
  { id: "unions", label: "ইউনিয়ন/পৌরসভা", icon: Grid3X3 },
  { id: "areas", label: "গ্রাম/এলাকা/মহল্লা", icon: House },
];

const NAV_LINKS = [
  { label: "হোম", icon: House, href: "/" },
  { label: "জরুরী সেবা", icon: Phone, href: "/#emergency" },
  { label: "জেলা তথ্য", icon: Info, href: "/#directory" },
  { label: "ভৌগোলিক পরিচিতি", icon: MapIcon, href: "/geography/areas" },
  { label: "বিখ্যাত ব্যক্তিত্ব", icon: UserRound, href: "/#directory" },
  { label: "রক্তদাতা", icon: Droplet, href: "/#blood-donors" },
  { label: "পর্যটন ও বিনোদন", icon: Camera, href: "/#tourism" },
  { label: "নোটিশ", icon: Newspaper, href: "/#notice-board" },
  { label: "পরিসংখ্যান", icon: ChartNoAxesColumnIncreasing, href: "/#statistics" },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

function groupListings(
  listings: ServiceDirectoryListing[],
  getName: (listing: ServiceDirectoryListing) => string,
  getKey: (listing: ServiceDirectoryListing) => string,
): GeographyEntry[] {
  const groups = new Map<string, GeographyEntry>();

  for (const listing of listings) {
    const name = getName(listing).trim();
    if (!name) continue;

    const key = getKey(listing);
    const existing = groups.get(key);
    if (existing) {
      existing.listingCount += 1;
      existing.listings.push(listing);
      continue;
    }

    groups.set(key, {
      key,
      name,
      district: listing.district.trim(),
      upazila: listing.upazila.trim(),
      union: listing.union.trim(),
      listingCount: 1,
      listings: [listing],
    });
  }

  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name, "bn"));
}

export default function GeographyDirectoryPage({ initialLevel }: { initialLevel: string }) {
  const { data: settings, isLoading, error } = useStoreSettings();
  const directory = parseServiceDirectory(settings?.service_directory);
  const listings = directory.listings.filter((listing) => listing.is_active);
  const level: GeographyLevel = LEVELS.some((entry) => entry.id === initialLevel)
    ? initialLevel as GeographyLevel
    : "areas";
  const [activeLevel, setActiveLevel] = useState<GeographyLevel>(level);
  const [search, setSearch] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedUnion, setSelectedUnion] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const upazilas = groupListings(
    listings,
    (listing) => listing.upazila,
    (listing) => normalize(listing.upazila),
  );
  const unions = groupListings(
    listings,
    (listing) => listing.union,
    (listing) => `${normalize(listing.upazila)}|${normalize(listing.union)}`,
  );
  const areas = groupListings(
    listings,
    (listing) => listing.area,
    (listing) => `${normalize(listing.upazila)}|${normalize(listing.union)}|${normalize(listing.area)}`,
  );
  const district = listings.find((listing) => listing.district.trim())?.district.trim() || "জেলা";
  const storeName = settings?.store_name?.trim() || "স্মার্ট নেত্রকোণা";
  const storeTagline = settings?.store_tagline?.trim() || "জেলার তথ্য ও সেবার স্মার্ট প্ল্যাটফর্ম";
  const entries = activeLevel === "upazilas" ? upazilas : activeLevel === "unions" ? unions : areas;
  const visibleEntries = entries.filter((entry) => {
    if (selectedUpazila && activeLevel !== "upazilas" && normalize(entry.upazila) !== normalize(selectedUpazila)) {
      return false;
    }
    if (selectedUnion && activeLevel === "areas" && normalize(entry.union) !== normalize(selectedUnion)) {
      return false;
    }
    const query = normalize(search);
    return !query || [
      entry.name,
      entry.upazila,
      entry.union,
      entry.district,
    ].some((value) => normalize(value).includes(query));
  });

  useEffect(() => {
    const enabled = localStorage.getItem("header-dark-mode") === "true";
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const selectLevel = (nextLevel: GeographyLevel) => {
    setActiveLevel(nextLevel);
    setSearch("");
    if (nextLevel === "upazilas") {
      setSelectedUpazila("");
      setSelectedUnion("");
    } else if (nextLevel === "unions") {
      setSelectedUnion("");
    }
  };

  const toggleDarkMode = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("header-dark-mode", String(nextIsDark));
    setIsDark(nextIsDark);
  };

  const title = `${district} জেলার ভৌগোলিক পরিচিতি ও এলাকা`;
  const subtitle = `${district} জেলার ${upazilas.length}টি উপজেলা, ${unions.length}টি ইউনিয়ন/পৌরসভা এবং ${areas.length}টি গ্রাম/এলাকার তথ্য`;

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-[70] flex w-[306px] max-w-[85vw] flex-col bg-white shadow-xl transition-transform dark:bg-slate-900 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="shrink-0 bg-[#009f70] px-5 pt-5 text-white">
          <Link href="/" className="flex items-center gap-3 border-b border-white/20 pb-4">
            {settings?.store_logo ? (
              <Image src={settings.store_logo} alt={storeName} width={48} height={48} className="h-12 w-12 rounded-xl bg-white object-contain p-1" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-2xl font-black">স</span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold">{storeName}</span>
              <span className="block text-[11px] leading-4 text-white/80">{storeTagline}</span>
            </span>
          </Link>
          <Link href="/admin/login" className="flex items-center gap-3 py-4">
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/75 bg-white/15"><UserRound className="h-8 w-8" /></span>
            <span>
              <span className="block font-bold">অতিথি ব্যবহারকারী</span>
              <span className="mt-1 block text-xs text-white/80">{district} সদর উপজেলা</span>
            </span>
          </Link>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto py-3 pr-5">
          {NAV_LINKS.map(({ label, icon: Icon, href }, index) => (
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
        </nav>
        <div className="shrink-0 border-t px-5 py-3 text-[11px] text-slate-500">
          <p>সংস্করণ ৬.০.৩ · {storeName}</p>
          <p className="mt-2 font-semibold text-emerald-700">〈/〉 Developed by SUhan</p>
        </div>
      </aside>

      {sidebarOpen && (
        <button type="button" aria-label="মেনু বন্ধ করুন" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-[60] bg-black/40 lg:hidden" />
      )}

      <div className="min-h-screen lg:ml-[306px]">
        <header className="sticky top-0 z-40 flex h-[78px] items-center justify-between bg-[#009f70] px-4 text-white shadow-sm sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="মেনু খুলুন">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="min-w-0">
              <span className="block truncate text-lg font-extrabold sm:text-xl">{storeName}</span>
              <span className="block truncate text-[11px] text-white/75">{storeTagline}</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a href="#geography-search" aria-label="সার্চ করুন" className="rounded-full p-2 hover:bg-white/10"><Search className="h-5 w-5" /></a>
            <Link href="/#statistics" aria-label="পরিসংখ্যান" className="rounded-full p-2 hover:bg-white/10"><Trophy className="h-5 w-5 text-yellow-300" /></Link>
            <button type="button" onClick={toggleDarkMode} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full p-2 hover:bg-white/10">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href="/admin/login" aria-label="অ্যাডমিন লগইন" className="rounded-full p-2 hover:bg-white/10"><UserRound className="h-5 w-5" /></Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] space-y-7 px-5 py-7 sm:px-8">
          <section className="flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-blue-50 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:from-slate-900 dark:to-slate-800 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-8 w-8 shrink-0 fill-emerald-600 text-emerald-600" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
            </div>
            <nav aria-label="এলাকার ধরন" className="flex flex-wrap gap-2 rounded-xl bg-white p-1 shadow dark:bg-slate-950">
              {LEVELS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-current={activeLevel === id ? "page" : undefined}
                  onClick={() => selectLevel(id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${activeLevel === id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                >
                  <Icon className="h-4 w-4" />
                  {label} ({id === "upazilas" ? upazilas.length : id === "unions" ? unions.length : areas.length})
                </button>
              ))}
            </nav>
          </section>

          <section id="geography-search" className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
            <label className="flex h-12 min-w-0 w-full max-w-[520px] items-center gap-3 rounded-lg border border-slate-200 px-4 dark:border-slate-700">
              <Search className="h-5 w-5 shrink-0 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="নাম বা এলাকা লিখে খুঁজুন..."
                aria-label="নাম বা এলাকা লিখে খুঁজুন"
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            {activeLevel !== "upazilas" && (
              <label className="flex items-center gap-2 text-sm font-semibold">
                উপজেলা ফিল্টার:
                <span className="relative">
                  <select
                    value={selectedUpazila}
                    onChange={(event) => {
                      setSelectedUpazila(event.target.value);
                      setSelectedUnion("");
                    }}
                    aria-label="উপজেলা ফিল্টার"
                    className="h-11 min-w-48 appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 font-normal dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">সকল উপজেলা</option>
                    {upazilas.map((upazila) => (
                      <option key={upazila.key} value={upazila.name}>{upazila.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                </span>
              </label>
            )}
            {activeLevel === "areas" && selectedUpazila && (
              <label className="flex items-center gap-2 text-sm font-semibold">
                ইউনিয়ন ফিল্টার:
                <span className="relative">
                  <select
                    value={selectedUnion}
                    onChange={(event) => setSelectedUnion(event.target.value)}
                    aria-label="ইউনিয়ন ফিল্টার"
                    className="h-11 min-w-48 appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 font-normal dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">সকল ইউনিয়ন</option>
                    {unions.filter((entry) => normalize(entry.upazila) === normalize(selectedUpazila)).map((entry) => (
                      <option key={entry.key} value={entry.name}>{entry.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                </span>
              </label>
            )}
          </section>

          {error ? (
            <p role="alert" className="rounded-2xl bg-white p-8 text-center text-destructive dark:bg-slate-900">
              এলাকার তথ্য লোড করা যায়নি: {error.message}
            </p>
          ) : isLoading ? (
            <p className="rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900">এলাকার তথ্য লোড হচ্ছে...</p>
          ) : visibleEntries.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleEntries.map((entry) => {
                const canDrillDown = activeLevel !== "areas";
                const card = (
                  <div className={`relative min-h-[138px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${canDrillDown ? "hover:border-emerald-300" : ""}`}>
                    <span className="absolute right-4 top-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300">
                      {activeLevel === "upazilas" ? "উপজেলা" : activeLevel === "unions" ? "ইউনিয়ন/পৌরসভা" : "গ্রাম"}
                    </span>
                    <h2 className="flex items-center gap-2 pr-28 text-lg font-bold">
                      {activeLevel === "upazilas" ? (
                        <MapIcon className="h-5 w-5 shrink-0 text-emerald-600" />
                      ) : activeLevel === "unions" ? (
                        <Grid3X3 className="h-5 w-5 shrink-0 text-emerald-600" />
                      ) : (
                        <House className="h-5 w-5 shrink-0 text-teal-600" />
                      )}
                      <span className="line-clamp-2">{entry.name}</span>
                    </h2>
                    {entry.union && activeLevel === "areas" && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Building2 className="h-4 w-4 shrink-0" /> ইউনিয়ন: {entry.union}
                      </p>
                    )}
                    {entry.upazila && activeLevel !== "upazilas" && (
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 shrink-0" /> উপজেলা: {entry.upazila}
                      </p>
                    )}
                    {activeLevel === "upazilas" && (
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {entry.listingCount}টি তথ্য তালিকাভুক্ত
                      </p>
                    )}
                  </div>
                );

                if (activeLevel === "upazilas") {
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      onClick={() => {
                        setSelectedUpazila(entry.name);
                        setSelectedUnion("");
                        setSearch("");
                        setActiveLevel("unions");
                      }}
                      className="text-left"
                    >
                      {card}
                    </button>
                  );
                }
                if (activeLevel === "unions") {
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      onClick={() => {
                        setSelectedUpazila(entry.upazila);
                        setSelectedUnion(entry.name);
                        setSearch("");
                        setActiveLevel("areas");
                      }}
                      className="text-left"
                    >
                      {card}
                    </button>
                  );
                }
                return <article key={entry.key}>{card}</article>;
              })}
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900">
              {listings.length === 0
                ? "ড্যাশবোর্ডের তথ্য ও সেবা ডিরেক্টরিতে আগে এলাকার তথ্য যোগ করুন।"
                : "এই অনুসন্ধানের সঙ্গে মেলে এমন কোনো এলাকা পাওয়া যায়নি।"}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
