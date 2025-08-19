# CheckInto App

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/marcelolewin/checkinto-app)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

A mobile-first web application that enables seamless self-service check-in for in-person group event attendees with real-time raffle functionality and full multi-tenant support.

## Purpose

This application streamlines the check-in process for group events by providing a simple, branded experience that:
- Eliminates manual attendance tracking
- Collects attendee information digitally
- Provides venue details to checked-in attendees
- Enables real-time raffle winner announcements during events
- Scales to support multiple group organizers through subdomain architecture

## How It Works

**For Attendees:**
1. Visit your group's custom URL: `https://{groupname}.checkinto.io/{eventId}`
2. Complete the simple three-screen flow:
   - **Welcome Screen** - Event-specific landing page with group branding
   - **Check-In Form** - Provide name, email, and an interesting fact
   - **Confirmation Screen** - View venue details and watch for raffle announcements

**Example:** [https://codingwithai.checkinto.io/082025](https://codingwithai.checkinto.io/082025)

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
- **Complete data isolation** - Each group maintains separate attendees, venues, and talent
- **Subdomain-based routing** - Secure event access via `{groupname}.checkinto.io/{eventId}`
- **Cross-group flexibility** - Same user can participate in multiple groups independently
- **Scalable design** - Support for unlimited group organizers without conflicts

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS with mobile-first design
- **Backend**: Supabase (PostgreSQL database, API, Edge Functions)
- **Hosting**: Vercel with custom domain routing
- **Domain**: Both checkinto.io and chkin.io with subdomain architecture

## Production Deployment

The application is deployed on Vercel with:
- Automatic deployments from main branch
- Custom domain configuration through Namecheap
- SSL certificates automatically managed
- Environment variables securely configured

## URL Structure & Multi-Tenant Routing

Events are accessed via: `https://{groupname}.checkinto.io/{eventId}`

The application automatically:
1. **Extracts the group identifier** from the subdomain (`{groupname}`)
2. **Validates event access** by checking both `eventId` AND `groupname` 
3. **Ensures data isolation** - groups cannot access each other's events even with same event IDs
4. **Provides fallback routing** for development environments via URL parameters

Examples:
- `https://codingwithai.checkinto.io/082025` - Coding with AI group, August 2025 event
- `https://seattle.checkinto.io/082025` - Seattle group, August 2025 event (same ID, different group - no conflict!)
- `http://localhost:5173/082025?group=codingwithai` - Development routing

## Environment Variables

```sh
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Image Asset Organization

Assets are organized in a group-based structure for multi-tenant scaling:

```
static/images/groups/
└── {groupname}/
    ├── group/          # Group logos and branding
    ├── talent/         # Speaker/presenter photos  
    └── events/         # Event-specific images
```

**Example:**
```
static/images/groups/codingwithai/
├── group/coding-with-ai-group.png
├── talent/marcelo-lewin.png
└── events/ (for future event images)
```

## Multi-Tenant Support Details

### Data Isolation
- **Complete tenant separation** - Each group maintains its own attendees, venues, and talent records
- **Cross-group user support** - Same email address can register for events across different groups
- **Secure routing** - Events are validated against both event ID and group profile name
- **Database-level isolation** - All core tables include `group_id` foreign key constraints

### Real-World Example
A user with email `john@example.com` can:
1. Register for `codingwithai.checkinto.io/082025` as "John Smith"
2. Register for `seattle.checkinto.io/082025` as "J. Smith" 
3. Register for `vancouver.checkinto.io/082025` as "Johnny"

Each group sees them as separate attendees with their own check-in history, while the system maintains proper isolation and prevents conflicts.

## License

This software is licensed under a **Commercial License**. 

- ✅ **Permitted**: Use for its intended purpose, viewing source code, educational study
- ❌ **Prohibited**: Modification, redistribution, derivative works, commercial redistribution

The source code is publicly available for transparency and educational purposes only. See the [LICENSE](LICENSE) file for complete terms and conditions.

For commercial licensing inquiries: marcelo@icodewith.ai

## Version History

- **v1.3.0** - Complete multi-tenant architecture with data isolation and secure routing
- **v1.2.0** - CSS consolidation and styling improvements
- **v1.1.0** - Multi-tenant image folder restructure with group-based organization
- **v1.0.0** - Production deployment with custom domain and full feature set
- **v0.8.0** - Real-time raffle system implementation
- **v0.7.0** - Group host integration and talent management
- **v0.6.0** - Persistent state management for confirmation screens
- **v0.5.0** - Database schema normalization and optimization
- **v0.1.0-v0.4.0** - Core functionality development and polish
