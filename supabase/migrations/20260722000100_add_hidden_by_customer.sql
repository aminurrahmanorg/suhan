-- Add hidden_by_customer column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS hidden_by_customer boolean NOT NULL DEFAULT false;

-- Recreate SELECT policy to hide customer-deleted orders from customers but show all to staff
DROP POLICY IF EXISTS "Users can view their own orders or staff all" ON public.orders;
CREATE POLICY "Users can view their own orders or staff all"
ON public.orders FOR SELECT
USING (
  (user_id = auth.uid() AND (hidden_by_customer = false OR hidden_by_customer IS NULL)) 
  OR can_manage_orders(auth.uid()) 
  OR (user_id IS NULL AND (hidden_by_customer = false OR hidden_by_customer IS NULL))
);

-- Create UPDATE policy so users can update (hide) their own orders
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
