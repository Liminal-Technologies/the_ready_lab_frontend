/**
 * TRL API Client Service
 *
 * Provides typed API access to the trl-api backend.
 * Uses Supabase session tokens for authentication.
 */

import { supabase } from '@/integrations/supabase/client';

// API Base URL - defaults to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ============================================================================
// Types
// ============================================================================

// Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'student' | 'educator' | 'admin';
  subscription_status?: string;
  subscription_tier?: string;
  avatar_url?: string;
  preferred_language?: string;
  show_content_in_language_first?: boolean;
  created_at: string;
  updated_at: string;
}

// User Role Types
export interface UserRole {
  id: string;
  user_id: string;
  role: 'student' | 'educator' | 'admin';
  is_primary: boolean;
  created_at: string;
}

// User Interest Types
export interface UserInterest {
  id: string;
  user_id: string;
  interest: string;
  created_at: string;
}

// Track Types
export interface Track {
  id: string;
  title: string;
  description?: string;
  price: number;
  certification_type?: 'accredited' | 'completion';
  completion_requirement?: number;
  is_active: boolean;
  created_by: string;
  thumbnail_url?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours?: number;
  interest_tags?: string[];
  roadmap_tags?: string[];
  translations?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Module Types
export interface Module {
  id: string;
  track_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

// Lesson Types
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'pdf' | 'template' | 'link' | 'poll' | 'prompt';
  content_url?: string;
  content_data?: unknown;
  order_index: number;
  duration_minutes?: number;
  is_required: boolean;
  is_standalone: boolean;
  poster_url?: string;
  thumbnail_url?: string;
  video_duration_seconds?: number;
  created_at: string;
  updated_at: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  user_id: string;
  track_id: string;
  enrollment_date: string;
  completion_date?: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
  track?: Track;
}

// Lesson Progress Types
export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_date?: string;
  time_spent_minutes: number;
  created_at: string;
  updated_at: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  passing_score: number;
  time_limit_minutes?: number;
  questions: unknown[];
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  answers: unknown[];
  started_at: string;
  completed_at?: string;
}

// Certification Types
export interface Certification {
  id: string;
  user_id: string;
  track_id: string;
  certificate_type: 'accredited' | 'completion';
  status: 'pending' | 'approved' | 'issued' | 'rejected';
  issue_date?: string;
  certificate_url?: string;
  shareable_url?: string;
  approved_by?: string;
  instructor_signature?: string;
  created_at: string;
  updated_at: string;
  track?: Track;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description?: string;
  visibility: 'open' | 'private';
  created_by: string;
  member_count: number;
  rules?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
  profile?: Profile;
}

// Post Types
export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  title?: string;
  content: string;
  media_urls?: string[];
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  author?: Profile;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

// Live Event Types
export interface LiveEvent {
  id: string;
  title: string;
  description?: string;
  host_id: string;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  stream_key?: string;
  playback_id?: string;
  thumbnail_url?: string;
  max_viewers?: number;
  current_viewers?: number;
  created_at: string;
  updated_at: string;
}

export interface LiveEventCredentials {
  stream_key: string;
  rtmp_url: string;
  playback_url: string;
}

export interface ChatMessage {
  id: string;
  live_event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: Profile;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  file_url?: string;
  thumbnail_url?: string;
  created_by: string;
  is_active: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

// Purchase Types
export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  stripe_payment_id?: string;
  status: 'pending' | 'completed' | 'refunded';
  created_at: string;
  product?: Product;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id?: string;
  plan?: SubscriptionPlan;
}

// Stripe Connect Types
export interface StripeConnectAccount {
  id: string;
  user_id: string;
  stripe_account_id: string;
  status: 'pending' | 'active' | 'restricted' | 'disabled';
  payouts_enabled: boolean;
  charges_enabled: boolean;
  created_at: string;
}

export interface EducatorPayout {
  id: string;
  educator_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  stripe_payout_id?: string;
  created_at: string;
  paid_at?: string;
}

// Institution Types
export interface Institution {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  contact_email?: string;
  subscription_tier?: string;
  max_members?: number;
  created_at: string;
  updated_at: string;
}

export interface InstitutionMember {
  id: string;
  institution_id: string;
  user_id: string;
  role: 'member' | 'admin' | 'owner';
  joined_at: string;
  profile?: Profile;
}

// Admin Types
export interface AdminRole {
  id: string;
  user_id: string;
  role: 'super_admin' | 'content_admin' | 'finance_admin' | 'community_admin' | 'compliance_admin' | 'support_agent' | 'institution_manager';
  granted_by?: string;
  granted_at: string;
  is_active: boolean;
  feature_flags?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  is_enabled: boolean;
  percentage_rollout?: number;
  user_whitelist?: string[];
  created_at: string;
  updated_at: string;
}

