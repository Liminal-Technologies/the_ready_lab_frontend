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

## Deployment Configuration
- **Start Script:** Added `"start": "tsx server/index.ts"` to package.json for production deployment
- **Build Script:** `"build": "vite build"` compiles the frontend assets
- **Development:** `npm run dev` runs both Express backend and Vite frontend with hot reloading

## Recent Updates (Nov 5, 2025)

### Pricing Page Complete Redesign
- Completely redesigned pricing page with modern, sophisticated layout
- **Modern Structure:**
  - Breadcrumb navigation (Home > Pricing) matching site design
  - Clean hero with billing toggle (Monthly/Annual with 17% savings badge)
  - Tab-based pricing for different user types (Students, Educators, Institutions)
  - Sophisticated card layouts with "Most Popular" badges
- **Pricing Plans:**
  - **Students:** Free tier + Pro tier ($29/mo or $290/yr)
  - **Educators:** Creator (free with 85% revenue share) + Pro Educator ($49/mo with 90% share)
  - **Institutions:** Enterprise custom pricing with feature showcase
- **Additional Sections:**
  - Payment methods grid (Credit Cards, Klarna, Afterpay, Affirm)
  - Modern FAQ accordion with 6 common questions
  - Final CTA card with gradient background
- **Visual Improvements:**
  - Consistent card styling with hover effects
  - Better typography hierarchy
  - Checkmark feature lists
  - Icon integration throughout
  - Responsive grid layouts

### Solutions Page Consolidation & Redesign
- Merged "For Institutions" and "Custom Solutions" pages into unified `/solutions` page
- **Modern Layout Redesign:**
  - Breadcrumb navigation (Home > Solutions) matching site design pattern
  - Clean hero section with gradient background and trust badge
  - Card-based layout for solution types with hover effects
  - Stats grid showcase (500+ orgs, 1M+ learners, 94% completion, 4.9/5 rating)
  - Consistent spacing and typography matching Explore/Community pages
- **Solution Types Section:**
  - Ready Lab for Institutions (marked "Most Popular") - Pre-built platform
  - Custom White-Label Solutions - Fully custom builds
  - Feature comparison with checkmark lists
  - Dual CTAs: "Request Demo" and "Discuss Custom Build"
- **Content Sections:**
  - Value propositions with icon cards (4 cards)
  - Enterprise features grid (3 features)
  - Final CTA card with gradient background
- **Navigation updates:**
  - Header: Single "Solutions" link replaces "For Institutions" and "Custom Solutions"
  - Mobile menu: Consolidated to single "Solutions" entry
- **Route redirects for backwards compatibility:**
  - `/for-institutions` → `/solutions`
  - `/custom-saas` → `/solutions`
  - `/custom` → `/solutions`

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
- **Navigation Unified:** Desktop and mobile both link directly to `/community` browse page
- **Create Community Button:** Purple-themed button in header area, navigates to `/community/create`
- Mobile navigation: Community button is purple when on community or feed page
- Note: `/feed` route redirects to Community page (replaced old LearningFeed)
- Old `/community/join` page removed in favor of unified browse experience

