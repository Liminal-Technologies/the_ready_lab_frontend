# 🎬 Educator Journey Recording Guide - The Ready Lab

**Purpose:** Manual step-by-step guide for recording educator demo videos  
**Duration:** 12-18 minutes for complete journey (2-3 min per journey)  
**Demo Mode:** Password-free, instant payments, pre-populated data

---

## 🎯 Recording Setup

**Before You Start:**
1. Open browser in incognito/private mode for clean session
2. Navigate to homepage: `/`
3. Have this guide open on second screen
4. Recording software ready (OBS, Loom, etc.)
5. Screen resolution: 1920x1080 recommended

---

## Journey A: Discovery → Signup (2-3 min)

### Script Opening:
> "Welcome to The Ready Lab - where educators monetize their expertise and students prepare to get funded. Let me show you the complete educator experience."

### Steps:

**1. Homepage Hero (15 sec)**
- **Action:** Land on `/` homepage
- **Highlight:** Scroll down slightly to show hero section
- **Narrate:** "Educators discover the platform through our value proposition - create courses, track students, and earn revenue"

**2. Educator Value Proposition (15 sec)**
- **Action:** Scroll to features section
- **Highlight:** Point to key features (AI course builder, analytics, Stripe integration)
- **Narrate:** "The platform offers AI-powered course creation, student analytics, and automatic payments"

**3. Quick Access (30 sec)**
- **Action:** Click "Try Demo" button in header
- **What Happens:** Auto-logs in as educator (mock auth, no password)
- **Narrate:** "In demo mode, we skip authentication for quick access"
- **Transition:** You're now logged in as Dr. Sarah Chen, educator

---

## Journey B: Dashboard Overview (2-3 min)

### Current Location: `/educator/dashboard`

### Script Transition:
> "Here's the educator dashboard - your command center for managing courses and students."

### Steps:

**1. Dashboard Stats (30 sec)**
- **Action:** Point to top stat cards
- **Highlight:** Total Students (0), Total Courses (0), Completed Students (0), Total Revenue ($0.00)
- **Narrate:** "The dashboard shows key metrics at a glance - students, courses, revenue, and ratings"
- **Note:** Stats are empty initially, will populate after creating course

**2. Suggested Actions (20 sec)**
- **Action:** Scroll to "Grow Your Teaching Business" section
- **Highlight:** "Create Your First Course" action item
- **Narrate:** "Smart suggestions guide new educators through their first steps"

**3. Course List (20 sec)**
- **Action:** Scroll to "My Courses" section (currently empty)
- **Narrate:** "This is where all your courses will appear with enrollment metrics and quick actions"

**4. Quick Actions (30 sec)**
- **Action:** Highlight "+Create Course" button (top right, gold button)
- **Narrate:** "Educators can create courses, schedule live events, and manage students with one click"
- **Transition:** "Let's create our first course"

---

## Journey C: Create Course with AI Builder (3-4 min)

### Script Transition:
> "Our AI-powered course builder helps educators launch courses in minutes, not weeks."

### Steps:

**1. Open Course Builder (5 sec)**
- **Action:** Click "+Create Course" button
- **What Happens:** Course Builder Wizard modal opens (5 steps)

**2. Step 1: Basic Info (30-40 sec)**
- **Fields to Fill:**
  - Title: `Grant Writing Masterclass`
  - Category: Select "Funding & Grants" from dropdown
  - Description: `Learn professional grant writing strategies to secure funding for your nonprofit or startup`
  - Learning Objectives: `Master grant proposal writing`, `Understand funder psychology`, `Build winning budgets`
  - Difficulty: Select "Intermediate"
  - Language: "English" (default)
  - Duration: `6 hours`
- **Action:** Click "Next"
- **Narrate:** "Step 1: Basic course information - title, category, description, and objectives"

