-- v0.7.0 Database Migration ROLLBACK: Talent Refactor & Meetup Host Addition
-- This rollback script reverses all changes made in v0.7.0-talent-refactor-migration.sql
-- 
-- IMPORTANT: 
-- - This will remove the meetup_host_id column and all its data!
-- - Only run this if you need to completely reverse the migration
-- - Backup your database before running this rollback!

BEGIN;

-- Step 1: Drop foreign key constraints added in migration
ALTER TABLE event DROP CONSTRAINT IF EXISTS fk_event_presenter;
ALTER TABLE event DROP CONSTRAINT IF EXISTS fk_event_workshop_lead;
ALTER TABLE event DROP CONSTRAINT IF EXISTS fk_event_meetup_host;

-- Step 2: Remove meetup_host_id column (WARNING: This removes data!)
ALTER TABLE event DROP COLUMN IF EXISTS meetup_host_id;

-- Step 3: Rename workshop_lead_id back to workshop_host_id
ALTER TABLE event RENAME COLUMN workshop_lead_id TO workshop_host_id;

-- Step 4: Rename talent table back to presenter
ALTER TABLE talent RENAME TO presenter;

-- Step 5: Recreate original foreign key constraints
ALTER TABLE event 
ADD CONSTRAINT fk_event_presenter 
FOREIGN KEY (presenter_id) REFERENCES presenter(id) ON DELETE RESTRICT;

ALTER TABLE event 
ADD CONSTRAINT fk_event_workshop_host 
FOREIGN KEY (workshop_host_id) REFERENCES presenter(id) ON DELETE RESTRICT;

COMMIT;

-- ==============================================================================
-- ROLLBACK COMPLETE
-- ==============================================================================
-- The database schema has been restored to its state before v0.7.0 migration.
-- 
-- NOTE: Any data that was stored in meetup_host_id has been permanently lost.
-- If you need to re-run the forward migration, you'll need to repopulate 
-- the meetup_host_id values for all events.
-- ==============================================================================