# The Ready Lab - Learning Management System

## Overview
The Ready Lab is a comprehensive Learning Management System (LMS) designed to offer course management, certifications, community features, a digital products marketplace, live streaming capabilities, and multi-language support. Its purpose is to provide an all-encompassing educational platform for students, educators, and institutions, enabling discovery, enrollment, learning, and community engagement. The project aims to provide a modern, responsive, and feature-rich educational experience.

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development

## Recent Changes (November 15, 2024)
- **Email Confirmation Flow (COMPLETED):**
  - Implemented production-ready email confirmation system with Supabase
  - Created EmailConfirmation component with "Check your email" screen, resend functionality, and 60-second cooldown
  - Built ConfirmEmail page that handles email link callbacks, validates tokens, and establishes authenticated sessions
  - Updated SignupForm to show confirmation screen after signup instead of auto-redirect
  - Updated LoginForm to detect unconfirmed emails and offer resend option
  - Added /confirm-email route for handling Supabase email confirmation callbacks
  - Complete flow: Signup → confirmation screen → click email → session established → role-based dashboard redirect
  - Proper error handling: expired/invalid tokens show helpful recovery options
  - Both student and educator roles fully supported with correct dashboard routing
- **Authentication & User Flow Fixes (COMPLETED):**
  - Fixed Supabase Auth integration: Created SQL script to properly configure `handle_new_user` trigger for automatic profile creation
  - Resolved "PGRST116: The result contains 0 rows" error on signup by ensuring profiles table is populated via trigger
  - Implemented robust error handling: Profile fetch retries with exponential backoff, errors properly propagate to UI
  - Fixed signup flow: Toast and redirect only occur after auth.user is confirmed (no silent failures)
  - Role-based routing: Students → /student-dashboard, Educators → /educator-dashboard
  - Fixed pricing page CTAs (PricingHero, StudentPlans, EducatorPlans) to check auth state before showing signup
  - Logged-in users now redirected to their role-specific dashboard instead of seeing signup modal
  - Button text dynamically changes: "Get Started" → "Go to Dashboard" for authenticated users
  - Educator plan modal properly integrated with auth flow (no duplicate toasts)
- **Demo Mode Architecture:** Implemented comprehensive demo system with mock authentication and data services
  - Created `useMockAuth` hook with role switcher (Super Admin, Admin, Educator, Student)
  - Built MockApi service with seed data for communities, users, courses, certificates, events
  - Added integration stubs: StripeStub (payment processing), EmailCrmStub (email/CRM providers)
  - Implemented service layer pattern (AdminDataService interfaces) for dual-mode support (real Supabase vs mock data)
  - Created RoleSwitcher component for top nav with demo mode toggle
  - Added ConfirmDialog component for destructive actions with typed confirmation requirement
- **Navigation Fixes:** All course/pricing/browse buttons now scroll to top of destination pages

## System Architecture
The project is built as a full-stack monorepo. The frontend utilizes React with TypeScript, Vite, TailwindCSS, and shadcn/ui. The backend is powered by Express.js and TypeScript, providing RESTful API services. Data persistence is handled by Neon PostgreSQL, accessed via Drizzle ORM. Stripe is integrated for payment processing.

**Key Architectural Decisions & Features:**

*   **UI/UX Design:**
    *   Modern, sophisticated layouts with consistent design systems across all dashboards (Educator, Admin, Institution, Student).
    *   Brand color system with dedicated themes for different sections: Orange (Courses), Green (Explore/Learner), Purple (Community), Yellow (Primary/CTAs/Course Detail), Blue (Profile).
    *   Responsive design with mobile-first approach and grid layouts (sm, md, lg breakpoints).
    *   Breadcrumb navigation, tab-based interfaces, and interactive elements (e.g., accordions, progress bars, hover effects).
    *   **Mobile Navigation:** Bottom navigation bar with 5 tabs (Home, Explore, Courses, More, Profile). Auto-hide scroll behavior hides the nav when scrolling down and shows it when scrolling up for improved content visibility. "More" button opens a bottom sheet with links to secondary pages (Solutions, Pricing, Community, Resources, Settings, Terms, Privacy).
*   **Core Feature Implementations:**
    *   **Student Journeys:** Course discovery, enrollment, certificate generation with LinkedIn sharing, interactive community features (post creation, comments, likes, live Q&A).
    *   **Educator Journeys:** Dedicated landing page, onboarding, dashboard with stats, 5-step course builder wizard, live event scheduling/broadcasting.
    *   **Institution Journeys:** Landing page, demo request, admin dashboard for CSV uploads, cohort management, and report generation.
    *   **Browse/Course Catalog:** Unified browsing experience with search, categories, advanced filters, sorting, pagination, micro-learning feeds, and community showcases.
    *   **Pricing Page:** Redesigned with a modern layout, billing toggles, tab-based pricing for different user types (Students, Educators, Institutions), and FAQ section.
    *   **Solutions Page:** Consolidated "For Institutions" and "Custom Solutions" into a unified page with card-based layouts and feature comparisons.
    *   **Course Detail Page:** Comprehensive landing page with tabbed content (Overview, Curriculum, Instructor, Reviews), sticky enrollment sidebar with BNPL options, and interactive elements like live events and community access.
    *   **Course Lesson Player:** Dynamic URL-based navigation, sequential lesson unlocking, video and quiz lesson types, progress tracking (auto-completion, manual mark complete), and resource downloads.
    *   **Student Dashboard:** Tab-based layout with sections for Overview, My Courses, Certificates, Bookmarks, and Activity. Includes an interactive welcome tour.
    *   **Educator Preview Mode:** Allows educators to experience student journeys before course creation, with visual indicators and a CTA to create courses.
    *   **Email Notification System (Mock):** Toast-based confirmations for key user actions (e.g., certificate generation, event registration) to demonstrate email touchpoints.
*   **Technology Stack:**
    *   Frontend: React, TypeScript, Vite, TailwindCSS, shadcn/ui
    *   Backend: Express.js, TypeScript
    *   Database: Neon PostgreSQL
    *   ORM: Drizzle ORM
    *   Payment Processing: Stripe

## External Dependencies
*   **Database:** Neon PostgreSQL
*   **ORM:** Drizzle ORM
*   **Payments:** Stripe (Connect, Subscriptions, Products APIs)
*   **(Optional) AI Features:** OpenAI
*   **(Optional) Email Notifications:** Resend