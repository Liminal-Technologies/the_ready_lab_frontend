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
- All original content maintained: courses, communities, learning styles
- Added proper padding between header and page content

### Explore Page Redesign (Green Theme)
- Complete redesign with LinkedIn Learning-inspired layout
- **Green theme (#10A37F)** throughout to match learner branding
- Moved micro-learning feed from Courses to Explore (6 bite-sized lessons)
- Similar layout to Courses page: breadcrumb, search, sidebar filters, content grid
- Interest-based filtering: Funding, Business, Branding, AI, Marketing, Operations, Leadership, Technology, Design
- Added community poll with green progress bars
- Live events section showcasing upcoming Q&A sessions and workshops
- Featured resources section for downloadable templates
- Bookmark functionality for lessons
- Green CTA banner linking to full courses
- Mobile navigation: Explore button is green when on explore page

### Community Page (Purple Theme)
- Complete community browsing page with purple theme (#9333EA)
- Accessible at both `/community` and `/feed` routes
- Similar layout to Courses and Explore pages: breadcrumb, search, sidebar filters, content grid
- Topic-based filtering: Funding, Legal, Marketing, Infrastructure, Branding, Finance, AI, Operations
- Community cards showing:
  - Community icon/image
  - Member count and activity (posts today)
  - Open/Private badges
  - Join status indicators
- Trending discussions sidebar
- Filter by type: Private Only, My Communities
- Purple CTA banner linking to courses
- Mobile navigation: Community button is purple when on community or feed page
- Note: `/feed` route redirects to Community page (replaced old LearningFeed)

### Brand Color System
- **Orange (#FF6B35):** Courses page theme
- **Green (#10A37F):** Explore page theme (learner brand color)
- **Purple (#9333EA):** Community page theme
- **Yellow (#E5A000):** Primary branding color for CTAs and default active states
- Mobile navigation uses conditional colors based on active page