**3. Step 2: Curriculum (45-60 sec)**
- **What Shows:** Pre-populated with 3 modules, 10 lessons
  - Module 1: Grant Writing Fundamentals (3 lessons)
  - Module 2: Proposal Development (4 lessons)
  - Module 3: Budget & Submission (3 lessons)
- **Action:** Point out the structure, don't edit
- **Narrate:** "The curriculum is already populated - 3 modules with 10 lessons total. Educators can add, edit, or reorder as needed"
- **Action:** Click "Next"

**4. Step 3: Pricing (30 sec)**
- **Action:** Select "One-time payment"
- **Action:** Enter price: `$99`
- **Narrate:** "Set pricing - one-time payment, subscription, or free. We'll charge $99 for this course"
- **Action:** Click "Next"

**5. Step 4: Settings (20 sec)**
- **Action:** Leave defaults (enrollment limit: unlimited, certificate enabled)
- **Narrate:** "Course settings - enrollment limits, certificates, and access controls"
- **Action:** Click "Next"

**6. Step 5: Review & Publish (30 sec)**
- **Action:** Review the course summary
- **Highlight:** Course title, 10 lessons, $99 price
- **Narrate:** "Final review before publishing - everything looks good"
- **Action:** Click "Publish Course"
- **What Happens:** 
  - Confetti animation 🎉
  - Success screen shows
  - Course automatically enrolls demo student "Alex Morgan" with $99 payment
  - Modal closes after 3 seconds

**7. Verify Course Created (15 sec)**
- **Action:** Back on dashboard, scroll to "My Courses" section
- **What Shows:** "Grant Writing Masterclass" now appears with:
  - 1 student enrolled
  - Published status
  - Edit/View Analytics buttons
- **Narrate:** "Course is live! We already have our first student enrolled"

---

## Journey D: Manage Students & Analytics (2-3 min)

### Script Transition:
> "Now let's see how educators track student progress and identify who needs support."

### Steps:

**1. Navigate to Student Analytics (5 sec)**
- **Action:** Click "Students" in sidebar OR top nav
- **Destination:** `/educator/students`

**2. Student List (40 sec)**
- **What Shows:** List of enrolled students with:
  - Alex Morgan - 15% progress - Active 2h ago - ✅ On Track
  - (May show more demo students if pre-populated)
- **Action:** Point out key columns
- **Narrate:** "View all students across all courses with real-time progress tracking"
- **Highlight:** Progress bars, last active times, status indicators

**3. Student Details (30 sec)**
- **Action:** Click on "Alex Morgan" to expand/view details
- **What Shows:** 
  - Course: Grant Writing Masterclass
  - Lessons completed: 2/10
  - Payment: $99 paid
  - Enrollment date
- **Narrate:** "Detailed view shows exactly which lessons they've completed and payment status"

**4. Engagement Metrics (30 sec)**
- **Action:** Scroll to engagement charts (if visible) or metrics section
- **Narrate:** "Analytics show enrollment trends, completion funnels, and engagement patterns"
- **Note:** Charts may be minimal with only 1 student - that's okay, explain it would show more with multiple students

---

## Journey E: Revenue & Payouts (2-3 min)

### Script Transition:
> "Let's check revenue tracking and how educators get paid through Stripe."

### Steps:

**1. Navigate to Revenue Dashboard (5 sec)**
- **Action:** Click "Revenue" in sidebar
- **Destination:** `/educator/revenue`

**2. Revenue Stats (40 sec)**
- **What Shows:** Top stat cards:
  - This Month: $99 (from Alex Morgan)
  - Last Month: $0
  - All-Time: $99
  - Pending Payout: $99
- **Narrate:** "Revenue dashboard shows this month, last month, all-time earnings, and pending payouts"

**3. Revenue Breakdown by Course (30 sec)**
- **Action:** Scroll to "Revenue by Course" section
- **What Shows:** 
  - Grant Writing Masterclass: $99 (1 sale)
- **Narrate:** "See which courses are performing best. As you create more courses, this breakdown helps identify top earners"

