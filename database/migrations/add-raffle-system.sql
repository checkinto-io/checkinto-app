-- Migration: Add Raffle System Fields
-- Version: v0.8.0-raffle-system
-- Description: Add raffle_winner, raffle_round to event_attendee table and raffle_winners_to_display to meetup table

BEGIN;

-- Add raffle fields to event_attendee table
ALTER TABLE public.event_attendee 
ADD COLUMN raffle_winner BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN raffle_round INTEGER;

-- Add raffle display control to meetup table  
ALTER TABLE public.meetup
ADD COLUMN raffle_winners_to_display INTEGER NOT NULL DEFAULT 1;

-- Create composite index for efficient raffle winner queries
CREATE INDEX idx_event_attendee_raffle_lookup 
ON public.event_attendee (event_id, raffle_winner, raffle_round);

-- Add constraint to ensure raffle_round is positive when set
ALTER TABLE public.event_attendee
ADD CONSTRAINT chk_raffle_round_positive 
CHECK (raffle_round IS NULL OR raffle_round > 0);

-- Add constraint to ensure raffle_winners_to_display is positive
ALTER TABLE public.meetup
ADD CONSTRAINT chk_raffle_winners_to_display_positive
CHECK (raffle_winners_to_display > 0);

COMMIT;

-- Rollback script (run this to undo changes if needed):
/*
BEGIN;
DROP INDEX IF EXISTS idx_event_attendee_raffle_lookup;
ALTER TABLE public.event_attendee DROP CONSTRAINT IF EXISTS chk_raffle_round_positive;
ALTER TABLE public.meetup DROP CONSTRAINT IF EXISTS chk_raffle_winners_to_display_positive;
ALTER TABLE public.event_attendee DROP COLUMN IF EXISTS raffle_winner;
ALTER TABLE public.event_attendee DROP COLUMN IF EXISTS raffle_round;
ALTER TABLE public.meetup DROP COLUMN IF EXISTS raffle_winners_to_display;
COMMIT;
*/