-- Meetup Check-In Database Schema
-- Run this entire file in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Event table
CREATE TABLE IF NOT EXISTS event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    welcome_message TEXT NOT NULL,
    checked_in_message TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Attendee table
CREATE TABLE IF NOT EXISTS attendee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    interesting_fact TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Event_Attendee junction table
CREATE TABLE IF NOT EXISTS event_attendee (
    event_id UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    attendee_id UUID NOT NULL REFERENCES attendee(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, attendee_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_url_id ON event(url_id);
CREATE INDEX IF NOT EXISTS idx_attendee_email ON attendee(email);
CREATE INDEX IF NOT EXISTS idx_event_attendee_event_id ON event_attendee(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendee_attendee_id ON event_attendee(attendee_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_event_updated_at 
    BEFORE UPDATE ON event 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendee_updated_at 
    BEFORE UPDATE ON attendee 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE event ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendee ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendee ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access to active events
CREATE POLICY "Allow public read access to active events" ON event
    FOR SELECT USING (active = true);

-- Create RLS policies for public insert access to attendees
CREATE POLICY "Allow public insert access to attendees" ON attendee
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for public read access to attendees (for upsert functionality)
CREATE POLICY "Allow public read access to attendees" ON attendee
    FOR SELECT USING (true);

-- Create RLS policies for public update access to attendees (for upsert functionality)
CREATE POLICY "Allow public update access to attendees" ON attendee
    FOR UPDATE USING (true);

-- Create RLS policies for event_attendee table
CREATE POLICY "Allow public insert access to event_attendee" ON event_attendee
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to event_attendee" ON event_attendee
    FOR SELECT USING (true);

-- Insert sample data for testing
INSERT INTO event (url_id, title, welcome_message, checked_in_message) VALUES 
(
    'test-event-2025', 
    'Test Meetup 2025', 
    'Welcome to our Test Meetup! We''re excited to have you here. Please click the button below to check in.',
    'Thank you for checking in! The event is being held in Conference Room A. WiFi password is: meetup2025. Restrooms are located down the hall to the right.'
) ON CONFLICT (url_id) DO NOTHING;

-- Success message
SELECT 'Database schema created successfully!' as message;