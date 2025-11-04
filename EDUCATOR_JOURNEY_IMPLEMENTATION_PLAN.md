# Educator Journey Implementation Plan
**Date:** November 4, 2025  
**Project:** The Ready Lab - Educator Front-End Demo

## Overview
Implementing complete educator journeys (A-E) with mock data and localStorage, matching the student demo implementation approach.

## Implementation Status

### ✅ Task 1: ForEducators Landing Page - COMPLETE
**File:** `src/pages/ForEducators.tsx`

**Implemented:**
- ✅ Hero section with gradient background and "Join 10,000+ Educators" badge
- ✅ Value proposition: "Share Your Knowledge. Build Your Business."
- ✅ Primary CTA: "Explore as an Educator" button
- ✅ 3 benefit cards:
  - Monetize Your Expertise (up to 90% revenue share)
  - Reach Global Learners (6 languages auto-translation)
  - Analytics & Insights (engagement tracking)
- ✅ Features overview grid (Video Courses, Live Events, Digital Products, Communities)
- ✅ Bottom CTA section
- ✅ Auth modal integration
- ✅ Sets `userRole: 'educator'` and `educatorPreviewMode: 'true'` in localStorage
- ✅ Redirects to `/explore` after auth

**Test IDs:**
- `button-explore-as-educator`
- `button-cta-bottom`
- `benefit-card-{index}`

---

### ⏳ Task 2: Plan Selection Modal - PENDING
**Component:** `src/components/educator/PlanSelectionModal.tsx` (exists but needs update)

**Requirements:**
- FREE/PRO/PREMIUM plan cards with pricing
- Feature bullets matching PRD exactly
- "Choose Plan" buttons
- For FREE: immediate selection, save to localStorage
- For PRO/PREMIUM: show fake Stripe subscription modal
- Fake Stripe: 2-second loader → success toast
- After plan selection → Educator Onboarding form

**TODO:** Update existing PlanSelectionModal or create new component

---

### ⏳ Task 3: Educator Onboarding Form - PENDING
**Component:** Create `src/pages/EducatorOnboarding.tsx`

**Requirements:**
- Name input
- Photo upload (preview only, no real upload)
- Bio textarea
- Expertise tags (multi-select chips: Funding, Legal, Marketing, Infrastructure, Finance, AI, etc.)
- Teaching styles (pills: Visual, Auditory, Kinesthetic, Reading/Writing)
- Preferred content types (pills: Microlearning, Deep Learning, Live Events, Digital Products)
- "Save & Continue" button → Educator Dashboard
- Save all to localStorage: `educatorProfile`

---

### ⏳ Task 4: Educator Dashboard with Checklist - PENDING
**Component:** Update `src/pages/EducatorDashboard.tsx`

**Requirements:**
- Onboarding checklist card:
  - ☐ Create profile → ✓ when educatorProfile exists
  - ☐ Create first course → ✓ when localStorage has course
  - ☐ Upload first lesson → ✓ when course has lessons
  - ☐ Submit for review → ✓ when course submitted
- Stats cards (from Task 6):
  - Students enrolled
  - Lessons completed
  - Avg rating
  - Revenue this month
- "Create New Course" button → opens Course Builder Wizard

---

### ⏳ Task 5: Course Builder Wizard (5 Steps) - PENDING
**Component:** Create `src/components/educator/CourseBuilderWizard.tsx`

**Step 1: Course Type**
- Radio cards: Microlearning / Deep Learning / Digital Product
- Description for each type

**Step 2: Course Details**
- Title input
- Category dropdown (Funding, Legal, Marketing, Infrastructure, Finance, AI, etc.)
- Level radio (Beginner/Intermediate/Advanced)
- Description textarea
- Learning Objectives (dynamic bullet fields or multi-line)

