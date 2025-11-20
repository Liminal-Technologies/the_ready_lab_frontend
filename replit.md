# The Ready Lab - Learning Management System

## Overview
The Ready Lab is a comprehensive Learning Management System (LMS) designed to offer course management, certifications, community features, a digital products marketplace, live streaming capabilities, and multi-language support. Its purpose is to provide an all-encompassing educational platform for students, educators, and institutions, enabling discovery, enrollment, learning, and community engagement. The project aims to provide a modern, responsive, and feature-rich educational experience, with a business vision to serve as a digital prep school for growth-ready entrepreneurs.

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development

## System Architecture
The project is built as a full-stack monorepo with a frontend utilizing React, TypeScript, Vite, TailwindCSS, and shadcn/ui. The backend is powered by Express.js and TypeScript, providing RESTful API services. Data persistence is handled by Neon PostgreSQL, accessed via Drizzle ORM. Stripe is integrated for payment processing.

### UI/UX Design
The platform features modern, sophisticated layouts with consistent design systems across all dashboards (Educator, Admin, Institution, Student). It employs a brand color system with dedicated themes, a responsive, mobile-first approach with grid layouts, and incorporates breadcrumb navigation, tab-based interfaces, and interactive elements. A key UI/UX decision is the mobile navigation with a bottom bar that auto-hides on scroll.

### Core Feature Implementations
The system supports distinct user journeys:
*   **Student Journeys:** Course discovery, enrollment, certificate generation with LinkedIn sharing, interactive community features, and a tab-based dashboard.
*   **Educator Journeys:** Complete end-to-end journey with full localStorage persistence:
    - **Onboarding**: 4-step wizard with profile setup, teaching preferences, and payout configuration
    - **Course Creation**: 6-step builder wizard with curriculum management, pricing configuration, publishing controls, and success screen
    - **Course Management**: Edit (ID preservation), publish/unpublish toggle, delete with confirmation, duplicate courses
    - **Student-Facing Integration**: Educator courses appear in browse/search, enrollable by students, playable with progress tracking
    - **Analytics & Revenue**: Real-time dashboards showing student progress (active/at-risk/completed), revenue metrics (this month/all-time/pending), transaction history, and course performance breakdowns
    - **Data Flow**: Complete reactivity from course creation → publishing → student enrollment → progress tracking → analytics/revenue updates
    - **Demo Mode Journey**: Homepage "Start Your Journey" → Pricing Page → "Start Educator Demo" button → Auto-login as Dr. Sarah Chen → Pre-filled Onboarding → Dashboard → Pre-filled Course Builder → Pre-filled Schedule Event → Publish → Success Screen (stays visible) → Analytics
    - **Demo Recording Features**: Reactive form pre-filling using Zustand store (useMockAuth), forms auto-reset on logout, dedicated demo CTA on pricing page, auto-enrollment of Alex Morgan (15% progress, $99 payment) when course published, success screen stays visible for presenters to showcase
*   **Institution Journeys:** Landing page, demo requests, and an admin dashboard for CSV uploads, cohort management, and report generation.
*   **Course Management:** Unified browsing experience with search, filters, sorting, pagination, micro-learning feeds, community showcases, and comprehensive course detail pages with tabbed content and sticky enrollment sidebars. Educator-created courses are merged with mock courses and are searchable/filterable.
*   **Learning Experience:** Dynamic lesson player with URL-based navigation, sequential lesson unlocking (cross-module support), dual-type ID support (UUID/numeric), video and quiz lesson types, progress tracking (localStorage-based persistence with hardened parsing), and resource downloads. Includes robust progress tracking and certificate generation upon completion.
*   **Community Features:** A fully functional community feed with post creation, live event banners, and post interactions (like, comment, reactions) with localStorage persistence.
*   **Pricing & Solutions:** A redesigned pricing page with billing toggles and tab-based pricing for different user types, and a consolidated solutions page with card-based layouts.
*   **Authentication Flow:** Implemented a secure and robust authentication system with email confirmation, role-based routing, and a demo mode for simplified showcases (password-free and payment-free). Student demo accounts automatically reset on login.

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