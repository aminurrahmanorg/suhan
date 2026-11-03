import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "../utils/supabase/client";
import { useAuth } from "./useAuth";

const WISHLIST_KEY = "wishlist_session_id";
const LOCAL_WISHLIST_STORAGE_KEY = "local_wishlist_ids";

function getSessionId(): string {
  if (typeof window === "undefined") return "guest_ssr";
  let sessionId = localStorage.getItem(WISHLIST_KEY);
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(WISHLIST_KEY, sessionId);
  }
  return sessionId;
}

function getLocalWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_WISHLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlistIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore storage errors
  }
}

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
}

const supabase = createClient();

async function fetchWishlist(
  userId: string | null,
  sessionId: string,
): Promise<WishlistItem[]> {
  try {
    let query = (supabase as any).from("wishlists").select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query;
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>("");
  const [localIds, setLocalIds] = useState<string[]>([]);

  useEffect(() => {
    setSessionId(getSessionId());
    setLocalIds(getLocalWishlistIds());

    const handleStorage = () => {
      setLocalIds(getLocalWishlistIds());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const { data: remoteWishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id || sessionId],
    queryFn: () => fetchWishlist(user?.id || null, sessionId),
    enabled: !!sessionId || !!user?.id,
  });

  // Combine remote Supabase product IDs and local storage product IDs for 100% reliability
  const remoteProductIds = remoteWishlistItems.map((item) => item.product_id);
  const combinedProductIds = Array.from(
    new Set([...remoteProductIds, ...localIds]),
  );

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      // Local sync
      const current = getLocalWishlistIds();
      if (!current.includes(productId)) {
        const next = [...current, productId];
        saveLocalWishlistIds(next);
        setLocalIds(next);
      }

      // Supabase sync (if table exists)
      try {
        const insertData = user
          ? { product_id: productId, user_id: user.id }
          : { product_id: productId, session_id: sessionId };

        await (supabase as any).from("wishlists").insert(insertData);
      } catch {
        // Fallback to local storage silently if table is not configured
      }
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist ❤️");
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      // Local sync
      const current = getLocalWishlistIds();
      const next = current.filter((id) => id !== productId);
      saveLocalWishlistIds(next);
      setLocalIds(next);

      // Supabase sync
      try {
        let query = (supabase as any)
          .from("wishlists")
          .delete()
          .eq("product_id", productId);

        if (user) {
          query = query.eq("user_id", user.id);
        } else {
          query = query.eq("session_id", sessionId);
        }
        await query;
      } catch {
        // Fallback to local storage silently
      }
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
  });

  const isInWishlist = useCallback(
    (productId: string) => {
      return combinedProductIds.includes(productId);
    },
    [combinedProductIds],
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (isInWishlist(productId)) {
        removeFromWishlistMutation.mutate(productId);
      } else {
        addToWishlistMutation.mutate(productId);
      }
    },
    [isInWishlist, addToWishlistMutation, removeFromWishlistMutation],
  );

  return {
    wishlistItems: remoteWishlistItems,
    productIds: combinedProductIds,
    wishlistCount: combinedProductIds.length,
    isLoading,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
  };
};
