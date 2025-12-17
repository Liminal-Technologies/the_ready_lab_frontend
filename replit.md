# The Ready Lab

## Overview

The Ready Lab is a digital prep school platform designed for growth-ready entrepreneurs. It's a full-stack EdTech application that enables students to take courses, earn certifications, and connect with a community, while educators can create and monetize their expertise. The platform also supports institutional/enterprise customers with bulk learning management features.

The application is built as a React frontend with an Express backend, using PostgreSQL (via Neon serverless) for data persistence. It integrates with Supabase for authentication and Stripe for payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **State Management**: React Query for server state, React Context for global app state (auth, language, demo experience)
- **Routing**: React Router v6 with role-based route protection
- **3D Graphics**: React Three Fiber and Drei for any 3D elements

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript executed via tsx
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon serverless PostgreSQL (connection pooling via WebSocket)

### Authentication & Authorization
- **Provider**: Supabase Auth (handles user signup, login, session management)
- **Token Verification**: Server-side verification of Supabase JWT tokens
- **Role System**: Multi-role support (student, educator, admin) with role guards
- **Demo Mode**: Mock authentication system for investor demos that bypasses real auth

### Data Storage
- **Primary Database**: PostgreSQL via Neon serverless
- **Schema Location**: `shared/schema.ts` defines all tables using Drizzle
- **Key Entities**: profiles, tracks (courses), modules, lessons, enrollments, certifications, communities, posts, digital products, notifications
- **Migrations**: Drizzle Kit for schema push and studio

### Key Design Patterns
- **Shared Schema**: Database schema in `shared/` directory is accessible to both frontend and backend
- **Storage Layer**: Abstracted storage interface (`IStorage`) in `server/storage.ts` for database operations
- **Path Aliases**: `@/` maps to `src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`
- **Demo Experience**: Context-based demo orchestration system for guided walkthroughs

### Multi-Role Dashboards
- **Student Dashboard**: Course progress, enrollments, certifications, community access
- **Educator Dashboard**: Course creation, student analytics, revenue tracking, live events
- **Admin Dashboard**: Platform-wide user management, course moderation, payments, institutions
- **Institution Dashboard**: Cohort management, bulk user imports, analytics

## External Dependencies

### Authentication & User Management
- **Supabase**: Primary authentication provider, user session management, and profile storage
- **Environment Variables**: `SUPABASE_SERVICE_ROLE_KEY` for server-side admin operations

### Payment Processing
- **Stripe**: Payment processing for course purchases and educator subscriptions
- **Stripe Connect**: Educator payout management
- **Environment Variables**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Webhook Handling**: Raw body parsing for Stripe webhook signature verification

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Environment Variables**: `DATABASE_URL` for connection string
- **WebSocket**: Uses `ws` package for Neon's serverless driver

### PDF Generation
- **PDFKit**: Server-side certificate generation for course completions

### Third-Party Integrations (Stubbed)
- **Email/CRM**: Klaviyo, Mailchimp, HubSpot, Salesforce integration stubs ready for implementation
- **GitHub**: Octokit REST client included for potential GitHub integrations

### Frontend Libraries
- **Canvas Confetti**: Celebration animations for course completions
- **React Query**: Data fetching and caching
- **Zod**: Schema validation (used with Drizzle insert schemas)