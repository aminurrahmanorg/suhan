export const DIRECTORY_ICONS = [
  "phone",
  "heart",
  "hospital",
  "briefcase",
  "wrench",
  "laptop",
  "shopping-bag",
  "home",
  "utensils",
  "graduation-cap",
  "key",
  "bus",
  "landmark",
  "users",
  "scale",
  "building",
  "camera",
  "party-popper",
  "newspaper",
] as const;

export type DirectoryIcon = (typeof DIRECTORY_ICONS)[number];

export interface ServiceDirectoryCategory {
  id: string;
  name: string;
  slug: string;
  icon: DirectoryIcon;
  color: string;
  is_active: boolean;
}

export interface ServiceDirectoryListing {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image: string;
  district: string;
  upazila: string;
  union: string;
  area: string;
  address: string;
  description: string;
  phone_numbers: string[];
  is_active: boolean;
}

export interface ServiceDirectoryData {
  categories: ServiceDirectoryCategory[];
  listings: ServiceDirectoryListing[];
}

export const EMPTY_SERVICE_DIRECTORY: ServiceDirectoryData = {
  categories: [],
  listings: [],
};

function isDirectoryCategory(value: unknown): value is ServiceDirectoryCategory {
  if (typeof value !== "object" || value === null) return false;
  const category = value as Record<string, unknown>;
  return (
    typeof category.id === "string" &&
    typeof category.name === "string" &&
    typeof category.slug === "string" &&
    typeof category.icon === "string" &&
    DIRECTORY_ICONS.some((icon) => icon === category.icon) &&
    typeof category.color === "string" &&
    typeof category.is_active === "boolean"
  );
}

function isDirectoryListing(value: unknown): value is ServiceDirectoryListing {
  if (typeof value !== "object" || value === null) return false;
  const listing = value as Record<string, unknown>;
  return (
    typeof listing.id === "string" &&
    typeof listing.category_id === "string" &&
    typeof listing.name === "string" &&
    typeof listing.slug === "string" &&
    typeof listing.image === "string" &&
    typeof listing.district === "string" &&
    typeof listing.upazila === "string" &&
    typeof listing.union === "string" &&
    typeof listing.area === "string" &&
    typeof listing.address === "string" &&
    typeof listing.description === "string" &&
    Array.isArray(listing.phone_numbers) &&
    listing.phone_numbers.every((phone) => typeof phone === "string") &&
    typeof listing.is_active === "boolean"
  );
}

export function parseServiceDirectory(value?: string): ServiceDirectoryData {
  if (!value) return EMPTY_SERVICE_DIRECTORY;

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) {
      console.error("Service directory setting must contain an object.");
      return EMPTY_SERVICE_DIRECTORY;
    }

    const data = parsed as Record<string, unknown>;
    if (!Array.isArray(data.categories) || !Array.isArray(data.listings)) {
      console.error("Service directory setting is missing categories or listings.");
      return EMPTY_SERVICE_DIRECTORY;
    }

    const categories = data.categories.filter(isDirectoryCategory);
    const listings = data.listings.filter(isDirectoryListing);
    if (categories.length !== data.categories.length || listings.length !== data.listings.length) {
      console.error("Invalid item found in service directory setting.");
    }
    return { categories, listings };
  } catch (error) {
    console.error("Failed to parse service directory setting.", error);
    return EMPTY_SERVICE_DIRECTORY;
  }
}

export function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}
