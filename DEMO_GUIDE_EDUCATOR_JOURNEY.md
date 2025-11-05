# The Ready Lab - Educator Journey Demo Guide

## Overview
This guide provides step-by-step instructions for demonstrating the complete educator journey from discovery to course launch. Each section includes demo scripts, verification steps, and tips for presenting.

---

## Journey A: Discovery → Signup (Day 0)

### Step 1: Educator Landing Page
**URL:** `/for-educators`

**Demo Script:**
> "Let me show you how The Ready Lab empowers educators to create and monetize their courses. Notice how we clearly communicate the value proposition for educators..."

**What to Show:**
- **Hero Section:**
  - Headline: "Teach What You Know. Earn What You Deserve."
  - Subheadline: "Create, launch, and scale your courses with our all-in-one platform"
  - CTA buttons: "Get Started Free" | "See Pricing"
  - Hero image/illustration of educator teaching

- **Key Benefits:**
  - 💰 Flexible pricing models (one-time, subscription, free)
  - 🎥 Built-in video hosting with auto-captions (EN/ES)
  - 📊 Student analytics and progress tracking
  - 🌍 Global reach with multi-language support
  - 💳 Stripe integration for payments
  - 🎓 Automatic certificate generation
  - 📱 Mobile-optimized course player
  - 👥 Community features included

- **Pricing Tiers Preview:**
  - **Free Plan:** 50% platform fee, basic features
  - **Pro Plan ($29/mo):** 20% platform fee, advanced analytics
  - **Enterprise ($99/mo):** 10% platform fee, white-label options

- **Success Stories:**
  - Testimonials from successful educators
  - Revenue examples
  - Student count milestones

- **Features Comparison Table:**
  - Side-by-side plan comparison
  - Feature checkmarks
  - "Most Popular" badge on Pro

**Actions:**
1. Scroll through landing page sections
2. Click "See Pricing" to jump to pricing section
3. Click "Get Started Free" to trigger signup

**Verification:**
✓ Landing page loads completely  
✓ All sections render properly  
✓ CTAs trigger auth flow  
✓ Pricing table displays correctly

---

### Step 2: Educator Signup
**Demo Script:**
> "Educators can get started in under 2 minutes. Let me create a test account..."

**Actions:**
1. Click "Get Started Free"
2. Auth modal appears
3. Click "Sign Up with Email"
4. Enter test credentials:
   - Email: `demo-educator@thereadylab.com`
   - Password: `Demo2024!`
5. Click "Sign Up"

**What Happens:**
- Account created in Supabase
- User role set to "educator"
- Redirected to educator onboarding

**Verification:**
✓ Account created successfully  
✓ Role assigned correctly  
✓ Redirected to onboarding

---

## Journey B: Onboarding → Profile Setup (Day 0)

### Step 1: Onboarding Screen 1 - Choose Plan
**Demo Script:**
> "First, educators choose their pricing plan. We recommend starting with Free to test the platform, then upgrading once they see results..."

**What to Show:**
- Plan selection with three cards:

#### Free Plan
- **Price:** $0/month
- **Platform Fee:** 50% of course sales
- **Features:**
  - Unlimited courses
  - Basic analytics
  - Community access
  - Certificate generation
  - Video hosting (up to 2GB)
- **Best for:** Testing the platform

#### Pro Plan (Recommended)
- **Price:** $29/month
- **Platform Fee:** 20% of course sales
- **Features:**
  - Everything in Free
  - Advanced analytics
  - Custom branding
  - Priority support
  - Video hosting (up to 50GB)
  - Live streaming
  - Bulk upload tools
- **Best for:** Professional educators

#### Enterprise Plan
- **Price:** $99/month
- **Platform Fee:** 10% of course sales
- **Features:**
  - Everything in Pro
  - White-label options
  - Dedicated account manager
  - Custom integrations
  - Unlimited video hosting
  - API access
- **Best for:** Institutions & agencies

**Actions:**
1. Review each plan
2. Select "Free" for demo
3. Click "Continue"

