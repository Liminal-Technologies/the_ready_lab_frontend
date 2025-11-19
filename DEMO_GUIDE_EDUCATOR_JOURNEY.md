# Educator Journey Demo Guide

**Last Updated:** November 19, 2025  
**Purpose:** Quick 2-3 minute demos for each journey (12-18 min total)  
**Demo Mode:** Mock authentication - all forms accept any input

---

## Overview

This guide covers 6 educator journeys, each designed as a **2-3 minute walkthrough** showing how educators create, launch, and manage courses on The Ready Lab.

### Mock Authentication
- ✅ All forms accept any input (no validation)
- ✅ Stripe Connect onboarding simulated
- ✅ Pre-populated with demo courses and students
- ✅ Perfect for investor presentations

---

## Journey A: Discovery → Signup (2-3 min)

**Shows:** Educator landing page, value proposition, signup

### Quick Demo Script
> "Educators discover how to monetize their expertise on The Ready Lab..."

### Steps

**1. Educator Landing Page (1 min)**
- Go to `/for-educators`
- **Hero Section:**
  - "Teach What You Know. Earn What You Deserve."
  - CTA: "Get Started Free" | "See Pricing"
- **Scroll to show:**
  - 💰 Pricing models (one-time, subscription, free)
  - 🎥 Built-in video hosting
  - 📊 Student analytics
  - 💳 Stripe integration
  - **Pricing tiers:**
    - Free: 50% platform fee
    - Pro ($29/mo): 20% fee
    - Enterprise ($99/mo): 10% fee

**2. Signup (1 min)**
- Click **"Get Started Free"**
- Fill in any values:
  - Name: "Jane Educator"
  - Email: "jane@example.com"
  - Password: "password"
  - Role: **Educator**
- Click **"Sign Up"**
- ✅ Redirects to educator onboarding

**3. Quick Onboarding (30 sec)**
- **Step 1:** Select teaching topics (click 2-3)
- **Step 2:** Choose language (English)
- **Step 3:** Set experience level ("Expert")
- Click **"Complete Setup"**
- ✅ Redirects to **Educator Dashboard**

### Key Features
- 🎯 Clear educator value proposition
- 💰 Transparent pricing tiers
- ⚡ Quick signup (under 2 minutes)

---

## Journey B: Educator Dashboard Overview (2-3 min)

**Shows:** Dashboard stats, course list, quick actions

### Quick Demo Script
> "The educator dashboard gives a complete view of courses, revenue, and student progress..."

### Steps

**1. Dashboard Stats (1 min)**
- **Top Stats Cards:**
  - **Total Students:** 1,247
  - **Active Courses:** 5 published
  - **Total Revenue:** $12,450 (this month)
  - **Avg Rating:** 4.8 ⭐

**2. Recent Activity (30 sec)**
- Shows:
  - "Sarah J. completed Business Plan Fundamentals"
  - "New review: 5 ⭐ from Michael C."
  - "Payment received: $199 from Emma D."

**3. My Courses List (1 min)**
- Table shows 5 courses:
  1. **Business Plan Fundamentals** - 234 students, 78% completion
  2. **Grant Writing Mastery** - 189 students, $199/course
  3. **Digital Marketing** - 167 students, Free
  4. **Financial Planning** - 145 students, $67/mo subscription
  5. **Pitch Deck Workshop** - 98 students, Draft

- Each row shows:
  - Course title
  - Student count
  - Revenue
  - Status (Published/Draft)
  - **Actions:** Edit, View Analytics, Duplicate, Delete

**4. Quick Actions (30 sec)**
- Click **"+ Create New Course"** button
- ✅ Redirects to course builder

### Key Features
- 📊 Real-time revenue tracking
- 👥 Student enrollment metrics
- ⭐ Course ratings and reviews
- 🎯 Quick access to course management

---

## Journey C: Create Course with AI Builder (2-3 min)

**Shows:** 5-step course builder wizard with AI assistance

### Quick Demo Script
> "Our AI-powered course builder helps educators launch courses in minutes, not weeks..."

### Steps

**1. Course Builder - Step 1: Basic Info (30 sec)**
- URL: `/educator/courses/new`
- Fill in:
  - **Title:** "Fundraising for Startups"
  - **Description:** "Learn to raise capital from angels and VCs"
  - **Category:** Funding & Grants
  - **Difficulty:** Intermediate
  - **Language:** English
- Click **"Next"**

**2. Step 2: Pricing (30 sec)**
- Select pricing model:
  - ⦿ **One-time payment:** $149
  - ○ Subscription: $49/month
  - ○ Free
- Click **"Next"**

