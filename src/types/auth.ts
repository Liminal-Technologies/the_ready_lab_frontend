export type UserRole = 'student' | 'educator' | 'admin';

export interface AdminRole {
  id: string;
  role: 'super_admin' | 'content_admin' | 'finance_admin' | 'community_admin' | 'compliance_admin' | 'support_agent' | 'institution_manager';
  granted_by?: string;
  granted_at: string;
  is_active: boolean;
  feature_flags: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at: string;
  subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled';
  subscription_tier?: 'basic' | 'pro' | 'premium';
  avatar_url?: string;
  admin_roles?: AdminRole[];
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  price: number;
  certification_type: 'accredited' | 'completion';
  completion_requirement: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
}

export interface Module {
  id: string;
  track_id: string;
  title: string;
  description: string;
  order_index: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  content_type: 'video' | 'pdf' | 'template' | 'link' | 'poll' | 'prompt';
  content_url?: string;
  content_data?: any;
  order_index: number;
  duration_minutes?: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface Community {
  id: string;
  name: string;
  description: string;
  visibility: 'open' | 'private';
  created_by: string;
  member_count: number;
  rules?: string;
  created_at: string;
  updated_at: string;
}