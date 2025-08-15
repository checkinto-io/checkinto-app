-- Function: Select Raffle Winner
-- Version: v0.8.0-raffle-system
-- Description: Randomly selects a raffle winner from eligible attendees for a given event
-- Usage: SELECT select_raffle_winner('YOUR_EVENT_ID_HERE');

CREATE OR REPLACE FUNCTION select_raffle_winner(p_event_id UUID)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    attendee_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    raffle_round INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_winner_id UUID;
    v_next_round INTEGER;
    v_lock_id BIGINT;
    v_winner_record RECORD;
BEGIN
    -- Convert UUID to a numeric lock ID (using first 8 bytes of UUID)
    v_lock_id := ('x' || substr(p_event_id::text, 1, 8))::bit(32)::bigint;
    
    -- Acquire advisory lock to prevent concurrent winner selection for same event
    PERFORM pg_advisory_lock(v_lock_id);
    
    BEGIN
        -- Get the next round number
        SELECT COALESCE(MAX(ea.raffle_round), 0) + 1 INTO v_next_round
        FROM event_attendee ea
        WHERE ea.event_id = p_event_id
        AND ea.raffle_winner = true;
        
        -- Select a random eligible attendee (not already a winner)
        SELECT ea.attendee_id INTO v_winner_id
        FROM event_attendee ea
        WHERE ea.event_id = p_event_id
        AND ea.raffle_winner = false
        ORDER BY RANDOM()
        LIMIT 1;
        
        -- Check if we found an eligible attendee
        IF v_winner_id IS NULL THEN
            -- Release the lock
            PERFORM pg_advisory_unlock(v_lock_id);
            
            RETURN QUERY
            SELECT 
                false AS success,
                'No eligible attendees remaining for this event' AS message,
                NULL::UUID AS attendee_id,
                NULL::TEXT AS first_name,
                NULL::TEXT AS last_name,
                NULL::TEXT AS email,
                NULL::INTEGER AS raffle_round;
            RETURN;
        END IF;
        
        -- Update the winner
        UPDATE event_attendee
        SET raffle_winner = true,
            raffle_round = v_next_round
        WHERE event_attendee.event_id = p_event_id
        AND event_attendee.attendee_id = v_winner_id
        AND event_attendee.raffle_winner = false; -- Double-check to prevent race condition
        
        -- Verify the update was successful
        IF NOT FOUND THEN
            -- Release the lock
            PERFORM pg_advisory_unlock(v_lock_id);
            
            RETURN QUERY
            SELECT 
                false AS success,
                'Failed to update winner - possible race condition' AS message,
                NULL::UUID AS attendee_id,
                NULL::TEXT AS first_name,
                NULL::TEXT AS last_name,
                NULL::TEXT AS email,
                NULL::INTEGER AS raffle_round;
            RETURN;
        END IF;
        
        -- Get winner details
        SELECT 
            a.id,
            a.first_name,
            a.last_name,
            a.email
        INTO v_winner_record
        FROM attendee a
        WHERE a.id = v_winner_id;
        
        -- Release the lock
        PERFORM pg_advisory_unlock(v_lock_id);
        
        -- Return success with winner details
        RETURN QUERY
        SELECT 
            true AS success,
            format('Successfully selected winner for round %s', v_next_round) AS message,
            v_winner_record.id AS attendee_id,
            v_winner_record.first_name AS first_name,
            v_winner_record.last_name AS last_name,
            v_winner_record.email AS email,
            v_next_round AS raffle_round;
            
    EXCEPTION WHEN OTHERS THEN
        -- Release the lock in case of error
        PERFORM pg_advisory_unlock(v_lock_id);
        RAISE;
    END;
END;
$$;

-- Grant execute permission to authenticated users (adjust as needed)
GRANT EXECUTE ON FUNCTION select_raffle_winner(UUID) TO authenticated;

-- Example usage:
-- SELECT * FROM select_raffle_winner('YOUR_EVENT_ID_HERE');
-- 
-- To run multiple rounds:
-- SELECT * FROM select_raffle_winner('YOUR_EVENT_ID_HERE'); -- Round 1
-- SELECT * FROM select_raffle_winner('YOUR_EVENT_ID_HERE'); -- Round 2
-- SELECT * FROM select_raffle_winner('YOUR_EVENT_ID_HERE'); -- Round 3