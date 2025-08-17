-- Migration Script: v1.3.0-meetup-host-field-update.sql
-- Description: Update meetup_host_id field to group_host_id for terminology consistency
-- Changes:
--   1. Rename meetup_host_id field to group_host_id in event table
--   2. Update foreign key constraint name accordingly

-- Start transaction for atomic migration
BEGIN;

-- Step 1: Rename meetup_host_id column to group_host_id
ALTER TABLE public.event 
RENAME COLUMN meetup_host_id TO group_host_id;

-- Step 2: Drop old foreign key constraint
ALTER TABLE public.event 
DROP CONSTRAINT fk_event_meetup_host;

-- Step 3: Add new foreign key constraint with updated name
ALTER TABLE public.event 
ADD CONSTRAINT fk_event_group_host FOREIGN KEY (group_host_id) REFERENCES public.talent(id);

-- Commit the transaction
COMMIT;

-- Verification queries (commented out - can be run separately to verify migration)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'event' AND column_name = 'group_host_id';
-- SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_group_host';