**Platform Fee Calculator:**
- Example: If your course is $100:
  - **Free Plan:** You earn $50, platform keeps $50
  - **Pro Plan:** You earn $80, platform keeps $20
  - **Enterprise:** You earn $90, platform keeps $10

**Verification:**
✓ Plan cards display correctly  
✓ Fee calculator updates  
✓ Can select a plan  
✓ Selection saved to localStorage

---

### Step 2: Onboarding Screen 2 - Expertise & Bio
**Demo Script:**
> "Next, educators create their instructor profile. This appears on all their course pages and helps students understand their credibility..."

**What to Show:**
- Profile setup form with fields:

**Fields:**
1. **Full Name:** "Dr. Sarah Martinez"
2. **Professional Title:** "Grant Writing Expert & Nonprofit Consultant"
3. **Areas of Expertise:** (Multi-select)
   - Grant Writing ✓
   - Nonprofit Management ✓
   - Fundraising Strategy ✓
4. **Bio:** (Textarea, 500 chars max)
   ```
   Dr. Sarah Martinez has 15+ years of experience helping nonprofits 
   secure $50M+ in grant funding. She's trained 1,000+ organizations 
   in grant writing best practices and serves as a consultant to major 
   foundations.
   ```
5. **Profile Photo:** Upload or use default avatar
6. **Website/LinkedIn:** (Optional)
   - Website: `https://sarahmartinez.com`
   - LinkedIn: `linkedin.com/in/drsarahmartinez`

**Actions:**
1. Fill in all fields
2. Upload profile photo (optional)
3. Add social links
4. Click "Continue"

**Verification:**
✓ All fields accept input  
✓ Photo upload shows preview  
✓ Bio character counter works  
✓ Data saved to localStorage

---

### Step 3: Onboarding Screen 3 - Preview Experience (Optional)
**Demo Script:**
> "Before creating their first course, educators can preview what the student experience looks like..."

**What to Show:**
- Preview mode toggle
- Option to browse platform as a student
- "Skip to Dashboard" or "Preview Student Journey"

**Actions:**
1. Click "Preview Student Journey"
2. Redirected to browse page with banner:
   - "👋 You're in Preview Mode - See what students see"
   - "Exit Preview" button
3. Can browse courses, view details
4. Click "Exit Preview" returns to educator dashboard

**Verification:**
✓ Preview mode banner appears  
✓ Can browse as student  
✓ "Exit Preview" works  
✓ Returns to educator dashboard

---

## Journey C: Educator Dashboard (Day 0-1)

### Step 1: Dashboard Overview
**URL:** `/educator-dashboard`

**Demo Script:**
> "Welcome to the educator dashboard. This is command central for managing all your courses, students, and earnings..."

**What to Show:**

#### Header Section:
- Welcome message: "Welcome, Dr. Sarah Martinez!"
- "Create Course" button (prominent, blue)
- "Go Live" button (for streaming)
- Quick stats cards:
  - **Total Students:** 0 → grows over time
  - **Active Courses:** 0 → updates when courses published
  - **Total Revenue:** $0 → updates with sales
  - **Avg. Rating:** N/A → shows after reviews

#### Main Dashboard Sections:

**1. Quick Actions:**
- Create New Course (wizard)
- Schedule Live Event
- View Analytics
- Manage Students

**2. Course Management Table:**
- Columns: Course Name | Status | Students | Revenue | Actions
- Status badges: Draft, Under Review, Published, Archived
- Action buttons: Edit, Preview, Analytics, Unpublish

**3. Recent Activity Feed:**
- New enrollments
- Course completions
- Reviews received
- Payment notifications

**4. Earnings Overview:**
- Monthly revenue chart
- Breakdown by course
- Pending vs. completed payments
- Next payout date

**5. Student Feedback:**
- Recent reviews and ratings
- Flagged comments
- Response needed notifications

**Verification:**
✓ Dashboard loads without errors  
✓ Stats display (even if 0)  
✓ Empty states show properly  
✓ Create Course button prominent

---

### Step 2: First Time Welcome Tour (Optional)
**Demo Script:**
> "On first login, educators see a quick tour highlighting key dashboard features..."

