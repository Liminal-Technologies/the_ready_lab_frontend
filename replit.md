# The Ready Lab

## Overview

The Ready Lab is a digital prep school and learning management system (LMS) designed for growth-ready entrepreneurs. The platform enables students to discover and enroll in courses, earn certifications, and connect with a community. Educators can create and monetize courses, while institutions can deploy enterprise LMS solutions for their organizations.

The application serves three primary user types:
- **Students**: Browse courses, enroll, complete lessons, earn certifications, join communities
- **Educators**: Create courses, manage students, track revenue, host live events
- **Institutions**: Manage cohorts, bulk user imports, enterprise analytics

The platform includes a demo mode for investor presentations with mock authentication and pre-populated data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with SWC for fast compilation
- **Routing**: React Router for SPA navigation with role-based routes (`/student/*`, `/educator/*`, `/super-admin/*`)
- **State Management**: TanStack React Query for server state, React Context for auth and language
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **3D Elements**: React Three Fiber for interactive 3D components

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with tsx for direct execution
- **API Structure**: RESTful endpoints under `/api/*` prefix
- **Authentication**: Supabase Auth with JWT token verification
- **File Structure**: Server code in `/server`, shared types in `/shared`

### Data Layer
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `/shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema push and studio

### Key Design Patterns
- **Monorepo Structure**: Frontend (`/src`), backend (`/server`), shared code (`/shared`)
- **Path Aliases**: `@/*` for src, `@shared/*` for shared, `@assets/*` for attached assets
- **Demo Mode**: Mock authentication system for investor demos with pre-populated data
- **Role-Based Access**: Student, Educator, Admin, and Institution Admin roles with separate dashboards

### Build Configuration
- **Development**: `npm run dev` runs the Express server which serves Vite in middleware mode
- **Production**: Vite builds to `dist/public`, Express serves static files
- **Port**: 5000 (server), 8080 (Vite dev server when standalone)

## External Dependencies

### Authentication & Database
- **Supabase**: Authentication provider with email/OAuth support and user management
- **Neon Database**: Serverless PostgreSQL with WebSocket connections via `@neondatabase/serverless`

### Payments
- **Stripe**: Payment processing with Connect for educator payouts, subscription management, and webhook handling
- **Webhook Endpoint**: `/api/stripe/webhook` handles Stripe events

### Third-Party Integrations
- **Octokit**: GitHub API integration for potential repository management
- **PDFKit**: Server-side PDF generation for certificates
- **Canvas Confetti**: Celebration animations for course completion

### UI Components
- **Radix UI**: Full suite of accessible primitives (dialogs, dropdowns, tabs, etc.)
- **Lucide React**: Icon library
- **React Three Fiber/Drei**: 3D graphics capabilities

### Environment Variables Required
- `DATABASE_URL`: Neon PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API key for server-side operations
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification
- `SUPABASE_SERVICE_ROLE_KEY`: Admin access to Supabase