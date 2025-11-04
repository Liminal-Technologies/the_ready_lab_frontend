# The Ready Lab - Learning Management System

## Project Overview
A comprehensive educational learning management system (LMS) with course management, certifications, communities, digital products marketplace, live streaming, and multi-language support (EN, ES, FR, PT, AR, ZH).

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Payments**: Stripe (Connect, Subscriptions, Products)
- **Development**: Full-stack monorepo with hot reload

## Recent Changes

### Migration to Replit (Nov 3, 2025)
Successfully migrated from Lovable/Supabase to Replit full-stack environment:
- ✅ Converted 25+ database tables from Supabase to Drizzle ORM
- ✅ Created Express backend with REST API routes
- ✅ Set up Neon PostgreSQL database
- ✅ Configured Vite dev server integration
- ✅ Basic Stripe payment routes (keys pending)
- ⚠️ Frontend still uses Supabase client - needs migration to fetch API calls

### Student Journey Front-End Demo (Nov 4, 2025) - ✅ 100% COMPLETE
Completed ALL Student Journey requirements (A-E) from PRD with localStorage and mock data:

**Previous Enhancements:**
- ✅ **Improved Onboarding Flow** - Language selection + optional profile (src/pages/Onboarding.tsx)
- ✅ **Welcome Tour** - 5-step guided overlay for new users (src/components/onboarding/WelcomeTour.tsx)
- ✅ **Browse Without Login** - Verified courses browseable without auth
- ✅ **BNPL Payment Indicators** - Klarna/Afterpay/Affirm badges (src/pages/CourseDetail.tsx)
- ✅ **Certificate Generation Modal** - Animated progress + LinkedIn share (src/components/certificates/CertificateGenerationModal.tsx)
- ✅ **Community Join Prompt** - Post-certification banner (src/pages/MyCertificates.tsx)

**Community Features (Completed Nov 4, 2025):**
- ✅ **Join/Leave Toggle** - LocalStorage-based membership with visual feedback (src/pages/CommunityJoin.tsx)
- ✅ **Create Post** - Share posts with community, auto-saves to localStorage (src/pages/CommunityDetail.tsx)
- ✅ **Comments & Likes** - Expandable comments, reactions (👍❤️😊), like counters (src/components/community/PostTimeline.tsx)
- ✅ **Live Q&A Panel** - Upcoming events sidebar with reminder functionality (src/pages/CommunityDetail.tsx)

**Status:** All 4 student journeys (A: Discovery, B/C: Enrollment, D: Certificates, E: Community) 100% implemented. Ready for demo.

See COMMUNITY_FEATURES_COMPLETION_REPORT.md for full details.

### Educator Journey Front-End Demo (Nov 4, 2025) - ✅ 100% COMPLETE
Completed ALL Educator Journey requirements (A-E) from PRD with localStorage and mock data:

**Landing & Onboarding (Journeys A & B):**
- ✅ **ForEducators Landing Page** - Hero, 3 benefits, features overview (src/pages/ForEducators.tsx)
- ✅ **Plan Selection Modal** - FREE/PRO/PREMIUM with fake Stripe (src/components/educator/PlanSelectionModal.tsx)
- ✅ **Educator Onboarding Form** - Name, photo, bio, expertise, teaching styles, content types (src/pages/EducatorOnboarding.tsx)
- ✅ **Sets educator role** - localStorage: userRole='educator', educatorPreviewMode='true'

**Dashboard & Course Creation (Journeys C & D):**
- ✅ **Educator Dashboard** - Onboarding checklist with 4 steps tracked via localStorage (src/pages/EducatorDashboard.tsx)
- ✅ **Stats Cards** - Students enrolled (156), Lessons completed (2,341), Avg rating (4.8), Revenue ($3,847)
- ✅ **5-Step Course Builder Wizard** - Type selection, details, pricing with fee calc, upload with fake thumbnails/captions, review (src/components/educator/CourseBuilderWizard.tsx)
- ✅ **Draft & Submit** - Save drafts or submit for review, updates checklist
- ✅ **Student Progress Table** - 8 mock students with progress bars, at-risk badges
- ✅ **Latest Questions Panel** - Discussion board questions from students

