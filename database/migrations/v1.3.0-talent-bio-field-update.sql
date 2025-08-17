-- Migration Script: v1.3.0-talent-bio-field-update.sql
-- Description: Rename about_presenter field to bio in talent table
-- Changes:
--   1. Rename about_presenter column to bio in talent table

-- Start transaction for atomic migration
BEGIN;

-- Step 1: Rename about_presenter column to bio
ALTER TABLE public.talent 
RENAME COLUMN about_presenter TO bio;

-- Commit the transaction
COMMIT;

-- Verification queries (commented out - can be run separately to verify migration)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'talent' AND column_name = 'bio';