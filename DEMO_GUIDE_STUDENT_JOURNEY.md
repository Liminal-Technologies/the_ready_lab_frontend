# Student Journey Demo Guide

**Last Updated:** November 19, 2025  
**Purpose:** Quick 2-3 minute demos for each journey (10-15 min total)  
**Demo Mode:** Mock authentication - all forms accept any input

---

## Overview

The Ready Lab is a digital prep school for growth-ready entrepreneurs. This guide covers 5 student journeys, each designed as a **2-3 minute walkthrough** focusing on key features only.

### Mock Authentication
- ✅ All signup/login forms accept any input (no validation)
- ✅ No email verification required
- ✅ Pre-populated with demo data
- ✅ Perfect for investor presentations

---

## Journey A: Discovery → First Lesson (2-3 min)

**Shows:** Signup, onboarding, course discovery, enrollment, first lesson

### Quick Demo Script
> "Let me show you how a new student discovers courses and starts learning in under 2 minutes..."

### Steps

**1. Homepage → Signup (30 sec)**
- Go to `/`
- Click **"Sign Up"** (top-right yellow button)
- Fill in any values:
  - Name: "Alex Demo"
  - Email: "alex@example.com"
  - Password: "password"
  - Role: **Student**
- Click **"Sign Up"**
- ✅ Redirects to onboarding at `/onboarding`

**2. Onboarding - 3 Steps (1 min)**

**Step 1: Select Interests**
- Click 3-4 interest cards (Funding, Business, Marketing, etc.)
- Click **"Next"**

**Step 2: Choose Language**
- Select **English** (or Español to show multi-language)
- Click **"Next"**

**Step 3: Set Experience Level**
- Select **"Getting Started"**
- Click **"Complete Setup"**
- ✅ Redirects to personalized dashboard

**3. Browse & Enroll (30 sec)**
- Dashboard shows **"Recommended for You"** courses based on interests
- Click on **"Business Plan Fundamentals"** course card
- Click **"Enroll for Free"** button
- ✅ Toast: "Successfully enrolled!"

**4. Start First Lesson (30 sec)**
- Click **"Start Learning"** button
- ✅ Redirects to lesson player at `/courses/:id/lessons/:lessonId`
- Video auto-plays
- Progress bar shows "Lesson 1 of 8"

### Key Features
- 🎯 Interest-based personalization
- 🌍 Multi-language support (English, Spanish)
- 📚 Instant course enrollment
- 🎥 Clean video player UI

---

## Journey B: Course Enrollment Options (2-3 min)

**Shows:** Free vs. paid courses, BNPL checkout, access granted

### Quick Demo Script
> "Students can enroll in free courses instantly or purchase premium courses with Buy Now Pay Later options..."

### Steps

**1. Browse Paid Course (30 sec)**
- Go to `/courses`
- Filter by **"Paid"** or browse catalog
- Click **"Grant Writing Mastery"** (premium course)
- Course detail page shows:
  - Price: **$199** (or $67/month × 3 with BNPL)
  - What's included: 12 lessons, certificate, AI coaching
  - Instructor info
  - Reviews: 4.8 ⭐ (124 reviews)

**2. Enroll with Payment (1 min)**
- Click **"Enroll Now - $199"** button
- **Checkout modal** opens with 2 tabs:
  - **Pay in Full** ($199)
  - **Pay Over Time** ($67/month × 3) ← Select this

**3. BNPL Checkout (1 min)**
- **Payment schedule preview:**
  - Today: $67
  - 30 days: $67
  - 60 days: $67
  - Total: $201 (includes $2 processing fee)
