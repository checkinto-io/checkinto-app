-- Function: Get Raffle Winners
-- Version: v0.8.0-raffle-system
-- Description: Retrieves the latest raffle winners for a given event based on group display settings
-- Usage: SELECT * FROM get_raffle_winners('YOUR_EVENT_ID_HERE');

CREATE OR REPLACE FUNCTION get_raffle_winners(p_event_id UUID)
RETURNS TABLE (
    attendee_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    raffle_round INTEGER,
    total_winners_to_display INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_winners_to_display INTEGER;
BEGIN
    -- Get the raffle_winners_to_display setting from the group
    SELECT g.raffle_winners_to_display INTO v_winners_to_display
    FROM event e
    JOIN "group" g ON e.group_id = g.id
    WHERE e.id = p_event_id;
    
    -- If event not found or group not configured, return empty
    IF v_winners_to_display IS NULL THEN
        RETURN;
    END IF;
    
    -- Return the latest winners based on the display setting
    RETURN QUERY
    SELECT 
        a.id AS attendee_id,
        a.first_name,
        a.last_name,
        a.email,
        ea.raffle_round,
        v_winners_to_display AS total_winners_to_display
    FROM event_attendee ea
    JOIN attendee a ON ea.attendee_id = a.id
    WHERE ea.event_id = p_event_id
    AND ea.raffle_winner = true
    ORDER BY ea.raffle_round DESC
    LIMIT v_winners_to_display;
END;
$$;

-- Grant execute permission to anon and authenticated users for polling
GRANT EXECUTE ON FUNCTION get_raffle_winners(UUID) TO anon, authenticated;

-- Example usage:
-- SELECT * FROM get_raffle_winners('YOUR_EVENT_ID_HERE');
--
-- This will return:
-- - The latest winner(s) based on raffle_winners_to_display setting
-- - Empty result if no winners yet
-- - Ordered by raffle_round DESC (newest first)