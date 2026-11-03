"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useActiveTemplate,
  useTemplateSections,
  useUpdateSection,
} from "@/hooks/useHomePageTemplates";
import { Image as ImageIcon, Info, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PromoBannersSettings() {
  const { data: activeTemplate, isLoading: templateLoading } = useActiveTemplate();
  const { data: sections = [], isLoading: sectionsLoading } = useTemplateSections(activeTemplate?.id);
  const updateSection = useUpdateSection();

  const [b1Image, setB1Image] = useState("");
  const [b1Badge, setB1Badge] = useState("");
  const [b1Title, setB1Title] = useState("");
  const [b1Desc, setB1Desc] = useState("");
  const [b1Discount, setB1Discount] = useState("");
  const [b1Link, setB1Link] = useState("");

  const [b2Image, setB2Image] = useState("");
  const [b2Badge, setB2Badge] = useState("");
  const [b2Title, setB2Title] = useState("");
  const [b2Desc, setB2Desc] = useState("");
  const [b2Discount, setB2Discount] = useState("");
  const [b2Link, setB2Link] = useState("");

  const featuredProductsSection = sections.find((s) => s.section_type === "featured_products");

  useEffect(() => {
    if (featuredProductsSection) {
      const settings = featuredProductsSection.settings_json || {};
      setB1Image(settings.banner1_image || "");
      setB1Badge(settings.banner1_badge || "");
      setB1Title(settings.banner1_title || "");
      setB1Desc(settings.banner1_desc || "");
      setB1Discount(settings.banner1_discount || "");
      setB1Link(settings.banner1_link || "");

      setB2Image(settings.banner2_image || "");
      setB2Badge(settings.banner2_badge || "");
      setB2Title(settings.banner2_title || "");
      setB2Desc(settings.banner2_desc || "");
      setB2Discount(settings.banner2_discount || "");
      setB2Link(settings.banner2_link || "");
    }
  }, [featuredProductsSection]);

  const handleSave = async () => {
    if (!featuredProductsSection) {
      toast.error("Could not find homepage layout configuration.");
      return;
    }

    try {
      const updatedSettings = {
        ...(featuredProductsSection.settings_json || {}),
        banner1_image: b1Image,
        banner1_badge: b1Badge,
        banner1_title: b1Title,
        banner1_desc: b1Desc,
        banner1_discount: b1Discount,
        banner1_link: b1Link,

        banner2_image: b2Image,
        banner2_badge: b2Badge,
        banner2_title: b2Title,
        banner2_desc: b2Desc,
        banner2_discount: b2Discount,
        banner2_link: b2Link,
      };

      await updateSection.mutateAsync({
        id: featuredProductsSection.id,
        settings_json: updatedSettings,
      });

      toast.success("Promo Banners updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update Promo Banners.");
    }
  };

  const isLoading = templateLoading || sectionsLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading settings...</p>
      </div>
    );
  }

  if (!featuredProductsSection) {
    return (
      <div className="p-6 text-center border rounded-xl bg-destructive/5 border-destructive/20 text-destructive">
        <p className="font-bold">Homepage Section Mismatch</p>
        <p className="text-xs mt-1">Make sure you have an active homepage template and the "Featured Products" section is enabled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6" /> Promo Banners
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure the 2 homepage promotional banners (located below Featured Products)
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateSection.isPending} className="gap-2 cursor-pointer">
          <Save className="h-4 w-4" />
          {updateSection.isPending ? "Saving..." : "Save Banners"}
        </Button>
      </div>

      <Card className="bg-blue-50/20 border-blue-200/50">
        <CardContent className="pt-4 flex gap-2.5 items-start text-xs text-blue-700 dark:text-blue-300">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Tip:</span> If you want to use the banner as a **clean, image-only clickable banner link** without any overlay text or buttons, simply leave the **Badge, Title, Description, and Discount text fields empty**. Only the uploaded image will be rendered, and clicking it will direct users to the configured link.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1 (Left) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Banner 1 (Left Banner)</CardTitle>
            <CardDescription>Configure properties for the left-side homepage promo banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">Banner Image</label>
              <ImageUpload
                value={b1Image}
                onChange={setB1Image}
                folder="banners"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Badge Text</label>
                <Input
                  value={b1Badge}
                  onChange={(e) => setB1Badge(e.target.value)}
                  placeholder="e.g., Limited Time Offer (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Banner Title</label>
                <Input
                  value={b1Title}
                  onChange={(e) => setB1Title(e.target.value)}
                  placeholder="e.g., Premium Sports Gear (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                <Input
                  value={b1Desc}
                  onChange={(e) => setB1Desc(e.target.value)}
                  placeholder="e.g., Elevate your workout... (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Discount/Label Text</label>
                <Input
                  value={b1Discount}
                  onChange={(e) => setB1Discount(e.target.value)}
                  placeholder="e.g., Up to 35% OFF (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Redirection Link</label>
                <Input
                  value={b1Link}
                  onChange={(e) => setB1Link(e.target.value)}
                  placeholder="e.g., /shop or category path"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banner 2 (Right) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Banner 2 (Right Banner)</CardTitle>
            <CardDescription>Configure properties for the right-side homepage promo banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">Banner Image</label>
              <ImageUpload
                value={b2Image}
                onChange={setB2Image}
                folder="banners"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Badge Text</label>
                <Input
                  value={b2Badge}
                  onChange={(e) => setB2Badge(e.target.value)}
                  placeholder="e.g., New Arrivals (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Banner Title</label>
                <Input
                  value={b2Title}
                  onChange={(e) => setB2Title(e.target.value)}
                  placeholder="e.g., Next-Gen Athletic Sneakers (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                <Input
                  value={b2Desc}
                  onChange={(e) => setB2Desc(e.target.value)}
                  placeholder="e.g., Engineered for speed... (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Discount/Label Text</label>
                <Input
                  value={b2Discount}
                  onChange={(e) => setB2Discount(e.target.value)}
                  placeholder="e.g., Run Fast (leave blank to hide)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Redirection Link</label>
                <Input
                  value={b2Link}
                  onChange={(e) => setB2Link(e.target.value)}
                  placeholder="e.g., /shop or category path"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
