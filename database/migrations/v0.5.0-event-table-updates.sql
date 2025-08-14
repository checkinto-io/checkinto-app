-- v0.5.0 Event Table Updates
-- Minor schema updates to event table field names and relationships
-- Safe to run - does not affect current application functionality

-- =====================================================
-- STEP 1: Rename about_working_session to about_workshop
-- =====================================================

-- Rename the column to better reflect its purpose
ALTER TABLE event 
RENAME COLUMN about_working_session TO about_workshop;

-- =====================================================
-- STEP 2: Add workshop_host_id field
-- =====================================================

-- Add new foreign key field for workshop host (one-to-many from presenter)
-- Note: Adding as nullable first, will set NOT NULL after populating data
ALTER TABLE event 
ADD COLUMN workshop_host_id UUID;

-- Add foreign key constraint to presenter table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_event_workshop_host') THEN
        ALTER TABLE event ADD CONSTRAINT fk_event_workshop_host 
            FOREIGN KEY (workshop_host_id) REFERENCES presenter(id) ON DELETE RESTRICT;
    END IF;
END $$;

-- =====================================================
-- STEP 2b: Set workshop_host_id values and make required
-- =====================================================

-- IMPORTANT: You need to populate workshop_host_id values before running this step
-- Example: UPDATE event SET workshop_host_id = 'your-presenter-uuid' WHERE id = 'event-id';

-- After populating data, make the field required
-- UNCOMMENT THE LINE BELOW AFTER POPULATING DATA:
-- ALTER TABLE event ALTER COLUMN workshop_host_id SET NOT NULL;

-- =====================================================
-- STEP 3: Create index for performance
-- =====================================================

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_event_workshop_host_id ON event(workshop_host_id);

-- =====================================================
-- STEP 4: Add constraint for data integrity
-- =====================================================

-- Add check constraint to ensure workshop_host_id is different from presenter_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_event_workshop_host_valid') THEN
        ALTER TABLE event ADD CONSTRAINT chk_event_workshop_host_valid 
            CHECK (workshop_host_id != presenter_id);
    END IF;
END $$;

-- Success message
SELECT 'v0.5.0 event table updates completed successfully!' as message;
SELECT 'about_working_session renamed to about_workshop' as renamed;
SELECT 'workshop_host_id field added with foreign key to presenter table' as added;