**Tour Steps (4 total):**
1. **Create Course Button:** "Start here to build your first course"
2. **Course Table:** "Manage all your courses in one place"
3. **Analytics:** "Track student progress and engagement"
4. **Earnings:** "Monitor revenue and payouts"

**Actions:**
1. Tour appears automatically
2. Click "Next" through steps
3. Click "Get Started" on last step
4. Tour dismissed, never shows again

**Verification:**
✓ Tour appears on first visit  
✓ Can skip or complete  
✓ Tour highlights correct elements  
✓ Doesn't show on subsequent visits

---

## Journey D: Course Creation (Day 1-7)

### Step 1: Start Course Builder Wizard
**Demo Script:**
> "Creating a course is simple with our 5-step wizard. Let me walk you through it..."

**Actions:**
1. Click "Create New Course" button
2. Course builder wizard modal opens
3. Progress bar shows: Step 1 of 5

**Verification:**
✓ Wizard opens  
✓ Progress bar appears  
✓ Can navigate steps

---

### WIZARD STEP 1: Select Course Type

**Demo Script:**
> "First, choose your course type. This determines the structure and features available..."

**Course Type Options:**

#### 1. Self-Paced Course (Most Popular)
- **Icon:** 📚 Book
- **Description:** Students learn at their own speed with pre-recorded video lessons
- **Best for:** Evergreen content, skill-based training
- **Features:** Video lessons, quizzes, resources, certificates

#### 2. Cohort-Based Course
- **Icon:** 👥 Users
- **Description:** Time-bound courses with a group of students starting together
- **Best for:** Community-driven learning, accountability
- **Features:** Everything in Self-Paced + live sessions, peer groups, deadlines

#### 3. Live Workshop
- **Icon:** 🎥 Video
- **Description:** Real-time interactive sessions with Q&A
- **Best for:** One-time events, masterclasses, webinars
- **Features:** Live streaming, chat, recordings, limited enrollment

#### 4. Micro-Learning Path
- **Icon:** ⚡ Lightning
- **Description:** Short, bite-sized lessons (5-10 min each)
- **Best for:** Quick skills, daily learning habits
- **Features:** Short videos, quick quizzes, mobile-optimized

**Actions:**
1. Review each option
2. Select "Self-Paced Course" (radio button)
3. Click "Next Step"

**Verification:**
✓ All options display  
✓ Selection highlights  
✓ Can proceed to next step  
✓ Selection saved

---

### WIZARD STEP 2: Course Details

**Demo Script:**
> "Now we add the core course information. This is what students see when browsing..."

**Form Fields:**

#### 1. Course Title* (Required)
- Input: "Grant Writing Masterclass"
- Character limit: 80
- Placeholder: "e.g., Grant Writing Masterclass"

#### 2. Category* (Required)
- Dropdown select from:
  - Funding & Grants ✓
  - Business Operations
  - Marketing & Sales
  - Technology & AI
  - Legal & Compliance
  - Partnership Strategy
  - Impact Measurement
  - Other

#### 3. Level* (Required)
- Radio buttons:
  - ○ Beginner
  - ● Intermediate (selected)
  - ○ Advanced

#### 4. Short Description* (Required)
- Textarea, 500 chars max
- Input:
  ```
  Master the art of grant writing with proven strategies that have 
  secured $10M+ in funding. Learn to research opportunities, craft 
  compelling narratives, and build lasting funder relationships.
  ```

#### 5. Learning Objectives (Dynamic list)
- Minimum 3, maximum 8
- Click "Add Objective" to add more
- Examples:
  1. "Identify grant opportunities that match your mission"
  2. "Write persuasive proposals using the SMART framework"
  3. "Build relationships with program officers"
  4. "Track and report on grant outcomes effectively"

**Actions:**
1. Fill in course title
2. Select category
3. Choose level
4. Write description
5. Add 4 learning objectives
6. Click "Next Step"

**Validation:**
- Can't proceed without required fields
- Character limits enforced
- Must have at least 3 objectives

**Verification:**
✓ All fields accept input  
✓ Validation works  
✓ Objectives list grows  
✓ Can remove objectives  
✓ Form data saved

