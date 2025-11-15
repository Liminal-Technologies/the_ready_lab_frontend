# Supabase Configuration for Auto-Login After Signup

## Current Issue
After signing up, users are not automatically logged in because Supabase requires email confirmation by default. This means:
- Users see "Check your email" screen
- They must click the confirmation link to establish a session
- Header doesn't show they're logged in until they confirm

## Solution: Disable Email Confirmation Requirement

To enable **auto-login after signup** (better UX for demos and free tiers):

### Steps to Configure Supabase

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Open Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Go to "Providers" > "Email"

3. **Disable Email Confirmation**
   - Find the "Confirm email" toggle
   - **Turn it OFF** (or set to "Auto-confirm")
   - Save the changes

### Alternative: Enable Email Confirmation but Allow Auto-Login

If you want to keep email confirmation for security but still auto-login users:

1. In Supabase Dashboard → Authentication → Email Templates
2. Set "Confirm signup" template to send confirmation emails
3. Configure "Auto Confirm Email" setting in Auth → Settings
4. Enable "Enable email confirmations" but check "Auto confirm users"

## What This Fixes

With email confirmation disabled:
- ✅ Users are immediately logged in after signup
- ✅ Free tier: Instant access to student dashboard
- ✅ Paid tier: After payment succeeds, instant access to dashboard
- ✅ Header shows logged-in state immediately
- ✅ No waiting for email confirmation

Email confirmation will still be sent but won't block access.

## Code Implementation

The code now handles both scenarios:

```typescript
// In useAuth.ts
if (data.session) {
  // Session exists - user is auto-logged in
  // Create profile and redirect to dashboard
} else {
  // No session - show email confirmation screen
  // User must click email link to establish session
}
```

## Testing

After disabling email confirmation:

1. Go to /pricing
2. Select a free plan (Student Free or Educator Free Trial)
3. Fill out signup form
4. Click "Create Account"
5. **Expected**: Immediately redirected to dashboard with header showing logged-in state
6. **Not Expected**: "Check your email" screen

## Security Note

For production environments, you may want to keep email confirmation enabled for security. The code supports both modes:
- **Development/Demo**: Auto-login (email confirmation disabled)
- **Production**: Email confirmation required (better security)