**3. Step 3: Course Structure (1 min)**
- **AI Generate Option:**
  - Click **"Generate with AI"** button
  - AI creates 8-lesson outline:
    1. Introduction to Fundraising
    2. Understanding Investor Types
    3. Building Your Pitch Deck
    4. Financial Projections
    5. Due Diligence Prep
    6. Negotiating Terms
    7. Closing the Deal
    8. Post-Investment Management
- Can **edit titles**, **reorder**, or **add lessons**
- Click **"Next"**

**4. Step 4: Upload Content (30 sec)**
- For each lesson, upload:
  - **Video file** (drag-and-drop or browse)
  - **Resources** (PDF, slides)
  - **Quiz questions** (optional)
- Demo shows "Lesson 1" with video uploaded
- Click **"Next"**

**5. Step 5: Review & Publish (30 sec)**
- **Course preview:**
  - Title, price, lessons list
  - Estimated course duration: 4.5 hours
- Toggle: **"Publish immediately"** ✓
- Click **"Publish Course"**
- ✅ Confetti animation 🎉
- ✅ "Course published successfully!"
- ✅ Redirects to course detail page

### Key Features
- 🤖 AI-generated course outlines
- 🎥 Video upload with auto-captions
- 📝 Drag-and-drop lesson reordering
- ⚡ Publish in <10 minutes

---

## Journey D: Manage Students & Analytics (2-3 min)

**Shows:** Student list, progress tracking, engagement metrics

### Quick Demo Script
> "Educators can track every student's progress and identify who needs help..."

### Steps

**1. View Course Students (1 min)**
- From dashboard, click **"View Analytics"** on any course
- URL: `/educator/courses/:id/students`
- **Student table** shows:
  - Student name + avatar
  - Enrollment date
  - Progress % (visual bar)
  - Last active
  - Status (Active, At Risk, Completed)
- **Sample rows:**
  - Sarah J. - 82% progress - Active 2h ago - ✅ On Track
  - Michael C. - 35% progress - Active 8 days ago - ⚠️ At Risk
  - Emma D. - 100% progress - Completed Nov 10 - 🎉 Completed

**2. Identify At-Risk Students (30 sec)**
- Filter: **"At Risk"** (students <40% progress + inactive 7+ days)
- Shows 8 students
- Bulk action: **"Send Reminder Email"**
- Select students → Click **"Send Email"**
- ✅ Email sent to 8 students

**3. View Analytics Dashboard (1 min)**
- Click **"Analytics"** tab
- **Charts:**
  - **Enrollment trend:** Line chart (last 6 months)
  - **Completion funnel:** Shows drop-off at each lesson
  - **Engagement heatmap:** When students are most active
  - **Average rating:** 4.8 ⭐ (89 reviews)
- **Insights:**
  - "Biggest drop-off at Lesson 3 (15%)" - suggests improving content
  - "Peak activity: Weekday evenings 6-9pm"

### Key Features
- 📊 Real-time student progress tracking
- ⚠️ At-risk student identification
- 📧 Bulk email communications
- 📈 Engagement analytics with insights

---

## Journey E: Revenue & Payouts (2-3 min)

**Shows:** Stripe Connect setup, revenue tracking, payouts

### Quick Demo Script
> "Educators get paid directly via Stripe with transparent revenue tracking..."

### Steps

**1. Connect Stripe Account (1 min)**
- Go to `/educator/settings/payouts`
- Click **"Connect Stripe Account"**
- **Stripe Connect onboarding** (in demo, simulated):
  - Business type: Individual
  - Country: United States
  - Account details (name, DOB, SSN)
  - Bank account (routing + account number)
- Click **"Complete Setup"**
- ✅ "Stripe account connected!"

**2. View Revenue Dashboard (1 min)**
- URL: `/educator/revenue`
- **Revenue Stats:**
  - **This Month:** $12,450
  - **Last Month:** $9,870
  - **All-Time:** $67,890
  - **Pending Payout:** $3,200 (releases Nov 25)
- **Revenue Breakdown by Course:**
  - Business Plan: $4,200
  - Grant Writing: $3,800
  - Financial Planning: $2,450
  - Other: $2,000

**3. Transaction History (30 sec)**
- **Table shows:**
  - Date, Student, Course, Amount, Status (Paid/Pending)
  - Sample: Nov 18 - Emma D. - Grant Writing - $199 - ✅ Paid
- Can export to CSV

**4. Payout Schedule (30 sec)**
- **Automatic payouts:**
  - Frequency: Weekly (every Friday)
  - Next payout: Nov 25 ($3,200)
  - Bank: •••• 4242 (Bank of America)