---

### WIZARD STEP 3: Pricing & Enrollment

**Demo Script:**
> "Now set your pricing. You can see exactly how much you'll earn after platform fees..."

**Pricing Options:**

#### 1. Pricing Model* (Required)
Radio buttons:
- ○ Free (Build audience, no revenue)
- ● One-Time Payment (selected)
- ○ Subscription (Monthly/Annual access)
- ○ Pay What You Want (Min $0)

#### 2. Price (if paid)
- Input: `$99.00`
- Currency: USD (dropdown for others)

**Earnings Calculator (Auto-updates):**
```
Course Price: $99
Your Plan: Free (50% platform fee)
──────────────────────────
Platform Fee: -$49.50
Your Earnings: $49.50 per sale

💡 Tip: Upgrade to Pro plan to earn $79.20 per sale!
```

#### 3. Enrollment Settings
- **Max Students:** Unlimited or set cap (e.g., 500)
- **Enrollment Period:** Always open or date range
- **Prerequisites:** Optional (link to other courses)

#### 4. Refund Policy
- Dropdown:
  - 7-day money-back guarantee (recommended)
  - 14-day guarantee
  - 30-day guarantee
  - No refunds

**Actions:**
1. Select "One-Time Payment"
2. Enter price: $99
3. Review earnings breakdown
4. Set max students: 500
5. Keep enrollment always open
6. Select "7-day money-back guarantee"
7. Click "Next Step"

**Verification:**
✓ Calculator updates in real-time  
✓ Earnings shown correctly  
✓ Plan upgrade prompt appears  
✓ All settings save

---

### WIZARD STEP 4: Upload Content

**Demo Script:**
> "This is where the magic happens. Upload your video lessons and we'll handle the rest - hosting, processing, thumbnail generation, and even auto-captions in English and Spanish..."

**Content Upload Interface:**

#### File Upload Section:
- **Drag & Drop Zone:**
  - "Drag video files here or click to browse"
  - Supported formats: MP4, MOV, AVI (max 2GB per file on Free plan)
  - Shows upload progress bars

- **Uploaded Files List:**
  ```
  ✓ intro-to-grants.mp4 (45 MB) - 5:23 duration
  ✓ finding-opportunities.mp4 (120 MB) - 15:47 duration
  ✓ writing-proposals.mp4 (230 MB) - 28:12 duration
  ⏳ budget-planning.mp4 (180 MB) - Processing... 67%
  ```

#### AI-Powered Features:
Two prominent buttons appear after upload:

**1. Generate Thumbnails (AI)**
- Button: "✨ Generate Thumbnails"
- Disabled until files uploaded
- Click triggers:
  - Processing animation (2-3 seconds)
  - Extracts frame from video
  - Adds course branding overlay
  - Success: ✓ "Thumbnails generated for 4 videos"

**2. Generate Captions (EN/ES)**
- Button: "📝 Generate Captions (EN/ES)"
- Disabled until thumbnails done
- Click triggers:
  - Processing animation (3-5 seconds)
  - Transcribes audio using AI
  - Creates .vtt files for English
  - Auto-translates to Spanish
  - Success: ✓ "Captions generated: 4 EN, 4 ES"

#### Organize into Modules:
After AI processing, organize content:

**Module Structure:**
```
📂 Module 1: Introduction to Grant Writing
  ├─ Lesson 1: What is a Grant? (5:23)
  ├─ Lesson 2: Types of Funding Sources (8:45)
  └─ Quiz: Module 1 Assessment

📂 Module 2: Finding Opportunities
  ├─ Lesson 1: Research Strategies (15:47)
  ├─ Lesson 2: Database Navigation (12:30)
  └─ Resource: Grant Database List (PDF)

📂 Module 3: Writing Compelling Proposals
  ├─ Lesson 1: SMART Framework (28:12)
  ├─ Lesson 2: Narrative Techniques (22:05)
  ├─ Lesson 3: Budget Planning (18:33)
  └─ Quiz: Final Assessment
```

