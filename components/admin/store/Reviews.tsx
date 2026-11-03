"use client";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminCreateReview,
  useAllReviews,
  useApproveReview,
  useDeleteReview,
  useSetProductRating,
} from "@/hooks/useProductReviews";
import { useProducts } from "@/hooks/useShopData";
import { cn } from "@/lib/utils";
import { Check, MessageSquare, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function AdminReviews() {
  const { data: reviews = [], isLoading } = useAllReviews(false);
  const { data: products = [] } = useProducts();
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReview();
  const createReview = useAdminCreateReview();
  const setProductRating = useSetProductRating();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  // Add Review Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    rating: 5,
    text: "",
    verified_purchase: true,
  });

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.is_approved;
    if (filter === "approved") return review.is_approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteReview.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) return;

    await createReview.mutateAsync({
      name: formData.name.trim(),
      rating: formData.rating,
      text: formData.text.trim(),
      is_approved: true,
      product_id: formData.product_id || undefined,
    });

    if (formData.product_id) {
      await setProductRating.mutateAsync({
        productId: formData.product_id,
        rating: formData.rating,
      });
    }

    setIsAddDialogOpen(false);
    setFormData({
      product_id: "",
      name: "",
      rating: 5,
      text: "",
      verified_purchase: true,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer reviews or manually add reviews for products
          </p>
        </div>

        {/* Add Review Button & Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-accent gap-2">
              <Plus className="h-4 w-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Manual Customer Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Product <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <Select
                  value={formData.product_id}
                  onValueChange={(val) =>
                    setFormData({ ...formData, product_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Products (General Store Review)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="none">General Review (No specific product)</SelectItem>
                    {products.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Tanvir Ahmed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "h-6 w-6",
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted fill-muted/20"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold ml-2">
                    {formData.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Review Text / Comment *
                </label>
                <Textarea
                  required
                  rows={3}
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  placeholder="Write customer review feedback..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Switch
                  checked={formData.verified_purchase}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, verified_purchase: val })
                  }
                />
                <label className="text-sm font-medium">Verified Purchase Badge</label>
              </div>

              <div className="flex gap-2 pt-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-accent"
                  disabled={createReview.isPending}
                >
                  {createReview.isPending ? "Adding..." : "Add Review"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? "btn-accent" : ""}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredReviews.map((review) => {
              const matchedProd = products.find((p) => p.id === review.product_id);
              return (
                <div key={review.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-semibold text-foreground">{review.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            review.is_approved
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                          )}
                        >
                          {review.is_approved ? "Approved" : "Pending Approval"}
                        </span>
                        {matchedProd && (
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                            Product: {matchedProd.name}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2 text-sm">{review.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!review.is_approved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() =>
                            approveReview.mutate({
                              id: review.id,
                              approved: true,
                            })
                          }
                          disabled={approveReview.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            approveReview.mutate({
                              id: review.id,
                              approved: false,
                            })
                          }
                          disabled={approveReview.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Unapprove
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
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
