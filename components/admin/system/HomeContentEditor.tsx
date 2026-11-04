"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  parseLatestNews,
  parseNoticeBoard,
  type LatestNewsData,
  type NewsItem,
  type NoticeBoardData,
  type NoticeItem,
} from "@/lib/home-sections";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function HomeContentEditor() {
  const { data: settings, isLoading } = useStoreSettings();
  if (isLoading || !settings) return null;

  return (
    <HomeContentForm
      key={`${settings.notice_board}:${settings.latest_news}`}
      initialNoticeBoard={parseNoticeBoard(settings.notice_board)}
      initialLatestNews={parseLatestNews(settings.latest_news)}
    />
  );
}

function HomeContentForm({
  initialNoticeBoard,
  initialLatestNews,
}: {
  initialNoticeBoard: NoticeBoardData;
  initialLatestNews: LatestNewsData;
}) {
  const updateSettings = useUpdateStoreSettings();
  const [noticeBoard, setNoticeBoard] = useState(initialNoticeBoard);
  const [latestNews, setLatestNews] = useState(initialLatestNews);

  const saveNoticeBoard = async () => {
    try {
      await updateSettings.mutateAsync({ notice_board: JSON.stringify(noticeBoard) });
      toast.success("নোটিশ বোর্ড সংরক্ষণ হয়েছে");
    } catch {
      toast.error("নোটিশ বোর্ড সংরক্ষণ করা যায়নি");
    }
  };

  const saveLatestNews = async () => {
    try {
      await updateSettings.mutateAsync({ latest_news: JSON.stringify(latestNews) });
      toast.success("সর্বশেষ সংবাদ সংরক্ষণ হয়েছে");
    } catch {
      toast.error("সর্বশেষ সংবাদ সংরক্ষণ করা যায়নি");
    }
  };

  const addNotice = () => {
    const item: NoticeItem = {
      id: crypto.randomUUID(),
      title: "",
      date: today(),
      href: "",
      is_active: true,
    };
    setNoticeBoard((current) => ({ ...current, items: [...current.items, item] }));
  };

  const addNews = () => {
    const item: NewsItem = {
      id: crypto.randomUUID(),
      title: "",
      date: today(),
      image: "",
      href: "",
      is_active: true,
    };
    setLatestNews((current) => ({ ...current, items: [...current.items, item] }));
  };

  const updateNotice = (id: string, updates: Partial<NoticeItem>) => {
    setNoticeBoard((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, ...updates } : item),
    }));
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    setLatestNews((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, ...updates } : item),
    }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>নোটিশ বোর্ড</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addNotice}>
            <Plus /> নোটিশ যোগ করুন
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium">
              শিরোনাম
              <Input value={noticeBoard.title} onChange={(event) => setNoticeBoard((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label className="space-y-1 text-sm font-medium">
              সব দেখুন লিংক
              <Input value={noticeBoard.view_all_href} onChange={(event) => setNoticeBoard((current) => ({ ...current, view_all_href: event.target.value }))} placeholder="/notices" />
            </label>
          </div>
          {noticeBoard.items.map((item) => (
            <div key={item.id} className="space-y-3 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <Switch checked={item.is_active} onCheckedChange={(checked) => updateNotice(item.id, { is_active: checked })} aria-label="নোটিশ সক্রিয়" />
                <Button type="button" variant="ghost" size="icon" aria-label="নোটিশ মুছুন" onClick={() => setNoticeBoard((current) => ({ ...current, items: current.items.filter((entry) => entry.id !== item.id) }))}>
                  <Trash2 />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={item.title} onChange={(event) => updateNotice(item.id, { title: event.target.value })} placeholder="নোটিশের শিরোনাম" aria-label="নোটিশের শিরোনাম" />
                <Input type="date" value={item.date} onChange={(event) => updateNotice(item.id, { date: event.target.value })} aria-label="নোটিশের তারিখ" />
                <Input value={item.href} onChange={(event) => updateNotice(item.id, { href: event.target.value })} placeholder="লিংক (ঐচ্ছিক)" aria-label="নোটিশের লিংক" className="sm:col-span-2" />
              </div>
            </div>
          ))}
          {noticeBoard.items.length === 0 && <p className="text-sm text-muted-foreground">এখনও কোনো নোটিশ যোগ করা হয়নি।</p>}
          <Button type="button" onClick={saveNoticeBoard} disabled={updateSettings.isPending}>
            <Save /> নোটিশ সংরক্ষণ করুন
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>সর্বশেষ সংবাদ</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addNews}>
            <Plus /> সংবাদ যোগ করুন
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium">
              শিরোনাম
              <Input value={latestNews.title} onChange={(event) => setLatestNews((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label className="space-y-1 text-sm font-medium">
              সব দেখুন লিংক
              <Input value={latestNews.view_all_href} onChange={(event) => setLatestNews((current) => ({ ...current, view_all_href: event.target.value }))} placeholder="/news" />
            </label>
          </div>
          {latestNews.items.map((item) => (
            <div key={item.id} className="space-y-3 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <Switch checked={item.is_active} onCheckedChange={(checked) => updateNews(item.id, { is_active: checked })} aria-label="সংবাদ সক্রিয়" />
                <Button type="button" variant="ghost" size="icon" aria-label="সংবাদ মুছুন" onClick={() => setLatestNews((current) => ({ ...current, items: current.items.filter((entry) => entry.id !== item.id) }))}>
                  <Trash2 />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={item.title} onChange={(event) => updateNews(item.id, { title: event.target.value })} placeholder="সংবাদের শিরোনাম" aria-label="সংবাদের শিরোনাম" />
                <Input type="date" value={item.date} onChange={(event) => updateNews(item.id, { date: event.target.value })} aria-label="সংবাদের তারিখ" />
                <Input value={item.href} onChange={(event) => updateNews(item.id, { href: event.target.value })} placeholder="লিংক (ঐচ্ছিক)" aria-label="সংবাদের লিংক" className="sm:col-span-2" />
              </div>
              <ImageUpload value={item.image} onChange={(image) => updateNews(item.id, { image })} folder="home-news" />
            </div>
          ))}
          {latestNews.items.length === 0 && <p className="text-sm text-muted-foreground">এখনও কোনো সংবাদ যোগ করা হয়নি।</p>}
          <Button type="button" onClick={saveLatestNews} disabled={updateSettings.isPending}>
            <Save /> সংবাদ সংরক্ষণ করুন
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}