**Actions:**
1. Click "Upload Files" or drag 4 videos
2. Wait for uploads to complete
3. Click "✨ Generate Thumbnails"
   - Progress bar animates
   - Success message appears
4. Click "📝 Generate Captions (EN/ES)"
   - Progress bar animates
   - Success message appears
5. Click "Add Module" to create Module 1
6. Drag lessons into modules
7. Add quizzes between modules
8. Add downloadable resources (PDFs)
9. Click "Next Step"

**Verification:**
✓ Files upload successfully  
✓ Progress bars accurate  
✓ Thumbnail generation works  
✓ Caption generation works  
✓ Can organize into modules  
✓ Can add quizzes and resources  
✓ Module structure saves

---

### WIZARD STEP 5: Review & Publish

**Demo Script:**
> "Finally, review everything before publishing. You can save as draft or submit for review..."

**Review Screen Shows:**

#### Course Summary Card:
```
╔════════════════════════════════════════╗
║  Grant Writing Masterclass             ║
║  By Dr. Sarah Martinez                 ║
╠════════════════════════════════════════╣
║  Category: Funding & Grants            ║
║  Level: Intermediate                   ║
║  Price: $99 (One-time)                 ║
║  Duration: ~4 hours                    ║
║  Lessons: 12 videos + 3 quizzes        ║
║  Modules: 3 modules                    ║
║  Captions: EN/ES ✓                     ║
║  Certificate: Included ✓               ║
╚════════════════════════════════════════╝
```

#### Checklist:
- ✓ Course title and description
- ✓ Learning objectives (4 added)
- ✓ Pricing configured ($99)
- ✓ Content uploaded (12 videos)
- ✓ Thumbnails generated
- ✓ Captions created (EN/ES)
- ✓ Modules organized (3 modules)
- ✓ Quizzes added (3 quizzes)

#### Earnings Projection:
```
If 100 students enroll:
  Gross: $9,900
  Platform Fee (50%): -$4,950
  Your Earnings: $4,950

💡 Upgrade to Pro to earn $7,920 instead!
```

#### Action Buttons:

**1. Save as Draft**
- Saves course to "Drafts" folder
- Can edit anytime
- Not visible to students
- No review needed

**2. Submit for Review** (Primary action)
- Submits to The Ready Lab team
- Review time: ~24-48 hours
- Checks for quality, policy compliance
- Email notification when approved
- Then can publish

**Actions:**
1. Review all details
2. Click "Submit for Review"
3. Confirmation modal appears:
   ```
   🎉 Course submitted for review!
   
   What happens next:
   1. Our team reviews your course (24-48 hrs)
   2. You'll receive email notification
   3. Once approved, you can publish
   
   Need to make changes? Save as draft instead.
   ```
4. Click "Back to Dashboard"

**Verification:**
✓ Summary accurate  
✓ Checklist complete  
✓ Earnings calculator correct  
✓ Submit button works  
✓ Confirmation appears  
✓ Course saved to database

---

## Journey E: Course Management (Day 7-90)

### Step 1: Review Approval
**Demo Script:**
> "After 24-48 hours, educators receive an email notification that their course is approved..."

**Email Notification (Mock):**
```
Subject: ✅ Your course "Grant Writing Masterclass" is approved!

Hi Dr. Sarah Martinez,

Great news! Your course has been reviewed and approved.

You can now:
• Publish your course to students
• Set your launch date
• Promote your course link

[Publish Now] [View Course]

- The Ready Lab Team
```

**Actions:**
1. Show toast notification: "Course approved! ✅"
2. Navigate to dashboard
3. Course status changed from "Under Review" → "Ready to Publish"
4. "Publish" button now active

**Verification:**
✓ Toast appears  
✓ Status updated  
✓ Publish button enabled

---

### Step 2: Publish Course
**Demo Script:**
> "Publishing is instant. Once published, the course appears in the browse catalog and educators can start promoting it..."

**Actions:**
1. From dashboard, find course
2. Click "Publish" button
3. Confirmation modal:
   ```
   Ready to publish?
   
   Your course will be:
   ✓ Live in course catalog
   ✓ Searchable by students
   ✓ Available for enrollment
   
   You can unpublish anytime.
   ```
