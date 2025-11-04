export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'student' | 'educator' | 'admin'
          subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled'
          subscription_tier: 'basic' | 'pro' | 'premium' | null
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'student' | 'educator' | 'admin'
          subscription_status?: 'active' | 'inactive' | 'trial' | 'cancelled'
          subscription_tier?: 'basic' | 'pro' | 'premium' | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'student' | 'educator' | 'admin'
          subscription_status?: 'active' | 'inactive' | 'trial' | 'cancelled'
          subscription_tier?: 'basic' | 'pro' | 'premium' | null
          avatar_url?: string | null
        }
      }
      tracks: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          certification_type: 'accredited' | 'completion'
          completion_requirement: number
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
          thumbnail_url: string | null
          category: string
          level: 'beginner' | 'intermediate' | 'advanced'
          estimated_hours: number
        }
        Insert: {
          title: string
          description: string
          price?: number
          certification_type?: 'accredited' | 'completion'
          completion_requirement?: number
          is_active?: boolean
          created_by: string
          thumbnail_url?: string | null
          category: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          estimated_hours?: number
        }
        Update: {
          title?: string
          description?: string
          price?: number
          certification_type?: 'accredited' | 'completion'
          completion_requirement?: number
          is_active?: boolean
          thumbnail_url?: string | null
          category?: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          estimated_hours?: number
        }
      }
      modules: {
        Row: {
          id: string
          track_id: string
          title: string
          description: string
          order_index: number
          is_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          track_id: string
          title: string
          description: string
          order_index: number
          is_required?: boolean
        }
        Update: {
          title?: string
          description?: string
          order_index?: number
          is_required?: boolean
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string
          content_type: 'video' | 'pdf' | 'template' | 'link' | 'poll' | 'prompt'
          content_url: string | null
          content_data: Json | null
          order_index: number
          duration_minutes: number | null
          is_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          module_id: string
          title: string
          description: string
          content_type: 'video' | 'pdf' | 'template' | 'link' | 'poll' | 'prompt'
          content_url?: string | null
          content_data?: Json | null
          order_index: number
          duration_minutes?: number | null
          is_required?: boolean
        }
        Update: {
          title?: string
          description?: string
          content_type?: 'video' | 'pdf' | 'template' | 'link' | 'poll' | 'prompt'
          content_url?: string | null
          content_data?: Json | null
          order_index?: number
          duration_minutes?: number | null
          is_required?: boolean
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          track_id: string
          enrollment_date: string
          completion_date: string | null
          progress_percentage: number
          status: 'active' | 'completed' | 'dropped'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          track_id: string
          enrollment_date?: string
          progress_percentage?: number
          status?: 'active' | 'completed' | 'dropped'
        }
        Update: {
          completion_date?: string | null
          progress_percentage?: number
          status?: 'active' | 'completed' | 'dropped'
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          completion_date: string | null
          time_spent_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          lesson_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          completion_date?: string | null
          time_spent_minutes?: number
        }
        Update: {
          status?: 'not_started' | 'in_progress' | 'completed'
          completion_date?: string | null
          time_spent_minutes?: number
        }
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          track_id: string
          certificate_type: 'accredited' | 'completion'
          status: 'pending' | 'approved' | 'issued' | 'rejected'
          issue_date: string | null
          certificate_url: string | null
          shareable_url: string | null
          approved_by: string | null
          instructor_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          track_id: string
          certificate_type: 'accredited' | 'completion'
          status?: 'pending' | 'approved' | 'issued' | 'rejected'
          issue_date?: string | null
          certificate_url?: string | null
          shareable_url?: string | null
          approved_by?: string | null
          instructor_signature?: string | null
        }
        Update: {
          status?: 'pending' | 'approved' | 'issued' | 'rejected'
          issue_date?: string | null
          certificate_url?: string | null
          shareable_url?: string | null
          approved_by?: string | null
          instructor_signature?: string | null
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string
          visibility: 'open' | 'private'
          created_by: string
          member_count: number
          rules: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description: string
          visibility?: 'open' | 'private'
          created_by: string
          member_count?: number
          rules?: string | null
        }
        Update: {
          name?: string
          description?: string
          visibility?: 'open' | 'private'
          member_count?: number
          rules?: string | null
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: 'owner' | 'moderator' | 'member'
          joined_at: string
        }
        Insert: {
          community_id: string
          user_id: string
          role?: 'owner' | 'moderator' | 'member'
        }
        Update: {
          role?: 'owner' | 'moderator' | 'member'
        }
      }
      community_posts: {
        Row: {
          id: string
          community_id: string
          user_id: string
          title: string
          content: string
          is_pinned: boolean
          reply_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          community_id: string
          user_id: string
          title: string
          content: string
          is_pinned?: boolean
          reply_count?: number
        }
        Update: {
          title?: string
          content?: string
          is_pinned?: boolean
          reply_count?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}