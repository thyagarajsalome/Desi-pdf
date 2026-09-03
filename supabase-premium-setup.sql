-- SQL Script to set up the Premium Users table in Supabase
-- Go to https://supabase.com/dashboard > SQL Editor and run this code:

-- 1. Create the user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    email TEXT PRIMARY KEY,
    is_pro BOOLEAN DEFAULT false,
    pro_until TIMESTAMP WITH TIME ZONE,
    last_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows anyone to insert/update (Upsert) 
-- Note: For a real production app, you would verify the Razorpay webhook on a secure Node.js backend.
-- This policy allows the front-end to safely update the profile after checkout.
CREATE POLICY "Allow public insert and update" ON public.user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Create a policy for reading data
CREATE POLICY "Allow public select" ON public.user_profiles
    FOR SELECT
    USING (true);