4. Click "Publish Course"
5. Success animation
6. Status → "Published" with green badge
7. Course page URL generated: `/courses/ABC123`

**Verification:**
✓ Publish modal appears  
✓ Course goes live  
✓ Status updates to "Published"  
✓ URL generated  
✓ Appears in browse catalog

---

### Step 3: Share & Promote
**Demo Script:**
> "Educators can share their course link on social media, email, or anywhere they want..."

**Share Options:**

1. **Copy Course Link**
   - Button: "📋 Copy Link"
   - Copies: `https://thereadylab.com/courses/ABC123`
   - Toast: "Link copied!"

2. **Share to Social Media**
   - LinkedIn
   - Twitter
   - Facebook
   - Pre-filled post:
     ```
     🚀 Excited to announce my new course on The Ready Lab!
     
     Grant Writing Masterclass - Learn proven strategies that 
     have secured $10M+ in funding.
     
     Enroll now: [link]
     
     #GrantWriting #Nonprofits #ProfessionalDevelopment
     ```

3. **Email Promotion**
   - Button: "📧 Email Template"
   - Downloads sample email template

4. **Embed Code**
   - For educators with websites
   - Iframe embed code
   - Customizable size

**Actions:**
1. Click "Share Course"
2. Select sharing method
3. Copy link or social share
4. Post to LinkedIn (demo)

**Verification:**
✓ Share modal opens  
✓ Link copies correctly  
✓ Social posts pre-filled  
✓ Embed code works

---

### Step 4: Monitor Student Progress
**Demo Script:**
> "As students enroll, educators can track their progress in real-time..."

**Student Analytics Dashboard:**

**URL:** `/educator-dashboard/courses/ABC123/students`

**What to Show:**

#### Enrollment Stats:
- **Total Enrolled:** 47 students
- **Active (last 7 days):** 32
- **Completed:** 12
- **Avg. Completion Rate:** 68%

#### Student Table:
| Name | Enrolled | Progress | Last Active | Completion |
|------|----------|----------|-------------|------------|
| John Doe | Jan 15 | 85% | 2 hours ago | In Progress |
| Jane Smith | Jan 18 | 100% | 3 days ago | ✓ Completed |
| Mike Johnson | Jan 20 | 42% | 1 day ago | In Progress |

**Filters:**
- All / Active / Completed / Inactive
- Sort by: Progress, Last Active, Enrollment Date

#### Individual Student View:
Click on student name to see:
- Module-by-module progress
- Quiz scores
- Time spent per lesson
- Discussion posts
- Certificate issued (if completed)
- Option to send message

**Verification:**
✓ Student list loads  
✓ Progress bars accurate  
✓ Filters work  
✓ Can view individual students

---

### Step 5: View Earnings & Analytics
**Demo Script:**
> "The analytics dashboard shows revenue, student engagement, and course performance..."

**URL:** `/educator-dashboard/analytics`

**Analytics Sections:**

#### 1. Revenue Dashboard
```
Total Revenue (All Time): $4,653
This Month: $1,287
Last Month: $892

Revenue by Course:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Grant Writing Masterclass: $3,200 (47 sales)
Fundraising 101: $1,453 (23 sales)
```

#### 2. Student Engagement
- **Avg. Session Duration:** 28 minutes
- **Completion Rate:** 68% (vs. 15% industry avg)
- **Avg. Quiz Score:** 82%
- **Discussion Posts:** 143 total

#### 3. Course Performance Chart
- Line graph showing enrollments over time
- Bar chart of lesson completion rates
- Heatmap of most-watched lessons

#### 4. Reviews & Ratings
```
Overall Rating: 4.8 ⭐⭐⭐⭐⭐
Total Reviews: 34

5 stars: ███████████████████ 27 (79%)
4 stars: ██████ 5 (15%)
3 stars: ██ 2 (6%)
2 stars: 0 (0%)
1 star: 0 (0%)

Recent Review:
"Best grant writing course I've ever taken! Clear, 
actionable, and Sarah's templates saved me hours."
- Jane S., Nonprofit Director
```

