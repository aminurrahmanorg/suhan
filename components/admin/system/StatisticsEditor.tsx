"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  parseStatisticsSection,
  STATISTICS_COLORS,
  STATISTICS_ICONS,
  type StatisticsItem,
  type StatisticsSectionData,
} from "@/lib/home-sections";
import { ChartNoAxesColumnIncreasing, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ICON_LABELS = {
  map: "মানচিত্র",
  grid: "গ্রিড",
  home: "বাড়ি",
  users: "ব্যবহারকারী",
  list: "তালিকা",
  droplet: "রক্ত",
  eye: "ভিজিটর",
  globe: "বিশ্ব",
} as const;

const COLOR_LABELS = {
  emerald: "সবুজ",
  blue: "নীল",
  teal: "টিল",
  violet: "বেগুনি",
  rose: "গোলাপি",
  sky: "আকাশি",
} as const;

export default function StatisticsEditor() {
  const { data: settings, isLoading, error } = useStoreSettings();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">পরিসংখ্যান লোড হচ্ছে...</p>;
  }
  if (error) {
    return <p role="alert" className="text-sm text-destructive">পরিসংখ্যান লোড করা যায়নি: {error.message}</p>;
  }
  if (!settings) {
    return <p role="alert" className="text-sm text-destructive">পরিসংখ্যানের সেটিংস পাওয়া যায়নি।</p>;
  }

  return (
    <StatisticsForm
      key={settings.statistics_section}
      initialStatistics={parseStatisticsSection(settings.statistics_section)}
    />
  );
}

function StatisticsForm({ initialStatistics }: { initialStatistics: StatisticsSectionData }) {
  const updateSettings = useUpdateStoreSettings();
  const [statistics, setStatistics] = useState(initialStatistics);

  const addStatistic = () => {
    const item: StatisticsItem = {
      id: crypto.randomUUID(),
      label: "",
      value: "",
      icon: "map",
      color: "emerald",
      is_active: true,
    };
    setStatistics((current) => ({ ...current, items: [...current.items, item] }));
  };

  const updateStatistic = (id: string, updates: Partial<StatisticsItem>) => {
    setStatistics((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, ...updates } : item),
    }));
  };

  const saveStatistics = async () => {
    try {
      await updateSettings.mutateAsync({ statistics_section: JSON.stringify(statistics) });
      toast.success("পরিসংখ্যান সংরক্ষণ হয়েছে");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "পরিসংখ্যান সংরক্ষণ করা যায়নি");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ChartNoAxesColumnIncreasing className="h-6 w-6" />
          পরিসংখ্যান
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          হোমপেজের পরিসংখ্যান বিভাগ ও কার্ডগুলো পরিচালনা করুন।
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>পরিসংখ্যান কার্ড</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addStatistic}>
            <Plus /> পরিসংখ্যান যোগ করুন
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block max-w-md space-y-1 text-sm font-medium">
            সেকশনের শিরোনাম
            <Input
              value={statistics.title}
              onChange={(event) => setStatistics((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            {statistics.items.map((item) => (
              <div key={item.id} className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={(checked) => updateStatistic(item.id, { is_active: checked })}
                    aria-label="পরিসংখ্যান সক্রিয়"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="পরিসংখ্যান মুছুন"
                    onClick={() => setStatistics((current) => ({
                      ...current,
                      items: current.items.filter((entry) => entry.id !== item.id),
                    }))}
                  >
                    <Trash2 />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={item.label}
                    onChange={(event) => updateStatistic(item.id, { label: event.target.value })}
                    placeholder="শিরোনাম"
                    aria-label="পরিসংখ্যানের শিরোনাম"
                  />
                  <Input
                    value={item.value}
                    onChange={(event) => updateStatistic(item.id, { value: event.target.value })}
                    placeholder="সংখ্যা"
                    aria-label="পরিসংখ্যানের সংখ্যা"
                  />
                  <Select
                    value={item.icon}
                    onValueChange={(value) => {
                      const icon = STATISTICS_ICONS.find((option) => option === value);
                      if (icon) updateStatistic(item.id, { icon });
                    }}
                  >
                    <SelectTrigger aria-label="আইকন নির্বাচন করুন">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATISTICS_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>{ICON_LABELS[icon]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={item.color}
                    onValueChange={(value) => {
                      const color = STATISTICS_COLORS.find((option) => option === value);
                      if (color) updateStatistic(item.id, { color });
                    }}
                  >
                    <SelectTrigger aria-label="আইকনের রং নির্বাচন করুন">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATISTICS_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>{COLOR_LABELS[color]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
          {statistics.items.length === 0 && (
            <p className="text-sm text-muted-foreground">এখনও কোনো পরিসংখ্যান যোগ করা হয়নি।</p>
          )}
          <Button type="button" onClick={saveStatistics} disabled={updateSettings.isPending}>
            <Save /> পরিসংখ্যান সংরক্ষণ করুন
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
