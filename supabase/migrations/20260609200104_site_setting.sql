-- Create site_settings table for global configuration
CREATE TABLE public.site_settings (
    id text PRIMARY KEY DEFAULT 'global',
    default_country_code text NOT NULL DEFAULT 'BD',
    default_country_name text NOT NULL DEFAULT 'Bangladesh',
    currency_code text NOT NULL DEFAULT 'BDT',
    currency_symbol text NOT NULL DEFAULT '৳',
    currency_locale text NOT NULL DEFAULT 'bn-BD',
    language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'bn')),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can insert settings (for initial setup)
CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Insert default settings row
INSERT INTO public.site_settings (id) VALUES ('global');

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint on key column for store_settings to enable upsert
ALTER TABLE public.store_settings ADD CONSTRAINT store_settings_key_unique UNIQUE (key);


-- Add Facebook Pixel and cookie consent fields to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS fb_pixel_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS fb_pixel_id text,
ADD COLUMN IF NOT EXISTS fb_pixel_test_event_code text,
ADD COLUMN IF NOT EXISTS cookie_consent_enabled boolean NOT NULL DEFAULT false;

-- Add theme color field to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS theme_accent_color TEXT DEFAULT '#e85a4f';

-- Update existing record with default theme color
UPDATE public.site_settings 
SET theme_accent_color = '#e85a4f' 
WHERE id = 'global' AND theme_accent_color IS NULL;


-- Add expanded theme color columns to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS brand_primary text DEFAULT '#1a1a2e',
  ADD COLUMN IF NOT EXISTS brand_secondary text DEFAULT '#f0f0f0',
  ADD COLUMN IF NOT EXISTS brand_accent text DEFAULT '#e85a4f',
  ADD COLUMN IF NOT EXISTS brand_background text DEFAULT '#faf9f7',
  ADD COLUMN IF NOT EXISTS brand_foreground text DEFAULT '#1a1a2e',
  ADD COLUMN IF NOT EXISTS brand_muted text DEFAULT '#6b7280',
  ADD COLUMN IF NOT EXISTS brand_border text DEFAULT '#e5e7eb',
  ADD COLUMN IF NOT EXISTS brand_card text DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS brand_radius text DEFAULT '0.5';



-- Add Conversion API fields to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS fb_capi_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fb_capi_dataset_id text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fb_capi_test_event_code text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS fb_capi_api_version text NOT NULL DEFAULT 'v20.0';

ALTER TABLE public.site_settings ADD COLUMN show_stock_to_visitors boolean NOT NULL DEFAULT true;