#### 5. Traffic Sources
- Direct: 45%
- Social Media: 30%
- Search: 15%
- Referral: 10%

**Verification:**
✓ Revenue totals accurate  
✓ Charts render properly  
✓ Reviews display  
✓ Engagement metrics show

---

## Journey F: Live Events & Community (Ongoing)

### Step 1: Schedule Live Event
**Demo Script:**
> "Educators can host live Q&A sessions, workshops, or office hours for their students..."

**Actions:**
1. Click "Go Live" button in dashboard
2. OR click "Schedule Event" in course management
3. Live event scheduler modal opens

**Event Form:**

#### 1. Event Type
- ○ Live Q&A Session
- ● Workshop / Masterclass (selected)
- ○ Office Hours
- ○ Guest Speaker

#### 2. Event Details
- **Title:** "Advanced Grant Writing Techniques - Live Workshop"
- **Description:** "Join me for a 90-minute deep dive into advanced grant writing strategies..."
- **Date:** Feb 15, 2025
- **Time:** 2:00 PM EST
- **Duration:** 90 minutes
- **Platform:** Built-in streaming (or Zoom link)

#### 3. Access Control
- ○ All students enrolled in any course
- ● Only students in "Grant Writing Masterclass" (selected)
- ○ Open to everyone (requires signup)
- ○ Private/Invite only

#### 4. Features
- ✓ Live Chat enabled
- ✓ Q&A queue
- ✓ Screen sharing
- ✓ Recording (available after event)
- ✓ Send calendar invite
- ✓ Email reminders (24hr, 1hr before)

**Actions:**
1. Fill in event details
2. Select date and time
3. Choose access level
4. Enable desired features
5. Click "Schedule Event"
6. Confirmation:
   ```
   ✅ Event scheduled!
   
   Students will receive:
   • Email notification
   • Calendar invite
   • Reminder 24hrs before
   • Reminder 1hr before
   
   Event page: /events/ABC123
   ```

**Verification:**
✓ Form accepts input  
✓ Date/time picker works  
✓ Event created  
✓ Appears in educator dashboard  
✓ Visible to students

---

### Step 2: Go Live
**Demo Script:**
> "When it's time for the event, educators just click 'Go Live' and start streaming..."

**Actions:**
1. 15 minutes before event, "Go Live" button appears
2. Click "Go Live"
3. Camera/microphone permissions requested
4. Pre-stream check:
   - Camera preview
   - Mic test
   - Background blur option
   - Screen share test
5. Click "Start Broadcast"

**Live Streaming Interface:**

**Educator View:**
```
┌──────────────────────────────────────┐
│   Camera Feed (Your Video)          │
│                                      │
│   [Screen Share Button]              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   Live Chat                          │
│   ┌────────────────────────────────┐ │
│   │ Sarah: Welcome everyone!       │ │
│   │ John: Thanks for hosting!      │ │
│   │ Jane: Can't wait to learn!     │ │
│   └────────────────────────────────┘ │
│   [Type message...]                  │
└──────────────────────────────────────┘

Stats: 🔴 LIVE | 👁  47 viewers | ⏱ 00:15:23
```

**Features During Stream:**
- Live viewer count
- Chat moderation (pin, delete messages)
- Q&A queue (students submit questions)
- Polls (create live polls)
- Screen share toggle
- Mute/unmute
- End broadcast

**Actions:**
1. Welcome students
2. Share screen to show slides
3. Answer questions from Q&A queue
4. Run a poll: "Have you applied for a grant before?"
5. Respond to chat messages
6. End broadcast after 90 minutes

**Verification:**
✓ Stream starts successfully  
✓ Students can join  
✓ Chat works bidirectionally  
✓ Screen share functions  
✓ Recording saves

---

### Step 3: Post-Event Follow-Up
**Demo Script:**
> "After the event, the recording is automatically processed and available to students who missed it..."

