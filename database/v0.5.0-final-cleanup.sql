-- v0.5.0 Final Database Cleanup
-- Execute this script AFTER:
-- 1. Running v0.5.0-schema-updates.sql
-- 2. Populating new tables with data
-- 3. Updating all event records with foreign key references
-- 4. Updating application code to not use checked_in_message

-- =====================================================
-- STEP 1: Make foreign keys NOT NULL (required relationships)
-- =====================================================

-- Make foreign key columns NOT NULL to enforce required relationships
ALTER TABLE event 
ALTER COLUMN meetup_id SET NOT NULL,
ALTER COLUMN venue_id SET NOT NULL,
ALTER COLUMN presenter_id SET NOT NULL;

-- =====================================================
-- STEP 2: Remove unused column
-- =====================================================

-- Remove the unused checked_in_message column
ALTER TABLE event DROP COLUMN IF EXISTS checked_in_message;

-- =====================================================
-- STEP 3: Add additional constraints for data integrity
-- =====================================================

-- Add check constraints to ensure logo and profile_photo filenames are reasonable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_meetup_logo_length') THEN
        ALTER TABLE meetup ADD CONSTRAINT chk_meetup_logo_length 
            CHECK (logo IS NULL OR (length(logo) > 0 AND length(logo) <= 255));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_presenter_profile_photo_length') THEN
        ALTER TABLE presenter ADD CONSTRAINT chk_presenter_profile_photo_length 
            CHECK (profile_photo IS NULL OR (length(profile_photo) > 0 AND length(profile_photo) <= 255));
    END IF;
END $$;

-- Success message
SELECT 'v0.5.0 final cleanup completed successfully!' as message;
SELECT 'All foreign key relationships are now required (NOT NULL)' as info;
SELECT 'checked_in_message column has been removed' as removed;