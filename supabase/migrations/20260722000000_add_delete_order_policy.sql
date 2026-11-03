-- Allow users to delete their own completed orders and admins to delete any order
CREATE POLICY "Users can delete their own completed orders"
ON public.orders FOR DELETE
USING (
  (auth.uid() = user_id AND status = 'delivered') 
  OR public.is_admin(auth.uid())
);
