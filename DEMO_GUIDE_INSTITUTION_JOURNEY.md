"For institutions with existing LMS systems, we provide seamless integration..."

**URL:** `/admin-dashboard/settings/integrations`

**LTI Integration (Canvas/Blackboard):**

**Setup Steps:**
1. Generate LTI credentials
   - **Consumer Key:** auto-generated
   - **Shared Secret:** auto-generated
2. Copy config URL
3. In Canvas/Blackboard admin:
   - Add external app
   - Paste config URL
   - Test connection
4. Courses appear as external tools
5. Grades sync automatically

**Features:**
- ✓ Grade passback (LTI 1.3)
- ✓ Deep linking (launch specific courses)
- ✓ Rostering sync (automatic user provisioning)
- ✓ Single sign-on (SSO via LTI)

**API Integration:**
For custom integrations:
- **API Key:** Generate in settings
- **Documentation:** /api/docs
- **Rate Limits:** 1,000 requests/hour
- **Webhooks:** Real-time event notifications

**Available Endpoints:**
```
GET  /api/v1/users
POST /api/v1/users
GET  /api/v1/enrollments
POST /api/v1/enrollments
GET  /api/v1/progress
GET  /api/v1/certificates
```

**Verification:**
✓ LTI credentials generated  
✓ Integration tested  
✓ Grades sync correctly  
✓ API endpoints accessible

---

## Journey F: Billing & Subscription Management (Ongoing)

### Step 1: Subscription Overview
**Demo Script:**
> "The billing section shows current subscription, usage, and invoices..."

**URL:** `/admin-dashboard/billing`

**Subscription Details:**

#### Current Plan:
```
╔════════════════════════════════════════╗
║  ENTERPRISE PLAN                       ║
╠════════════════════════════════════════╣
║  Base Platform:     $1,500/month       ║
║  Active Users:       1,247 users       ║
║  Per-User Rate:      $8/user           ║
║  Monthly User Cost:  $9,976            ║
║  ────────────────────────────────────  ║
║  Total This Month:   $11,476           ║
║                                        ║
║  Next Billing Date:  Feb 1, 2025       ║
║  Payment Method:     •••• 4242         ║
╚════════════════════════════════════════╝
```

#### Usage Breakdown:
- **Active Users (Last 30 Days):** 1,247
- **Storage Used:** 245 GB / Unlimited
- **Bandwidth:** 1.2 TB / Unlimited
- **API Calls:** 45,230 / 100,000 included

#### Included Features:
- ✓ Unlimited courses
- ✓ Unlimited video hosting
- ✓ White-label branding
- ✓ SSO integration
- ✓ LMS connectors
- ✓ Custom domain
- ✓ API access
- ✓ Dedicated support
- ✓ 99.9% uptime SLA

**Verification:**
✓ Subscription displays correctly  
✓ Usage stats accurate  
✓ Billing calculations correct

---

### Step 2: Invoice History
**Demo Script:**
> "All invoices are available for download and sent to the billing contact..."

**Invoice Table:**
| Date | Amount | Status | Invoice |
|------|--------|--------|---------|
| Jan 1, 2025 | $11,476 | ✓ Paid | [Download PDF] |
| Dec 1, 2024 | $10,892 | ✓ Paid | [Download PDF] |
| Nov 1, 2024 | $9,234 | ✓ Paid | [Download PDF] |

**Invoice Details (PDF):**
```
INVOICE #INV-2025-001
Date: January 1, 2025
Due Date: January 15, 2025

Bill To:
Metro State University
Attn: Dr. Robert Chen
123 University Ave
Metro City, ST 12345

Description                    Qty      Rate      Amount
─────────────────────────────────────────────────────
Platform Base Fee               1    $1,500.00   $1,500.00
Active Users (Jan 2025)     1,247        $8.00   $9,976.00
                                                 ──────────
Subtotal                                        $11,476.00
Tax (0%)                                             $0.00
                                                 ──────────
TOTAL DUE                                       $11,476.00

Payment Method: Visa •••• 4242
Status: PAID - Jan 5, 2025
```

**Actions:**
1. Click "Download PDF" on any invoice
2. Invoice downloads immediately
3. Can email invoices to accounting

**Verification:**
✓ Invoices display  
✓ PDF downloads  
✓ Amounts correct  
✓ Payment status accurate

---

### Step 3: Manage Payment Method
**Demo Script:**
> "Billing admins can update payment methods and add multiple cards..."

**Payment Methods:**
```
Primary Payment Method:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Visa •••• 4242
   Expires: 12/2026
   [Edit] [Remove] [Set as Primary]

Add Payment Method:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[+ Add Credit Card]
[+ Add Bank Account (ACH)]
```

**Billing Contacts:**
- Primary: r.chen@metrostate.edu
- Accounting: accounting@metrostate.edu
- Notifications sent to all contacts

**Verification:**
✓ Can add payment method  
✓ Can remove payment method  
✓ Can set primary  
✓ Billing contacts work

---

## Demo Tips & Best Practices

### Before the Demo:
1. **Prepare sample institution data** (name, logo, colors)
2. **Have CSV file ready** with 50-100 sample users
3. **Pre-load 3-5 courses** to assign
4. **Create 2-3 cohorts** with different dates
5. **Generate sample reports** to show quickly
6. **Test SSO/LTI integrations** if showing

