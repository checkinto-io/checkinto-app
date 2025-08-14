-- v0.5.0 Database Schema Updates
-- Major database schema restructure for data normalization
-- Run this entire file in Supabase SQL Editor

-- =====================================================
-- STEP 1: Create new tables (meetup, venue, presenter)
-- =====================================================

-- Create Meetup table
CREATE TABLE IF NOT EXISTS meetup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    learn_more_link TEXT,
    logo TEXT, -- filename only, path will be /static/images/meetup/{logo}
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Venue table  
CREATE TABLE IF NOT EXISTS venue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    learn_more_link TEXT,
    wifi_access TEXT,
    restroom_details TEXT,
    food_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Presenter table
CREATE TABLE IF NOT EXISTS presenter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    learn_more_link TEXT,
    about_presenter TEXT,
    profile_photo TEXT, -- filename only, path will be /static/images/presenters/{profile_photo}
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- STEP 2: Add new columns to event table
-- =====================================================

-- Add new columns to event table
ALTER TABLE event 
ADD COLUMN IF NOT EXISTS about_presentation TEXT,
ADD COLUMN IF NOT EXISTS about_working_session TEXT,
ADD COLUMN IF NOT EXISTS presenter_id UUID,
ADD COLUMN IF NOT EXISTS meetup_id UUID,
ADD COLUMN IF NOT EXISTS venue_id UUID;

-- =====================================================
-- STEP 3: Create foreign key constraints
-- =====================================================

-- Add foreign key constraints (all required relationships)
-- Note: Using DO blocks to handle "IF NOT EXISTS" for constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_event_meetup') THEN
        ALTER TABLE event ADD CONSTRAINT fk_event_meetup 
            FOREIGN KEY (meetup_id) REFERENCES meetup(id) ON DELETE RESTRICT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_event_venue') THEN
        ALTER TABLE event ADD CONSTRAINT fk_event_venue 
            FOREIGN KEY (venue_id) REFERENCES venue(id) ON DELETE RESTRICT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_event_presenter') THEN
        ALTER TABLE event ADD CONSTRAINT fk_event_presenter 
            FOREIGN KEY (presenter_id) REFERENCES presenter(id) ON DELETE RESTRICT;
    END IF;
END $$;

-- =====================================================
-- STEP 4: Create indexes for performance
-- =====================================================

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_meetup_name ON meetup(name);
CREATE INDEX IF NOT EXISTS idx_venue_name ON venue(name);
CREATE INDEX IF NOT EXISTS idx_presenter_email ON presenter(email);
CREATE INDEX IF NOT EXISTS idx_presenter_name ON presenter(last_name, first_name);

-- Create indexes for new foreign keys in event table
CREATE INDEX IF NOT EXISTS idx_event_meetup_id ON event(meetup_id);
CREATE INDEX IF NOT EXISTS idx_event_venue_id ON event(venue_id);
CREATE INDEX IF NOT EXISTS idx_event_presenter_id ON event(presenter_id);

-- =====================================================
-- STEP 5: Create updated_at triggers for new tables
-- =====================================================

-- Create triggers for new tables to automatically update updated_at columns
-- Note: Using DO blocks to handle trigger creation conditionally
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_meetup_updated_at') THEN
        CREATE TRIGGER update_meetup_updated_at 
            BEFORE UPDATE ON meetup 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_venue_updated_at') THEN
        CREATE TRIGGER update_venue_updated_at 
            BEFORE UPDATE ON venue 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_presenter_updated_at') THEN
        CREATE TRIGGER update_presenter_updated_at 
            BEFORE UPDATE ON presenter 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- STEP 6: Enable Row Level Security for new tables
-- =====================================================

-- Enable RLS for new tables
ALTER TABLE meetup ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue ENABLE ROW LEVEL SECURITY;
ALTER TABLE presenter ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access to new tables
CREATE POLICY "Allow public read access to meetups" ON meetup
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to venues" ON venue
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to presenters" ON presenter
    FOR SELECT USING (true);

-- =====================================================
-- STEP 7: Remove unused column (after data population)
-- =====================================================

-- NOTE: This step should be executed AFTER data population is complete
-- and the application has been updated to not use checked_in_message

-- UNCOMMENT THE LINE BELOW AFTER COMPLETING ALL OTHER STEPS:
-- ALTER TABLE event DROP COLUMN IF EXISTS checked_in_message;

-- Success message
SELECT 'v0.5.0 database schema updates completed successfully!' as message;
SELECT 'IMPORTANT: Remember to populate the new tables with data before making foreign keys NOT NULL' as reminder;
SELECT 'IMPORTANT: Remove checked_in_message column AFTER updating the application code' as warning;