**Step 3: Pricing**
- Free/Paid toggle
- If Paid: price input
- Platform fee calculation based on plan:
  - FREE plan: 50% platform fee, 50% your earnings
  - PRO plan: 20% platform fee, 80% your earnings
  - PREMIUM plan: 10% platform fee, 90% your earnings
- Display calculation: "Price: $99 → Platform Fee: $19.80 → Your Earnings: $79.20"

**Step 4: Upload Content**
- Drag-and-drop area (no real upload, just show preview)
- Fake file upload: user selects files, we store filenames + random durations
- "Generate Thumbnails" button → 2s spinner → success badge
- "Generate Captions (EN/ES)" button → 2s spinner → success badge
- Interface to group uploads into modules/lessons (local state)

**Step 5: Review & Submit**
- Preview card showing course as student would see it
- "Save Draft" button → saves to localStorage, shows toast
- "Submit for Review" button → saves to localStorage with `status: 'pending'`, shows success screen

**Success Screen:**
- "Submitted for Review" message
- "Your course is under review. We'll notify you within 24-48 hours."
- "View Dashboard" button → Educator Dashboard

---

### ⏳ Task 6: Enhanced Educator Dashboard - PENDING
**Component:** Update `src/pages/EducatorDashboard.tsx`

**Additional Requirements:**
- **Stats Cards** (mock data):
  - Students Enrolled: 156
  - Lessons Completed: 2,341
  - Avg Rating: 4.8 ⭐
  - Revenue This Month: $3,847
- **Students Table:**
  - Columns: Name, Avatar, Course, Progress %, At-Risk badge
  - Mock data for 10 students
  - At-risk logic: progress < 30% in past 7 days
- **Latest Questions Section:**
  - List of discussion board questions
  - Click to view thread (fake modal/expansion)
- **Charts** (can be static or use simple chart library):
  - Completion by Lesson (bar chart)
  - Revenue Trend (line chart, last 6 months)

---

### ⏳ Task 7: Live Events Schedule & Management - PENDING
**Components:**
- Update `src/pages/EducatorDashboard.tsx` - add "Schedule Live Event" button
- Create `src/components/educator/ScheduleLiveEventModal.tsx`
- Update/Create `src/pages/LiveEvent.tsx` for broadcaster view

**Schedule Live Event Modal:**
- Title input
- Description textarea
- Date picker
- Time picker
- Duration input (minutes)
- Max attendees input
- Associated course dropdown (from created courses)
- Checkboxes: Enable Chat, Enable Q&A, Enable Polls, Record Session
- "Create Event" button → saves to localStorage: `liveEvents` array
- Shows success toast and adds to "Upcoming Events" section

**Live Event Page (Broadcaster View):**
- Event details at top (title, date, time, attendees count)
- **"Go Live" button** → enables streaming view:
  - Large video placeholder area (just a gray box with text "Your camera feed")
  - Right sidebar with tabs: Chat / Q&A / Polls
  - Mock chat messages appearing every few seconds
  - Mock Q&A questions from attendees
  - "End Stream" button at top