**4. Transaction History (30 sec)**
- **Action:** Scroll to transaction list
- **What Shows:**
  - Recent transaction: Alex Morgan - $99 - Grant Writing Masterclass - Status: Paid
- **Narrate:** "Complete transaction history with student names, amounts, and payment status"

**5. Payout Schedule (30 sec)**
- **Action:** Point to payout section
- **Narrate:** "Stripe Connect handles automatic payouts - weekly, bi-weekly, or monthly to your bank account"
- **Note:** Payout details may be minimal in demo mode - that's fine

---

## Journey F: Schedule Live Event (2-3 min)

### Script Transition:
> "Educators can also host live Q&A sessions to engage students in real-time."

### Steps:

**1. Navigate Back to Dashboard (5 sec)**
- **Action:** Click "Dashboard" in sidebar
- **Destination:** `/educator/dashboard`

**2. Open Schedule Event (10 sec)**
- **Action:** Click "Schedule Event" button (top right, white button next to Create Course)
- **What Happens:** "Schedule Live Event" modal opens

**3. Fill Event Details (60 sec)**
- **Fields:**
  - Title: `Grant Writing Q&A - Live Session`
  - Date: Select tomorrow's date
  - Time: Select 6:00 PM
  - Duration: `2 hours`
  - Related Course: Select "Grant Writing Masterclass" from dropdown
  - Description: `Bring your grant questions - I'll review real proposals and answer live!`
  - Max Attendees: `50`
- **Action:** Click "Create Event"
- **Narrate:** "Create live events linked to courses - students get automatic email invitations"

**4. Event Created (20 sec)**
- **What Shows:** Success message, modal closes
- **Action:** Point out event now appears on dashboard (if visible in events section)
- **Narrate:** "Event is scheduled - all enrolled students in Grant Writing Masterclass will receive an email invitation"

**5. Event Features Preview (30 sec)**
- **Action:** Click on the event (if clickable) or describe
- **Narrate:** "On event day, the broadcast interface shows live video, student chat, Q&A upvoting, and participant count. Sessions auto-record for replay"
- **Note:** Don't actually go live - just explain the feature

---

## 🎬 Closing Script

> "And that's the complete educator journey on The Ready Lab. From discovering the platform, creating an AI-powered course, tracking student progress, monitoring revenue, to hosting live events - all designed to help educators monetize their expertise and grow their teaching business. The platform handles payments through Stripe, provides real-time analytics, and makes course creation fast with AI assistance. Ready to transform your teaching into a thriving business? Start your journey at The Ready Lab."

---

## 📝 Recording Tips

**Pacing:**
- Speak slowly and clearly
- Pause 2-3 seconds between major actions
- Let UI animations complete before narrating

**Camera Movement:**
- Smooth scrolling, no jerky movements
- Highlight important UI elements by hovering
- Zoom in for small text if needed

**Common Mistakes to Avoid:**
- ❌ Don't click too fast - let viewers see what you're clicking
- ❌ Don't skip narration - explain what's happening
- ❌ Don't rush through forms - show field completion
- ❌ Don't ignore errors - if something fails, re-record that section

**Post-Production:**
- Add cursor highlighting for better visibility
- Include captions/subtitles
- Add transitions between journeys
- Background music at low volume

---

## 🔧 Demo Data Reference

**Mock Educator Profile:**
- Name: Dr. Sarah Chen
- Email: educator@thereadylab.com
- Role: Educator
- Status: Active Premium subscriber

**Demo Student (Auto-enrolled):**
- Name: Alex Morgan
- Progress: 15% (2/10 lessons)
- Payment: $99 paid
- Status: Active

**Demo Course (Created):**
- Title: Grant Writing Masterclass
- Price: $99
- Lessons: 10 (across 3 modules)
- Students: 1 enrolled
- Revenue: $99

---

**Total Recording Time:** 12-18 minutes  
**Recommended Format:** 1080p, 30fps  
**Audio:** Clear voiceover with background music  
**Output:** MP4 for web, YouTube, demos
