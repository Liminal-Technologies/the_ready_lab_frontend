# The Ready Lab - Learning Management System

## Overview
The Ready Lab is a comprehensive Learning Management System (LMS) designed to offer course management, certifications, community features, a digital products marketplace, live streaming capabilities, and multi-language support. Its purpose is to provide an all-encompassing educational platform for students, educators, and institutions, enabling discovery, enrollment, learning, and community engagement. The project aims to provide a modern, responsive, and feature-rich educational experience, with a business vision to serve as a digital prep school for growth-ready entrepreneurs.

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development

## Recent Bug Fixes (November 16, 2025)
- **Toast System**: Fixed duplicate toast notifications by consolidating to a single Sonner toaster component in App.tsx (removed duplicate instances from main.tsx)
- **Navigation**: Fixed Profile button navigation in Header to correctly route admin users to /admin and other authenticated users to /dashboard (which uses DashboardRouter for role-specific routing)
- **AI Chat Widget Button**: Achieved perfect circular shape by replacing shadcn Button component with native HTML button element to eliminate default padding, using explicit 90×90px dimensions with min constraints and rounded-full
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