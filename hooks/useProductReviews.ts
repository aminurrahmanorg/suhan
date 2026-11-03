import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "../utils/supabase/client";

export interface ProductReview {
  id: string;
  product_id?: string | null;
  name: string;
  rating: number;
  text: string;
  is_approved: boolean;
  verified_purchase?: boolean;
  user_id?: string | null;
  order_id?: string | null;
  created_at: string;
}

const supabase = createClient();

async function fetchProductReviews(
  productId: string,
  approvedOnly: boolean,
): Promise<ProductReview[]> {
  try {
    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (approvedOnly) {
      query = query.eq("is_approved", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return ((data || []) as any[]).map((item) => ({
      ...item,
      product_id: item.product_id || null,
      verified_purchase: item.verified_purchase || false,
      user_id: item.user_id || null,
      order_id: item.order_id || null,
    }));
  } catch (error) {
    return [];
  }
}

async function fetchAllReviews(
  approvedOnly: boolean,
): Promise<ProductReview[]> {
  let query = supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (approvedOnly) {
    query = query.eq("is_approved", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data || []) as any[]).map((item) => ({
    ...item,
    product_id: item.product_id || null,
    verified_purchase: item.verified_purchase || false,
    user_id: item.user_id || null,
    order_id: item.order_id || null,
  }));
}

export const useProductReviews = (productId: string, approvedOnly = true) => {
  return useQuery({
    queryKey: ["product_reviews", productId, approvedOnly],
    queryFn: () => fetchProductReviews(productId, approvedOnly),
    enabled: !!productId,
  });
};

export const useAllReviews = (approvedOnly = false) => {
  return useQuery({
    queryKey: ["all_reviews", approvedOnly],
    queryFn: () => fetchAllReviews(approvedOnly),
  });
};

export const useProductRatingsMap = () => {
  return useQuery({
    queryKey: ["product_ratings_map"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("value")
          .eq("key", "product_ratings_map")
          .maybeSingle();

        if (error || !data) return {} as Record<string, number>;
        return JSON.parse(data.value) as Record<string, number>;
      } catch (e) {
        return {} as Record<string, number>;
      }
    },
  });
};

export const useHideStockMap = () => {
  return useQuery({
    queryKey: ["hide_stock_map"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("value")
          .eq("key", "hide_stock_map")
          .maybeSingle();

        if (error || !data) return {} as Record<string, boolean>;
        return JSON.parse(data.value) as Record<string, boolean>;
      } catch (e) {
        return {} as Record<string, boolean>;
      }
    },
  });
};

export const useSetHideStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      hideStock,
    }: {
      productId: string;
      hideStock: boolean;
    }) => {
      const { data } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "hide_stock_map")
        .maybeSingle();

      let map: Record<string, boolean> = {};
      if (data?.value) {
        try {
          map = JSON.parse(data.value);
        } catch (e) {}
      }

      map[productId] = hideStock;

      const { error } = await supabase
        .from("store_settings")
        .upsert(
          {
            key: "hide_stock_map",
            value: JSON.stringify(map),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );

      if (error) throw error;
      return map;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hide_stock_map"] });
    },
  });
};

export const useSetProductRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
    }: {
      productId: string;
      rating: number;
    }) => {
      const { data } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "product_ratings_map")
        .maybeSingle();

      let map: Record<string, number> = {};
      if (data?.value) {
        try {
          map = JSON.parse(data.value);
        } catch (e) {}
      }

      map[productId] = rating;

      const { error } = await supabase
        .from("store_settings")
        .upsert(
          {
            key: "product_ratings_map",
            value: JSON.stringify(map),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" },
        );

      if (error) throw error;
      return map;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_ratings_map"] });
      toast.success("Product card rating updated!");
    },
  });
};

export const useProductRatingStats = () => {
  const { data: reviews = [] } = useAllReviews(true);
  const { data: ratingsMap = {} } = useProductRatingsMap();

  const getProductRating = (productId: string) => {
    // 1. If admin explicitly set a rating for this product:
    if (ratingsMap && ratingsMap[productId] != null) {
      return { avgRating: Number(ratingsMap[productId]), count: 1 };
    }

    // 2. Compute from customer reviews if available:
    const productReviews = reviews.filter(
      (r) => r.product_id === productId || (r as any).product_id === productId,
    );
    if (productReviews.length > 0) {
      const avg =
        productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length;
      return {
        avgRating: Math.round(avg * 10) / 10,
        count: productReviews.length,
      };
    }

    // 3. Default fallback rating
    return { avgRating: 5.0, count: 1 };
  };

  return { getProductRating, ratingsMap, totalReviewsCount: reviews.length };
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      name: string;
      rating: number;
      text: string;
      product_id?: string;
    }) => {
      const payload: any = {
        name: review.name,
        rating: review.rating,
        text: review.text,
        is_approved: false,
      };

      const { data, error } = await supabase
        .from("reviews")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["all_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review submitted! It will appear after approval.");
    },
    onError: (error: Error) => {
      toast.error("Failed to submit review: " + error.message);
    },
  });
};

export const useAdminCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      name: string;
      rating: number;
      text: string;
      is_approved?: boolean;
      product_id?: string;
    }) => {
      const payload: any = {
        name: review.name,
        rating: review.rating,
        text: review.text,
        is_approved: review.is_approved !== undefined ? review.is_approved : true,
      };

      const { data, error } = await supabase
        .from("reviews")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["all_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create review: " + error.message);
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update({ is_approved: approved })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["all_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review status updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update review: " + error.message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["all_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete review: " + error.message);
    },
  });
};
