"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  Ambulance,
  Droplet,
  Flame,
  Hospital,
  Phone,
  PhoneCall,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  EmergencyService,
  EmergencyServiceIcon,
  getEmergencyContacts,
  parseEmergencyServices,
} from "@/lib/emergency-services";
import { useState } from "react";

const ICONS: Record<EmergencyServiceIcon, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  hospital: Hospital,
  fire: Flame,
  shield: ShieldCheck,
  zap: Zap,
  ambulance: Ambulance,
  droplet: Droplet,
};

function getTelLink(phone: string) {
  const dialable = phone.replace(/[^\d+*#,;]/g, "");
  return `tel:${dialable}`;
}

export function EmergencyServices() {
  const { data: settings } = useStoreSettings({ staleTime: 0 });
  const services = parseEmergencyServices(settings?.emergency_services).filter(
    (service) => service.is_active,
  );
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(
    null,
  );

  if (services.length === 0) return null;

  return (
    <section id="emergency-services" className="bg-slate-50 py-6 sm:py-8">
      <div className="container-shop">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
            <span className="h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-100" />
            জরুরী নম্বর
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-4 sm:gap-4 xl:grid-cols-7">
          {services.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service)}
                aria-label={`View phone numbers for ${service.title}`}
                className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-3xl bg-white px-3 py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-[66px] w-[66px] items-center justify-center rounded-[20px] bg-gradient-to-br from-red-600 to-red-500 text-white shadow-[0_8px_18px_rgba(220,38,38,0.24)]">
                  <Icon className="h-8 w-8 fill-white/10" />
                </span>
                <span className="line-clamp-2 text-sm font-medium leading-5 text-slate-700">
                  {service.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <Dialog
        open={selectedService !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-hidden rounded-3xl p-6 sm:max-w-lg">
          {selectedService && (
            <>
              <DialogHeader className="items-center text-center">
                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600">
                  জরুরী সেবা
                </span>
                <DialogTitle className="text-2xl font-extrabold">
                  {selectedService.title}
                </DialogTitle>
                <DialogDescription>
                  কল করতে নিচের যেকোনো নম্বরের কল বাটনে চাপুন
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                {getEmergencyContacts(selectedService).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-800">
                        {contact.title}
                      </p>
                      <p className="mt-1 font-semibold text-emerald-700">
                        {contact.phone}
                      </p>
                    </div>
                    <a
                      href={getTelLink(contact.phone)}
                      aria-label={`Call ${contact.title} at ${contact.phone}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-colors hover:bg-emerald-700"
                    >
                      <PhoneCall className="h-5 w-5 fill-current" />
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
