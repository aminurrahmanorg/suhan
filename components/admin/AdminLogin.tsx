"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Eye, EyeOff, Lock, Mail, Sparkles, Star, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, isLoading: authLoading, user, isAdmin, isStaff } = useAuth();
  const { data: s, isLoading: storeLoading } = useStoreSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin || isStaff) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [user, isAdmin, isStaff, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    // Check user role to redirect appropriately
    const { createClient } = await import("@/utils/supabase/client");
    const supabaseClient = createClient();
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    let redirectPath = "/";
    if (session?.user) {
      const { data: roleData } = await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const role = roleData?.role || "customer";
      if (role !== "customer") {
        redirectPath = "/admin";
      }
    }

    toast.success("Welcome back!");
    router.push(redirectPath);
  };

  const isLoading = authLoading || storeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-muted-foreground font-semibold">Loading Secure Portal...</p>
      </div>
    );
  }

  const logoImg = s?.store_logo || "";
  const storeName = s?.store_name || "Store";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Glowing Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-accent/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/8 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card Component */}
        <div className="bg-card/45 backdrop-blur-lg rounded-3xl border border-border/80 p-8 shadow-sm space-y-6 relative overflow-hidden">
          {/* Card Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-blue-500" />

          {/* Logo inside card */}
          <div className="text-center">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              {logoImg ? (
                <Image
                  src={logoImg}
                  alt={storeName}
                  width={150}
                  height={45}
                  className="h-9 w-auto object-contain mx-auto"
                />
              ) : (
                <span className="text-2xl font-black tracking-tight text-foreground uppercase">{storeName}</span>
              )}
            </Link>
          </div>

          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Account Sign In</h1>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to access your account dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-background/50 border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all focus:bg-background"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 text-sm bg-background/50 border border-input rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all focus:bg-background"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Action Footer */}
          <div className="border-t border-border/50 pt-4 flex flex-col items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Back to Storefront
            </Link>
          </div>
        </div>

        {/* Outer Switch Page Link */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/admin/register" className="font-bold text-accent hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
