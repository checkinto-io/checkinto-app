-- Migration: v1.3.1-group-to-community-migration.sql
-- Purpose: Rename "group" table to "community" to resolve PostgreSQL reserved keyword conflicts
-- Date: 2025-01-19
-- 
-- This migration resolves issues with PostgreSQL reserved keyword "group" that causes
-- syntax errors in database functions and requires escaping with double quotes.
--
-- IMPORTANT: This script should be run in a transaction. Test thoroughly before production.

BEGIN;

-- Step 1: Rename the main table from "group" to "community"
ALTER TABLE "group" RENAME TO community;

-- Step 2: Update foreign key columns in all dependent tables
-- Note: PostgreSQL automatically updates foreign key constraints when renaming the referenced table,
-- but we need to rename the foreign key columns themselves for consistency

-- Update attendee table: group_id → community_id
ALTER TABLE attendee RENAME COLUMN group_id TO community_id;

-- Update event table: group_id → community_id and group_host_id → community_host_id  
ALTER TABLE event RENAME COLUMN group_id TO community_id;
ALTER TABLE event RENAME COLUMN group_host_id TO community_host_id;

-- Update talent table: group_id → community_id
ALTER TABLE talent RENAME COLUMN group_id TO community_id;

-- Update venue table: group_id → community_id  
ALTER TABLE venue RENAME COLUMN group_id TO community_id;

-- Step 3: Rename foreign key constraints for clarity and consistency
-- Note: PostgreSQL auto-updates constraint references, but we rename for semantic clarity

-- Drop old foreign key constraints
ALTER TABLE attendee DROP CONSTRAINT fk_attendee_group;
ALTER TABLE event DROP CONSTRAINT fk_event_group;
ALTER TABLE event DROP CONSTRAINT fk_event_group_host;
ALTER TABLE talent DROP CONSTRAINT fk_talent_group;
ALTER TABLE venue DROP CONSTRAINT fk_venue_group;

-- Add new foreign key constraints with community naming
ALTER TABLE attendee ADD CONSTRAINT fk_attendee_community 
    FOREIGN KEY (community_id) REFERENCES community(id);

ALTER TABLE event ADD CONSTRAINT fk_event_community 
    FOREIGN KEY (community_id) REFERENCES community(id);

ALTER TABLE event ADD CONSTRAINT fk_event_community_host 
    FOREIGN KEY (community_host_id) REFERENCES talent(id);

ALTER TABLE talent ADD CONSTRAINT fk_talent_community 
    FOREIGN KEY (community_id) REFERENCES community(id);

ALTER TABLE venue ADD CONSTRAINT fk_venue_community 
    FOREIGN KEY (community_id) REFERENCES community(id);

-- Step 4: Update unique constraint that references the old group_id
ALTER TABLE event DROP CONSTRAINT event_url_id_group_id_unique;
ALTER TABLE event ADD CONSTRAINT event_url_id_community_id_unique 
    UNIQUE (url_id, community_id);

-- Step 5: Verification queries (commented out - uncomment to verify after migration)
-- 
-- Verify table was renamed:
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'community';
--
-- Verify foreign key columns were renamed:
-- SELECT column_name, table_name FROM information_schema.columns 
-- WHERE column_name LIKE '%community%' AND table_schema = 'public';
--
-- Verify foreign key constraints were updated:
-- SELECT constraint_name, table_name FROM information_schema.table_constraints 
-- WHERE constraint_name LIKE '%community%' AND table_schema = 'public';
--
-- Verify unique constraint was updated:
-- SELECT constraint_name FROM information_schema.table_constraints 
-- WHERE constraint_name = 'event_url_id_community_id_unique';

COMMIT;

-- Post-migration notes:
-- 1. Database functions in /database/functions/ will need to be updated to reference "community" table
-- 2. All application code using "Group" types should be updated to "Community"
-- 3. All Supabase queries referencing "group" table should be updated to "community"
-- 4. This resolves PostgreSQL reserved keyword issues that required escaping "group" with quotes