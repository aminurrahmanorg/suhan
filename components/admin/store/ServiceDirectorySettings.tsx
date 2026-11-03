"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import {
  createSlug,
  DIRECTORY_ICONS,
  DirectoryIcon,
  parseServiceDirectory,
  ServiceDirectoryCategory,
  ServiceDirectoryData,
  ServiceDirectoryListing,
} from "@/lib/service-directory";
import {
  BriefcaseBusiness,
  Building,
  Bus,
  Camera,
  GraduationCap,
  Heart,
  House,
  Landmark,
  Laptop,
  MapPin,
  Newspaper,
  PartyPopper,
  Pencil,
  Phone,
  Plus,
  Scale,
  Save,
  ShoppingBag,
  Trash2,
  Utensils,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ICONS: Record<
  DirectoryIcon,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  phone: Phone,
  heart: Heart,
  hospital: Building,
  briefcase: BriefcaseBusiness,
  wrench: Wrench,
  laptop: Laptop,
  "shopping-bag": ShoppingBag,
  home: House,
  utensils: Utensils,
  "graduation-cap": GraduationCap,
  key: MapPin,
  bus: Bus,
  landmark: Landmark,
  users: Users,
  scale: Scale,
  building: Building,
  camera: Camera,
  "party-popper": PartyPopper,
  newspaper: Newspaper,
};

const COLORS = ["#dc2626", "#0f9f6e", "#0e7490", "#2563eb", "#9333ea", "#ea580c", "#db2777"];

const emptyCategory: Omit<ServiceDirectoryCategory, "id"> = {
  name: "",
  slug: "",
  icon: "phone",
  color: COLORS[0],
  is_active: true,
};

const emptyListing: Omit<ServiceDirectoryListing, "id"> = {
  category_id: "",
  name: "",
  slug: "",
  image: "",
  district: "",
  upazila: "",
  union: "",
  area: "",
  address: "",
  description: "",
  phone_numbers: [""],
  is_active: true,
};

