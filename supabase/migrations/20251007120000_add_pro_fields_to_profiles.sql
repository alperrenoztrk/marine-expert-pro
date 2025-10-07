-- Add Pro entitlement fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMPTZ;

-- Optional helpful index
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON public.profiles(is_pro);
