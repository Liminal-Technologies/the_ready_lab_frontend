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

// Micro Lesson Types
export interface MicroLesson {
  id: string;
  instructor_id: string;
  title: string;
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_seconds: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  interest_tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  instructor?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface MicroLessonComment {
  id: string;
  micro_lesson_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

// Community Poll Types
export interface CommunityPollOption {
  id: string;
  poll_id: string;
  text: string;
  votes_count: number;
  order_index: number;
  created_at: string;
}

export interface CommunityPoll {
  id: string;
  created_by: string;
  question: string;
  is_active: boolean;
  ends_at?: string;
  total_votes: number;
  created_at: string;
  updated_at: string;
  options: CommunityPollOption[];
  user_vote?: string; // option_id if user has voted
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: string | number;
  fileUrl?: string;
  thumbnailUrl?: string;
  creatorId: string;
  category: string;
  isActive: boolean;
  salesCount: number;
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

// Course Types (for CourseBrowse page)
export interface Course {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnailUrl?: string;
  estimatedHours: number;
  enrollmentCount: number;
  averageRating: number;
  format: 'Video' | 'Interactive' | 'Live';
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  isFeatured: boolean;
  isActive: boolean;
  instructorName: string;
  instructorAvatar?: string;
  certificationType?: string;
  completionRequirement?: number;
  instructor?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  modules?: Array<{
    id: string;
    title: string;
    description?: string;
    orderIndex: number;
    lessons: Array<{
      id: string;
      title: string;
      description?: string;
      contentType: string;
      contentUrl?: string;
      duration?: number;
      orderIndex: number;
    }>;
  }>;
  createdAt: string;
  updatedAt?: string;
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
   * Get the current auth token from Supabase session or JWT auth
   */
  private async getAuthToken(): Promise<string | null> {
    // First check for JWT token from our custom auth system
    const jwtToken = localStorage.getItem('trl_auth_token');
    if (jwtToken) {
      return jwtToken;
    }

    // Fall back to Supabase session token
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
  // Track Endpoints (Course containers)
  // ============================================================================

  tracks = {
    list: (params?: {
      category?: string;
      level?: string;
      is_active?: boolean;
      created_by?: string;
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.level) searchParams.set('level', params.level);
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      if (params?.created_by) searchParams.set('created_by', params.created_by);
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: Track[]; pagination: { limit: number; offset: number } }>(
        `/api/tracks?${searchParams}`
      );
    },

    get: (id: string) =>
      this.request<Track>(`/api/tracks/${id}`),

    create: (data: {
      title: string;
      description?: string;
      category: string;
      level?: string;
      price?: number;
      thumbnail_url?: string;
      is_active?: boolean;
      created_by?: string;
      estimated_hours?: number;
      translations?: Record<string, any>;
    }) =>
      this.request<Track>('/api/tracks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<{
      title: string;
      description: string;
      category: string;
      level: string;
      price: number;
      thumbnail_url: string;
      is_active: boolean;
      estimated_hours: number;
      translations: Record<string, any>;
    }>) =>
      this.request<Track>(`/api/tracks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/tracks/${id}`, { method: 'DELETE' }),

    getModules: (trackId: string) =>
      this.request<{ data: Module[] }>(`/api/tracks/${trackId}/modules`),
  };

  // ============================================================================
  // Module Endpoints
  // ============================================================================

  modules = {
    get: (id: string) =>
      this.request<Module>(`/api/modules/${id}`),

    create: (data: {
      track_id: string;
      title: string;
      description?: string;
      order_index: number;
      is_required?: boolean;
    }) =>
      this.request<Module>('/api/modules', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<{
      title: string;
      description: string;
      order_index: number;
      is_required: boolean;
    }>) =>
      this.request<Module>(`/api/modules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/modules/${id}`, { method: 'DELETE' }),

    getLessons: (moduleId: string) =>
      this.request<{ data: Lesson[] }>(`/api/modules/${moduleId}/lessons`),
  };

  // ============================================================================
  // Lesson Endpoints
  // ============================================================================

  lessons = {
    get: (id: string) =>
      this.request<Lesson>(`/api/lessons/${id}`),

    list: (moduleId: string) =>
      this.request<{ lessons: Lesson[] }>(`/api/lessons?moduleId=${moduleId}`),

    /**
     * Get learning feed lessons with optional related data
     */
    feed: (params: {
      user_id?: string;
      include?: ('module' | 'track' | 'progress')[];
      interest_tags?: string[];
      is_standalone?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params.user_id) searchParams.set('user_id', params.user_id);
      if (params.include?.length) searchParams.set('include', params.include.join(','));
      if (params.interest_tags?.length) searchParams.set('interest_tags', params.interest_tags.join(','));
      if (params.is_standalone) searchParams.set('is_standalone', 'true');
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: (Lesson & { module?: Module; track?: Track; progress?: LessonProgress })[]; pagination: { limit: number; offset: number } }>(`/api/lessons/feed?${searchParams}`);
    },

    create: (data: {
      moduleId?: string;
      title: string;
      description?: string;
      lessonType: string;
      orderIndex: number;
      duration?: number;
      videoAssetId?: string;
      contentMarkdown?: string;
      isFreePreview?: boolean;
      isStandalone?: boolean;
      posterUrl?: string;
      thumbnailUrl?: string;
      videoDurationSeconds?: number;
      contentData?: Record<string, any>;
    }) =>
      this.request<Lesson>('/api/lessons', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<{
      title: string;
      description: string;
      orderIndex: number;
      duration: number;
      videoAssetId: string;
      contentMarkdown: string;
      isFreePreview: boolean;
      posterUrl: string;
      thumbnailUrl: string;
      videoDurationSeconds: number;
      contentData: Record<string, any>;
    }>) =>
      this.request<Lesson>(`/api/lessons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/lessons/${id}`, { method: 'DELETE' }),
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
  // Enrollment Endpoints
  // ============================================================================

  enrollments = {
    list: (userId?: string, trackId?: string) => {
      const params = new URLSearchParams();
      if (userId) params.set('user_id', userId);
      if (trackId) params.set('track_id', trackId);
      return this.request<Enrollment[]>(`/api/enrollments?${params}`);
    },

    /**
     * List user enrollments with optional related data
     *
     * TRANSITIONAL IMPLEMENTATION: Uses include param to join related tables.
     * TODO: Replace with purpose-built endpoints that abstract internal schema.
     *
     * @param userId - User ID to get enrollments for
     * @param params.status - Filter by status (active, completed, dropped)
     * @param params.include - Comma-separated: track
     */
    listByUser: (userId: string, params?: {
      status?: 'active' | 'completed' | 'dropped';
      include?: ('track')[];
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.include?.length) searchParams.set('include', params.include.join(','));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: (Enrollment & { track?: Track })[]; pagination: { limit: number; offset: number } }>(`/api/enrollments/user/${userId}?${searchParams}`);
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
      /**
       * List community members with optional profile data
       *
       * TRANSITIONAL IMPLEMENTATION: Uses include param to join related tables.
       * TODO: Replace with purpose-built endpoints that abstract internal schema.
       *
       * @param communityId - Community ID
       * @param params.role - Filter by role
       * @param params.include - Comma-separated: profile
       */
      list: (communityId: string, params?: {
        role?: 'member' | 'moderator' | 'admin';
        include?: ('profile')[];
        limit?: number;
        offset?: number;
      }) => {
        const searchParams = new URLSearchParams();
        if (params?.role) searchParams.set('role', params.role);
        if (params?.include?.length) searchParams.set('include', params.include.join(','));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.offset) searchParams.set('offset', String(params.offset));
        return this.request<{ data: (CommunityMember & { profile?: Profile })[]; pagination: { limit: number; offset: number } }>(`/api/communities/${communityId}/members?${searchParams}`);
      },

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
    /**
     * List posts with optional related data
     *
     * TRANSITIONAL IMPLEMENTATION: Uses include param to join related tables.
     * TODO: Replace with purpose-built endpoints that abstract internal schema.
     *
     * @param params.community_id - Filter by community
     * @param params.include - Comma-separated: author, community
     */
    list: (params?: {
      community_id?: string;
      include?: ('author' | 'community')[];
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.community_id) searchParams.set('community_id', params.community_id);
      if (params?.include?.length) searchParams.set('include', params.include.join(','));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: (Post & { author?: Profile; community?: { id: string; name: string; category: string } })[]; pagination: { limit: number; offset: number } }>(`/api/posts?${searchParams}`);
    },

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

      /**
       * Get current user's reaction on a post
       * Returns { hasReacted, emoji, reactedAt }
       */
      getUserReaction: (postId: string, userId: string) =>
        this.request<{ hasReacted: boolean; emoji: string | null; reactedAt: string | null }>(`/api/posts/${postId}/reactions/user/${userId}`),

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
  // Micro Lesson Endpoints
  // ============================================================================

  microLessons = {
    list: (params?: {
      instructor_id?: string;
      category?: string;
      level?: string;
      interest_tags?: string[];
      is_active?: boolean;
      include?: string[];
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.instructor_id) searchParams.set('instructor_id', params.instructor_id);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.level) searchParams.set('level', params.level);
      if (params?.interest_tags?.length) searchParams.set('interest_tags', params.interest_tags.join(','));
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      if (params?.include?.length) searchParams.set('include', params.include.join(','));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: MicroLesson[]; pagination: { limit: number; offset: number } }>(
        `/api/micro-lessons?${searchParams}`
      );
    },