**What Happens:**
1. Recording uploaded to video storage
2. Auto-captions generated (EN/ES)
3. Chat transcript saved
4. Email sent to all enrollees:
   ```
   📹 Recording available: Advanced Grant Writing Workshop
   
   Missed the live session? Watch the recording anytime.
   
   [Watch Recording]
   
   Resources from the session:
   • Slides (PDF)
   • Chat transcript
   • Advanced template pack
   ```

5. Recording appears in course resources

**Verification:**
✓ Recording processed  
✓ Captions generated  
✓ Email sent  
✓ Accessible to students

---

## Demo Tips & Best Practices

### Before the Demo:
1. **Prepare sample videos** (3-4 short clips)
2. **Have educator bio ready** to copy/paste
3. **Pre-calculate earnings** for different plan levels
4. **Test file uploads** to ensure smooth demo
5. **Clear cache** for fresh onboarding experience
6. **Bookmark key pages** for quick navigation

### During the Demo:
1. **Emphasize revenue potential:** "With just 100 students, you'd earn $4,950"
2. **Highlight automation:** "Auto-captions save hours of work"
3. **Show comparison:** "Other platforms charge $49/mo + 30% fees"
4. **Demonstrate ease:** "From idea to published in under 1 hour"
5. **Address concerns:** "Start free, upgrade when you see results"

### Demo Flow Optimization:
- **5-minute version:** Landing → Signup → Wizard overview → Publish
- **15-minute version:** Full course creation journey
- **30-minute version:** Course creation + live events + analytics
- **60-minute version:** All features + student management + Q&A

### Common Questions to Prepare For:

**Q: "What's your platform fee compared to competitors?"**
A: Udemy takes 50-97% depending on how student found you. Teachable charges $39-$119/mo + payment fees. We're transparent: 10-50% depending on plan, no hidden fees.

**Q: "How long does course approval take?"**
A: 24-48 hours. We check for quality and policy compliance, not content censorship.

**Q: "Can I move my existing course from another platform?"**
A: Yes! Bulk upload tools on Pro plan make migration easy.

**Q: "What payment methods do students use?"**
A: Credit card, PayPal, Apple Pay, Google Pay, and BNPL (Klarna, Afterpay, Affirm).

**Q: "Do you support courses in languages other than English?"**
A: Yes! Auto-captions support 20+ languages. Course content can be in any language.

**Q: "What if I need to refund a student?"**
A: One-click refunds in your dashboard. You set the refund policy (7, 14, or 30 days).

**Q: "Can I offer my course to my organization's employees?"**
A: Yes! Bulk enrollment and custom pricing available on Enterprise plan.

### Troubleshooting:
- **Upload fails:** Check file size under 2GB, format is MP4/MOV
- **Captions don't generate:** Ensure audio quality is good
- **Can't publish:** Ensure all required fields complete
- **Revenue not showing:** Check if test payments, real ones take 24hrs

---

## Success Metrics to Highlight

When demoing educator features, mention:

- **Avg. Educator Revenue:** $2,400/month (active courses)
- **Course Creation Time:** <2 hours start to finish
- **Student Satisfaction:** 4.7⭐ average across all courses
- **Completion Rates:** 3x higher than industry average
- **Support Response Time:** <2 hours for educator questions
- **Payout Speed:** Weekly payouts, no minimums

---

## Next Steps After Demo

If the demo goes well, suggest:
1. **Create free educator account** to test platform
2. **Upload one sample lesson** to see auto-features
3. **Schedule 1-on-1 onboarding call** for migration help
4. **Share promotional materials** (social templates, email copy)
5. **Join educator community** to connect with other instructors

---

## Conclusion

The educator journey demonstrates a complete platform for creating, launching, and scaling online courses. Key differentiators:

✅ **Fast setup:** Course created in <2 hours  
✅ **AI-powered tools:** Auto-thumbnails and captions (EN/ES)  
✅ **Transparent pricing:** Keep 50-90% depending on plan  
✅ **Built-in streaming:** No need for Zoom or YouTube  
✅ **Student analytics:** Track progress and engagement  
✅ **Automated marketing:** Email sequences and social sharing  

**Questions?** Refer to the Student or Institution demo guides for those journeys.