### During the Demo:
1. **Lead with pain points:** "Managing 1,000 learners in spreadsheets is impossible..."
2. **Show ROI:** "Our clients see 3x completion rates vs. traditional LMS"
3. **Emphasize ease:** "CSV upload means setup in minutes, not days"
4. **Highlight support:** "Dedicated account manager and 24/7 support"
5. **Address compliance:** "FERPA, GDPR, 508 compliant out of the box"

### Demo Flow Optimization:
- **15-minute version:** CSV upload → Course assignment → Analytics dashboard
- **30-minute version:** Full user management + cohorts + reporting
- **60-minute version:** Complete admin journey + SSO setup + Q&A
- **90-minute version:** Technical deep-dive with IT team present

### Common Questions to Prepare For:

**Q: "What's the implementation timeline?"**
A: Typically 2-4 weeks:
- Week 1: Branding, SSO setup, admin training
- Week 2: User import, course assignment, testing
- Week 3: Pilot with small cohort
- Week 4: Full rollout

**Q: "Can we migrate content from our old LMS?"**
A: Yes! We have migration tools for:
- SCORM packages
- Video content (MP4, MOV)
- User data (CSV)
- Grades and transcripts
Usually takes 1-2 weeks depending on volume.

**Q: "What about data privacy and security?"**
A: We're fully compliant:
- SOC 2 Type II certified
- FERPA compliant
- GDPR compliant
- Data hosted in US (or EU on request)
- Encrypted in transit and at rest
- Regular security audits

**Q: "Do you offer training for our admins?"**
A: Yes! Included with Enterprise plan:
- 4-hour live onboarding session
- Video tutorials
- Written documentation
- Dedicated account manager
- 24/7 support portal

**Q: "Can students access courses on mobile?"**
A: Absolutely! Our platform is mobile-responsive:
- Native mobile apps (iOS/Android) optional
- Works in any mobile browser
- Offline mode for video downloads
- Push notifications

**Q: "What if we need custom features?"**
A: Custom development available:
- API for custom integrations
- Webhook events for automation
- Custom reporting
- Special pricing for custom work

**Q: "How do you handle peak usage times?"**
A: Infrastructure scales automatically:
- 99.9% uptime SLA
- CDN for global performance
- Auto-scaling servers
- Load tested to 100,000 concurrent users

### Troubleshooting:
- **CSV upload fails:** Check format matches template exactly
- **SSO not working:** Verify certificate and URLs
- **Reports not generating:** Check date range and filters
- **Grades not syncing:** Ensure LTI 1.3 properly configured

---

## Success Metrics to Highlight

When demoing to institutions, emphasize:

- **Implementation Speed:** 2-4 weeks vs. 6-12 months for legacy LMS
- **Cost Savings:** 60% less than traditional LMS over 3 years
- **Completion Rates:** 3x higher than industry average
- **Support Response:** <2 hours for enterprise clients
- **Uptime:** 99.9% guaranteed
- **Customer Retention:** 95% annual renewal rate
- **User Satisfaction:** 4.8/5.0 average rating

---

## Next Steps After Demo

If the demo goes well:
1. **Provide pricing proposal** within 24 hours
2. **Schedule technical review** with IT team
3. **Offer 30-day pilot** with 50-100 users
4. **Share case studies** from similar institutions
5. **Connect with references** (peer institutions)
6. **Draft implementation timeline**
7. **Prepare contract** for review

**Typical Sales Cycle:**
- Initial demo → Proposal: 1 week
- Technical review → Contract: 2-4 weeks
- Contract → Implementation: 2-4 weeks
- Total: 5-9 weeks from first contact to launch

---

## Conclusion

The institution journey demonstrates a comprehensive admin platform for managing large-scale learning programs. Key differentiators:

✅ **Rapid deployment:** 2-4 weeks vs. months  
✅ **Bulk operations:** CSV upload for 1,000s of users  
✅ **Comprehensive analytics:** Real-time progress tracking  
✅ **Flexible integrations:** SSO, LTI, API access  
✅ **White-label branding:** Fully customizable  
✅ **Dedicated support:** Account manager + 24/7 help  

**Questions?** Contact enterprise@thereadylab.com or schedule a follow-up call.

---

## Appendix: Technical Specifications

### System Requirements:
- **Browser:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS 13+, Android 8+
- **Network:** 5 Mbps minimum per user
- **Storage:** Unlimited cloud storage included

### Security & Compliance:
- **Certifications:** SOC 2 Type II, ISO 27001
- **Compliance:** FERPA, GDPR, CCPA, 508
- **Encryption:** TLS 1.3, AES-256
- **Authentication:** MFA, SSO, SAML, OAuth
- **Backups:** Daily automated, 30-day retention
- **DR/BC:** 99.9% uptime, <4 hour RTO

### Integration Capabilities:
- **LMS:** Canvas, Blackboard, Moodle, Brightspace
- **SSO:** SAML, OAuth, LDAP, Azure AD, Okta
- **HRIS:** Workday, BambooHR, ADP
- **CRM:** Salesforce, HubSpot
- **Video:** Zoom, Teams, Webex
- **Analytics:** Google Analytics, Mixpanel
- **API:** RESTful, webhook events, rate limits

### Support Channels:
- **Email:** enterprise@thereadylab.com
- **Phone:** 1-800-READY-LAB
- **Chat:** 24/7 in-app support
- **Portal:** support.thereadylab.com
- **SLA:** <2 hour response for enterprise