- Click **"Continue to Payment"**
- **Stripe Checkout** opens (in demo mode, use test card)
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/26`)
- CVC: Any 3 digits (e.g., `123`)
- Click **"Pay $67"**

**4. Access Granted (30 sec)**
- ✅ Success page: "Payment Successful! 🎉"
- ✅ Course unlocked immediately
- Click **"Start Learning"**
- ✅ Redirects to first lesson

### Key Features
- 💳 Stripe integration (real payment processing)
- 📅 Buy Now Pay Later (3-month installments)
- ⚡ Instant course access after payment
- 🧾 Email receipt sent (in production)

---

## Journey C: Learn & Complete (2-3 min)

**Shows:** Video player, notes, quizzes, AI coach, progress tracking

### Quick Demo Script
> "The learning experience is designed for engagement with video lessons, interactive quizzes, AI coaching, and note-taking..."

### Steps

**1. Watch Video Lesson (30 sec)**
- In lesson player (`/courses/:id/lessons/:lessonId`)
- Video plays with controls:
  - Play/pause
  - Playback speed (1x, 1.5x, 2x)
  - Fullscreen
  - Volume
- **Progress bar** updates in real-time (shows % complete)
- **Sidebar** shows lesson list with checkmarks for completed lessons

**2. Take Notes (30 sec)**
- Click **"Notes"** tab (right sidebar)
- Type a note: "Key takeaway: Always validate problem before solution"
- Click **"Save Note"** button
- ✅ Note saved with timestamp
- Notes sync across devices (in production)

**3. Complete Quiz (1 min)**
- Click **"Next Lesson"** → Navigates to Quiz lesson
- Quiz interface shows:
  - Question 1 of 5
  - Multiple choice options (A, B, C, D)
- Select answer for each question
- Click **"Submit Quiz"**
- ✅ Results: "4/5 correct - 80% (Passing score: 70%)"
- ✅ Green confetti animation 🎉
- ✅ Lesson marked complete

**4. Ask AI Coach (30 sec)**
- Click **AI Chat button** (floating bottom-right, 60×60px circular)
- Chat window opens
- Type question: "How do I validate my business idea?"
- AI responds with personalized advice based on course context
- Can continue conversation
- Click **X** to close chat

### Key Features
- 🎥 Professional video player
- 📝 Note-taking with sync
- ✅ Interactive quizzes with instant feedback
- 🤖 AI coaching contextual to current lesson
- 📊 Real-time progress tracking

---

## Journey D: Earn Certificate (2-3 min)

**Shows:** Certificate generation, LinkedIn sharing, QR verification

### Quick Demo Script
> "When students complete all lessons and quizzes, they earn a verified certificate they can share on LinkedIn..."

### Steps

**1. Complete Final Lesson (30 sec)**
- Navigate to last lesson in course
- Complete video or quiz
- ✅ Progress bar hits **100%**
- ✅ **Certificate modal** auto-opens

**2. Certificate Generation (30 sec)**
- Modal shows:
  - **"Congratulations! 🎉"**
  - Certificate preview with:
    - Student name
    - Course title
    - Completion date
    - THE READY LAB branding
    - Verification QR code
- Click **"View Certificate"** button

**3. Certificate Detail Page (1 min)**
- Redirects to `/certificates/:id`
- **Full certificate display:**
  - Professional design (bordered, logo, seal)
  - Student name: "Alex Demo"
  - Course: "Business Plan Fundamentals"
  - Date: November 19, 2025
  - **QR code** (links to verification page)
- **Action buttons:**
  - 📥 **"Download PDF"** - Downloads certificate as PDF
  - 💼 **"Share on LinkedIn"** - Opens LinkedIn share dialog
  - 📧 **"Email Certificate"** - Send to own inbox

**4. LinkedIn Sharing (30 sec)**
- Click **"Share on LinkedIn"**
- **LinkedIn share modal** opens with:
  - Pre-filled post: "I just earned a certificate in Business Plan Fundamentals from The Ready Lab! 🎓"
  - Certificate image attached
  - Link to verification page
- Click **"Post"** (in demo, shows success toast)
- ✅ "Shared to LinkedIn!"

**5. Verification (Optional - 30 sec)**
- Anyone can scan QR code or visit `/verify/:certificateId`
- **Verification page** shows:
  - ✅ "This certificate is valid"
  - Student name, course, date
  - Issued by The Ready Lab
  - Cannot be tampered with

### Key Features
- 🏆 Auto-generated certificates on course completion
- 📄 PDF download
- 💼 One-click LinkedIn sharing
- ✅ QR code verification (prevents fraud)
- 📧 Email delivery option

---

## Journey E: Join Community (2-3 min)

**Shows:** Community feed, create post, comment, like, live Q&A

### Quick Demo Script
> "Beyond courses, students connect with peers and experts in our community for ongoing support..."

### Steps

**1. Navigate to Community (15 sec)**
- Click **"Community"** in main navigation
- Redirects to `/community`
- **Community feed** loads with posts

**2. Browse Posts (30 sec)**
- Feed shows posts from students and educators:
  - **Discussion post:** "How do I find co-founders?"
  - **Success story:** "Just got funded $50K! 🎉"
  - **Question:** "Best tools for MVP development?"
- Each post shows:
  - Author avatar + name
  - Post content
  - 👍 Likes count
  - 💬 Comments count
  - 🕐 Timestamp ("2 hours ago")

**3. Create New Post (45 sec)**
- Click **"Create Post"** button (top-right)
- **Post composer modal** opens
- Type post:
  - Title: "Looking for feedback on my pitch deck"
  - Body: "I'm applying to accelerators and would love community feedback..."
  - (Optional) Upload image/file
- Click **"Post"**
- ✅ Post appears at top of feed
- ✅ Toast: "Post published!"

**4. Engage with Community (45 sec)**
- Scroll to another post
- Click **"Like"** button (👍)
  - ✅ Like count increments
  - ✅ Button turns yellow
- Click **"Comment"** button
- **Comment box** opens below post
- Type comment: "Great question! I recommend using Figma for mockups..."
- Click **"Submit"**
- ✅ Comment appears below post
- ✅ Author gets notification (not shown in demo)

**5. Join Live Q&A (Optional - 30 sec)**
- **Banner at top:** "🔴 LIVE: Grant Writing Workshop starts in 5 minutes"
- Click **"Join Now"** button
- Redirects to `/live/:eventId`
- **Live event page** shows:
  - Video stream (instructor presenting)
  - Live chat sidebar
  - Q&A section (can upvote questions)
  - Participant count: "45 live viewers"
- Type question in Q&A: "What's the #1 mistake in grant proposals?"
- ✅ Question posted, can be upvoted by others

### Key Features
- 💬 Community feed with posts, comments, likes
- ✍️ Rich text post composer
- 🎥 Live Q&A sessions with video streaming
- 🔔 Real-time notifications (in production)
- 👥 Peer-to-peer support network

---

## Quick Navigation Tips

**Fast Demo Routes:**

**Landing → First Lesson (fastest path):**
1. `/` → Sign Up → Onboarding (3 steps) → Dashboard
2. Click recommended course → Enroll → Start Learning
3. Total: ~2 minutes

**Show Payment Flow:**
1. `/courses` → Click paid course → Enroll Now
2. Select BNPL → Stripe checkout (4242...)
3. Total: ~2 minutes

**Show Certificate:**
1. `/courses/:id/lessons/:lastLessonId` → Complete
2. Certificate modal → View → Download/Share
3. Total: ~2 minutes

**Show Community:**
1. `/community` → Browse → Create Post → Comment/Like
2. (Optional) Join live Q&A
3. Total: ~2 minutes

---

## Demo Flow Recommendations

### 5-Minute Quick Demo (Investors)
- **Journey A only:** Signup → Onboarding → Enroll → First lesson (2 min)
- **Show certificate page** (pre-loaded, 1 min)
- **Show community feed** (pre-loaded, 1 min)
- **Highlight AI chat** (quick interaction, 1 min)

### 10-Minute Standard Demo
- **Journey A:** Discovery → First Lesson (2-3 min)
- **Journey C:** Learn & Complete (video, notes, quiz, AI) (2-3 min)
- **Journey D:** Earn Certificate + LinkedIn share (2 min)
- **Journey E:** Community engagement (2 min)

### 15-Minute Comprehensive Demo
- **All 5 journeys** (2-3 min each)
- Shows complete student lifecycle
- Best for detailed stakeholder presentations

---

## Key Features to Emphasize

**For Investors:**
- 🎯 **Personalization:** Interest-based recommendations
- 💳 **Monetization:** Stripe payments + BNPL (increases conversions)
- 🤖 **AI Integration:** Contextual coaching throughout
- 🏆 **Gamification:** Certificates, achievements, confetti
- 💬 **Community:** Network effects, peer learning
- 📱 **Mobile-first:** Responsive design, bottom nav
- 🌍 **Global:** Multi-language support

**For Educators:**
- 📊 Real-time progress tracking
- ✅ Interactive assessments with instant feedback
- 📝 Student note-taking built-in
- 🎥 Professional video player
- 🏅 Automatic certificate generation

**For Students:**
- ⚡ Instant course access (no barriers)
- 💰 Flexible payment options
- 🤖 AI help when stuck
- 🏆 Shareable credentials
- 👥 Supportive community

---

**END OF STUDENT JOURNEY DEMO GUIDE**

Total guide length: ~350 lines (vs. 1,662 original)  
Each journey: 2-3 minutes  
Total demo time: 10-15 minutes for all 5 journeys
