"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  isAllowedSectionHref,
  parseTourismSection,
  type TourismItem,
} from "@/lib/home-sections";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const emptyItem: Omit<TourismItem, "id"> = {
  title: "",
  image: "",
  description: "",
  detail_description: "",
  district: "",
  upazila: "",
  address: "",
  map_url: "",
  phone_numbers: [],
  href: "",
  is_active: true,
};

export default function TourismSectionSettings() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [sectionTitle, setSectionTitle] = useState<string | null>(null);
  const [itemsOverride, setItemsOverride] = useState<TourismItem[] | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  const section = parseTourismSection(settings?.tourism_section);
  const title = sectionTitle ?? section.title;
  const items = itemsOverride ?? section.items;

  const persist = async (nextTitle: string, nextItems: TourismItem[]) => {
    await updateSettings.mutateAsync({
      tourism_section: JSON.stringify({ title: nextTitle, items: nextItems }),
    });
    setSectionTitle(null);
    setItemsOverride(null);
  };

  const reset = () => {
    setForm(emptyItem);
    setEditingId(null);
  };

  const saveItem = async () => {
    const itemTitle = form.title.trim();
    const href = form.href.trim();
    const mapUrl = form.map_url.trim();
    if (!itemTitle) {
      toast.error("পর্যটনস্থলের নাম লিখুন।");
      return;
    }
    if (href && !isAllowedSectionHref(href)) {
      toast.error("লিংকটি / দিয়ে শুরু করুন অথবা http/https ঠিকানা দিন।");
      return;
    }
    if (mapUrl && !/^https?:\/\//i.test(mapUrl)) {
      toast.error("মানচিত্রের লিংকটি http:// অথবা https:// দিয়ে শুরু করুন।");
      return;
    }

    const nextItem = { ...form, title: itemTitle, href, map_url: mapUrl };
    const nextItems = editingId
      ? items.map((item) => item.id === editingId ? { ...item, ...nextItem } : item)
      : [...items, { id: crypto.randomUUID(), ...nextItem }];
    try {
      await persist(title.trim() || "পর্যটন ও বিনোদন", nextItems);
      setItemsOverride(nextItems);
      reset();
      toast.success(editingId ? "পর্যটনস্থলের তথ্য আপডেট হয়েছে।" : "পর্যটনস্থল যোগ হয়েছে।");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "পর্যটনস্থলের তথ্য সংরক্ষণ করা যায়নি।");
    }
  };

  const editItem = (item: TourismItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      image: item.image,
      description: item.description,
      detail_description: item.detail_description,
      district: item.district,
      upazila: item.upazila,
      address: item.address,
      map_url: item.map_url,
      phone_numbers: item.phone_numbers,
      href: item.href,
      is_active: item.is_active,
    });
  };

  const deleteItem = async (id: string) => {
    const nextItems = items.filter((item) => item.id !== id);
    try {
      await persist(title, nextItems);
      setItemsOverride(nextItems);
      if (editingId === id) reset();
      toast.success("পর্যটনস্থল মুছে ফেলা হয়েছে।");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "পর্যটনস্থল মুছে ফেলা যায়নি।");
    }
  };

  const saveTitle = async () => {
    try {
      await persist(title.trim() || "পর্যটন ও বিনোদন", items);
      toast.success("পর্যটন বিভাগের শিরোনাম সংরক্ষিত হয়েছে।");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "শিরোনাম সংরক্ষণ করা যায়নি।");
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">পর্যটনস্থলের তথ্য লোড হচ্ছে...</p>;
  if (error) return <p role="alert" className="p-6 text-sm text-destructive">তথ্য লোড করা যায়নি: {error.message}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">পর্যটন ও বিনোদন বিভাগ</h1>
        <p className="mt-1 text-sm text-muted-foreground">হোমপেজের পর্যটন কার্ডের ছবি, নাম ও বিবরণ পরিচালনা করুন।</p>
      </div>
      <Card>
        <CardHeader><CardTitle>বিভাগের শিরোনাম</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <input className="input-shop flex-1" aria-label="পর্যটন বিভাগের শিরোনাম" value={title} onChange={(event) => setSectionTitle(event.target.value)} />
          <Button onClick={saveTitle} disabled={updateSettings.isPending} className="gap-2"><Save className="h-4 w-4" /> সংরক্ষণ</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{editingId ? "পর্যটনস্থল সম্পাদনা" : "পর্যটনস্থল যোগ করুন"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            পর্যটনস্থলের নাম
            <input className="input-shop" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="যেমন: সাতছড়ি জাতীয় উদ্যান" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            ছবি
            <ImageUpload value={form.image} onChange={(image) => setForm((current) => ({ ...current, image }))} folder="tourism" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            সংক্ষিপ্ত বিবরণ
            <textarea className="input-shop min-h-24" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="স্থানটি সম্পর্কে সংক্ষেপে লিখুন" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            বিস্তারিত বিবরণ
            <textarea className="input-shop min-h-32" value={form.detail_description} onChange={(event) => setForm((current) => ({ ...current, detail_description: event.target.value }))} placeholder="পর্যটনস্থল সম্পর্কে বিস্তারিত তথ্য লিখুন" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              জেলা
              <input className="input-shop" value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              উপজেলা
              <input className="input-shop" value={form.upazila} onChange={(event) => setForm((current) => ({ ...current, upazila: event.target.value }))} />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium">
            বিস্তারিত ঠিকানা
            <input className="input-shop" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            মানচিত্রের লিংক (ঐচ্ছিক)
            <input className="input-shop" value={form.map_url} onChange={(event) => setForm((current) => ({ ...current, map_url: event.target.value }))} placeholder="https://maps.google.com/..." />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            যোগাযোগ নম্বর (কমা দিয়ে আলাদা করুন)
            <input className="input-shop" value={form.phone_numbers.join(", ")} onChange={(event) => setForm((current) => ({ ...current, phone_numbers: event.target.value.split(",").map((phone) => phone.trim()).filter(Boolean) }))} placeholder="01700000000, 01800000000" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            বিস্তারিত পেজ/ওয়েবসাইটের লিংক (ঐচ্ছিক)
            <input className="input-shop" value={form.href} onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))} placeholder="/directory/tourism অথবা https://example.com" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} />
            হোমপেজে দেখান
          </label>
          <div className="flex gap-2">
            <Button onClick={saveItem} disabled={updateSettings.isPending} className="gap-2"><Plus className="h-4 w-4" />{editingId ? "আপডেট" : "যোগ করুন"}</Button>
            {editingId && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            {item.image && <Image src={item.image} alt={item.title} width={480} height={240} className="h-36 w-full rounded-t-xl object-cover" />}
            <CardContent className="flex items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description || "বিবরণ নেই"}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.is_active ? "সক্রিয়" : "বন্ধ"}</p>
              </div>
              <div className="flex shrink-0">
                <Button variant="ghost" size="icon" aria-label={`${item.title} সম্পাদনা`} onClick={() => editItem(item)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label={`${item.title} মুছুন`} onClick={() => void deleteItem(item.id)} disabled={updateSettings.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
