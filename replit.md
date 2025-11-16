# The Ready Lab - Learning Management System

## Overview
The Ready Lab is a comprehensive Learning Management System (LMS) designed to offer course management, certifications, community features, a digital products marketplace, live streaming capabilities, and multi-language support. Its purpose is to provide an all-encompassing educational platform for students, educators, and institutions, enabling discovery, enrollment, learning, and community engagement. The project aims to provide a modern, responsive, and feature-rich educational experience.

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development

## Recent Changes (November 16, 2025)
- **Demo Polish & Micro-Interactions (COMPLETED - Session 3):**
  - **Confetti Celebration:** Installed canvas-confetti library and added celebratory animation on certificate downloads for memorable achievement moments
  - **Progress Milestone Toasts:** Added celebration notifications in Course Lesson Player at key milestones (25% 🌟, 50% 🔥, 75% 💪, 100% 🎓) with unique messages and 5-second duration
  - **Educator Dashboard Navigation:** Extended PageBreadcrumb component to Educator Dashboard for consistent wayfinding across all user journeys
  - **Educator Suggested Actions:** Added SuggestedActions component to Educator Dashboard with educator-specific guidance (Create Course, Schedule Event, View Analytics, Engage Students)
  - **Skeleton Loaders Verified:** Confirmed CourseCardSkeleton components properly implemented on Student Dashboard for optimal perceived performance during loading states
- **Investor Demo Improvements (COMPLETED - Session 2):**
  - **LinkedIn Certificate Sharing:** Added professional share button with pre-filled message including course title, certificate ID, verification URL, and hashtags - copies to clipboard and opens LinkedIn
  - **Enhanced Empty States:** Redesigned EmptyCourses, EmptyCertificates, and EmptyCommunity with glowing icons, dashed card borders, better copy, and clear CTAs
  - **Breadcrumb Navigation:** Created PageBreadcrumb component with auto-generation from routes, integrated into Student Dashboard for wayfinding
  - **Interactive Card Hover Effects:** Added card-interactive CSS utility class with elevation shadow and transform effects - applied to course cards, community posts, and community directory cards for consistent polish
  - **Suggested Next Actions:** Created reusable SuggestedActions component showing 4 contextual action cards on Student Dashboard to guide investors through user journeys (Browse Courses, Join Community, Attend Events, Earn Certificates)
- **Duplicate Toast Fix (COMPLETED):**
  - Fixed duplicate "Welcome back!" notification popups appearing on login
  - Root cause: Double-clicking submit button before auth loading state updated
  - Solution: Added local `isSubmitting` state to LoginForm for immediate button disabling
  - Submit button now disabled instantly when clicked, preventing double-submission
  - Both toast systems (shadcn/ui Toaster and Sonner) preserved to avoid breaking existing features
  - App uses both systems: Sonner (8 files, mainly auth) and shadcn/ui toast (33 files, rest of app)
- **Logo Update (COMPLETED):**
  - Replaced old BookOpen icon + text logo with new "THE READY LAB" branded logo throughout the site
  - Added @assets alias to vite.config.ts for easy logo importing
  - Updated Header: Logo sized to h-16 (64px) with optimized navbar padding (py-2)
  - Updated Footer: Logo sized to h-12 (48px) for appropriate footer display
  - Maintained all existing hover effects (opacity transitions) and navigation functionality
  - Logo displays consistently across all pages with yellow branding and trapezoid frame design

## Previous Changes (November 15, 2025)
- **Demo Click-Through Signup (COMPLETED):**
  - Converted signup flow to pure demo mode using mock authentication
  - No Supabase authentication required - instant click-through experience
  - Free plans: Fill form → instant dashboard redirect (no popups, no waiting)
  - Paid plans: Fill form + payment details → instant dashboard redirect
  - Payment validation still active for UX (validates card format before proceeding)
  - Uses existing mock auth system for instant session creation
  - Perfect for demos: Zero notifications, zero wait time, zero friction
  - Flow: /pricing → select plan → fill form → [payment validation if paid] → instant dashboard redirect
  - Clean UX: No toast notifications or confirmation screens during signup
- **Pricing-First Signup Flow (COMPLETED):**
  - Redesigned signup flow to route users through pricing page first
  - "Sign Up" buttons in Header and LoginForm now navigate to /pricing instead of opening modal directly
  - Pricing page plan selection opens signup modal with selected plan pre-filled (name, price, role, billing cycle)
  - SignupForm displays plan summary at top showing plan details and pricing
  - Payment UI integrated for paid plans: card number, expiry date (MM/YY), CVC fields
  - Strict payment validation: card number (13-16 digits), expiry month (01-12), CVC (3-4 digits)
  - All payment inputs sanitize to digits-only in real-time (no alphabetic characters allowed)
  - Payment-first logic: For paid plans → validate payment → simulate processing (2s) → create account → auto-login
  - Free tier flow: Bypasses payment, goes directly to account creation → auto-login
  - State management: Payment fields reset when plan changes, role resets when no plan selected
  - Error handling: Payment failures shown inline with clear error messages and toast notifications
  - Complete user journey: Click "Sign Up" → /pricing → select plan → fill form → payment (if paid) → account created → auto-login → dashboard
  - TODO: Replace simulated payment with actual Stripe checkout integration

## Previous Changes (November 15, 2024)
- **Secure Profile Creation Fix (COMPLETED):**
  - Fixed profile creation issue caused by Supabase Auth and Neon DB being separate databases
  - Created secure server-side endpoint `/api/profiles/create-on-signup` with JWT verification
  - Server verifies Supabase tokens using SUPABASE_SERVICE_ROLE_KEY before creating profiles
  - Role sanitization: only 'student' or 'educator' roles allowed, preventing privilege escalation
  - User ID derived from verified JWT token, not client-supplied data
  - Profile created in Neon DB immediately after Supabase user creation during signup
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