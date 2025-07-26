-- =============================================
-- MARITIME CALCULATOR DATABASE SCHEMA
-- Google Authentication + User Data Management
-- =============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- =============================================
-- 1. USER PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'google',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User metadata
    user_level TEXT DEFAULT 'beginner' CHECK (user_level IN ('beginner', 'intermediate', 'expert', 'professional')),
    total_calculations INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    
    -- Subscription info
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'enterprise')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User profiles RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. USER PREFERENCES TABLE  
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Language & Localization
    language TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en', 'es', 'de', 'fr', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'hu', 'ro', 'el', 'bg', 'hr', 'uk')),
    
    -- UI Preferences
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    
    -- Ad Preferences
    ad_frequency INTEGER DEFAULT 3 CHECK (ad_frequency BETWEEN 1 AND 10),
    ads_enabled BOOLEAN DEFAULT true,
    
    -- Notification Preferences
    email_notifications BOOLEAN DEFAULT true,
    calculation_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    
    -- Favorite Calculations
    favorite_calculations TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- User preferences RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    USING (auth.uid() = user_id);

-- =============================================
-- 3. CALCULATION HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.calculation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Calculation Details
    calculation_type TEXT NOT NULL CHECK (calculation_type IN (
        'stability', 'navigation', 'hydrodynamics', 'engine', 'cargo', 
        'ballast', 'trim', 'structural', 'safety', 'emission', 
        'weather', 'economic', 'special'
    )),
    
    title TEXT NOT NULL DEFAULT 'Maritime Calculation',
    notes TEXT DEFAULT '',
    
    -- Calculation Data (JSON)
    input_data JSONB NOT NULL DEFAULT '{}',
    result_data JSONB NOT NULL DEFAULT '{}',
    
    -- User Actions
    is_favorite BOOLEAN DEFAULT false,
    is_shared BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 1,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    calculation_duration_ms INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_calculation_data CHECK (
        jsonb_typeof(input_data) = 'object' AND 
        jsonb_typeof(result_data) = 'object'
    )
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_calculation_history_user_id ON public.calculation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_calculation_history_type ON public.calculation_history(calculation_type);
CREATE INDEX IF NOT EXISTS idx_calculation_history_created_at ON public.calculation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculation_history_favorites ON public.calculation_history(user_id, is_favorite) WHERE is_favorite = true;

-- Calculation history RLS
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own calculation history" ON public.calculation_history
    USING (auth.uid() = user_id);

-- =============================================
-- 4. MARITIME FORMULAS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.maritime_formulas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Formula Information
    category TEXT NOT NULL CHECK (category IN (
        'stability', 'navigation', 'hydrodynamics', 'engine', 'cargo', 
        'ballast', 'trim', 'structural', 'safety', 'emission', 
        'weather', 'economic', 'special'
    )),
    
    name TEXT NOT NULL,
    formula_text TEXT NOT NULL,
    description TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '{}',
    units JSONB NOT NULL DEFAULT '{}',
    
    -- SEO & Search
    keywords TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Usage Statistics
    usage_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Content
    example_calculation JSONB DEFAULT '{}',
    references TEXT[] DEFAULT '{}',
    
    -- Metadata
    created_by UUID REFERENCES public.user_profiles(id),
    is_verified BOOLEAN DEFAULT false,
    difficulty_level TEXT DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(category, name)
);

-- Maritime formulas indexes
CREATE INDEX IF NOT EXISTS idx_maritime_formulas_category ON public.maritime_formulas(category);
CREATE INDEX IF NOT EXISTS idx_maritime_formulas_keywords ON public.maritime_formulas USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_maritime_formulas_usage ON public.maritime_formulas(usage_count DESC);

-- Public read access for formulas
ALTER TABLE public.maritime_formulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read formulas" ON public.maritime_formulas
    FOR SELECT USING (true);

