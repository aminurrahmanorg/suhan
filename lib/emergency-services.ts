export const EMERGENCY_SERVICE_ICONS = [
  "phone",
  "hospital",
  "fire",
  "shield",
  "zap",
  "ambulance",
  "droplet",
] as const;

export type EmergencyServiceIcon = (typeof EMERGENCY_SERVICE_ICONS)[number];

export interface EmergencyContact {
  id: string;
  title: string;
  phone: string;
}

export interface EmergencyService {
  id: string;
  title: string;
  phone: string;
  contacts?: EmergencyContact[];
  icon: EmergencyServiceIcon;
  is_active: boolean;
}

function isEmergencyContact(item: unknown): item is EmergencyContact {
  if (typeof item !== "object" || item === null) return false;
  const contact = item as Record<string, unknown>;

  return (
    typeof contact.id === "string" &&
    typeof contact.title === "string" &&
    typeof contact.phone === "string"
  );
}

function isEmergencyService(item: unknown): item is EmergencyService {
  if (typeof item !== "object" || item === null) return false;
  const service = item as Record<string, unknown>;

  const hasValidContacts =
    service.contacts === undefined ||
    (Array.isArray(service.contacts) && service.contacts.every(isEmergencyContact));

  return (
    typeof service.id === "string" &&
    typeof service.title === "string" &&
    typeof service.phone === "string" &&
    hasValidContacts &&
    typeof service.icon === "string" &&
    EMERGENCY_SERVICE_ICONS.some((icon) => icon === service.icon) &&
    typeof service.is_active === "boolean"
  );
}

export function getEmergencyContacts(service: EmergencyService): EmergencyContact[] {
  const contacts = service.contacts?.filter(
    (contact) => contact.title.trim() && contact.phone.trim(),
  );
  if (contacts?.length) return contacts;
  if (service.phone.trim()) {
    return [{ id: `${service.id}-primary`, title: service.title, phone: service.phone }];
  }
  return [];
}

export function parseEmergencyServices(value?: string): EmergencyService[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      console.error("Emergency services setting must contain a JSON array.");
      return [];
    }

    const services = parsed.filter(isEmergencyService);
    if (services.length !== parsed.length) {
      console.error("Invalid item found in emergency services setting.");
    }
    return services;
  } catch (error) {
    console.error("Failed to parse emergency services setting.", error);
    return [];
  }
}