    get: (id: string, params?: { include?: string[] }) => {
      const searchParams = new URLSearchParams();
      if (params?.include?.length) searchParams.set('include', params.include.join(','));
      return this.request<MicroLesson>(`/api/micro-lessons/${id}?${searchParams}`);
    },

    create: (data: Partial<MicroLesson>) =>
      this.request<MicroLesson>('/api/micro-lessons', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<MicroLesson>) =>
      this.request<MicroLesson>(`/api/micro-lessons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/micro-lessons/${id}`, { method: 'DELETE' }),

    // Like/Unlike
    like: (id: string, userId: string) =>
      this.request<{ success: boolean }>(`/api/micro-lessons/${id}/like`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      }),

    unlike: (id: string, userId: string) =>
      this.request<void>(`/api/micro-lessons/${id}/like?user_id=${userId}`, {
        method: 'DELETE',
      }),

    // Comments
    comments: {
      list: (microLessonId: string, params?: { limit?: number; offset?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.limit) searchParams.set('limit', String(params.limit));
        if (params?.offset) searchParams.set('offset', String(params.offset));
        return this.request<{ data: MicroLessonComment[]; pagination: { limit: number; offset: number } }>(
          `/api/micro-lessons/${microLessonId}/comments?${searchParams}`
        );
      },

      add: (microLessonId: string, userId: string, content: string) =>
        this.request<MicroLessonComment>(`/api/micro-lessons/${microLessonId}/comments`, {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, content }),
        }),

      delete: (microLessonId: string, commentId: string) =>
        this.request<void>(`/api/micro-lessons/${microLessonId}/comments/${commentId}`, {
          method: 'DELETE',
        }),
    },
  };

  // ============================================================================
  // Community Poll Endpoints
  // ============================================================================

  communityPolls = {
    list: (params?: {
      is_active?: boolean;
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: CommunityPoll[]; pagination: { limit: number; offset: number } }>(
        `/api/community-polls?${searchParams}`
      );
    },

    get: (id: string, userId?: string) => {
      const searchParams = new URLSearchParams();
      if (userId) searchParams.set('user_id', userId);
      return this.request<CommunityPoll>(`/api/community-polls/${id}?${searchParams}`);
    },

    create: (data: { created_by: string; question: string; options: string[]; ends_at?: string }) =>
      this.request<CommunityPoll>('/api/community-polls', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    vote: (pollId: string, userId: string, optionId: string) =>
      this.request<{ success: boolean; message: string }>(`/api/community-polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, option_id: optionId }),
      }),

    close: (pollId: string) =>
      this.request<CommunityPoll>(`/api/community-polls/${pollId}/close`, {
        method: 'POST',
      }),

    delete: (id: string) =>
      this.request<void>(`/api/community-polls/${id}`, { method: 'DELETE' }),
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
  // Course Endpoints (for CourseBrowse page)
  // ============================================================================

  courses = {
    list: (params?: {
      category?: string;
      level?: string;
      format?: string;
      learning_style?: string;
      is_active?: boolean;
      is_featured?: boolean;
      is_free?: boolean;
      search?: string;
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.level) searchParams.set('level', params.level);
      if (params?.format) searchParams.set('format', params.format);
      if (params?.learning_style) searchParams.set('learning_style', params.learning_style);
      if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
      if (params?.is_featured !== undefined) searchParams.set('is_featured', String(params.is_featured));
      if (params?.is_free !== undefined) searchParams.set('is_free', String(params.is_free));
      if (params?.search) searchParams.set('search', params.search);
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ courses: Course[]; pagination: { limit: number; offset: number; total: number } }>(
        `/api/courses?${searchParams}`
      );
    },

    get: (id: string) =>
      this.request<Course>(`/api/courses/${id}`),

    create: (data: Partial<Course>) =>
      this.request<Course>('/api/courses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Course>) =>
      this.request<Course>(`/api/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/api/courses/${id}`, { method: 'DELETE' }),
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
    /**
     * List user bookmarks with optional item details
     *
     * TRANSITIONAL IMPLEMENTATION: Uses include param to hydrate bookmarked items.
     * TODO: Replace with purpose-built endpoints that abstract internal schema.
     *
     * @param userId - User ID
     * @param params.type - Filter by type (lesson, track, post, product)
     * @param params.include - Comma-separated: details (fetches the bookmarked item's data)
     */
    list: (userId: string, params?: {
      type?: 'lesson' | 'track' | 'post' | 'product';
      include?: ('details')[];
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.type) searchParams.set('type', params.type);
      if (params?.include?.length) searchParams.set('include', params.include.join(','));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      return this.request<{ data: (Bookmark & { item?: Lesson | Track | Post | Product })[]; pagination: { limit: number; offset: number } }>(`/api/bookmarks/user/${userId}?${searchParams}`);
    },

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

    createUpload: (data: { title: string; ownerId: string; description?: string; corsOrigin?: string }) =>
      this.request<{ id: string; uploadUrl: string; title: string; status: string }>('/api/videos/uploads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

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

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'educator' | 'admin';
  subscriptionStatus?: string;
  subscriptionTier?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

// ============================================================================
// Auth API (uses direct fetch, not Supabase token)
// ============================================================================

const AUTH_TOKEN_KEY = 'trl_auth_token';
const AUTH_USER_KEY = 'trl_auth_user';

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // Store token and user in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));

    return data;
  },

  /**
   * Signup with email, password, and name
   */
  signup: async (email: string, password: string, fullName: string, role: 'student' | 'educator' = 'student'): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, role }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Signup failed' }));
      throw new Error(error.message || 'Signup failed');
    }

    const data = await response.json();

    // Store token and user in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));

    return data;
  },

  /**
   * Get current user from token
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        // Token is invalid, clear storage
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch {
      return null;
    }
  },

  /**
   * Get stored user (from localStorage, no API call)
   */
  getStoredUser: (): AuthUser | null => {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Logout - clear stored auth data
   */
  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  /**
   * Refresh user data from API (used by useAuth hook)
   * Note: Does NOT update localStorage - we always fetch fresh on page load
   */
  refreshUser: async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch {
      return null;
    }
  },
};

// Export singleton instance
export const api = new ApiClient();

// Export class for custom instances
export { ApiClient };
