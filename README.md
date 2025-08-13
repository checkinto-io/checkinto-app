# Meetup Check-In

A mobile-first web application that enables seamless self-service check-in for in-person meetup attendees.

## Overview

This app provides a simple three-screen flow for event attendees:
1. **Welcome Screen** - Event-specific landing page with check-in button
2. **Check-In Form** - Collect attendee information (name, email, interesting fact)
3. **Confirmation Screen** - Success message with venue information

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Backend**: Supabase (database & API)
- **Hosting**: Netlify

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

## URL Structure

Events are accessed via: `https://meetup.icodewith.ai/[eventId]/`
