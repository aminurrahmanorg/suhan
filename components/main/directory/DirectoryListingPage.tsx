"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { parseServiceDirectory } from "@/lib/service-directory";

export default function DirectoryListingPage() {
  const { categorySlug, listingSlug } = useParams<{
    categorySlug: string;
    listingSlug: string;
  }>();
  const { data: settings, isLoading, error } = useStoreSettings({ staleTime: 0 });
  const directory = parseServiceDirectory(settings?.service_directory);
  const category = directory.categories.find(
    (item) => item.slug === categorySlug && item.is_active,
  );
  const listing = directory.listings.find(
    (item) =>
      item.category_id === category?.id &&
      item.slug === listingSlug &&
      item.is_active,
  );
  const locationParts = [
    ["জেলা", listing?.district],
    ["উপজেলা", listing?.upazila],
    ["ইউনিয়ন/ওয়ার্ড", listing?.union],
    ["গ্রাম/এলাকা/মহল্লা", listing?.area],
  ] as const;

  if (isLoading) return <p className="container-shop py-16 text-center">লোড হচ্ছে...</p>;
  if (error) {
    return <p className="container-shop py-16 text-center text-destructive">{error.message}</p>;
  }
  if (!category || !listing) {
    return (
      <div className="container-shop py-16 text-center">
        <h1 className="text-2xl font-bold">তথ্য পাওয়া যায়নি</h1>
        <Link href="/" className="mt-4 inline-block text-accent">হোমে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="relative flex min-h-56 items-end overflow-hidden bg-slate-800 sm:min-h-72">
        {listing.image && (
          <Image
            src={listing.image}
            alt={listing.name}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="container-shop relative z-10 pb-7 text-white">
          <Link href={`/directory/${category.slug}`} className="mb-4 inline-block text-sm text-white/85 hover:underline">
            {category.name}
          </Link>
          <h1 className="text-2xl font-extrabold sm:text-4xl">{listing.name}</h1>
          {listing.area && (
            <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
              <MapPin className="h-4 w-4 text-amber-400" />
              {[listing.area, listing.upazila, listing.district].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="container-shop mt-6 space-y-5">
        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <MapPin className="h-5 w-5 text-rose-500" />
            ঠিকানা ও অবস্থান
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {locationParts.map(([label, value]) => value && (
              <div key={label} className="rounded-xl border bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          {listing.address && (
            <p className="mt-4 rounded-xl border bg-slate-50 p-4 text-slate-700">
              <strong>বিস্তারিত ঠিকানা:</strong> {listing.address}
            </p>
          )}
        </section>

        {listing.description && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-3 text-lg font-bold">বিস্তারিত তথ্য</h2>
            <p className="whitespace-pre-wrap leading-7 text-slate-700">{listing.description}</p>
          </section>
        )}

        {listing.phone_numbers.length > 0 && (
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Phone className="h-5 w-5 text-emerald-600" />
              যোগাযোগ
            </h2>
            <div className="flex flex-wrap gap-3">
              {listing.phone_numbers.map((phone, index) => (
                <a
                  key={`${phone}-${index}`}
                  href={`tel:${phone.replace(/[^\d+*#,;]/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
