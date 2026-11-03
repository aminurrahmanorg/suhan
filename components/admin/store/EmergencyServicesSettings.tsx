"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  EmergencyContact,
  EmergencyService,
  EmergencyServiceIcon,
  EMERGENCY_SERVICE_ICONS,
  getEmergencyContacts,
  parseEmergencyServices,
} from "@/lib/emergency-services";
import {
  Ambulance,
  Droplet,
  Flame,
  Hospital,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ICONS: Record<EmergencyServiceIcon, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  hospital: Hospital,
  fire: Flame,
  shield: ShieldCheck,
  zap: Zap,
  ambulance: Ambulance,
  droplet: Droplet,
};

const ICON_LABELS: Record<EmergencyServiceIcon, string> = {
  phone: "Emergency phone",
  hospital: "Hospital",
  fire: "Fire service",
  shield: "Police / safety",
  zap: "Electricity",
  ambulance: "Ambulance",
  droplet: "Blood bank",
};

const emptyService: Omit<EmergencyService, "id"> = {
  title: "",
  phone: "",
  icon: "phone",
  is_active: true,
};

export default function EmergencyServicesSettings() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [servicesOverride, setServicesOverride] = useState<EmergencyService[] | null>(null);
  const [form, setForm] = useState(emptyService);
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: crypto.randomUUID(), title: "", phone: "" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const services =
    servicesOverride ?? parseEmergencyServices(settings?.emergency_services);

  const resetForm = () => {
    setForm(emptyService);
    setContacts([{ id: crypto.randomUUID(), title: "", phone: "" }]);
    setEditingId(null);
  };

  const persistServices = async (nextServices: EmergencyService[]) => {
    await updateSettings.mutateAsync({
      emergency_services: JSON.stringify(nextServices),
    });
    setServicesOverride(null);
  };

  const addOrUpdateService = async () => {
    const title = form.title.trim();
    const savedContacts = contacts
      .map((contact) => ({
        ...contact,
        title: contact.title.trim(),
        phone: contact.phone.trim(),
      }))
      .filter((contact) => contact.title || contact.phone);
    if (!title || savedContacts.length === 0 || savedContacts.some((contact) => !contact.title || !contact.phone)) {
      toast.error("Enter a service name and complete each contact name and phone number.");
      return;
    }

    if (savedContacts.some((contact) => !/[0-9]/.test(contact.phone))) {
      toast.error("Enter a valid phone number for every contact.");
      return;
    }

    const serviceData = {
      ...form,
      title,
      phone: savedContacts[0].phone,
      contacts: savedContacts,
    };
    const nextServices = editingId
      ? services.map((service) =>
          service.id === editingId ? { ...service, ...serviceData } : service,
        )
      : [
        ...services,
        { id: crypto.randomUUID(), ...serviceData },
      ];

    try {
      await persistServices(nextServices);
      resetForm();
      toast.success(editingId ? "Emergency service updated." : "Emergency service added.");
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save emergency service.",
      );
    }
  };

  const startEditing = (service: EmergencyService) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      phone: service.phone,
      icon: service.icon,
      is_active: service.is_active,
    });
    setContacts(getEmergencyContacts(service));
  };

  const saveServices = async () => {
    try {
      await persistServices(services);
      toast.success("Emergency services saved.");
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save emergency services.",
      );
    }
  };

  const deleteService = async (serviceId: string) => {
    const nextServices = services.filter((service) => service.id !== serviceId);
    try {
      await persistServices(nextServices);
      if (editingId === serviceId) resetForm();
      toast.success("Emergency service deleted.");
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Failed to delete emergency service.",
      );
    }
  };

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading services...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-sm text-destructive">
        Failed to load emergency services: {error.message}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Emergency Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the emergency service contacts available in this admin panel.
          </p>
        </div>
        <Button
          onClick={saveServices}
          disabled={updateSettings.isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {updateSettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Service" : "Add a Service"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium">
              Service name
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="e.g. Fire Service"
                className="input-shop"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Icon
              <select
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon: event.target.value as EmergencyServiceIcon,
                  }))
                }
                className="input-shop"
              >
                {EMERGENCY_SERVICE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {ICON_LABELS[icon]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Call contacts</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContacts((current) => [
                    ...current,
                    { id: crypto.randomUUID(), title: "", phone: "" },
                  ])
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Add number
              </Button>
            </div>
            {contacts.map((contact, index) => (
              <div key={contact.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  aria-label={`Contact ${index + 1} name`}
                  value={contact.title}
                  onChange={(event) =>
                    setContacts((current) =>
                      current.map((item) =>
                        item.id === contact.id
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Contact name"
                  className="input-shop"
                />
                <input
                  type="tel"
                  aria-label={`Contact ${index + 1} phone`}
                  value={contact.phone}
                  onChange={(event) =>
                    setContacts((current) =>
                      current.map((item) =>
                        item.id === contact.id
                          ? { ...item, phone: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Phone number"
                  className="input-shop"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove contact ${index + 1}`}
                  disabled={contacts.length === 1}
                  onClick={() =>
                    setContacts((current) =>
                      current.filter((item) => item.id !== contact.id),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active: event.target.checked,
                }))
              }
            />
            Mark this service as active
          </label>
          <div className="flex gap-2">
            <Button
              onClick={addOrUpdateService}
              disabled={updateSettings.isPending}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {updateSettings.isPending
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <Card key={service.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{service.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{service.phone}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.is_active ? "Visible" : "Hidden"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(service)}
                    disabled={updateSettings.isPending}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${service.title}`}
                    onClick={() => deleteService(service.id)}
                    disabled={updateSettings.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {services.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No services added yet. Add an emergency contact above; it will be saved immediately.
        </div>
      )}
    </div>
  );
}