### Individual Course Detail Page
- Comprehensive course landing page with yellow (#E5A000) brand color throughout
- **Layout:**
  - Breadcrumb navigation (Home > Courses > Category > Course Title)
  - Hero section with gradient background featuring course image preview (desktop sticky)
  - Two-column layout: main content (left) + sticky enrollment sidebar (right)
- **Tabbed Content Sections:**
  - Overview: What You'll Learn, Course Description, Requirements, Course Stats, Live Events (when enrolled), Community Access
  - Curriculum: Expandable accordion modules with individual lessons, duration, lock/preview/completion states
  - Instructor: Profile with avatar, bio, rating, student count, course count
  - Reviews: Student testimonials with ratings, helpful/reply actions
- **Enrollment Sidebar:**
  - Preview image with play button
  - Pricing with BNPL options (Klarna, Afterpay, Affirm)
  - Yellow "Enroll Now" button for non-enrolled users
  - Green "Continue Learning" button with progress bar for enrolled users
  - Course features checklist (lifetime access, mobile/desktop, certificate, community, subtitles)
- **Interactive Elements:**
  - Live Events section shows upcoming Q&As and workshops (visible to enrolled students)
  - Community access button navigates to `/community` page
- **Similar Courses Section:** 3-card grid at bottom with course recommendations
- **Features:** 26 lessons across 4 modules, preview badges, lock icons, completion checkmarks
- Uses CSS variable `--primary` set to #E5A000 (HSL: 42, 100%, 45%) for brand consistency

### Course Lesson Player & Navigation System
- **Dynamic URL-Based Navigation:**
  - Lessons identified by `/courses/:courseId/lessons/:lessonId` route
  - currentLessonId derived from URL parameter, no hard-coded state
  - Sequential unlocking: lessons unlock when previous lesson completed
  - Completion tracking persisted in localStorage
- **Lesson Types:**
  - Video lessons: React Player with EN/ES captions and auto-caption support
  - Quiz lessons: Integrated QuizPlayer component using Supabase backend
  - Quiz format: 5 MCQ questions, 70% pass threshold, retries allowed
- **Progress Tracking:**
  - Auto-completion at 95% video playback
  - Manual "Mark Complete" button available
  - Completion state synced across desktop sidebar and mobile sheet
  - Green checkmarks show completed lessons
- **Navigation Controls:**
  - Desktop: Sidebar with collapsible modules, lesson buttons
  - Mobile: Sheet drawer with same lesson structure
  - "Next Lesson" button appears when current lesson completed
  - Next button navigates to URL of next lesson, closes mobile drawer
- **Visual States:**
  - Current lesson highlighted with primary yellow background
  - Locked lessons greyed out with lock icon, disabled buttons
  - Completed lessons show green checkmark
  - Quiz lessons indicated by type in lesson list

### Student Dashboard Redesign
- Complete dashboard overhaul with modern tab-based layout matching site design patterns
- **Layout Structure:**
  - Breadcrumb navigation (Home > Dashboard) consistent with site navigation
  - Increased top padding (py-16) for better visual hierarchy
  - Blue profile button (bg-blue-500 hover:bg-blue-600) for settings access
- **Tab Navigation:** Clean 5-tab interface with icons
  - **Overview Tab:** Quick stats cards (enrolled courses, certificates earned, learning hours), continue learning section, personalized course recommendations
  - **My Courses Tab:** Grid of enrolled courses with progress bars and "Continue Learning" CTAs
  - **Certificates Tab:** Certificate cards with verification badges, download/LinkedIn share actions
  - **Bookmarks Tab:** Saved lessons grid with quick access links
  - **Activity Tab:** Notifications feed with unread count badge, mark-as-read functionality
- **Real Data Integration:**
  - Supabase authentication and user profile
  - Enrollments with progress tracking from database
  - Bookmarks management with lesson details
  - Notifications system with read/unread states
  - Mock certificates stored in localStorage for demo
- **Responsive Design:** Mobile-first with responsive grids (sm, md, lg breakpoints)
- **Visual Features:** Yellow (#E5A000) for primary CTAs, card-based layouts, empty states for zero-data scenarios

### Brand Color System
- **Orange (#FF6B35):** Courses page theme
- **Green (#10A37F):** Explore page theme (learner brand color)
- **Purple (#9333EA):** Community page theme
- **Yellow (#E5A000):** Primary branding color for CTAs, Course Detail page, and default active states
- **Blue (#3B82F6):** Profile/settings button on dashboard
- **CSS Variables:** Primary color defined as HSL(42, 100%, 45%) in index.css for consistent theming
- Mobile navigation uses conditional colors based on active page