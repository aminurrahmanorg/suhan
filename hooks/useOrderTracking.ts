import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export const useOrderTracking = (searchQuery: string) => {
  return useQuery({
    queryKey: ["order_tracking", searchQuery],
    queryFn: async () => {
      const cleanInput = searchQuery ? searchQuery.trim() : "";
      if (!cleanInput) throw new Error("Please enter your Phone Number or Order ID.");

      const isDigitsOnly = /^\d+$/.test(cleanInput);
      const cleanPhone = cleanInput.replace(/[\s\-\(\)]/g, "");

      let query = supabase.from("orders").select("*, order_items(*)");

      if (cleanInput.toUpperCase().startsWith("ORD-")) {
        query = query.eq("order_number", cleanInput.toUpperCase());
      } else if (isDigitsOnly && cleanInput.length >= 8) {
        // Search by phone number (e.g. 01712345678)
        query = query.ilike("customer_phone", `%${cleanPhone.slice(-8)}%`);
      } else {
        // Search by either order_number or customer_phone
        query = query.or(
          `order_number.eq.${cleanInput},order_number.eq.ORD-${cleanInput},customer_phone.ilike.%${cleanPhone}%`,
        );
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data)
        throw new Error(
          "No order found matching your Phone Number or Order ID. Please check and try again.",
        );

      return data;
    },
    enabled: !!searchQuery && searchQuery.trim().length >= 4,
    retry: false,
  });
};