**Live Events (Journey E):**
- ✅ **Schedule Live Event Modal** - Title, date, time, duration, max attendees, course association, features (chat/Q&A/polls/recording) (src/components/educator/ScheduleLiveEventModal.tsx)
- ✅ **Live Event Broadcaster Page** - Video placeholder, "Go Live" button, attendee counter, chat/Q&A tabs with mock messages, "End Stream" (src/pages/LiveEventBroadcaster.tsx)
- ✅ **Post-Stream Success** - Recording processing message, stats (peak attendees, messages, questions), "Watch Replay" button

**Status:** All educator journeys (A: Landing, B: Onboarding, C: Course Builder, D/E: Dashboard+Stats, E: Live Events) 100% implemented. Ready for demo.

See EDUCATOR_JOURNEY_IMPLEMENTATION_PLAN.md for full details.

## Database Schema
Located in `shared/schema.ts` with these main tables:
- **profiles** - User accounts and roles
- **tracks** - Course tracks/programs
- **modules** - Course modules within tracks
- **lessons** - Individual lessons with content
- **enrollments** - User course enrollments
- **lesson_progress** - Lesson completion tracking
- **certifications** - Earned certificates
- **communities** - Learning communities
- **posts** - Community posts
- **digital_products** - Marketplace products
- **purchases** - Product purchases
- **stripe_connect_accounts** - Educator payment accounts
- **stripe_subscriptions** - User subscriptions
- **notifications** - User notifications
- **admin_roles** - Admin permissions
- **audit_logs** - System audit trail
- **quizzes** - Lesson quizzes
- **live_events** - Live streaming events

## API Endpoints
**Core Resources:**
- GET/POST `/api/profiles/:id`
- GET `/api/tracks` - List all active tracks
- GET `/api/tracks/:id` - Get track details
- GET `/api/tracks/:id/modules` - Get track modules
- GET `/api/modules/:id/lessons` - Get module lessons
- GET `/api/lessons/:id` - Get lesson details
- GET/POST `/api/enrollments/user/:userId`
- GET `/api/certifications/user/:userId`
- GET `/api/communities`
- GET/POST `/api/communities/:id/posts`
- GET `/api/products`
- GET `/api/notifications/user/:userId`

**Stripe (requires keys):**
- POST `/api/stripe/webhook` - Stripe webhook handler
- POST `/api/stripe/create-checkout` - Create checkout session
- POST `/api/stripe/create-connect-account` - Create educator account

## Environment Variables
**Database (configured):**
- DATABASE_URL
- PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

**Required for full functionality:**
- STRIPE_SECRET_KEY - For payment processing
- STRIPE_WEBHOOK_SECRET - For webhook verification
- (Optional) OPENAI_API_KEY - For AI features
- (Optional) RESEND_API_KEY - For email notifications

## Project Structure
```
├── server/              # Backend Express server
│   ├── index.ts        # Main server entry point
│   ├── routes.ts       # API route handlers
│   ├── storage.ts      # Database operations layer
│   ├── stripe-routes.ts # Stripe payment routes
│   ├── vite.ts         # Vite dev server integration
│   └── db.ts           # Database connection
├── shared/             # Shared types and schema
│   └── schema.ts       # Drizzle ORM schema
├── src/                # Frontend React app
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # External integrations
│   └── lib/            # Utilities
├── supabase/           # Legacy Supabase files (reference)
│   ├── migrations/     # SQL migrations (ported to Drizzle)
│   └── functions/      # Edge functions (partially ported)
└── package.json        # Dependencies and scripts
```

## Development Commands
```bash
npm run dev         # Start full-stack dev server (port 5000)
npm run build       # Build for production
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio (database GUI)
```

## Current Status
✅ **Backend**: Fully operational
✅ **Database**: Schema deployed and ready
✅ **Server**: Running on port 5000
⚠️ **Frontend**: Still using Supabase client - needs update to use Express API
⚠️ **Payments**: Stripe routes ready but require API keys
⚠️ **Edge Functions**: Basic routes created, complex functions (certificate generation, translations) pending

## Next Steps for Development
1. Update frontend to replace Supabase calls with fetch to Express API
2. Add Stripe API keys when ready to enable payments
3. Port remaining Supabase Edge Functions as needed
4. Test end-to-end user flows
5. Add authentication middleware to protect routes

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development