- **After "End Stream":**
  - Success screen: "Stream ended successfully"
  - "Recording available soon" message
  - After 3 seconds, shows "Watch Replay" button (just a link, doesn't actually play)

**Upcoming Events Section (Dashboard):**
- List of scheduled events
- Click event → goes to Live Event page
- Shows countdown timer if event is today

---

## LocalStorage Keys

### Student Journey (Already Implemented)
```javascript
onboardingData
hasSeenWelcomeTour
enrolledCourses
course_{id}_progress
mockCertificates
communityPromptDismissed
joinedCommunities
communityPosts_{id}
```

### Educator Journey (To Be Implemented)
```javascript
userRole                    // 'student' or 'educator'
educatorPreviewMode         // 'true' when in preview mode
selectedPlan                // 'free', 'pro', or 'premium'
educatorProfile             // { name, photo, bio, expertise, teachingStyles, contentTypes }
createdCourses              // Array of course objects
liveEvents                  // Array of live event objects
courseBuilder_draft         // Current wizard state (for resuming)
```

---

## Technical Implementation Notes

### Component Structure
```
src/
├── pages/
│   ├── ForEducators.tsx ✅ (Updated)
│   ├── EducatorOnboarding.tsx ⏳ (Create)
│   ├── EducatorDashboard.tsx ⏳ (Update)
│   └── LiveEvent.tsx ⏳ (Update/Create)
├── components/
│   └── educator/
│       ├── PlanSelectionModal.tsx ⏳ (Update existing)
│       ├── CourseBuilderWizard.tsx ⏳ (Create)
│       ├── ScheduleLiveEventModal.tsx ⏳ (Create)
│       ├── OnboardingChecklist.tsx ⏳ (Create)
│       ├── StudentTable.tsx ⏳ (Create)
│       └── RevenueChart.tsx ⏳ (Optional - can use static)
```

### All Features Use Mock Data
- No real Stripe integration
- No real file uploads (just filenames and fake metadata)
- No real streaming (just placeholder UI)
- All state in localStorage
- Clear TODO comments for backend integration

---

## Testing Checklist (After Implementation)

### Journey A: Landing → Onboarding
- [ ] Visit `/for-educators`
- [ ] See hero, 3 benefit cards, features overview
- [ ] Click "Explore as an Educator"
- [ ] Auth modal opens
- [ ] After auth, localStorage has `userRole: 'educator'` and `educatorPreviewMode: 'true'`
- [ ] Redirected to `/explore`

### Journey B: Plan Selection → Profile
- [ ] Plan selection modal appears (or accessible from Explore)
- [ ] Click FREE plan → immediately continues
- [ ] Click PRO/PREMIUM → fake Stripe modal → 2s loader → success
- [ ] Onboarding form shows
- [ ] Fill all fields (name, photo preview, bio, tags, styles)
- [ ] Click "Save & Continue" → Educator Dashboard
- [ ] localStorage has `educatorProfile` with all data

### Journey C: Course Builder
- [ ] From dashboard, click "Create New Course"
- [ ] Step 1: Select course type → Next
- [ ] Step 2: Fill course details → Next
- [ ] Step 3: Set pricing, see fee calculation → Next
- [ ] Step 4: "Upload" files (fake), generate thumbnails/captions → Next
- [ ] Step 5: Review preview card
- [ ] Click "Save Draft" → toast appears, course in localStorage
- [ ] Click "Submit for Review" → success screen
- [ ] localStorage has course with `status: 'pending'`

### Journey D: Dashboard Stats & Students
- [ ] Dashboard shows 4 stat cards with numbers
- [ ] Student table shows 10 students with progress
- [ ] At-risk badges appear for low-progress students
- [ ] Latest questions section shows discussion items
- [ ] Charts display (completion + revenue)

### Journey E: Live Events
- [ ] Click "Schedule Live Event" on dashboard
- [ ] Fill event form (title, date, time, duration, checkboxes)
- [ ] Click "Create Event" → success toast
- [ ] Event appears in "Upcoming Events" section
- [ ] Click event → Live Event page
- [ ] Click "Go Live" → video placeholder + chat sidebar appear
- [ ] Mock chat messages appear
- [ ] Click "End Stream" → success message
- [ ] "Recording available soon" appears
- [ ] After 3s, "Watch Replay" button shows

---

## Next Steps

1. **Task 2**: Create/update Plan Selection Modal with fake Stripe flow
2. **Task 3**: Create Educator Onboarding form
3. **Task 4**: Add onboarding checklist to Dashboard
4. **Task 5**: Build complete 5-step Course Builder Wizard
5. **Task 6**: Enhance Dashboard with stats, student table, charts
6. **Task 7**: Create Live Event scheduling and broadcaster view

**Estimated Components:** 8 new files, 2 updated files  
**Estimated LOC:** ~2,000 lines total  
**All features:** Mock data + localStorage only
