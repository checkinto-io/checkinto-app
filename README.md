# Meetup Check-In v1.0

A mobile-first web application that enables seamless self-service check-in for in-person meetup attendees with real-time raffle functionality.

## Purpose

This application streamlines the check-in process for meetup events by providing a simple, branded experience that:
- Eliminates manual attendance tracking
- Collects attendee information digitally
- Provides venue details to checked-in attendees
- Enables real-time raffle winner announcements during events
- Scales to support multiple meetup organizers through subdomain architecture

## How It Works

**For Attendees:**
1. Visit your meetup's custom URL: `https://{meetupname}.chkin.io/{eventId}`
2. Complete the simple three-screen flow:
   - **Welcome Screen** - Event-specific landing page with meetup branding
   - **Check-In Form** - Provide name, email, and an interesting fact
   - **Confirmation Screen** - View venue details and watch for raffle announcements

**Example:** [https://codingwithai.chkin.io/082025](https://codingwithai.chkin.io/082025)

## Key Features

### ✅ Core Check-In Flow
- Mobile-optimized responsive design
- Event-specific branding and messaging
- Real-time form validation
- Duplicate email handling (upsert logic)

### ✅ Raffle System
- Real-time winner announcements
- Support for multiple raffle rounds
- Personalized messaging for winners vs. non-winners
- Admin-triggered winner selection via Supabase Edge Functions

### ✅ Multi-Tenant Architecture
- Subdomain-based organization structure
- Scalable for multiple meetup organizers
- Custom branding per meetup group

### ✅ Data Management
- Normalized database schema with venues, meetups, talent, and attendees
- Event-specific configuration
- Real-time polling for live updates

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS with mobile-first design
- **Backend**: Supabase (PostgreSQL database, API, Edge Functions)
- **Hosting**: Vercel with custom domain routing
- **Domain**: chkin.io with subdomain architecture

## Production Deployment

**Live Application:** [https://codingwithai.chkin.io](https://codingwithai.chkin.io)

The application is deployed on Vercel with:
- Automatic deployments from main branch
- Custom domain configuration through Namecheap
- SSL certificates automatically managed
- Environment variables securely configured

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## URL Structure

Events are accessed via: `https://{meetupname}.chkin.io/{eventId}`

Examples:
- `https://codingwithai.chkin.io/082025` - Coding with AI meetup, August 2025 event
- `https://seattle.chkin.io/090125` - Seattle meetup, September 2025 event

## Environment Variables

```sh
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Version History

- **v1.0.0** - Production deployment with custom domain and full feature set
- **v0.8.0** - Real-time raffle system implementation
- **v0.7.0** - Meetup host integration and talent management
- **v0.6.0** - Persistent state management for confirmation screens
- **v0.5.0** - Database schema normalization and optimization
- **v0.1.0-v0.4.0** - Core functionality development and polish
