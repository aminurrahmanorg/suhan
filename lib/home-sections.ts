export const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export interface BloodDonorCard {
  id: string;
  blood_group: BloodGroup;
  donor_count: number;
  href: string;
  is_active: boolean;
}

export interface BloodDonorSectionData {
  title: string;
  cards: BloodDonorCard[];
}

export interface TourismItem {
  id: string;
  title: string;
  image: string;
  description: string;
  detail_description: string;
  district: string;
  upazila: string;
  address: string;
  map_url: string;
  phone_numbers: string[];
  href: string;
  is_active: boolean;
}

export interface TourismSectionData {
  title: string;
  items: TourismItem[];
}

export const EMPTY_BLOOD_DONOR_SECTION: BloodDonorSectionData = {
  title: "রক্তদাতা খুঁজুন",
  cards: [],
};

export const EMPTY_TOURISM_SECTION: TourismSectionData = {
  title: "পর্যটন ও বিনোদন",
  items: [],
};

export function parseBloodDonorSection(value?: string): BloodDonorSectionData {
  if (!value) return EMPTY_BLOOD_DONOR_SECTION;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !Array.isArray(parsed.cards)) {
      throw new Error("রক্তদাতা বিভাগের তথ্য সঠিক নয়।");
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : EMPTY_BLOOD_DONOR_SECTION.title,
      cards: parsed.cards.filter(isBloodDonorCard),
    };
  } catch (error) {
    console.error("Failed to parse blood donor section.", error);
    return EMPTY_BLOOD_DONOR_SECTION;
  }
}

export function parseTourismSection(value?: string): TourismSectionData {
  if (!value) return EMPTY_TOURISM_SECTION;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !Array.isArray(parsed.items)) {
      throw new Error("পর্যটন বিভাগের তথ্য সঠিক নয়।");
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : EMPTY_TOURISM_SECTION.title,
      items: parsed.items.filter(isTourismItem).map((item) => ({
        ...item,
        detail_description: item.detail_description ?? "",
        district: item.district ?? "",
        upazila: item.upazila ?? "",
        address: item.address ?? "",
        map_url: item.map_url ?? "",
        phone_numbers: item.phone_numbers ?? [],
      })),
    };
  } catch (error) {
    console.error("Failed to parse tourism section.", error);
    return EMPTY_TOURISM_SECTION;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type TourismItemInput =
  Pick<TourismItem, "id" | "title" | "image" | "description" | "href" | "is_active"> &
  Partial<Pick<TourismItem, "detail_description" | "district" | "upazila" | "address" | "map_url" | "phone_numbers">>;

function isBloodDonorCard(value: unknown): value is BloodDonorCard {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.blood_group === "string" &&
    BLOOD_GROUPS.some((group) => group === value.blood_group) &&
    typeof value.donor_count === "number" &&
    Number.isInteger(value.donor_count) &&
    value.donor_count >= 0 &&
    typeof value.href === "string" &&
    typeof value.is_active === "boolean"
  );
}

function isTourismItem(value: unknown): value is TourismItemInput {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.image === "string" &&
    typeof value.description === "string" &&
    (value.detail_description === undefined || typeof value.detail_description === "string") &&
    (value.district === undefined || typeof value.district === "string") &&
    (value.upazila === undefined || typeof value.upazila === "string") &&
    (value.address === undefined || typeof value.address === "string") &&
    (value.map_url === undefined || typeof value.map_url === "string") &&
    (value.phone_numbers === undefined || (
      Array.isArray(value.phone_numbers) &&
      value.phone_numbers.every((phone) => typeof phone === "string")
    )) &&
    typeof value.href === "string" &&
    typeof value.is_active === "boolean"
  );
}

export function isAllowedSectionHref(value: string) {
  return /^\/(?!\/)/.test(value) || /^https?:\/\//i.test(value);
}
