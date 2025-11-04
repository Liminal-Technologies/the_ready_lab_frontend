export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          feature_flags: Json | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_flags?: Json | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_flags?: Json | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          bookmarkable_id: string
          bookmarkable_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          bookmarkable_id: string
          bookmarkable_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          bookmarkable_id?: string
          bookmarkable_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          approved_by: string | null
          cert_type: string
          certificate_type: string
          certificate_url: string | null
          created_at: string
          disclaimer_text: string | null
          id: string
          instructor_signature: string | null
          issue_date: string | null
          issued_at: string | null
          issuer_id: string | null
          issuer_name: string | null
          pdf_url: string | null
          price_min: number | null
          serial: string | null
          share_url: string | null
          shareable_url: string | null
          status: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_by?: string | null
          cert_type?: string
          certificate_type?: string
          certificate_url?: string | null
          created_at?: string
          disclaimer_text?: string | null
          id?: string
          instructor_signature?: string | null
          issue_date?: string | null
          issued_at?: string | null
          issuer_id?: string | null
          issuer_name?: string | null
          pdf_url?: string | null
          price_min?: number | null
          serial?: string | null
          share_url?: string | null
          shareable_url?: string | null
          status?: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_by?: string | null
          cert_type?: string
          certificate_type?: string
          certificate_url?: string | null
          created_at?: string
          disclaimer_text?: string | null
          id?: string
          instructor_signature?: string | null
          issue_date?: string | null
          issued_at?: string | null
          issuer_id?: string | null
          issuer_name?: string | null
          pdf_url?: string | null
          price_min?: number | null
          serial?: string | null
          share_url?: string | null
          shareable_url?: string | null
          status?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certifications_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          emoji: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          emoji: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          emoji?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          cover_photo: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          member_count: number
          name: string
          rules: string | null
          updated_at: string
          visibility: string
        }
        Insert: {
          cover_photo?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          member_count?: number
          name: string
          rules?: string | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          cover_photo?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          member_count?: number
          name?: string
          rules?: string | null
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_bans: {
        Row: {
          ban_type: string
          banned_by: string
          community_id: string
          created_at: string
          expires_at: string | null
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          ban_type: string
          banned_by: string
          community_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          ban_type?: string
          banned_by?: string
          community_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_bans_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_moderation_log: {
        Row: {
          action: string
          community_id: string
          created_at: string
          id: string
          metadata: Json | null
          moderator_id: string
          reason: string | null
          target_comment_id: string | null
          target_post_id: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          community_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          moderator_id: string
          reason?: string | null
          target_comment_id?: string | null
          target_post_id?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          community_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          moderator_id?: string
          reason?: string | null
          target_comment_id?: string | null
          target_post_id?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_moderation_log_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_moderation_log_target_comment_id_fkey"
            columns: ["target_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_moderation_log_target_post_id_fkey"
            columns: ["target_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      digital_products: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          description: string | null
          downloads_count: number
          educator_id: string
          file_url: string | null
          id: string
          platform_fee_percentage: number | null
          preview_url: string | null
          price: number
          product_type: string
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          translations: Json | null
          updated_at: string
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number
          educator_id: string
          file_url?: string | null
          id?: string
          platform_fee_percentage?: number | null
          preview_url?: string | null
          price?: number
          product_type: string
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number
          educator_id?: string
          file_url?: string | null
          id?: string
          platform_fee_percentage?: number | null
          preview_url?: string | null
          price?: number
          product_type?: string
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_products_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_products_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educator_agreements: {
        Row: {
          accepted_at: string
          agreement_text: string
          created_at: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          accepted_at?: string
          agreement_text: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
          version?: string
        }
        Update: {
          accepted_at?: string
          agreement_text?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "educator_agreements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completion_date: string | null
          created_at: string
          enrollment_date: string
          id: string
          progress_percentage: number
          status: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          enrollment_date?: string
          id?: string
          progress_percentage?: number
          status?: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          enrollment_date?: string
          id?: string
          progress_percentage?: number
          status?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          flag_name: string
          id: string
          is_enabled: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          flag_name: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          flag_name?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_members: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          institution_id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          institution_id: string
          is_active?: boolean
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_members_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_members_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          admin_contact_email: string | null
          billing_contact_email: string | null
          created_at: string
          created_by: string | null
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          payment_status: string
          seat_limit: number
          seats_used: number
          status: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          admin_contact_email?: string | null
          billing_contact_email?: string | null
          created_at?: string
          created_by?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          payment_status?: string
          seat_limit?: number
          seats_used?: number
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          admin_contact_email?: string | null
          billing_contact_email?: string | null
          created_at?: string
          created_by?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          payment_status?: string
          seat_limit?: number
          seats_used?: number
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completion_date: string | null
          created_at: string
          id: string
          lesson_id: string
          status: string
          time_spent_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          status?: string
          time_spent_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          status?: string
          time_spent_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_data: Json | null
          content_type: string
          content_url: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_required: boolean
          is_standalone: boolean | null
          lesson_type: string | null
          module_id: string | null
          order_index: number
          poster_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_duration_seconds: number | null
        }
        Insert: {
          content_data?: Json | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_required?: boolean
          is_standalone?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          order_index: number
          poster_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_duration_seconds?: number | null
        }
        Update: {
          content_data?: Json | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_required?: boolean
          is_standalone?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          order_index?: number
          poster_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_duration_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      live_event_credentials: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          stream_key: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          stream_key?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          stream_key?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_event_credentials_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "live_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_event_credentials_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "public_live_events"
            referencedColumns: ["id"]
          },
        ]
      }
      live_events: {
        Row: {
          attendee_count: number | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          instructor_id: string | null
          is_recording: boolean | null
          max_attendees: number | null
          meeting_url: string | null
          recording_url: string | null
          scheduled_at: string
          status: string
          thumbnail_url: string | null
          title: string
          track_id: string | null
          updated_at: string | null
          viewer_count: number | null
        }
        Insert: {
          attendee_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          instructor_id?: string | null
          is_recording?: boolean | null
          max_attendees?: number | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at: string
          status?: string
          thumbnail_url?: string | null
          title: string
          track_id?: string | null
          updated_at?: string | null
          viewer_count?: number | null
        }
        Update: {
          attendee_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          instructor_id?: string | null
          is_recording?: boolean | null
          max_attendees?: number | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          track_id?: string | null
          updated_at?: string | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_events_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_required: boolean
          order_index: number
          title: string
          track_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          order_index: number
          title: string
          track_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          order_index?: number
          title?: string
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link_url: string | null
          message: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link_url?: string | null
          message: string
          notification_type: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link_url?: string | null
          message?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      post_bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          media_type: string | null
          media_url: string | null
          parent_comment_id: string | null
          post_id: string
          reactions_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          parent_comment_id?: string | null
          post_id: string
          reactions_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          parent_comment_id?: string | null
          post_id?: string
          reactions_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          emoji: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          id?: string
          post_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          details: string | null
          id: string
          post_id: string | null
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          post_id?: string | null
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number
          community_id: string
          content: string | null
          created_at: string
          deleted_at: string | null
          id: string
          is_pinned: boolean
          likes_count: number
          link_description: string | null
          link_image: string | null
          link_title: string | null
          link_url: string | null
          media_duration_seconds: number | null
          media_url: string | null
          post_type: string
          saves_count: number
          share_url: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          community_id: string
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean
          likes_count?: number
          link_description?: string | null
          link_image?: string | null
          link_title?: string | null
          link_url?: string | null
          media_duration_seconds?: number | null
          media_url?: string | null
          post_type?: string
          saves_count?: number
          share_url?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          community_id?: string
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean
          likes_count?: number
          link_description?: string | null
          link_image?: string | null
          link_title?: string | null
          link_url?: string | null
          media_duration_seconds?: number | null
          media_url?: string | null
          post_type?: string
          saves_count?: number
          share_url?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          preferred_language: string | null
          role: string
          show_content_in_language_first: boolean | null
          subscription_status: string
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          preferred_language?: string | null
          role: string
          show_content_in_language_first?: boolean | null
          subscription_status?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          preferred_language?: string | null
          role?: string
          show_content_in_language_first?: boolean | null
          subscription_status?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          product_id: string
          purchased_at: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          product_id: string
          purchased_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          product_id?: string
          purchased_at?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "digital_products"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          attempt_number: number
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          passed: boolean
          quiz_id: string | null
          score: number
          started_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          passed?: boolean
          quiz_id?: string | null
          score: number
          started_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          passed?: boolean
          quiz_id?: string | null
          score?: number
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: Json
          created_at: string
          explanation: string | null
          id: string
          lesson_id: string
          options: Json | null
          order_index: number
          points: number
          question_text: string
          question_type: string
          quiz_id: string
          updated_at: string
        }
        Insert: {
          correct_answer: Json
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id: string
          options?: Json | null
          order_index: number
          points?: number
          question_text: string
          question_type?: string
          quiz_id: string
          updated_at?: string
        }
        Update: {
          correct_answer?: Json
          created_at?: string
          explanation?: string | null
          id?: string
          lesson_id?: string
          options?: Json | null
          order_index?: number
          points?: number
          question_text?: string
          question_type?: string
          quiz_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lesson_id: string | null
          module_id: string | null
          pass_threshold: number
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          module_id?: string | null
          pass_threshold?: number
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          module_id?: string | null
          pass_threshold?: number
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_chat_messages: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          message: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          message: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          message?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_chat_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "live_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_chat_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "public_live_events"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connect_accounts: {
        Row: {
          account_status: string
          charges_enabled: boolean
          created_at: string
          details_submitted: boolean
          id: string
          onboarding_completed: boolean
          payouts_enabled: boolean
          requirements_due_by: string | null
          requirements_fields: Json | null
          stripe_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: string
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          id?: string
          onboarding_completed?: boolean
          payouts_enabled?: boolean
          requirements_due_by?: string | null
          requirements_fields?: Json | null
          stripe_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: string
          charges_enabled?: boolean
          created_at?: string
          details_submitted?: boolean
          id?: string
          onboarding_completed?: boolean
          payouts_enabled?: boolean
          requirements_due_by?: string | null
          requirements_fields?: Json | null
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_invoices: {
        Row: {
          amount_due: number
          amount_paid: number
          created_at: string
          currency: string
          hosted_invoice_url: string | null
          id: string
          invoice_pdf: string | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_customer_id: string
          stripe_invoice_id: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_due: number
          amount_paid: number
          created_at?: string
          currency?: string
          hosted_invoice_url?: string | null
          id?: string
          invoice_pdf?: string | null
          period_end?: string | null
          period_start?: string | null
          status: string
          stripe_customer_id: string
          stripe_invoice_id: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          created_at?: string
          currency?: string
          hosted_invoice_url?: string | null
          id?: string
          invoice_pdf?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_invoice_id?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_payouts: {
        Row: {
          amount: number
          arrival_date: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          status: string
          stripe_account_id: string
          stripe_payout_id: string
          user_id: string
        }
        Insert: {
          amount: number
          arrival_date?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status: string
          stripe_account_id: string
          stripe_payout_id: string
          user_id: string
        }
        Update: {
          amount?: number
          arrival_date?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          stripe_account_id?: string
          stripe_payout_id?: string
          user_id?: string
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_product_id: string
          stripe_subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_product_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          status?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          stripe_product_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          name: string
          price_monthly: number
          price_yearly: number | null
          role: string
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          stripe_product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price_monthly: number
          price_yearly?: number | null
          role?: string
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          role?: string
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          category: string
          certification_type: string
          completion_requirement: number
          created_at: string
          created_by: string | null
          description: string | null
          estimated_hours: number
          id: string
          interest_tags: string[] | null
          is_active: boolean
          level: string
          price: number
          roadmap_tags: string[] | null
          thumbnail_url: string | null
          title: string
          translations: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          certification_type?: string
          completion_requirement?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_hours?: number
          id?: string
          interest_tags?: string[] | null
          is_active?: boolean
          level?: string
          price?: number
          roadmap_tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          translations?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          certification_type?: string
          completion_requirement?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_hours?: number
          id?: string
          interest_tags?: string[] | null
          is_active?: boolean
          level?: string
          price?: number
          roadmap_tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          translations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          created_at: string
          id: string
          interest_tag: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interest_tag: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interest_tag?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verified_educator_badges: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          badge_type: string
          created_at: string
          id: string
          reason: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          badge_type?: string
          created_at?: string
          id?: string
          reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          badge_type?: string
          created_at?: string
          id?: string
          reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verified_educator_badges_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verified_educator_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_captions: {
        Row: {
          caption_url: string
          created_at: string | null
          format: string
          id: string
          is_auto_generated: boolean | null
          language_code: string
          lesson_id: string
          updated_at: string | null
        }
        Insert: {
          caption_url: string
          created_at?: string | null
          format?: string
          id?: string
          is_auto_generated?: boolean | null
          language_code?: string
          lesson_id: string
          updated_at?: string | null
        }
        Update: {
          caption_url?: string
          created_at?: string | null
          format?: string
          id?: string
          is_auto_generated?: boolean | null
          language_code?: string
          lesson_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_captions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_live_events: {
        Row: {
          attendee_count: number | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string | null
          is_recording: boolean | null
          max_attendees: number | null
          meeting_url: string | null
          recording_url: string | null
          scheduled_at: string | null
          status: string | null
          thumbnail_url: string | null
          title: string | null
          track_id: string | null
          updated_at: string | null
          viewer_count: number | null
        }
        Insert: {
          attendee_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_recording?: boolean | null
          max_attendees?: number | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string | null
          track_id?: string | null
          updated_at?: string | null
          viewer_count?: number | null
        }
        Update: {
          attendee_count?: number | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_recording?: boolean | null
          max_attendees?: number | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string | null
          track_id?: string | null
          updated_at?: string | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_events_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_admin_role: {
        Args: {
          _role: Database["public"]["Enums"]["admin_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_community_moderator: {
        Args: { _community_id: string; _user_id: string }
        Returns: boolean
      }
      is_event_instructor: {
        Args: { _event_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_banned: {
        Args: { _community_id: string; _user_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          _action: string
          _entity_id?: string
          _entity_type: string
          _metadata?: Json
          _new_values?: Json
          _old_values?: Json
        }
        Returns: string
      }
      user_has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      admin_role:
        | "super_admin"
        | "content_admin"
        | "finance_admin"
        | "community_admin"
        | "compliance_admin"
        | "support_agent"
        | "institution_manager"
      user_role: "student" | "educator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: [
        "super_admin",
        "content_admin",
        "finance_admin",
        "community_admin",
        "compliance_admin",
        "support_agent",
        "institution_manager",
      ],
      user_role: ["student", "educator", "admin"],
    },
  },
} as const
