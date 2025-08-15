-- Raffle Admin Script
-- Version: v0.8.0-raffle-system
-- Description: Admin script for managing raffle winners
-- 
-- IMPORTANT: Replace 'YOUR_EVENT_ID_HERE' with the actual event ID before running
--
-- ============================================================================
-- HOW TO USE THIS SCRIPT:
-- ============================================================================
-- 1. Open Supabase SQL Editor
-- 2. Replace 'YOUR_EVENT_ID_HERE' with your actual event ID
-- 3. Uncomment and run the desired command
-- ============================================================================

-- ============================================================================
-- 1. SELECT A NEW RAFFLE WINNER
-- ============================================================================
-- Uncomment and run this to select a new winner:
/*
SELECT * FROM select_raffle_winner('YOUR_EVENT_ID_HERE');
*/

-- ============================================================================
-- 2. VIEW CURRENT WINNERS (as seen by users)
-- ============================================================================
-- Uncomment and run this to see what users will see:
/*
SELECT * FROM get_raffle_winners('YOUR_EVENT_ID_HERE');
*/

-- ============================================================================
-- 3. VIEW ALL WINNERS FOR AN EVENT
-- ============================================================================
-- Uncomment and run this to see all winners (not just displayed ones):
/*
SELECT 
    a.first_name,
    a.last_name,
    a.email,
    ea.raffle_round,
    ea.raffle_winner
FROM event_attendee ea
JOIN attendee a ON ea.attendee_id = a.id
WHERE ea.event_id = 'YOUR_EVENT_ID_HERE'
AND ea.raffle_winner = true
ORDER BY ea.raffle_round ASC;
*/

-- ============================================================================
-- 4. CHECK HOW MANY ELIGIBLE ATTENDEES REMAIN
-- ============================================================================
-- Uncomment and run this to see how many people can still win:
/*
SELECT COUNT(*) as eligible_attendees_remaining
FROM event_attendee
WHERE event_id = 'YOUR_EVENT_ID_HERE'
AND raffle_winner = false;
*/

-- ============================================================================
-- 5. RESET ALL RAFFLE WINNERS (USE WITH CAUTION!)
-- ============================================================================
-- Uncomment and run this to clear all winners and start over:
/*
UPDATE event_attendee
SET raffle_winner = false,
    raffle_round = NULL
WHERE event_id = 'YOUR_EVENT_ID_HERE';
*/

-- ============================================================================
-- 6. MANUALLY SET A SPECIFIC ATTENDEE AS WINNER
-- ============================================================================
-- Uncomment and run this if you need to manually set someone as winner:
/*
UPDATE event_attendee
SET raffle_winner = true,
    raffle_round = (
        SELECT COALESCE(MAX(raffle_round), 0) + 1 
        FROM event_attendee 
        WHERE event_id = 'YOUR_EVENT_ID_HERE' 
        AND raffle_winner = true
    )
WHERE event_id = 'YOUR_EVENT_ID_HERE'
AND attendee_id = 'SPECIFIC_ATTENDEE_ID_HERE';
*/

-- ============================================================================
-- 7. VIEW EVENT DETAILS WITH MEETUP SETTINGS
-- ============================================================================
-- Uncomment and run this to see event and raffle configuration:
/*
SELECT 
    e.id as event_id,
    e.title as event_title,
    e.active as event_active,
    m.name as meetup_name,
    m.raffle_winners_to_display,
    COUNT(DISTINCT ea.attendee_id) as total_attendees,
    COUNT(DISTINCT CASE WHEN ea.raffle_winner = true THEN ea.attendee_id END) as total_winners
FROM event e
JOIN meetup m ON e.meetup_id = m.id
LEFT JOIN event_attendee ea ON e.id = ea.event_id
WHERE e.id = 'YOUR_EVENT_ID_HERE'
GROUP BY e.id, e.title, e.active, m.name, m.raffle_winners_to_display;
*/

-- ============================================================================
-- 8. FIND EVENT ID BY URL_ID
-- ============================================================================
-- Uncomment and run this if you know the URL but not the event ID:
/*
SELECT id, title, url_id, active 
FROM event 
WHERE url_id = 'YOUR_URL_ID_HERE';
*/