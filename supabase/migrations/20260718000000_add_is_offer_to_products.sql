-- Add is_offer flag to products table to allow selecting offer products for the homepage
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_offer boolean NOT NULL DEFAULT false;
