-- v0.7.0 Database Migration: Talent Refactor & Meetup Host Addition
-- This migration:
-- 1. Renames presenter table to talent
-- 2. Renames workshop_host_id to workshop_lead_id in event table
-- 3. Adds meetup_host_id (required) to event table
-- 4. Updates all foreign key constraints

-- IMPORTANT: Backup your database before running this migration!

BEGIN;

-- Step 1: Rename presenter table to talent
ALTER TABLE presenter RENAME TO talent;

-- Step 2: Drop existing foreign key constraints on event table
ALTER TABLE event DROP CONSTRAINT IF EXISTS fk_event_presenter;
ALTER TABLE event DROP CONSTRAINT IF EXISTS fk_event_workshop_host;

-- Step 3: Rename workshop_host_id column to workshop_lead_id
ALTER TABLE event RENAME COLUMN workshop_host_id TO workshop_lead_id;

-- Step 4: Add meetup_host_id column (required)
-- Note: This will require setting a value for existing rows
-- For now, we'll allow NULL temporarily, then require user to populate
ALTER TABLE event ADD COLUMN meetup_host_id UUID;

-- Step 5: Recreate foreign key constraints with new table and column names
ALTER TABLE event 
ADD CONSTRAINT fk_event_presenter 
FOREIGN KEY (presenter_id) REFERENCES talent(id) ON DELETE RESTRICT;

ALTER TABLE event 
ADD CONSTRAINT fk_event_workshop_lead 
FOREIGN KEY (workshop_lead_id) REFERENCES talent(id) ON DELETE RESTRICT;

ALTER TABLE event 
ADD CONSTRAINT fk_event_meetup_host 
FOREIGN KEY (meetup_host_id) REFERENCES talent(id) ON DELETE RESTRICT;

-- Step 6: Add NOT NULL constraint to meetup_host_id
-- This will be done AFTER user populates existing events
-- ALTER TABLE event ALTER COLUMN meetup_host_id SET NOT NULL;

COMMIT;

-- ==============================================================================
-- MANUAL STEP REQUIRED AFTER MIGRATION:
-- ==============================================================================
-- 1. Run this migration
-- 2. Update all existing events to set meetup_host_id to appropriate talent ID
-- 3. Run this command to make meetup_host_id required:
--    ALTER TABLE event ALTER COLUMN meetup_host_id SET NOT NULL;
-- ==============================================================================