export default function ServiceDirectorySettings() {
  const { data: settings, isLoading, error } = useStoreSettings();
  const updateSettings = useUpdateStoreSettings();
  const [directoryOverride, setDirectoryOverride] = useState<ServiceDirectoryData | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [listingForm, setListingForm] = useState(emptyListing);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const directory =
    directoryOverride ?? parseServiceDirectory(settings?.service_directory);

  const persist = async (nextDirectory: ServiceDirectoryData) => {
    await updateSettings.mutateAsync({
      service_directory: JSON.stringify(nextDirectory),
    });
    setDirectoryOverride(null);
  };

  const resetCategory = () => {
    setCategoryForm(emptyCategory);
    setEditingCategoryId(null);
  };

  const submitCategory = async () => {
    const name = categoryForm.name.trim();
    const slug = categoryForm.slug.trim() || createSlug(name);
    if (!name || !slug) {
      toast.error("Enter a category name.");
      return;
    }

    const duplicate = directory.categories.some(
      (category) =>
        category.slug === slug && category.id !== editingCategoryId,
    );
    if (duplicate) {
      toast.error("A category with this URL already exists.");
      return;
    }

    const nextCategory = { ...categoryForm, name, slug };
    const categories = editingCategoryId
      ? directory.categories.map((category) =>
          category.id === editingCategoryId
            ? { ...category, ...nextCategory }
            : category,
        )
      : [...directory.categories, { id: crypto.randomUUID(), ...nextCategory }];

    try {
      await persist({ ...directory, categories });
      resetCategory();
      toast.success(editingCategoryId ? "Category updated." : "Category added.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Could not save category.");
    }
  };

  const submitListing = async () => {
    const name = listingForm.name.trim();
    const categoryId = listingForm.category_id || directory.categories[0]?.id;
    const category = directory.categories.find((item) => item.id === categoryId);
    const slug = listingForm.slug.trim() || createSlug(name);
    if (!name || !category || !slug) {
      toast.error("Select a category and enter a listing name.");
      return;
    }

    const duplicate = directory.listings.some(
      (listing) =>
        listing.category_id === category.id &&
        listing.slug === slug &&
        listing.id !== editingListingId,
    );
    if (duplicate) {
      toast.error("A listing with this URL already exists in this category.");
      return;
    }

    const nextListing = {
      ...listingForm,
      category_id: category.id,
      name,
      slug,
      phone_numbers: listingForm.phone_numbers
        .map((phone) => phone.trim())
        .filter(Boolean),
    };
    const listings = editingListingId
      ? directory.listings.map((listing) =>
          listing.id === editingListingId
            ? { ...listing, ...nextListing }
            : listing,
        )
      : [...directory.listings, { id: crypto.randomUUID(), ...nextListing }];

    try {
      await persist({ ...directory, listings });
      resetListing();
      toast.success(editingListingId ? "Listing updated." : "Listing added.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Could not save listing.");
    }
  };

  const resetListing = () => {
    setListingForm({
      ...emptyListing,
      category_id: directory.categories[0]?.id || "",
      phone_numbers: [""],
    });
    setEditingListingId(null);
  };

  const editCategory = (category: ServiceDirectoryCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      color: category.color,
      is_active: category.is_active,
    });
  };

  const editListing = (listing: ServiceDirectoryListing) => {
    setEditingListingId(listing.id);
    setListingForm({
      ...listing,
      phone_numbers: listing.phone_numbers.length
        ? listing.phone_numbers
        : [""],
    });
  };

  const deleteCategory = async (categoryId: string) => {
    const categories = directory.categories.filter((item) => item.id !== categoryId);
    const listings = directory.listings.filter((item) => item.category_id !== categoryId);
    try {
      await persist({ categories, listings });
      if (editingCategoryId === categoryId) resetCategory();
      if (editingListingId && !listings.some((item) => item.id === editingListingId)) {
        resetListing();
      }
      toast.success("Category and its listings deleted.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Could not delete category.");
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      await persist({
        ...directory,
        listings: directory.listings.filter((item) => item.id !== listingId),
      });
      if (editingListingId === listingId) resetListing();
      toast.success("Listing deleted.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Could not delete listing.");
    }
  };

  if (isLoading) return <p className="p-6">Loading service directory...</p>;
  if (error) {
    return (
      <p className="p-6 text-destructive">
        Failed to load service directory: {error.message}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Information & Services Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage information directory categories, listings and their contact details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingCategoryId ? "Edit Service Category" : "Add Service Category"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-sm font-medium">
              Category name
              <input
                className="input-shop"
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm((current) => ({
                    ...current,
                    name: event.target.value,
                    ...(!editingCategoryId
                      ? { slug: createSlug(event.target.value) }
                      : {}),
                  }))
                }
                placeholder="যেমন: হাসপাতাল ও ক্লিনিক"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              URL slug
              <input
                className="input-shop"
                value={categoryForm.slug}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, slug: createSlug(event.target.value) }))
                }
                placeholder="hospital-clinic"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Icon
              <select
                className="input-shop"
                value={categoryForm.icon}
                onChange={(event) =>
                  setCategoryForm((current) => ({
                    ...current,
                    icon: event.target.value as DirectoryIcon,
                  }))
                }
              >
                {DIRECTORY_ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-medium">
              Icon color
              <select
                className="input-shop"
                value={categoryForm.color}
                onChange={(event) =>
                  setCategoryForm((current) => ({ ...current, color: event.target.value }))
                }
              >
                {COLORS.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={categoryForm.is_active}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, is_active: event.target.checked }))
              }
            />
            Mark this category as active
          </label>
          <div className="flex gap-2">
            <Button onClick={submitCategory} disabled={updateSettings.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {editingCategoryId ? "Update Category" : "Add Category"}
            </Button>
            {editingCategoryId && <Button variant="outline" onClick={resetCategory}>Cancel</Button>}
          </div>
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {directory.categories.map((category) => {
              const Icon = ICONS[category.icon];
              return (
                <div key={category.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5">
                  <Icon className="h-4 w-4" style={{ color: category.color }} />
                  <span className="text-sm">{category.name}</span>
                  <Button variant="ghost" size="icon-xs" aria-label={`Edit ${category.name}`} onClick={() => editCategory(category)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon-xs" aria-label={`Delete ${category.name}`} onClick={() => deleteCategory(category.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{editingListingId ? "Edit Directory Listing" : "Add Directory Listing"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {directory.categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add a service category first.</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-1 text-sm font-medium">
                  Category
                  <select
                    className="input-shop"
                    value={listingForm.category_id || directory.categories[0].id}
                    onChange={(event) =>
                      setListingForm((current) => ({ ...current, category_id: event.target.value }))
                    }
                  >
                    {directory.categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium">
                  Organization / service name
                  <input
                    className="input-shop"
                    value={listingForm.name}
                    onChange={(event) =>
                      setListingForm((current) => ({
                        ...current,
                        name: event.target.value,
                        ...(!editingListingId ? { slug: createSlug(event.target.value) } : {}),
                      }))
                    }
                    placeholder="Organization name"
                  />
                </label>
                <label className="space-y-1 text-sm font-medium">
                  URL slug
                  <input
                    className="input-shop"
                    value={listingForm.slug}
                    onChange={(event) =>
                      setListingForm((current) => ({ ...current, slug: createSlug(event.target.value) }))
                    }
                    placeholder="organization-name"
                  />
                </label>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Listing image</label>
                <ImageUpload
                  folder="service-directory"
                  value={listingForm.image}
                  onChange={(image) => setListingForm((current) => ({ ...current, image }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {([
                  ["district", "জেলা"],
                  ["upazila", "উপজেলা"],
                  ["union", "ইউনিয়ন/ওয়ার্ড"],
                  ["area", "গ্রাম/এলাকা/মহল্লা"],
                ] as const).map(([field, label]) => (
                  <label key={field} className="space-y-1 text-sm font-medium">
                    {label}
                    <input
                      className="input-shop"
                      value={listingForm[field]}
                      onChange={(event) =>
                        setListingForm((current) => ({ ...current, [field]: event.target.value }))
                      }
                    />
                  </label>
                ))}
              </div>
              <label className="block space-y-1 text-sm font-medium">
                বিস্তারিত ঠিকানা
                <textarea
                  className="input-shop min-h-20"
                  value={listingForm.address}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, address: event.target.value }))
                  }
                />
              </label>
              <label className="block space-y-1 text-sm font-medium">
                তথ্য / বিবরণ
                <textarea
                  className="input-shop min-h-24"
                  value={listingForm.description}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Phone numbers</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setListingForm((current) => ({
                        ...current,
                        phone_numbers: [...current.phone_numbers, ""],
                      }))
                    }
                  >
                    <Plus className="h-3.5 w-3.5" /> Add number
                  </Button>
                </div>
                {listingForm.phone_numbers.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="tel"
                      className="input-shop"
                      value={phone}
                      placeholder="Phone number"
                      onChange={(event) =>
                        setListingForm((current) => ({
                          ...current,
                          phone_numbers: current.phone_numbers.map((item, itemIndex) =>
                            itemIndex === index ? event.target.value : item,
                          ),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove phone number"
                      disabled={listingForm.phone_numbers.length === 1}
                      onClick={() =>
                        setListingForm((current) => ({
                          ...current,
                          phone_numbers: current.phone_numbers.filter((_, itemIndex) => itemIndex !== index),
                        }))
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
                  checked={listingForm.is_active}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, is_active: event.target.checked }))
                  }
                />
                Show listing publicly
              </label>
              <div className="flex gap-2">
                <Button onClick={submitListing} disabled={updateSettings.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateSettings.isPending ? "Saving..." : editingListingId ? "Update Listing" : "Add Listing"}
                </Button>
                {editingListingId && <Button variant="outline" onClick={resetListing}>Cancel</Button>}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {directory.listings.map((listing) => {
          const category = directory.categories.find((item) => item.id === listing.category_id);
          return (
            <Card key={listing.id}>
              <CardContent className="flex items-center gap-3 p-4">
                {listing.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-xl bg-muted">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{listing.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{category?.name || "Category removed"}</p>
                  <p className="truncate text-xs text-muted-foreground">{[listing.area, listing.upazila, listing.district].filter(Boolean).join(", ")}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => editListing(listing)}>Edit</Button>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${listing.name}`} onClick={() => deleteListing(listing.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
