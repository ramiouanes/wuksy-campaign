-- WUKSY Campaign - Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    quiz_type VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    score NUMERIC,
    recommendations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blood_test_uploads table
CREATE TABLE IF NOT EXISTS public.blood_test_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    processing_status VARCHAR(50) DEFAULT 'pending',
    extracted_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplement_interactions table
CREATE TABLE IF NOT EXISTS public.supplement_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    supplements JSONB NOT NULL,
    interaction_results JSONB NOT NULL,
    safety_score NUMERIC,
    timing_recommendations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_notifications table
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_analytics table
CREATE TABLE IF NOT EXISTS public.page_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON public.subscribers(source);
CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON public.quiz_results(email);
CREATE INDEX IF NOT EXISTS idx_quiz_results_type ON public.quiz_results(quiz_type);
CREATE INDEX IF NOT EXISTS idx_blood_test_uploads_email ON public.blood_test_uploads(email);
CREATE INDEX IF NOT EXISTS idx_supplement_interactions_email ON public.supplement_interactions(email);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_event ON public.page_analytics(page_name, event_type);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON public.page_analytics(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_test_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anonymous access (allowing inserts and reads)
-- Subscribers table policies
CREATE POLICY "Allow anonymous insert subscribers" ON public.subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read subscribers" ON public.subscribers
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update subscribers" ON public.subscribers
    FOR UPDATE USING (true);

-- Quiz results table policies
CREATE POLICY "Allow anonymous insert quiz_results" ON public.quiz_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read quiz_results" ON public.quiz_results
    FOR SELECT USING (true);

-- Blood test uploads table policies
CREATE POLICY "Allow anonymous insert blood_test_uploads" ON public.blood_test_uploads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read blood_test_uploads" ON public.blood_test_uploads
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update blood_test_uploads" ON public.blood_test_uploads
    FOR UPDATE USING (true);

-- Supplement interactions table policies
CREATE POLICY "Allow anonymous insert supplement_interactions" ON public.supplement_interactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read supplement_interactions" ON public.supplement_interactions
    FOR SELECT USING (true);

-- Page analytics table policies
CREATE POLICY "Allow anonymous insert page_analytics" ON public.page_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read page_analytics" ON public.page_analytics
    FOR SELECT USING (true);

-- Create storage bucket for blood test files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blood-tests', 'blood-tests', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for blood test files
CREATE POLICY "Allow anonymous upload blood tests" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'blood-tests');

CREATE POLICY "Allow anonymous read blood tests" ON storage.objects
    FOR SELECT USING (bucket_id = 'blood-tests');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_subscribers_updated_at 
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_test_uploads_updated_at 
    BEFORE UPDATE ON public.blood_test_uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT 
    schemaname,
    tablename
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('subscribers', 'quiz_results', 'blood_test_uploads', 'supplement_interactions', 'page_analytics')
ORDER BY tablename;
