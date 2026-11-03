"use client";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Award, Shield, Truck, Users, Sparkles, Star, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const VALUE_ICONS = [Award, Users, Truck, Shield];

export default function AboutPage() {
  const { data: s, isLoading } = useStoreSettings();

  const heroTitle = s?.about_hero_title || "About Us";
  const heroImage =
    s?.about_hero_image ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80";
  const storyTitle = s?.about_story_title || "Our Story";
  const storyP1 = s?.about_story_p1 || "";
  const storyP2 = s?.about_story_p2 || "";

  const values = [1, 2, 3, 4].map((i) => ({
    title: (s as any)?.[`about_value_${i}_title`] || "",
    text: (s as any)?.[`about_value_${i}_text`] || "",
    Icon: VALUE_ICONS[i - 1],
  }));

  const stats = [1, 2, 3, 4].map((i) => ({
    value: (s as any)?.[`about_stat_${i}_value`] || "",
    label: (s as any)?.[`about_stat_${i}_label`] || "",
  }));

  const hasValues = values.some((v) => v.title || v.text);
  const hasStats = stats.some((st) => st.value || st.label);

  if (isLoading) {
    return (
      <div className="container-shop section-padding min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground font-semibold">Loading Page...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Gorgeous Hero Background Cover Section */}
      <section className="relative h-[280px] md:h-[380px] overflow-hidden flex items-center justify-center">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-103 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/60" />
        
        {/* Breadcrumb & Hero Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <nav className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white/80 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-4 shadow-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-accent font-black">{heroTitle}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight uppercase">
            {heroTitle}
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mt-4 shadow-xs" />
        </div>
      </section>

      <div className="container-shop section-padding py-16 md:py-24 space-y-20 relative z-10">
        
        {/* Story Section */}
        {(storyP1 || storyP2) && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Image/Logo Card */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
              <div className="relative aspect-4/3 lg:aspect-square bg-card border border-border/80 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
                {/* Full Card Cover Image (Loaded dynamically from Settings -> Pages -> About Us -> Story Image field in dashboard) */}
                <Image
                  src={
                    s?.about_story_image ||
                    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80"
                  }
                  alt="Our Story"
                  fill
                  sizes="(max-w-1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5" />

                {/* Visual badge inside image */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md border border-border/60 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm z-10">
                  <div className="h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-accent animate-spin-slow" />
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-[9px] text-muted-foreground uppercase font-black">Premium Quality</p>
                    <p className="text-[11px] font-bold text-foreground mt-0.5">100% Genuine Gear</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Text Box */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 text-accent bg-accent/8 border border-accent/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Who We Are
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {storyTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed">
                {storyP1 && (
                  <p className="first-letter:text-3xl first-letter:font-black first-letter:text-accent">
                    {storyP1}
                  </p>
                )}
                {storyP2 && (
                  <p className="border-l-2 border-accent/30 pl-4 italic">
                    {storyP2}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Core Values Section */}
        {hasValues && (
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 text-accent bg-accent/8 border border-accent/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Our Core Pillars
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">What Defines Us</h2>
              <p className="text-muted-foreground text-xs md:text-sm">We are driven by excellence, integrity, and customer satisfaction in all our transactions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, idx) => {
                if (!v.title && !v.text) return null;
                return (
                  <div
                    key={idx}
                    className="group relative bg-card/45 backdrop-blur-md border border-border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg text-center"
                  >
                    {/* Floating glow behind icon */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-accent/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-accent/8 border border-accent/15 flex items-center justify-center mx-auto mb-5 transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <v.Icon className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                    </div>
                    <h3 className="font-extrabold text-md mb-2 group-hover:text-accent transition-colors duration-300">
                      {v.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {v.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Stats Section */}
        {hasStats && (
          <section className="relative overflow-hidden bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 shadow-2xl border border-primary-foreground/5">
            {/* Background Decorative Rings/Glows */}
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              {stats.map((st, idx) => {
                if (!st.value && !st.label) return null;
                return (
                  <div key={idx} className="space-y-1 group">
                    <p className="text-3xl md:text-5xl font-black tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
                      {st.value}
                    </p>
                    <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-primary-foreground/75 group-hover:text-accent transition-colors duration-300">
                      {st.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
