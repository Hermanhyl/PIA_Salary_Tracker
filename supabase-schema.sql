-- PiA Salary Tracker Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: monthly_records
-- Stores salary records for each month
CREATE TABLE IF NOT EXISTS public.monthly_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
    gross_salary DECIMAL(10, 2) NOT NULL CHECK (gross_salary >= 0),
    income_tax DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (income_tax >= 0),
    pension_insurance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (pension_insurance >= 0),
    health_insurance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (health_insurance >= 0),
    unemployment_insurance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (unemployment_insurance >= 0),
    total_deductions DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_deductions >= 0),
    net_income DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (net_income >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Ensure unique month/year combination per user
    UNIQUE(user_id, month, year)
);

-- Table: user_settings
-- Stores user preferences for automatic deduction calculations
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_calculate_deductions BOOLEAN NOT NULL DEFAULT true,
    pension_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.0930, -- 9.3%
    health_care_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.0900, -- 9.0% (7.3% health + 1.7% care)
    unemployment_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.0130, -- 1.3%
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for monthly_records
DROP TRIGGER IF EXISTS update_monthly_records_updated_at ON public.monthly_records;
CREATE TRIGGER update_monthly_records_updated_at
    BEFORE UPDATE ON public.monthly_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on both tables
ALTER TABLE public.monthly_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for monthly_records
-- Users can only view their own records
CREATE POLICY "Users can view own records" ON public.monthly_records
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert own records" ON public.monthly_records
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own records
CREATE POLICY "Users can update own records" ON public.monthly_records
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own records
CREATE POLICY "Users can delete own records" ON public.monthly_records
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for user_settings
-- Users can view their own settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own settings
CREATE POLICY "Users can delete own settings" ON public.user_settings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically create default user settings when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_settings (user_id)
    VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default settings for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_records_user_id ON public.monthly_records(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_records_year ON public.monthly_records(year);
CREATE INDEX IF NOT EXISTS idx_monthly_records_user_year ON public.monthly_records(user_id, year);
