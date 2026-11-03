"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { parseTourismSection, type TourismItem } from "@/lib/home-sections";
import {
  ArrowLeft,
  Building2,
  Camera,
  ChevronRight,
  Clock3,
  Droplet,
  Home,
  Info,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  Search,
  Share2,
  Trophy,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { parseServiceDirectory } from "@/lib/service-directory";

const SIDE_LINKS = [
  { label: "হোম", href: "/", icon: Home },
  { label: "জরুরী সেবা", href: "/#emergency", icon: Phone },
  { label: "জেলা তথ্য", href: "/#directory", icon: Info },
  { label: "জেলার ইতিহাস", href: "/#directory", icon: Clock3 },
  { label: "বিখ্যাত ব্যক্তিত্ব", href: "/#directory", icon: UserRound },
  { label: "রক্তদাতা", href: "/#blood-donors", icon: Droplet },
  { label: "পর্যটন ও বিনোদন", href: "/#tourism", icon: Camera },
  { label: "নোটিশ", href: "/#directory", icon: Newspaper },
  { label: "সংবাদ", href: "/#directory", icon: Newspaper },
];

export default function TourismDetailPage() {
  const { tourismId } = useParams<{ tourismId: string }>();
  const { data: settings, isLoading, error } = useStoreSettings();
  const section = parseTourismSection(settings?.tourism_section);
  const categories = parseServiceDirectory(settings?.service_directory).categories.filter(
    (category) => category.is_active,
  );
  const items = section.items.filter((item) => item.is_active);
  const item = items.find((tourismItem) => tourismItem.id === tourismId);
  const relatedItems = items.filter((tourismItem) => tourismItem.id !== item?.id).slice(0, 4);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const storeName = settings?.store_name?.trim() || "স্মার্ট হবিগঞ্জ";
  const storeTagline = settings?.store_tagline?.trim() || "হবিগঞ্জের তথ্য ও সেবার স্মার্ট প্ল্যাটফর্ম";

  const sharePlace = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: item?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShareMessage("লিংক শেয়ার হয়েছে");
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      setShareMessage("শেয়ার করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  if (isLoading) return <p className="container-shop py-16 text-center">লোড হচ্ছে...</p>;
  if (error) return <p role="alert" className="container-shop py-16 text-center text-destructive">{error.message}</p>;
  if (!item) {
    return (
      <div className="container-shop py-16 text-center">
        <h1 className="text-2xl font-bold">পর্যটনস্থলের তথ্য পাওয়া যায়নি</h1>
        <Link href="/#tourism" className="mt-4 inline-flex items-center gap-2 text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> পর্যটন বিভাগে ফিরে যান
        </Link>
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
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold">{storeName}</span>
              <span className="block text-[11px] leading-4 text-white/80">{storeTagline}</span>
            </span>
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
          {SIDE_LINKS.map(({ label, href, icon: Icon }, index) => (
            <Link key={label} href={href} onClick={() => setSidebarOpen(false)} className={`flex min-h-[54px] items-center gap-4 rounded-r-full px-6 text-sm transition-colors ${index === 0 ? "bg-[#e2f2ed] font-bold text-[#00845e]" : "text-slate-600 hover:bg-emerald-50 hover:text-[#00845e] dark:text-slate-300 dark:hover:bg-slate-800"}`}>
              <Icon className="h-5 w-5 shrink-0 text-[#009f70]" />
              {label}
            </Link>
          ))}
          {categories.map((category) => (
            <Link key={category.id} href={`/directory/${encodeURIComponent(category.slug)}`} onClick={() => setSidebarOpen(false)} className="flex min-h-[48px] items-center gap-4 px-6 text-sm text-slate-600 hover:bg-emerald-50 hover:text-[#00845e] dark:text-slate-300 dark:hover:bg-slate-800">
              <Building2 className="h-5 w-5 shrink-0 text-[#009f70]" />
              <span className="truncate">{category.name}</span>
            </Link>
          ))}
        </nav>
        <div className="shrink-0 border-t px-5 py-3 text-[11px] text-slate-500 dark:border-slate-800">
          <p>সংস্করণ ৬.০.৩ · {storeName}</p>
          <p className="mt-2 font-semibold text-emerald-700">〈/〉 Developed by SUhan</p>
        </div>
      </aside>

      {sidebarOpen && <button type="button" aria-label="মেনু বন্ধ করুন" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-[60] bg-black/40 lg:hidden" />}
      <div className="min-h-screen lg:ml-[306px]">
        <header className="sticky top-0 z-50 flex min-h-[64px] items-center justify-between gap-2 bg-[#009f70] px-3 text-white shadow-sm sm:min-h-[72px] sm:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-white/10 lg:hidden" aria-label="মেনু খুলুন"><Menu className="h-5 w-5" /></button>
            <Link href="/" className="min-w-0">
              <span className="block truncate text-base font-extrabold sm:text-xl">{storeName}</span>
              <span className="block truncate text-[11px] text-white/75">{storeTagline}</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            <Link href="/#directory" aria-label="তথ্য ও সেবা দেখুন" className="rounded-full p-2 hover:bg-white/10"><Search className="h-5 w-5" /></Link>
            <Link href="/#directory" aria-label="তথ্য ডিরেক্টরি" className="hidden rounded-full p-2 hover:bg-white/10 sm:inline-flex"><Trophy className="h-5 w-5 text-yellow-300" /></Link>
            <Link href="/admin/login" aria-label="অ্যাডমিন লগইন" className="rounded-full p-2 hover:bg-white/10"><UserRound className="h-5 w-5" /></Link>
          </div>
        </header>

        <section className="relative flex min-h-[220px] items-end overflow-hidden bg-slate-800 sm:min-h-[320px]">
          {item.image && <Image src={item.image} alt={item.title} fill priority className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="relative z-10 w-full px-4 pb-6 text-white sm:px-8 sm:pb-7">
            <Link href="/#tourism" className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Camera className="h-4 w-4" /> {section.title}
            </Link>
            <h1 className="break-words text-xl font-extrabold sm:text-4xl">{item.title}</h1>
            {(item.upazila || item.district) && (
              <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <MapPin className="h-4 w-4 text-amber-400" />
                {[item.upazila, item.district].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto min-w-0 max-w-[1440px] space-y-4 px-3 py-4 sm:space-y-5 sm:px-8 sm:py-5">
          <div className="flex items-center justify-between gap-2">
            <Link href="/#tourism" className="inline-flex min-w-0 items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline sm:gap-2 sm:text-sm">
              <ArrowLeft className="h-4 w-4 shrink-0" /> <span className="truncate">পর্যটন বিভাগ</span>
            </Link>
            <button type="button" onClick={() => void sharePlace()} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 sm:gap-2 sm:px-4 sm:text-sm">
              <Share2 className="h-4 w-4" /> শেয়ার
            </button>
          </div>
          {shareMessage && <p role="status" className="text-right text-sm text-emerald-700">{shareMessage}</p>}

          {item.description && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:bg-slate-900">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><span className="text-blue-500">ⓘ</span> সংক্ষিপ্ত বিবরণ</h2>
              <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">{item.description}</p>
            </section>
          )}

          {(item.detail_description || item.description) && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:bg-slate-900">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Camera className="h-5 w-5 text-emerald-600" /> বিস্তারিত বিবরণ</h2>
              <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">{item.detail_description || item.description}</p>
            </section>
          )}

          {item.image && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:bg-slate-900">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Camera className="h-5 w-5 text-sky-500" /> ছবি (1)</h2>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:aspect-auto sm:h-64 sm:max-w-md">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 448px" className="object-cover" />
              </div>
            </section>
          )}

          {(item.district || item.upazila || item.address || item.map_url) && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:bg-slate-900">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-rose-500" /> ঠিকানা ও অবস্থান</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {item.district && <LocationValue label="জেলা" value={item.district} />}
                {item.upazila && <LocationValue label="উপজেলা" value={item.upazila} />}
              </div>
              {item.address && <p className="mt-4 break-words rounded-xl border bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200"><strong>বিস্তারিত ঠিকানা:</strong> {item.address}</p>}
              {item.map_url && /^https?:\/\//i.test(item.map_url) && (
                <a href={item.map_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <MapPin className="h-4 w-4" /> গুগল ম্যাপে অবস্থান দেখুন
                </a>
              )}
            </section>
          )}

          {item.phone_numbers.length > 0 && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:bg-slate-900">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Phone className="h-5 w-5 text-blue-500" /> যোগাযোগ তথ্য</h2>
              <div className="flex flex-wrap gap-3">
                {item.phone_numbers.map((phone, index) => (
                  <a key={`${phone}-${index}`} href={`tel:${phone.replace(/[^\d+*#,;]/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">
                    <Phone className="h-4 w-4" /> {phone}
                  </a>
                ))}
              </div>
            </section>
          )}

          {relatedItems.length > 0 && (
            <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7 dark:bg-slate-900">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Camera className="h-5 w-5 text-emerald-600" /> সম্পর্কিত অন্যান্য তথ্য</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedItems.map((related) => <RelatedTourismCard key={related.id} item={related} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function LocationValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4 text-center dark:bg-slate-800">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function RelatedTourismCard({ item }: { item: TourismItem }) {
  const href = item.href || `/tourism/${encodeURIComponent(item.id)}`;
  const content = (
    <span className="flex items-center gap-3 rounded-xl border p-2 transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {item.image ? <Image src={item.image} alt="" fill sizes="56px" className="object-cover" /> : <Camera className="m-4 h-6 w-6 text-slate-400" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold">{item.title}</span>
        <span className="mt-1 block truncate text-xs text-slate-500">{[item.upazila, item.district].filter(Boolean).join(" · ") || "পর্যটন ও বিনোদন"}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </span>
  );
  return /^https?:\/\//i.test(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
    : <Link href={href}>{content}</Link>;
}
