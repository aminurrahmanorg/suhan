"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  BLOOD_GROUPS,
  isAllowedSectionHref,
  type BloodDonorCard,
  parseBloodDonorSection,
} from "@/lib/home-sections";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyCard: Omit<BloodDonorCard, "id"> = {
  blood_group: "O+",
  donor_count: 0,
  href: "",
  is_active: true,
};

export default function BloodDonorSectionSettings() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [sectionTitle, setSectionTitle] = useState<string | null>(null);
  const [cardsOverride, setCardsOverride] = useState<BloodDonorCard[] | null>(null);
  const [form, setForm] = useState(emptyCard);
  const [editingId, setEditingId] = useState<string | null>(null);
  const section = parseBloodDonorSection(settings?.blood_donor_section);
  const title = sectionTitle ?? section.title;
  const cards = cardsOverride ?? section.cards;

  const persist = async (nextTitle: string, nextCards: BloodDonorCard[]) => {
    await updateSettings.mutateAsync({
      blood_donor_section: JSON.stringify({ title: nextTitle, cards: nextCards }),
    });
    setSectionTitle(null);
    setCardsOverride(null);
  };

  const reset = () => {
    setForm(emptyCard);
    setEditingId(null);
  };

  const saveCard = async () => {
    const href = form.href.trim();
    const duplicateGroup = cards.some(
      (card) => card.blood_group === form.blood_group && card.id !== editingId,
    );
    if (duplicateGroup) {
      toast.error("এই রক্তের গ্রুপটি ইতিমধ্যে যোগ করা হয়েছে।");
      return;
    }
    if (!Number.isInteger(form.donor_count) || form.donor_count < 0) {
      toast.error("দাতার সংখ্যা শূন্য বা তার বেশি পূর্ণসংখ্যা হতে হবে।");
      return;
    }
    if (href && !isAllowedSectionHref(href)) {
      toast.error("লিংকটি / দিয়ে শুরু করুন অথবা http/https ঠিকানা দিন।");
      return;
    }

    const nextCard = editingId
      ? cards.map((card) => card.id === editingId ? { ...card, ...form, href } : card)
      : [...cards, { id: crypto.randomUUID(), ...form, href }];
    try {
      await persist(title.trim() || "রক্তদাতা খুঁজুন", nextCard);
      setCardsOverride(nextCard);
      reset();
      toast.success(editingId ? "রক্তের গ্রুপ আপডেট হয়েছে।" : "রক্তের গ্রুপ যোগ হয়েছে।");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "রক্তদাতার তথ্য সংরক্ষণ করা যায়নি।");
    }
  };

  const editCard = (card: BloodDonorCard) => {
    setEditingId(card.id);
    setForm({
      blood_group: card.blood_group,
      donor_count: card.donor_count,
      href: card.href,
      is_active: card.is_active,
    });
  };

  const deleteCard = async (id: string) => {
    const nextCards = cards.filter((card) => card.id !== id);
    try {
      await persist(title, nextCards);
      setCardsOverride(nextCards);
      if (editingId === id) reset();
      toast.success("রক্তের গ্রুপ মুছে ফেলা হয়েছে।");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "রক্তের গ্রুপ মুছে ফেলা যায়নি।");
    }
  };

  const saveTitle = async () => {
    try {
      await persist(title.trim() || "রক্তদাতা খুঁজুন", cards);
      toast.success("রক্তদাতা বিভাগের শিরোনাম সংরক্ষিত হয়েছে।");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "শিরোনাম সংরক্ষণ করা যায়নি।");
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">রক্তদাতার তথ্য লোড হচ্ছে...</p>;
  if (error) return <p role="alert" className="p-6 text-sm text-destructive">তথ্য লোড করা যায়নি: {error.message}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">রক্তদাতা বিভাগ</h1>
        <p className="mt-1 text-sm text-muted-foreground">হোমপেজের রক্তের গ্রুপ কার্ড এবং দাতার সংখ্যা পরিচালনা করুন।</p>
      </div>
      <Card>
        <CardHeader><CardTitle>বিভাগের শিরোনাম</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <input className="input-shop flex-1" aria-label="রক্তদাতা বিভাগের শিরোনাম" value={title} onChange={(event) => setSectionTitle(event.target.value)} />
          <Button onClick={saveTitle} disabled={updateSettings.isPending} className="gap-2"><Save className="h-4 w-4" /> সংরক্ষণ</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{editingId ? "রক্তের গ্রুপ সম্পাদনা" : "রক্তের গ্রুপ যোগ করুন"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              রক্তের গ্রুপ
              <select className="input-shop" value={form.blood_group} onChange={(event) => setForm((current) => ({ ...current, blood_group: event.target.value as BloodDonorCard["blood_group"] }))}>
                {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              দাতার সংখ্যা
              <input className="input-shop" type="number" min="0" step="1" value={form.donor_count} onChange={(event) => setForm((current) => ({ ...current, donor_count: Number(event.target.value) }))} />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium">
            “রক্তদাতা খুঁজুন” বাটনের লিংক (ঐচ্ছিক)
            <input className="input-shop" value={form.href} onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))} placeholder="/directory/blood-donor" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} />
            হোমপেজে দেখান
          </label>
          <div className="flex gap-2">
            <Button onClick={saveCard} disabled={updateSettings.isPending} className="gap-2"><Plus className="h-4 w-4" />{editingId ? "আপডেট" : "যোগ করুন"}</Button>
            {editingId && <Button variant="outline" onClick={reset}>বাতিল</Button>}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl font-extrabold text-rose-500">{card.blood_group}</span>
              <span className="flex-1 text-sm text-muted-foreground">{card.donor_count} জন · {card.is_active ? "সক্রিয়" : "বন্ধ"}</span>
              <Button variant="ghost" size="icon" aria-label={`${card.blood_group} সম্পাদনা`} onClick={() => editCard(card)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" aria-label={`${card.blood_group} মুছুন`} onClick={() => void deleteCard(card.id)} disabled={updateSettings.isPending}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