- Can change payout schedule (daily, weekly, monthly)

### Key Features
- 💳 Stripe Connect integration
- 💰 Real-time revenue tracking
- 📊 Course-by-course revenue breakdown
- 🏦 Automatic weekly payouts
- 📥 Transaction export (CSV)

---

## Journey F: Schedule Live Event (2-3 min)

**Shows:** Create live Q&A, schedule, promote, broadcast

### Quick Demo Script
> "Educators can host live Q&A sessions to engage students in real-time..."

### Steps

**1. Create Live Event (1 min)**
- From educator dashboard, click **"Schedule Live Event"**
- **Event form:**
  - **Title:** "Grant Writing Workshop - Live Q&A"
  - **Date:** Nov 25, 2025
  - **Time:** 6:00 PM EST (2 hours)
  - **Related Course:** Grant Writing Mastery (optional)
  - **Description:** "Bring your grant questions - I'll review real proposals and answer live!"
  - **Max Attendees:** 100
- Click **"Create Event"**
- ✅ Event created

**2. Event Promotion (30 sec)**
- **Event page** shows:
  - Event details
  - **Share link:** Copy URL
  - **Email students:** Send invite to all enrolled students
- Click **"Email Students"**
- ✅ Email sent to 189 students (all enrolled in Grant Writing course)

**3. Go Live (1 min)**
- On event day, navigate to `/educator/events/:id/broadcast`
- Click **"Start Broadcast"**
- **Broadcast interface:**
  - **Video preview:** Camera + mic check
  - **Chat panel:** See student questions
  - **Q&A panel:** Upvoted questions from students
  - **Participant count:** 45 live viewers
- Click **"Go Live"**
- ✅ Stream starts
- Students see live video + can ask questions

**4. Post-Event (30 sec)**
- After event:
  - **Recording auto-saved** (can share replay)
  - **Analytics:** 45 attendees, avg watch time 52 min
  - **Q&A exported** (for FAQ creation)

### Key Features
- 🔴 Live video streaming
- 💬 Real-time chat and Q&A
- 📧 Automated student notifications
- 📹 Auto-recording with replay
- 📊 Engagement analytics

---

## Quick Navigation Tips

**Fast Demo Routes:**

**Create Course (fastest):**
1. `/educator/courses/new` → AI Generate → Upload 1 video → Publish
2. Total: ~2 minutes

**Show Student Progress:**
1. Dashboard → Any course → View Analytics → Students tab
2. Filter "At Risk" → Send reminder
3. Total: ~2 minutes

**Show Revenue:**
1. `/educator/revenue` → View stats, breakdown, payouts
2. Total: ~1 minute

**Schedule Live Event:**
1. Dashboard → Schedule Live Event → Fill form → Email students
2. Total: ~2 minutes

---

## Demo Flow Recommendations

### 5-Minute Quick Demo (Investors)
- **Journey C:** AI Course Builder (2 min)
- **Journey D:** Student analytics (2 min)
- **Journey E:** Revenue dashboard (1 min)

### 10-Minute Standard Demo
- **Journey B:** Dashboard overview (2 min)
- **Journey C:** Create course with AI (3 min)
- **Journey D:** Manage students (3 min)
- **Journey E:** Revenue tracking (2 min)

### 18-Minute Comprehensive Demo
- **All 6 journeys** (2-3 min each)
- Shows complete educator lifecycle
- Best for detailed stakeholder presentations

---

## Key Features to Emphasize

**For Investors:**
- 🤖 **AI course builder:** Reduces course creation from weeks to minutes
- 💳 **Stripe integration:** Real payment processing, automatic payouts
- 📊 **Analytics:** Data-driven insights for educators
- 🎥 **Live streaming:** Engagement beyond pre-recorded content
- 💰 **Monetization:** Multiple pricing models (one-time, subscription, free)

**For Educators:**
- ⚡ Launch courses in <10 minutes with AI
- 📈 Track every student's progress
- 💰 Get paid automatically via Stripe
- 📧 Communicate with students at scale
- 🎥 Host live Q&A sessions
- 📱 Mobile-optimized for students

**For Platform:**
- 🏦 10-50% platform fee (depending on tier)
- 💳 Educator pays $0-99/month subscription
- 📊 Scalable infrastructure for 1,000s of courses
- 🌍 Multi-language support (EN, ES)

---

**END OF EDUCATOR JOURNEY DEMO GUIDE**

Total guide length: ~420 lines (vs. 1,141 original)  
Each journey: 2-3 minutes  
Total demo time: 12-18 minutes for all 6 journeys
