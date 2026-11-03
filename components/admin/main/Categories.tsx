"use client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Category,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useShopData";
import { useStoreSettings, useUpdateStoreSettings } from "@/hooks/useStoreSettings";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function AdminCategories() {
  const { data: categories = [], isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const {
    data: storeSettings,
    isLoading: isStoreSettingsLoading,
    error: storeSettingsError,
  } = useStoreSettings();
  const updateStoreSettings = useUpdateStoreSettings();

  const isShownInSidebar = (slug: string) => {
    if (!storeSettings?.sidebar_categories) return false;
    return storeSettings.sidebar_categories
      .split(",")
      .map((s) => s.trim())
      .includes(slug);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    showInSidebar: true,
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image,
      showInSidebar: isShownInSidebar(category.slug),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const category = categories.find((item) => item.id === deleteId);
    if (!category) return;

    try {
      await deleteCategory.mutateAsync(deleteId);
      if (storeSettings && isShownInSidebar(category.slug)) {
        await updateStoreSettings.mutateAsync({
          sidebar_categories: storeSettings.sidebar_categories
            .split(",")
            .map((slug) => slug.trim())
            .filter((slug) => slug && slug !== category.slug)
            .join(","),
        });
      }
      setDeleteId(null);
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete category.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) {
      toast.error("Sidebar settings are not loaded. Please try again.");
      return;
    }

    try {
      const { showInSidebar, ...categoryData } = formData;
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          ...categoryData,
        });
      } else {
        await createCategory.mutateAsync(categoryData);
      }

      const selectedSlugs = storeSettings.sidebar_categories
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean)
        .filter((slug) => slug !== editingCategory?.slug);
      if (showInSidebar && !selectedSlugs.includes(categoryData.slug)) {
        selectedSlugs.push(categoryData.slug);
      }
      await updateStoreSettings.mutateAsync({
        sidebar_categories: selectedSlugs.join(","),
      });

      setIsDialogOpen(false);
      setEditingCategory(null);
      resetForm();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save category and sidebar settings.",
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      image: "",
      showInSidebar: true,
    });
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">
          Failed to load categories. Check RLS policies.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="btn-accent"
              onClick={() => {
                setEditingCategory(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((previous) => ({
                      ...previous,
                      name,
                      ...(!editingCategory ? { slug: generateSlug(name) } : {}),
                    }));
                  }}
                  className="input-shop"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="input-shop"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image *
                </label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="categories"
                />
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={formData.showInSidebar}
                  disabled={isStoreSettingsLoading || !storeSettings}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      showInSidebar: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                Add this category to the homepage sidebar
              </label>
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="btn-accent flex-1"
                  disabled={
                    createCategory.isPending ||
                    updateCategory.isPending ||
                    updateStoreSettings.isPending ||
                    isStoreSettingsLoading ||
                    !storeSettings
                  }
                >
                  {updateStoreSettings.isPending
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {storeSettingsError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          Could not load sidebar settings: {storeSettingsError.message}
        </p>
      )}

      {/* Categories Grid */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="aspect-video relative">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    /{category.slug}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(category.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">
            No categories yet. Add your first category!
          </p>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Products in this
              category will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
