# The Ready Lab - Learning Management System

## Overview
The Ready Lab is a comprehensive Learning Management System (LMS) designed to offer course management, certifications, community features, a digital products marketplace, live streaming capabilities, and multi-language support. Its purpose is to provide an all-encompassing educational platform for students, educators, and institutions, enabling discovery, enrollment, learning, and community engagement. The project aims to provide a modern, responsive, and feature-rich educational experience, with a business vision to serve as a digital prep school for growth-ready entrepreneurs.

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development

## Recent Changes

### Demo Student Reset Feature (November 19, 2025 - Late Evening)
Implemented automatic localStorage cleanup for demo student accounts:
- **Auto-Reset on Login**: Student demo accounts now start fresh on every login, clearing all previous progress
- **Utility Function**: Created `clearDemoStudentData()` utility that removes student-specific localStorage keys (course progress, enrollments, onboarding, communities)
- **Selective Cleanup**: Only triggers for student role logins - educator/admin demo data remains intact
- **Demo Flow**: Enables repeatable demonstrations of the full student journey (discovery → enrollment → learning → completion → certification)
- **"Start Your Journey" Button**: Now navigates directly to pricing page instead of opening signup modal
- **Files Modified**: `src/utils/clearDemoData.ts` (new), `src/hooks/useMockAuth.ts`, `src/components/Hero.tsx`

### Lesson Progress Persistence (November 19, 2025 - Late Evening)
Implemented localStorage-based lesson progress persistence for complete quiz-to-unlock flow:
- **Backend API Routes**: Added GET/PUT endpoints for lesson progress tracking (future database integration ready)
- **localStorage Implementation**: Progress persists across page refreshes using course-specific keys (course-{id}-completed-lessons, course-{id}-shown-milestones)
- **Cross-Course Isolation**: Fixed state leakage bug - each course maintains separate progress when navigating between courses
- **Quiz Unlocking**: Completing quizzes correctly unlocks next lessons with progress persistence
- **Error Handling**: Added try/catch for malformed localStorage entries with graceful fallback
- **Demo Ready**: Works immediately without authentication or database setup for tech demos

### Student Journey Features (November 19, 2025 - Evening)
Enhanced demo experience with payment UI and verified Journey C & D features:
- **Payment Modal Re-enabled**: Paid courses now show FakeStripeCheckoutModal UI for visual demonstration while maintaining instant processing (800ms)
- **Journey B (Payment Flow)**: Shows payment options (Pay in Full, BNPL) with instant demo processing for investor presentations
- **Journey C (Learn & Complete)**: Verified full functionality - video player, notes, interactive quizzes with confetti, AI chat widget with contextual mock responses
- **Journey D (Earn Certificate)**: Verified auto-generation at 100% completion, LinkedIn sharing, QR verification, PDF download
- **Demo Guide Updated**: DEMO_GUIDE_STUDENT_JOURNEY.md now accurately reflects instant payment processing

### Demo Mode Implementation (November 19, 2025 - Morning)
Implemented complete password-free and payment-free demo mode for tech demos and investor presentations:
- **Simplified Signup**: Removed password, confirmPassword, and payment card fields from SignupForm - users only need name and role selection
- **Simplified Login**: Removed password field from LoginForm - accepts any email/input for instant demo login with informative banner
- **Demo Indicators**: Added subtle blue info banners in signup and login forms to indicate demo environment

### Bug Fixes (November 16, 2025)
- **Toast System**: Fixed duplicate toast notifications by consolidating to a single Sonner toaster component in App.tsx (removed duplicate instances from main.tsx)
- **Navigation**: Fixed Profile button navigation in Header to correctly route admin users to /admin and other authenticated users to /dashboard (which uses DashboardRouter for role-specific routing)
- **AI Chat Widget Button**: Achieved perfect circular shape by replacing shadcn Button component with native HTML button element to eliminate default padding, using explicit 60×60px dimensions with min constraints and rounded-full
- **AI Chat Window Desktop**: Fixed desktop height overflow by adding responsive max-height constraint `lg:max-h-[calc(100vh-100px)]` while maintaining 500px height for better viewport fit
- **AI Chat Popup Mobile**: Fixed mobile layout overflow by restructuring with flexbox - reduced mobile height to 450px while maintaining 500px on desktop, ensuring all sections (header, messages, suggestions, input) remain accessible
- **Mobile Navigation**: Fixed Profile button in mobile bottom nav to use role-based routing matching Header logic (admins → /admin, others → /dashboard)

## System Architecture
The project is built as a full-stack monorepo with a frontend utilizing React, TypeScript, Vite, TailwindCSS, and shadcn/ui. The backend is powered by Express.js and TypeScript, providing RESTful API services. Data persistence is handled by Neon PostgreSQL, accessed via Drizzle ORM. Stripe is integrated for payment processing.

### UI/UX Design
The platform features modern, sophisticated layouts with consistent design systems across all dashboards (Educator, Admin, Institution, Student). It employs a brand color system with dedicated themes, a responsive, mobile-first approach with grid layouts, and incorporates breadcrumb navigation, tab-based interfaces, and interactive elements. A key UI/UX decision is the mobile navigation with a bottom bar that auto-hides on scroll.

### Core Feature Implementations
The system supports distinct user journeys:
*   **Student Journeys:** Course discovery, enrollment, certificate generation with LinkedIn sharing, interactive community features, and a tab-based dashboard.
*   **Educator Journeys:** Dedicated landing page, onboarding, dashboard with stats, a 5-step course builder wizard, and live event scheduling/broadcasting.
*   **Institution Journeys:** Landing page, demo requests, and an admin dashboard for CSV uploads, cohort management, and report generation.
*   **Course Management:** Unified browsing experience with search, filters, sorting, pagination, micro-learning feeds, community showcases, and comprehensive course detail pages with tabbed content and sticky enrollment sidebars.
*   **Learning Experience:** Dynamic lesson player with URL-based navigation, sequential lesson unlocking, video and quiz lesson types, progress tracking, and resource downloads.
*   **Pricing & Solutions:** A redesigned pricing page with billing toggles and tab-based pricing for different user types, and a consolidated solutions page with card-based layouts.
*   **Authentication Flow:** Implemented a secure and robust authentication system with email confirmation, role-based routing, and a demo mode for simplified showcases.

### Technology Stack
*   **Frontend:** React, TypeScript, Vite, TailwindCSS, shadcn/ui
*   **Backend:** Express.js, TypeScript
*   **Database:** Neon PostgreSQL
*   **ORM:** Drizzle ORM
*   **Payment Processing:** Stripe

## External Dependencies
*   **Database:** Neon PostgreSQL
*   **ORM:** Drizzle ORM
*   **Payments:** Stripe (Connect, Subscriptions, Products APIs)
*   **(Optional) AI Features:** OpenAI
*   **(Optional) Email Notifications:** Resend