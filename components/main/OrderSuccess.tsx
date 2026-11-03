"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-N/A";
  const { t } = useSiteSettings();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (orderId && orderId !== "ORD-N/A") {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      toast.success("Order Number copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-background min-h-[85vh] flex items-center justify-center py-12 md:py-16">
      <div className="container-shop max-w-xl mx-auto px-4">
        <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm text-center space-y-6">
          {/* Animated Success Ring */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-3xl bg-accent/10 border-2 border-accent text-accent shadow-md shadow-accent/20">
            <CheckCircle2 className="h-10 w-10 text-accent" />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-xs">
              ✓
            </span>
          </div>

          <div>
            <Badge className="bg-accent/10 text-accent border border-accent/20 text-xs px-3 py-1 rounded-full font-bold mb-3">
              Order Placed Successfully
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-2">
              Thank You For Your Order! 🎉
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              We've received your request and our team is already preparing your items for delivery.
            </p>
          </div>

          {/* Order ID Card */}
          <div className="bg-background border border-border/80 rounded-2xl p-5 max-w-md mx-auto space-y-2 relative group">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Your Order Reference Number
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl md:text-3xl font-black tracking-wider text-accent font-mono">
                {orderId}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="p-2 rounded-xl text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                title="Copy Order ID"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Please save this Order ID to track your delivery status anytime.
            </p>
          </div>

          {/* Steps Timeline Box */}
          <div className="bg-secondary/40 border border-border/60 rounded-2xl p-6 text-left space-y-4">
            <h3 className="font-extrabold text-sm text-foreground">
              <span>What Happens Next?</span>
            </h3>

            <div className="space-y-3 text-xs text-foreground/90 font-medium">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent shrink-0 flex items-center justify-center font-bold text-[11px] mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-foreground block">Order Verification & Packaging</span>
                  <span className="text-muted-foreground text-[11px]">
                    Our team verifies product quality and packs your order carefully within 24 hours.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent shrink-0 flex items-center justify-center font-bold text-[11px] mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-foreground block">Dispatch & Tracking SMS</span>
                  <span className="text-muted-foreground text-[11px]">
                    You will receive an SMS update with live courier tracking details as soon as it ships.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent shrink-0 flex items-center justify-center font-bold text-[11px] mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-bold text-foreground block">Home Delivery</span>
                  <span className="text-muted-foreground text-[11px]">
                    Fast delivery directly to your doorstep with Cash on Delivery option.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href={`/track-order?orderId=${orderId}`}>
              <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:opacity-90 font-extrabold px-6 h-12 rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                <span>Track Order Live</span>
              </Button>
            </Link>

            <Link href="/shop">
              <Button variant="outline" className="w-full sm:w-auto font-bold px-6 h-12 rounded-xl text-sm border-border/80 flex items-center justify-center gap-2">
                <span>Continue Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
