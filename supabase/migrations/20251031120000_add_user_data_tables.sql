-- Create helper extensions and timestamp function
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'tr',
  theme TEXT DEFAULT 'system',
  ad_frequency INTEGER DEFAULT 3 CHECK (ad_frequency BETWEEN 0 AND 10),
  ads_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  calculation_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  favorite_calculations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER user_preferences_set_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Calculation history table
CREATE TABLE IF NOT EXISTS public.calculation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL,
  title TEXT DEFAULT 'Maritime Calculation',
  notes TEXT DEFAULT '',
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_favorite BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  calculation_duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calculation_history_user_id
  ON public.calculation_history(user_id);

CREATE INDEX IF NOT EXISTS idx_calculation_history_created_at
  ON public.calculation_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_calculation_history_favorites
  ON public.calculation_history(user_id)
  WHERE is_favorite IS TRUE;

ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calculations"
  ON public.calculation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON public.calculation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
  ON public.calculation_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON public.calculation_history FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER calculation_history_set_updated_at
  BEFORE UPDATE ON public.calculation_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User statistics table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_calculations INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  last_calculation_date TIMESTAMPTZ,
  user_level TEXT NOT NULL DEFAULT 'beginner'
    CHECK (user_level IN ('beginner', 'intermediate', 'expert', 'professional')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER user_stats_set_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper to keep user_stats in sync with calculation history
CREATE OR REPLACE FUNCTION public.refresh_user_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_user UUID;
  calc_count INTEGER;
  fav_count INTEGER;
  last_calc TIMESTAMPTZ;
  level TEXT;
BEGIN
  target_user := COALESCE(NEW.user_id, OLD.user_id);

  IF target_user IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT COUNT(*)
    INTO calc_count
    FROM public.calculation_history
    WHERE user_id = target_user;

  SELECT COUNT(*)
    INTO fav_count
    FROM public.calculation_history
    WHERE user_id = target_user
      AND is_favorite IS TRUE;

  SELECT MAX(created_at)
    INTO last_calc
    FROM public.calculation_history
    WHERE user_id = target_user;

  IF calc_count >= 100 THEN
    level := 'professional';
  ELSIF calc_count >= 25 THEN
    level := 'expert';
  ELSIF calc_count >= 5 THEN
    level := 'intermediate';
  ELSE
    level := 'beginner';
  END IF;

  INSERT INTO public.user_stats (user_id, total_calculations, favorite_count, last_calculation_date, user_level)
  VALUES (target_user, calc_count, fav_count, last_calc, level)
  ON CONFLICT (user_id) DO UPDATE
    SET total_calculations = EXCLUDED.total_calculations,
        favorite_count = EXCLUDED.favorite_count,
        last_calculation_date = EXCLUDED.last_calculation_date,
        user_level = EXCLUDED.user_level,
        updated_at = NOW();

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER refresh_user_stats_on_calculation_change
  AFTER INSERT OR UPDATE OR DELETE ON public.calculation_history
  FOR EACH ROW EXECUTE FUNCTION public.refresh_user_stats();

-- Extend new user handler to seed preference and stats rows
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = NOW();

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