export interface EducatorAgreement {
  id: string;
  user_id: string;
  agreement_version: string;
  accepted_at: string;
  ip_address?: string;
}

export interface VerifiedBadge {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

// Bookmark Types
export interface Bookmark {
  id: string;
  user_id: string;
  bookmarkable_type: 'lesson' | 'track' | 'post' | 'product';
  bookmarkable_id: string;
  created_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

// Video Types
export interface Video {
  id: string;
  lesson_id?: string;
  title: string;
  mux_asset_id?: string;
  mux_playback_id?: string;
  duration_seconds?: number;
  status: 'pending' | 'processing' | 'ready' | 'errored';
  created_at: string;
}

// ============================================================================
// API Client Class
// ============================================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current auth token from Supabase session
   */
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  }

  // ============================================================================
  // Profile Endpoints
  // ============================================================================

  profiles = {
    get: (userId: string) =>
      this.request<Profile>(`/api/profiles/${userId}`),

    create: (data: Partial<Profile>) =>
      this.request<Profile>('/api/profiles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (userId: string, data: Partial<Profile>) =>
      this.request<Profile>(`/api/profiles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // ============================================================================
  // User Role Endpoints
  // ============================================================================

  userRoles = {
    get: (userId: string) =>
      this.request<UserRole>(`/api/user-roles/${userId}`),

    create: (data: { user_id: string; role: string; is_primary?: boolean }) =>
      this.request<UserRole>('/api/user-roles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (userId: string, data: { role?: string; is_primary?: boolean }) =>
      this.request<UserRole>(`/api/user-roles/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (userId: string) =>
      this.request<void>(`/api/user-roles/${userId}`, { method: 'DELETE' }),
  };

  // ============================================================================
  // User Interest Endpoints
  // ============================================================================

  userInterests = {
    list: (userId: string) =>
      this.request<UserInterest[]>(`/api/user-interests/${userId}`),

    add: (userId: string, interest: string) =>
      this.request<UserInterest>(`/api/user-interests/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ interest }),
      }),

    set: (userId: string, interests: string[]) =>
      this.request<UserInterest[]>(`/api/user-interests/${userId}/bulk`, {
        method: 'PUT',
        body: JSON.stringify({ interests }),
      }),

    remove: (userId: string, interest: string) =>
      this.request<void>(`/api/user-interests/${userId}/${encodeURIComponent(interest)}`, {
        method: 'DELETE',
      }),
  };

  // ============================================================================
  // Track Endpoints
  // ============================================================================

  tracks = {
    list: (params?: { category?: string; level?: string; is_active?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.level) searchParams.set('level', params.level);
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      return this.request<Track[]>(`/api/tracks?${searchParams}`);
    },

    get: (id: string) =>
      this.request<Track>(`/api/tracks/${id}`),

    create: (data: Partial<Track>) =>
      this.request<Track>('/api/tracks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Track>) =>
      this.request<Track>(`/api/tracks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/tracks/${id}`, { method: 'DELETE' }),
  };

  // ============================================================================
  // Module Endpoints
  // ============================================================================

  modules = {
    list: (trackId: string) =>
      this.request<Module[]>(`/api/modules?track_id=${trackId}`),

    get: (id: string) =>
      this.request<Module>(`/api/modules/${id}`),

    create: (data: Partial<Module>) =>
      this.request<Module>('/api/modules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Module>) =>
      this.request<Module>(`/api/modules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/modules/${id}`, { method: 'DELETE' }),
  };

  // ============================================================================
  // Lesson Endpoints
  // ============================================================================

  lessons = {
    list: (moduleId: string) =>
      this.request<Lesson[]>(`/api/lessons?module_id=${moduleId}`),

    get: (id: string) =>
      this.request<Lesson>(`/api/lessons/${id}`),

    create: (data: Partial<Lesson>) =>
      this.request<Lesson>('/api/lessons', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Lesson>) =>
      this.request<Lesson>(`/api/lessons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/lessons/${id}`, { method: 'DELETE' }),
  };

  // ============================================================================
  // Enrollment Endpoints
  // ============================================================================

  enrollments = {
    list: (userId?: string, trackId?: string) => {
      const params = new URLSearchParams();
      if (userId) params.set('user_id', userId);
      if (trackId) params.set('track_id', trackId);
      return this.request<Enrollment[]>(`/api/enrollments?${params}`);
    },

    get: (id: string) =>
      this.request<Enrollment>(`/api/enrollments/${id}`),

    create: (data: { user_id: string; track_id: string }) =>
      this.request<Enrollment>('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateProgress: (id: string, progressPercentage: number) =>
      this.request<Enrollment>(`/api/enrollments/${id}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ progress_percentage: progressPercentage }),
      }),
  };

  // ============================================================================
  // Lesson Progress Endpoints
  // ============================================================================

  lessonProgress = {
    get: (userId: string, lessonId: string) =>
      this.request<LessonProgress>(`/api/lessons/${lessonId}/progress/${userId}`),

    update: (userId: string, lessonId: string, data: Partial<LessonProgress>) =>
      this.request<LessonProgress>(`/api/lessons/${lessonId}/progress/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // ============================================================================
  // Quiz Endpoints
  // ============================================================================

  quizzes = {
    get: (lessonId: string) =>
      this.request<Quiz>(`/api/quizzes/lesson/${lessonId}`),

    create: (data: Partial<Quiz>) =>
      this.request<Quiz>('/api/quizzes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Quiz>) =>
      this.request<Quiz>(`/api/quizzes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    submitAttempt: (quizId: string, answers: unknown[]) =>
      this.request<QuizAttempt>(`/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),

    getAttempts: (quizId: string, userId: string) =>
      this.request<QuizAttempt[]>(`/api/quizzes/${quizId}/attempts/${userId}`),
  };

  // ============================================================================
  // Certification Endpoints
  // ============================================================================

  certifications = {
    list: (userId: string) =>
      this.request<Certification[]>(`/api/certifications/user/${userId}`),

    get: (id: string) =>
      this.request<Certification>(`/api/certifications/${id}`),

    request: (trackId: string) =>
      this.request<Certification>('/api/certifications/request', {
        method: 'POST',
        body: JSON.stringify({ track_id: trackId }),
      }),

    approve: (id: string, signature?: string) =>
      this.request<Certification>(`/api/certifications/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ instructor_signature: signature }),
      }),
  };

  // ============================================================================
  // Community Endpoints
  // ============================================================================

  communities = {
    list: (params?: { visibility?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.visibility) searchParams.set('visibility', params.visibility);
      return this.request<Community[]>(`/api/communities?${searchParams}`);
    },

    get: (id: string) =>
      this.request<Community>(`/api/communities/${id}`),

    create: (data: Partial<Community>) =>
      this.request<Community>('/api/communities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Community>) =>
      this.request<Community>(`/api/communities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/communities/${id}`, { method: 'DELETE' }),

    // Member management
    members: {
      list: (communityId: string) =>
        this.request<CommunityMember[]>(`/api/communities/${communityId}/members`),

      join: (communityId: string) =>
        this.request<CommunityMember>(`/api/communities/${communityId}/members`, {
          method: 'POST',
        }),

      leave: (communityId: string, userId: string) =>
        this.request<void>(`/api/communities/${communityId}/members/${userId}`, {
          method: 'DELETE',
        }),

      updateRole: (communityId: string, userId: string, role: string) =>
        this.request<CommunityMember>(`/api/communities/${communityId}/members/${userId}`, {
          method: 'PUT',
          body: JSON.stringify({ role }),
        }),
    },
  };

  // ============================================================================
  // Post Endpoints
  // ============================================================================

  posts = {
    list: (communityId: string) =>
      this.request<Post[]>(`/api/posts?community_id=${communityId}`),

    get: (id: string) =>
      this.request<Post>(`/api/posts/${id}`),

    create: (data: { community_id: string; content: string; title?: string; media_urls?: string[] }) =>
      this.request<Post>('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: { content?: string; title?: string; media_urls?: string[] }) =>
      this.request<Post>(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/posts/${id}`, { method: 'DELETE' }),

    // Comments
    comments: {
      list: (postId: string) =>
        this.request<PostComment[]>(`/api/posts/${postId}/comments`),

      create: (postId: string, content: string) =>
        this.request<PostComment>(`/api/posts/${postId}/comments`, {
          method: 'POST',
          body: JSON.stringify({ content }),
        }),
    },

    // Reactions
    reactions: {
      list: (postId: string) =>
        this.request<PostReaction[]>(`/api/posts/${postId}/reactions`),

      add: (postId: string, reactionType: string) =>
        this.request<PostReaction>(`/api/posts/${postId}/reactions`, {
          method: 'POST',
          body: JSON.stringify({ reaction_type: reactionType }),
        }),

      remove: (postId: string) =>
        this.request<void>(`/api/posts/${postId}/reactions`, { method: 'DELETE' }),
    },

    // Bookmarks
    bookmark: (postId: string) =>
      this.request<Bookmark>(`/api/posts/${postId}/bookmark`, { method: 'POST' }),

    // Reports
    report: (postId: string, reason: string, details?: string) =>
      this.request<void>(`/api/posts/${postId}/report`, {
        method: 'POST',
        body: JSON.stringify({ reason, details }),
      }),
  };

  // ============================================================================
  // Live Event Endpoints
  // ============================================================================

  liveEvents = {
    list: (params?: { host_id?: string; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.host_id) searchParams.set('host_id', params.host_id);
      if (params?.status) searchParams.set('status', params.status);
      return this.request<LiveEvent[]>(`/api/live-events?${searchParams}`);
    },

    get: (id: string) =>
      this.request<LiveEvent>(`/api/live-events/${id}`),

    create: (data: Partial<LiveEvent>) =>
      this.request<LiveEvent>('/api/live-events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<LiveEvent>) =>
      this.request<LiveEvent>(`/api/live-events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/live-events/${id}`, { method: 'DELETE' }),

    getCredentials: (id: string) =>
      this.request<LiveEventCredentials>(`/api/live-events/${id}/credentials`),

    // Chat
    chat: {
      list: (eventId: string) =>
        this.request<ChatMessage[]>(`/api/live-events/${eventId}/chat`),

      send: (eventId: string, message: string) =>
        this.request<ChatMessage>(`/api/live-events/${eventId}/chat`, {
          method: 'POST',
          body: JSON.stringify({ message }),
        }),

      delete: (eventId: string, messageId: string) =>
        this.request<void>(`/api/live-events/${eventId}/chat/${messageId}`, {
          method: 'DELETE',
        }),
    },
  };

  // ============================================================================
  // Product Endpoints
  // ============================================================================

  products = {
    list: (params?: { created_by?: string; is_active?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.created_by) searchParams.set('created_by', params.created_by);
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      return this.request<Product[]>(`/api/products?${searchParams}`);
    },

    get: (id: string) =>
      this.request<Product>(`/api/products/${id}`),

    create: (data: Partial<Product>) =>
      this.request<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Product>) =>
      this.request<Product>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/products/${id}`, { method: 'DELETE' }),
  };

  // ============================================================================
  // Purchase Endpoints
  // ============================================================================

  purchases = {
    list: (userId: string) =>
      this.request<Purchase[]>(`/api/purchases/user/${userId}`),

    get: (id: string) =>
      this.request<Purchase>(`/api/purchases/${id}`),

    create: (data: { product_id: string; stripe_payment_id?: string }) =>
      this.request<Purchase>('/api/purchases', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // ============================================================================
  // Subscription Endpoints
  // ============================================================================

  subscriptions = {
    plans: {
      list: () =>
        this.request<SubscriptionPlan[]>('/api/subscriptions/plans'),
    },

    get: (userId: string) =>
      this.request<UserSubscription>(`/api/subscriptions/user/${userId}`),

    create: (data: { plan_id: string; billing_period: 'monthly' | 'yearly' }) =>
      this.request<UserSubscription>('/api/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    cancel: (userId: string) =>
      this.request<void>(`/api/subscriptions/user/${userId}/cancel`, {
        method: 'POST',
      }),

    invoices: (userId: string) =>
      this.request<unknown[]>(`/api/subscriptions/user/${userId}/invoices`),
  };

  // ============================================================================
  // Stripe Connect Endpoints
  // ============================================================================

  stripeConnect = {
    getStatus: (userId: string) =>
      this.request<StripeConnectAccount>(`/api/stripe-connect/${userId}/status`),

    create: (userId: string) =>
      this.request<{ url: string }>(`/api/stripe-connect/${userId}/create`, {
        method: 'POST',
      }),

    updateStatus: (userId: string) =>
      this.request<StripeConnectAccount>(`/api/stripe-connect/${userId}/update-status`, {
        method: 'PUT',
      }),

    payouts: (userId: string) =>
      this.request<EducatorPayout[]>(`/api/stripe-connect/${userId}/payouts`),
  };

  // ============================================================================
  // Institution Endpoints
  // ============================================================================

  institutions = {
    get: (id: string) =>
      this.request<Institution>(`/api/institutions/${id}`),

    create: (data: Partial<Institution>) =>
      this.request<Institution>('/api/institutions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Institution>) =>
      this.request<Institution>(`/api/institutions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    members: {
      list: (institutionId: string) =>
        this.request<InstitutionMember[]>(`/api/institutions/${institutionId}/members`),

      add: (institutionId: string, userId: string, role: string) =>
        this.request<InstitutionMember>(`/api/institutions/${institutionId}/members`, {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, role }),
        }),

      remove: (institutionId: string, userId: string) =>
        this.request<void>(`/api/institutions/${institutionId}/members/${userId}`, {
          method: 'DELETE',
        }),

      updateRole: (institutionId: string, userId: string, role: string) =>
        this.request<InstitutionMember>(`/api/institutions/${institutionId}/members/${userId}`, {
          method: 'PUT',
          body: JSON.stringify({ role }),
        }),
    },
  };

  // ============================================================================
  // Admin Endpoints
  // ============================================================================

  admin = {
    roles: {
      list: (userId: string) =>
        this.request<AdminRole[]>(`/api/admin/roles/${userId}`),

      grant: (userId: string, role: string, grantedBy: string) =>
        this.request<AdminRole>('/api/admin/roles', {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, role, granted_by: grantedBy }),
        }),

      revoke: (userId: string, role: string) =>
        this.request<void>(`/api/admin/roles/${userId}/${role}`, {
          method: 'DELETE',
        }),
    },

    auditLogs: {
      list: (params?: { user_id?: string; action?: string; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.user_id) searchParams.set('user_id', params.user_id);
        if (params?.action) searchParams.set('action', params.action);
        if (params?.limit) searchParams.set('limit', String(params.limit));
        return this.request<AuditLog[]>(`/api/admin/audit-logs?${searchParams}`);
      },

      create: (data: Partial<AuditLog>) =>
        this.request<AuditLog>('/api/admin/audit-logs', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
    },

    featureFlags: {
      list: () =>
        this.request<FeatureFlag[]>('/api/admin/feature-flags'),

      get: (name: string) =>
        this.request<FeatureFlag>(`/api/admin/feature-flags/${name}`),

      update: (name: string, data: Partial<FeatureFlag>) =>
        this.request<FeatureFlag>(`/api/admin/feature-flags/${name}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
    },

    educatorAgreements: {
      list: (userId: string) =>
        this.request<EducatorAgreement[]>(`/api/admin/educator-agreements/${userId}`),

      accept: (agreementVersion: string) =>
        this.request<EducatorAgreement>('/api/admin/educator-agreements', {
          method: 'POST',
          body: JSON.stringify({ agreement_version: agreementVersion }),
        }),
    },

    verifiedBadges: {
      get: (userId: string) =>
        this.request<VerifiedBadge>(`/api/admin/verified-badges/${userId}`),

      request: () =>
        this.request<VerifiedBadge>('/api/admin/verified-badges', {
          method: 'POST',
        }),

      updateStatus: (userId: string, status: string, rejectionReason?: string) =>
        this.request<VerifiedBadge>(`/api/admin/verified-badges/${userId}`, {
          method: 'PUT',
          body: JSON.stringify({ status, rejection_reason: rejectionReason }),
        }),
    },
  };

  // ============================================================================
  // Bookmark Endpoints
  // ============================================================================

  bookmarks = {
    list: (userId: string) =>
      this.request<Bookmark[]>(`/api/bookmarks/user/${userId}`),

    create: (type: string, itemId: string) =>
      this.request<Bookmark>('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ bookmarkable_type: type, bookmarkable_id: itemId }),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/bookmarks/${id}`, { method: 'DELETE' }),

    deleteByItem: (userId: string, type: string, itemId: string) =>
      this.request<void>(`/api/bookmarks/user/${userId}/${type}/${itemId}`, {
        method: 'DELETE',
      }),
  };

  // ============================================================================
  // Notification Endpoints
  // ============================================================================

  notifications = {
    list: (userId: string, unreadOnly?: boolean) => {
      const params = unreadOnly ? '?unread=true' : '';
      return this.request<Notification[]>(`/api/notifications/user/${userId}${params}`);
    },

    markRead: (id: string) =>
      this.request<Notification>(`/api/notifications/${id}/read`, {
        method: 'PUT',
      }),

    markAllRead: (userId: string) =>
      this.request<void>(`/api/notifications/user/${userId}/read-all`, {
        method: 'PUT',
      }),
  };

  // ============================================================================
  // Video Endpoints
  // ============================================================================

  videos = {
    get: (id: string) =>
      this.request<Video>(`/api/videos/${id}`),

    getUploadUrl: () =>
      this.request<{ url: string; id: string }>('/api/videos/upload-url'),

    create: (data: { lesson_id?: string; title: string; mux_upload_id: string }) =>
      this.request<Video>('/api/videos', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // ============================================================================
  // Health Check
  // ============================================================================

  health = () =>
    this.request<{ status: string; timestamp: string; services: Record<string, string> }>('/health');
}

// Export singleton instance
export const api = new ApiClient();

// Export class for custom instances
export { ApiClient };
