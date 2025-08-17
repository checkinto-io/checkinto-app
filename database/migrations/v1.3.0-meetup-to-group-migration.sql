-- Migration Script: v1.3.0-meetup-to-group-migration.sql
-- Description: Comprehensive migration from "meetup" to "group" terminology
-- Changes:
--   1. Rename meetup table to group
--   2. Rename logo field to banner
--   3. Add profilename field (text, unique)
--   4. Add favicon field (text, with same constraints as banner)
--   5. Update foreign key references from meetup_id to group_id

-- Start transaction for atomic migration
BEGIN;

-- Step 1: Add new fields to meetup table before rename
ALTER TABLE public.meetup 
ADD COLUMN profilename text,
ADD COLUMN favicon text CHECK (favicon IS NULL OR length(favicon) > 0 AND length(favicon) <= 255);

-- Step 2: Rename logo column to banner
ALTER TABLE public.meetup 
RENAME COLUMN logo TO banner;

-- Step 3: Rename meetup table to group
ALTER TABLE public.meetup 
RENAME TO "group";

-- Step 4: Add unique constraint to profilename
ALTER TABLE public."group" 
ADD CONSTRAINT group_profilename_unique UNIQUE (profilename);

-- Step 5: Update foreign key column name in event table
ALTER TABLE public.event 
RENAME COLUMN meetup_id TO group_id;

-- Step 6: Drop old foreign key constraint
ALTER TABLE public.event 
DROP CONSTRAINT fk_event_meetup;

-- Step 7: Add new foreign key constraint with updated name
ALTER TABLE public.event 
ADD CONSTRAINT fk_event_group FOREIGN KEY (group_id) REFERENCES public."group"(id);

-- Step 8: Update any sequences or other objects that reference the old table name
-- (PostgreSQL automatically handles sequence renames when table is renamed)

-- Commit the transaction
COMMIT;

-- Verification queries (commented out - can be run separately to verify migration)
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'group';
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'group';
-- SELECT constraint_name, table_name, column_name FROM information_schema.key_column_usage WHERE table_name = 'event' AND column_name = 'group_id';