CREATE POLICY "Verified users can contribute formulas" ON public.maritime_formulas
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 5. USER SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Session Details
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Session Data
    calculations_performed INTEGER DEFAULT 0,
    pages_visited TEXT[] DEFAULT '{}',
    features_used TEXT[] DEFAULT '{}',
    
    -- Device Info
    device_type TEXT DEFAULT 'unknown' CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
    browser TEXT,
    operating_system TEXT,
    screen_resolution TEXT,
    
    -- Location (Optional)
    country_code TEXT,
    city TEXT,
    ip_address INET,
    
    -- Analytics
    bounce_rate BOOLEAN DEFAULT false,
    conversion_events TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_date ON public.user_sessions(session_start DESC);

-- User sessions RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 6. FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculation_history_updated_at BEFORE UPDATE ON public.calculation_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, provider)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_app_meta_data->>'provider'
    );
    
    -- Create default preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_profiles 
    SET 
        total_calculations = (
            SELECT COUNT(*) 
            FROM public.calculation_history 
            WHERE user_id = NEW.user_id
        ),
        favorite_count = (
            SELECT COUNT(*) 
            FROM public.calculation_history 
            WHERE user_id = NEW.user_id AND is_favorite = true
        )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats on calculation changes
CREATE TRIGGER update_stats_on_calculation_change
    AFTER INSERT OR UPDATE OR DELETE ON public.calculation_history
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- =============================================
-- 7. SAMPLE DATA (Optional)
-- =============================================

-- Insert sample formulas
INSERT INTO public.maritime_formulas (category, name, formula_text, description, variables, units, keywords) VALUES
('stability', 'Basic GM Calculation', 'GM = KM - KG', 'Metacentric height calculation for ship stability', 
 '{"GM": "Metacentric Height", "KM": "Keel to Metacenter", "KG": "Keel to Center of Gravity"}',
 '{"GM": "meters", "KM": "meters", "KG": "meters"}',
 '{"stability", "GM", "metacentric height", "ship stability"}'),

('navigation', 'Great Circle Distance', 'd = R × arccos(sin(φ₁) × sin(φ₂) + cos(φ₁) × cos(φ₂) × cos(Δλ))', 
 'Calculate shortest distance between two points on Earth surface',
 '{"d": "Distance", "R": "Earth Radius", "φ₁": "Latitude 1", "φ₂": "Latitude 2", "Δλ": "Longitude Difference"}',
 '{"d": "nautical miles", "R": "nautical miles", "φ₁": "degrees", "φ₂": "degrees", "Δλ": "degrees"}',
 '{"navigation", "great circle", "distance", "navigation planning"}'),

('hydrodynamics', 'Froude Number', 'Fn = V / √(g × L)', 'Dimensionless number for wave resistance analysis',
 '{"Fn": "Froude Number", "V": "Ship Speed", "g": "Gravity", "L": "Waterline Length"}',
 '{"Fn": "dimensionless", "V": "m/s", "g": "m/s²", "L": "meters"}',
 '{"hydrodynamics", "froude number", "wave resistance", "ship performance"}')

ON CONFLICT (category, name) DO NOTHING;

-- =============================================
-- 8. VIEWS FOR ANALYTICS
-- =============================================

-- User activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.user_level,
    up.total_calculations,
    up.favorite_count,
    up.created_at as user_since,
    up.last_sign_in,
    COUNT(DISTINCT DATE(ch.created_at)) as active_days,
    COUNT(ch.id) as total_calc_records,
    AVG(ch.calculation_duration_ms) as avg_calculation_time,
    STRING_AGG(DISTINCT ch.calculation_type, ', ') as used_calculation_types
FROM public.user_profiles up
LEFT JOIN public.calculation_history ch ON up.id = ch.user_id
GROUP BY up.id, up.email, up.full_name, up.user_level, up.total_calculations, 
         up.favorite_count, up.created_at, up.last_sign_in;

-- Popular calculations
CREATE OR REPLACE VIEW popular_calculations AS
SELECT 
    calculation_type,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(calculation_duration_ms) as avg_duration,
    COUNT(CASE WHEN is_favorite THEN 1 END) as favorite_count,
    MAX(created_at) as last_used
FROM public.calculation_history
GROUP BY calculation_type
ORDER BY usage_count DESC;

-- =============================================
-- DONE! MARITIME CALCULATOR DATABASE READY
-- =============================================