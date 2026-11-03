"use client";
import { Truck, ShieldCheck, Lock, Headphones } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function TrustBadges() {
  const { ref, isVisible } = useScrollReveal();

  const badges = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders over 1000৳",
    },
    {
      icon: ShieldCheck,
      title: "7 Days Returns",
      desc: "Hassle-free easy returns",
    },
    {
      icon: Lock,
      title: "100% Safe Payment",
      desc: "Secured checkout system",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Care",
      desc: "Dedicated support team",
    },
  ];

  return (
    <section className="py-8 bg-muted/40" ref={ref}>
      <div className="container-shop">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-background border border-border/80 shadow-2xs hover:shadow-md transition-all duration-300 hover:border-accent/30 reveal-scale stagger-${index + 1} ${isVisible ? "reveal-visible" : ""
                  }`}
              >
                <div className="p-2.5 sm:p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-foreground/90 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-tight">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
