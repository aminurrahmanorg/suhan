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

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  href: string;
  is_active: boolean;
}

export interface NoticeBoardData {
  title: string;
  view_all_href: string;
  items: NoticeItem[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  href: string;
  is_active: boolean;
}

export interface LatestNewsData {
  title: string;
  view_all_href: string;
  items: NewsItem[];
}

export const STATISTICS_ICONS = [
  "map",
  "grid",
  "home",
  "users",
  "list",
  "droplet",
  "eye",
  "globe",
] as const;

export const STATISTICS_COLORS = [
  "emerald",
  "blue",
  "teal",
  "violet",
  "rose",
  "sky",
] as const;

export type StatisticsIcon = (typeof STATISTICS_ICONS)[number];
export type StatisticsColor = (typeof STATISTICS_COLORS)[number];

export interface StatisticsItem {
  id: string;
  label: string;
  value: string;
  icon: StatisticsIcon;
  color: StatisticsColor;
  is_active: boolean;
}

export interface StatisticsSectionData {
  title: string;
  items: StatisticsItem[];
}

export const EMPTY_BLOOD_DONOR_SECTION: BloodDonorSectionData = {
  title: "রক্তদাতা খুঁজুন",
  cards: [],
};

export const EMPTY_TOURISM_SECTION: TourismSectionData = {
  title: "পর্যটন ও বিনোদন",
  items: [],
};

export const EMPTY_NOTICE_BOARD: NoticeBoardData = {
  title: "নোটিশ বোর্ড",
  view_all_href: "",
  items: [],
};

export const EMPTY_LATEST_NEWS: LatestNewsData = {
  title: "সর্বশেষ সংবাদ",
  view_all_href: "",
  items: [],
};

export const DEFAULT_STATISTICS_SECTION: StatisticsSectionData = {
  title: "পরিসংখ্যান",
  items: [
    { id: "upazilas", label: "উপজেলা", value: "১০", icon: "map", color: "emerald", is_active: true },
    { id: "unions", label: "ইউনিয়ন/পৌরসভা", value: "৯১", icon: "grid", color: "blue", is_active: true },
    { id: "areas", label: "গ্রাম/এলাকা/মহল্লা", value: "৩৬", icon: "home", color: "teal", is_active: true },
    { id: "users", label: "রেজিস্ট্রেশনকৃত ব্যবহারকারী", value: "২৩", icon: "users", color: "violet", is_active: true },
    { id: "listings", label: "মোট লিস্টিং", value: "৫৩", icon: "list", color: "emerald", is_active: true },
    { id: "donors", label: "রক্তদাতা", value: "৪", icon: "droplet", color: "rose", is_active: true },
    { id: "today-visitors", label: "আজকের ভিজিটর", value: "৫", icon: "eye", color: "sky", is_active: true },
    { id: "total-visitors", label: "মোট ভিজিটর", value: "৪৪৪", icon: "globe", color: "violet", is_active: true },
  ],
};

export function parseStatisticsSection(value?: string): StatisticsSectionData {
  if (!value) return DEFAULT_STATISTICS_SECTION;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !Array.isArray(parsed.items)) {
      throw new Error("পরিসংখ্যান বিভাগের তথ্য সঠিক নয়।");
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : DEFAULT_STATISTICS_SECTION.title,
      items: parsed.items.filter(isStatisticsItem),
    };
  } catch (error) {
    console.error("Failed to parse statistics section.", error);
    return DEFAULT_STATISTICS_SECTION;
  }
}

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

export function parseNoticeBoard(value?: string): NoticeBoardData {
  if (!value) return EMPTY_NOTICE_BOARD;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !Array.isArray(parsed.items)) {
      throw new Error("নোটিশ বোর্ডের তথ্য সঠিক নয়।");
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : EMPTY_NOTICE_BOARD.title,
      view_all_href: typeof parsed.view_all_href === "string" ? parsed.view_all_href : "",
      items: parsed.items.filter(isNoticeItem),
    };
  } catch (error) {
    console.error("Failed to parse notice board.", error);
    return EMPTY_NOTICE_BOARD;
  }
}

export function parseLatestNews(value?: string): LatestNewsData {
  if (!value) return EMPTY_LATEST_NEWS;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !Array.isArray(parsed.items)) {
      throw new Error("সর্বশেষ সংবাদের তথ্য সঠিক নয়।");
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : EMPTY_LATEST_NEWS.title,
      view_all_href: typeof parsed.view_all_href === "string" ? parsed.view_all_href : "",
      items: parsed.items.filter(isNewsItem),
    };
  } catch (error) {
    console.error("Failed to parse latest news.", error);
    return EMPTY_LATEST_NEWS;
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

export function formatHomeContentDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNoticeItem(value: unknown): value is NoticeItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.date === "string" &&
    typeof value.href === "string" &&
    typeof value.is_active === "boolean"
  );
}

function isNewsItem(value: unknown): value is NewsItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.date === "string" &&
    typeof value.image === "string" &&
    typeof value.href === "string" &&
    typeof value.is_active === "boolean"
  );
}

function isStatisticsItem(value: unknown): value is StatisticsItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.value === "string" &&
    typeof value.icon === "string" &&
    STATISTICS_ICONS.some((icon) => icon === value.icon) &&
    typeof value.color === "string" &&
    STATISTICS_COLORS.some((color) => color === value.color) &&
    typeof value.is_active === "boolean"
  );
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
