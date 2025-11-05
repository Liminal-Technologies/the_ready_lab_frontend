# The Ready Lab - Learning Management System

## Overview
The Ready Lab is a comprehensive Learning Management System (LMS) designed to offer course management, certifications, community features, a digital products marketplace, live streaming capabilities, and multi-language support (EN, ES, FR, PT, AR, ZH). Its purpose is to provide an all-encompassing educational platform for students, educators, and institutions, enabling discovery, enrollment, learning, and community engagement.

## User Preferences
- Focusing on UI work first, backend infrastructure complete
- Stripe integration to be improved later
- Prefers minimal API keys for initial development

## System Architecture
The project is built as a full-stack monorepo. The frontend utilizes React with TypeScript, Vite, TailwindCSS, and shadcn/ui for a modern and responsive user interface. The backend is powered by Express.js and TypeScript, providing RESTful API services. Data persistence is handled by Neon PostgreSQL, accessed via Drizzle ORM. Stripe is integrated for payment processing, including Connect for educators and Subscriptions/Products for users. The development environment supports hot reloading for efficient iteration.

**Key Features Implemented (Frontend Demo Ready):**

*   **Student Journeys:** Includes comprehensive flows for course discovery, enrollment, certificate generation with LinkedIn sharing, and interactive community features (join/leave, post creation, comments, likes, live Q&A).
*   **Educator Journeys:** Features a dedicated landing page, onboarding process, a dashboard with stats, a 5-step course builder wizard, and live event scheduling/broadcasting capabilities.
*   **Institution Journeys:** Provides a landing page for inquiries, a request demo modal, and an admin dashboard for CSV uploads, cohort management, and report generation.
*   **Browse/Course Catalog:** A unified browsing experience with search, category chips, advanced filters (price, level, format), sorting, and pagination. Includes micro-learning feeds, community showcases, learning style explanations, and a CTA banner.

## External Dependencies
*   **Database:** Neon PostgreSQL
*   **ORM:** Drizzle ORM
*   **Payments:** Stripe (Connect, Subscriptions, Products APIs)
*   **(Optional) AI Features:** OpenAI (requires API key)
*   **(Optional) Email Notifications:** Resend (requires API key)

## Recent Updates (Nov 5, 2025)

### Courses Section Unified
- Replaced old `/courses` page with enhanced Browse experience
- Both `/courses` and `/browse` now show the same advanced filtering interface
- All original content maintained: courses, micro-learning feed, communities, learning styles

### Brand Color Refinements
- Bottom CTA banner button changed from orange to branding yellow (#E5A000)
- Removed top margin/curve from banner for edge-to-edge design
- Removed certificate icon from bottom CTA banner
- Condensed banner height from py-16 to py-12 for more compact design
- Removed rounded top curve from Courses & More section for cleaner appearance
- Mobile navigation: Courses button is orange when on courses page, yellow on all other pages