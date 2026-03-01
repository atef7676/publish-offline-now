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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      account_status: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          created_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      alert_events: {
        Row: {
          alert_data: Json | null
          alert_type: string
          created_at: string
          id: string
          is_read: boolean | null
          monitor_id: string
          notified_via: string[] | null
          severity: string
          x_post_id: string | null
        }
        Insert: {
          alert_data?: Json | null
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          monitor_id: string
          notified_via?: string[] | null
          severity?: string
          x_post_id?: string | null
        }
        Update: {
          alert_data?: Json | null
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          monitor_id?: string
          notified_via?: string[] | null
          severity?: string
          x_post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_events_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "x_monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_events_x_post_id_fkey"
            columns: ["x_post_id"]
            isOneToOne: false
            referencedRelation: "x_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      article_requests: {
        Row: {
          article_type: string
          completed_at: string | null
          created_at: string
          date_range_end: string | null
          date_range_start: string | null
          filters: Json
          generated_data: Json | null
          generated_text: string | null
          id: string
          source_post_count: number | null
          status: string
          title: string | null
          tone: string
          user_id: string
        }
        Insert: {
          article_type: string
          completed_at?: string | null
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          filters?: Json
          generated_data?: Json | null
          generated_text?: string | null
          id?: string
          source_post_count?: number | null
          status?: string
          title?: string | null
          tone?: string
          user_id: string
        }
        Update: {
          article_type?: string
          completed_at?: string | null
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          filters?: Json
          generated_data?: Json | null
          generated_text?: string | null
          id?: string
          source_post_count?: number | null
          status?: string
          title?: string | null
          tone?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          actor_user_id: string
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          target_profile_id: string | null
          target_user_id: string | null
        }
        Insert: {
          actor_user_id: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          target_profile_id?: string | null
          target_user_id?: string | null
        }
        Update: {
          actor_user_id?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          target_profile_id?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "audit_events_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_profile_id: string | null
          actor_role: string
          actor_user_id: string | null
          created_at: string
          id: string
          ip_hash: string | null
          metadata: Json | null
          reason: string | null
          request_id: string | null
          result: string
          session_id: string | null
          severity: string
          target_id: string | null
          target_type: string | null
          ua_hash: string | null
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          actor_role?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          reason?: string | null
          request_id?: string | null
          result?: string
          session_id?: string | null
          severity?: string
          target_id?: string | null
          target_type?: string | null
          ua_hash?: string | null
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          actor_role?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          reason?: string | null
          request_id?: string | null
          result?: string
          session_id?: string | null
          severity?: string
          target_id?: string | null
          target_type?: string | null
          ua_hash?: string | null
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          reason: string | null
          ref_id: string | null
          ref_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          reason?: string | null
          ref_id?: string | null
          ref_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          reason?: string | null
          ref_id?: string | null
          ref_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          category: string
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          coins_spent: number
          created_at: string
          id: string
          message: string
          recipient_profile_id: string
          responded_at: string | null
          sender_id: string
          status: string
          subject: string
        }
        Insert: {
          coins_spent?: number
          created_at?: string
          id?: string
          message: string
          recipient_profile_id: string
          responded_at?: string | null
          sender_id: string
          status?: string
          subject: string
        }
        Update: {
          coins_spent?: number
          created_at?: string
          id?: string
          message?: string
          recipient_profile_id?: string
          responded_at?: string | null
          sender_id?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "contact_requests_recipient_profile_id_fkey"
            columns: ["recipient_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      directory_profiles: {
        Row: {
          allow_subscribers_contact: boolean
          approval_status: string
          avatar_updated_at: string | null
          avatar_url: string | null
          bio: string | null
          bio_ar: string | null
          category: string | null
          city: string | null
          country_code: string | null
          created_at: string
          data_source: string | null
          display_name: string
          display_name_ar: string | null
          employment_status: string | null
          expertise_areas: string[] | null
          facebook_url: string | null
          first_name: string | null
          gender: string | null
          headline: string | null
          headline_ar: string | null
          hire_me_enabled: boolean | null
          hourly_rate: string | null
          influence_score: number | null
          instagram_url: string | null
          is_listed: boolean
          is_public: boolean
          is_top_listing: boolean | null
          is_verified: boolean | null
          languages: string[]
          last_name: string | null
          linkedin_url: string | null
          media_role: string | null
          notes: string | null
          outlet_name: string | null
          owner_user_id: string | null
          parent_company: string | null
          phone_number: string | null
          press_id_url: string | null
          profile_complete: boolean | null
          profile_id: string
          profile_type: string
          profile_type_id: string | null
          rank: string | null
          sector_id: string | null
          services_offered: string[] | null
          show_email_to_subscribers: boolean
          show_phone_to_subscribers: boolean
          show_whatsapp_to_subscribers: boolean
          slug: string
          specializations: string[] | null
          tags: string[]
          title: string | null
          tumblr_url: string | null
          twitter_handle: string | null
          updated_at: string
          username: string | null
          visits_count: number | null
          website_url: string | null
          whatsapp_number: string | null
          youtube_url: string | null
        }
        Insert: {
          allow_subscribers_contact?: boolean
          approval_status?: string
          avatar_updated_at?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_ar?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          data_source?: string | null
          display_name: string
          display_name_ar?: string | null
          employment_status?: string | null
          expertise_areas?: string[] | null
          facebook_url?: string | null
          first_name?: string | null
          gender?: string | null
          headline?: string | null
          headline_ar?: string | null
          hire_me_enabled?: boolean | null
          hourly_rate?: string | null
          influence_score?: number | null
          instagram_url?: string | null
          is_listed?: boolean
          is_public?: boolean
          is_top_listing?: boolean | null
          is_verified?: boolean | null
          languages?: string[]
          last_name?: string | null
          linkedin_url?: string | null
          media_role?: string | null
          notes?: string | null
          outlet_name?: string | null
          owner_user_id?: string | null
          parent_company?: string | null
          phone_number?: string | null
          press_id_url?: string | null
          profile_complete?: boolean | null
          profile_id?: string
          profile_type: string
          profile_type_id?: string | null
          rank?: string | null
          sector_id?: string | null
          services_offered?: string[] | null
          show_email_to_subscribers?: boolean
          show_phone_to_subscribers?: boolean
          show_whatsapp_to_subscribers?: boolean
          slug: string
          specializations?: string[] | null
          tags?: string[]
          title?: string | null
          tumblr_url?: string | null
          twitter_handle?: string | null
          updated_at?: string
          username?: string | null
          visits_count?: number | null
          website_url?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Update: {
          allow_subscribers_contact?: boolean
          approval_status?: string
          avatar_updated_at?: string | null
          avatar_url?: string | null
          bio?: string | null
          bio_ar?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          data_source?: string | null
          display_name?: string
          display_name_ar?: string | null
          employment_status?: string | null
          expertise_areas?: string[] | null
          facebook_url?: string | null
          first_name?: string | null
          gender?: string | null
          headline?: string | null
          headline_ar?: string | null
          hire_me_enabled?: boolean | null
          hourly_rate?: string | null
          influence_score?: number | null
          instagram_url?: string | null
          is_listed?: boolean
          is_public?: boolean
          is_top_listing?: boolean | null
          is_verified?: boolean | null
          languages?: string[]
          last_name?: string | null
          linkedin_url?: string | null
          media_role?: string | null
          notes?: string | null
          outlet_name?: string | null
          owner_user_id?: string | null
          parent_company?: string | null
          phone_number?: string | null
          press_id_url?: string | null
          profile_complete?: boolean | null
          profile_id?: string
          profile_type?: string
          profile_type_id?: string | null
          rank?: string | null
          sector_id?: string | null
          services_offered?: string[] | null
          show_email_to_subscribers?: boolean
          show_phone_to_subscribers?: boolean
          show_whatsapp_to_subscribers?: boolean
          slug?: string
          specializations?: string[] | null
          tags?: string[]
          title?: string | null
          tumblr_url?: string | null
          twitter_handle?: string | null
          updated_at?: string
          username?: string | null
          visits_count?: number | null
          website_url?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directory_profiles_profile_type_id_fkey"
            columns: ["profile_type_id"]
            isOneToOne: false
            referencedRelation: "profile_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directory_profiles_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notifications_queue: {
        Row: {
          attempts: number
          body_html: string
          created_at: string
          error_message: string | null
          id: string
          last_attempt_at: string | null
          metadata: Json | null
          notification_type: string
          recipient_email: string
          recipient_user_id: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          attempts?: number
          body_html: string
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          metadata?: Json | null
          notification_type: string
          recipient_email: string
          recipient_user_id: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          attempts?: number
          body_html?: string
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          metadata?: Json | null
          notification_type?: string
          recipient_email?: string
          recipient_user_id?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      email_preferences: {
        Row: {
          created_at: string
          email_verified: boolean
          notify_favorites: boolean
          notify_new_messages: boolean
          notify_profile_views: boolean
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email_verified?: boolean
          notify_favorites?: boolean
          notify_new_messages?: boolean
          notify_profile_views?: boolean
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email_verified?: boolean
          notify_favorites?: boolean
          notify_new_messages?: boolean
          notify_profile_views?: boolean
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      employment_status: {
        Row: {
          id: string
          key: string
          name_ar: string
          name_en: string
          sort_order: number
        }
        Insert: {
          id?: string
          key: string
          name_ar: string
          name_en: string
          sort_order?: number
        }
        Update: {
          id?: string
          key?: string
          name_ar?: string
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      entity_tags: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          tag_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_companies: {
        Row: {
          company_profile_id: string
          created_at: string
          expert_profile_id: string
          expertise_area: string | null
          id: string
          is_current: boolean | null
        }
        Insert: {
          company_profile_id: string
          created_at?: string
          expert_profile_id: string
          expertise_area?: string | null
          id?: string
          is_current?: boolean | null
        }
        Update: {
          company_profile_id?: string
          created_at?: string
          expert_profile_id?: string
          expertise_area?: string | null
          id?: string
          is_current?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_companies_expert_profile_id_fkey"
            columns: ["expert_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      expert_profiles: {
        Row: {
          created_at: string
          directory_profile_id: string
          expert_role: string | null
          organisation_name: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          directory_profile_id: string
          expert_role?: string | null
          organisation_name?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          directory_profile_id?: string
          expert_role?: string | null
          organisation_name?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "expert_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      experts: {
        Row: {
          approval_status: string | null
          availability_status: string | null
          contact_visibility_level: string | null
          created_at: string | null
          current_organisation: string | null
          email: string | null
          full_name: string
          id: string
          industry_focus: string[] | null
          media_experience: boolean | null
          phone: string | null
          preferred_topics: string[] | null
          previous_quotes: string | null
          primary_expertise: string | null
          profile_visibility: string | null
          role_type: string | null
          secondary_expertise: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          years_experience: number | null
        }
        Insert: {
          approval_status?: string | null
          availability_status?: string | null
          contact_visibility_level?: string | null
          created_at?: string | null
          current_organisation?: string | null
          email?: string | null
          full_name: string
          id?: string
          industry_focus?: string[] | null
          media_experience?: boolean | null
          phone?: string | null
          preferred_topics?: string[] | null
          previous_quotes?: string | null
          primary_expertise?: string | null
          profile_visibility?: string | null
          role_type?: string | null
          secondary_expertise?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          years_experience?: number | null
        }
        Update: {
          approval_status?: string | null
          availability_status?: string | null
          contact_visibility_level?: string | null
          created_at?: string | null
          current_organisation?: string | null
          email?: string | null
          full_name?: string
          id?: string
          industry_focus?: string[] | null
          media_experience?: boolean | null
          phone?: string | null
          preferred_topics?: string[] | null
          previous_quotes?: string | null
          primary_expertise?: string | null
          profile_visibility?: string | null
          role_type?: string | null
          secondary_expertise?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      journalist_expert_interactions: {
        Row: {
          created_at: string | null
          expert_id: string | null
          id: string
          interaction_date: string | null
          interaction_type: string | null
          journalist_id: string | null
          topic: string | null
        }
        Insert: {
          created_at?: string | null
          expert_id?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string | null
          journalist_id?: string | null
          topic?: string | null
        }
        Update: {
          created_at?: string | null
          expert_id?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type?: string | null
          journalist_id?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journalist_expert_interactions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_expert_interactions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["expert_id"]
          },
          {
            foreignKeyName: "journalist_expert_interactions_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_expert_interactions_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "journalist_expert_interactions_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
        ]
      }
      journalist_profiles: {
        Row: {
          created_at: string
          directory_profile_id: string
          job_title: string | null
          job_title_ar: string | null
          portfolio_json: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          directory_profile_id: string
          job_title?: string | null
          job_title_ar?: string | null
          portfolio_json?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          directory_profile_id?: string
          job_title?: string | null
          job_title_ar?: string | null
          portfolio_json?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "journalist_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      journalist_publications: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_primary: boolean | null
          journalist_id: string | null
          publication_id: string | null
          role: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_primary?: boolean | null
          journalist_id?: string | null
          publication_id?: string | null
          role?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_primary?: boolean | null
          journalist_id?: string | null
          publication_id?: string | null
          role?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journalist_publications_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_publications_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "journalist_publications_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "journalist_publications_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publication_contact_details"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "journalist_publications_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journalist_publications_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["publication_id"]
          },
        ]
      }
      journalist_roles: {
        Row: {
          created_at: string
          id: string
          key: string
          name_ar: string | null
          name_en: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name_ar?: string | null
          name_en: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name_ar?: string | null
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      journalists: {
        Row: {
          affiliations: string[] | null
          approval_status: string | null
          bio_long: string | null
          bio_short: string | null
          city: string | null
          contact_visibility_level: string | null
          country: string | null
          created_at: string | null
          current_status: string | null
          display_name: string | null
          email: string | null
          employment_type: string | null
          full_name: string
          id: string
          phone: string | null
          preferred_contact_method: string | null
          primary_beat: string | null
          primary_language: string | null
          profile_visibility: string | null
          regions_covered: string[] | null
          secondary_beats: string[] | null
          social_media_links: Json | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          years_experience: number | null
        }
        Insert: {
          affiliations?: string[] | null
          approval_status?: string | null
          bio_long?: string | null
          bio_short?: string | null
          city?: string | null
          contact_visibility_level?: string | null
          country?: string | null
          created_at?: string | null
          current_status?: string | null
          display_name?: string | null
          email?: string | null
          employment_type?: string | null
          full_name: string
          id?: string
          phone?: string | null
          preferred_contact_method?: string | null
          primary_beat?: string | null
          primary_language?: string | null
          profile_visibility?: string | null
          regions_covered?: string[] | null
          secondary_beats?: string[] | null
          social_media_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          years_experience?: number | null
        }
        Update: {
          affiliations?: string[] | null
          approval_status?: string | null
          bio_long?: string | null
          bio_short?: string | null
          city?: string | null
          contact_visibility_level?: string | null
          country?: string | null
          created_at?: string | null
          current_status?: string | null
          display_name?: string | null
          email?: string | null
          employment_type?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          preferred_contact_method?: string | null
          primary_beat?: string | null
          primary_language?: string | null
          profile_visibility?: string | null
          regions_covered?: string[] | null
          secondary_beats?: string[] | null
          social_media_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      list_items: {
        Row: {
          added_at: string
          id: string
          list_id: string
          profile_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          list_id: string
          profile_id: string
        }
        Update: {
          added_at?: string
          id?: string
          list_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "user_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "list_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      media_roles: {
        Row: {
          id: string
          key: string
          name_ar: string
          name_en: string
          sort_order: number
        }
        Insert: {
          id?: string
          key: string
          name_ar: string
          name_en: string
          sort_order?: number
        }
        Update: {
          id?: string
          key?: string
          name_ar?: string
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          coins_cost: number
          contact_request_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
          status: string
        }
        Insert: {
          coins_cost?: number
          contact_request_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
          status?: string
        }
        Update: {
          coins_cost?: number
          contact_request_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_contact_request_id_fkey"
            columns: ["contact_request_id"]
            isOneToOne: false
            referencedRelation: "contact_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      monitor_digests: {
        Row: {
          created_at: string
          generated_text: string | null
          id: string
          monitor_id: string
          period_end: string
          period_start: string
          period_type: string
          post_count: number | null
          status: string
          summary_data: Json | null
        }
        Insert: {
          created_at?: string
          generated_text?: string | null
          id?: string
          monitor_id: string
          period_end: string
          period_start: string
          period_type: string
          post_count?: number | null
          status: string
          summary_data?: Json | null
        }
        Update: {
          created_at?: string
          generated_text?: string | null
          id?: string
          monitor_id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          post_count?: number | null
          status?: string
          summary_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "monitor_digests_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "x_monitors"
            referencedColumns: ["id"]
          },
        ]
      }
      monitor_hits: {
        Row: {
          alert_reasons: string[] | null
          created_at: string
          id: string
          is_alert: boolean | null
          matched_rule: string | null
          monitor_id: string
          relevance_score: number | null
          x_post_id: string
        }
        Insert: {
          alert_reasons?: string[] | null
          created_at?: string
          id?: string
          is_alert?: boolean | null
          matched_rule?: string | null
          monitor_id: string
          relevance_score?: number | null
          x_post_id: string
        }
        Update: {
          alert_reasons?: string[] | null
          created_at?: string
          id?: string
          is_alert?: boolean | null
          matched_rule?: string | null
          monitor_id?: string
          relevance_score?: number | null
          x_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitor_hits_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "x_monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitor_hits_x_post_id_fkey"
            columns: ["x_post_id"]
            isOneToOne: false
            referencedRelation: "x_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoring_plans: {
        Row: {
          advanced_articles: boolean | null
          allow_article_generation: boolean | null
          allow_real_time: boolean | null
          allow_snapshots: boolean | null
          allow_stream: boolean | null
          api_access: boolean | null
          created_at: string
          custom_snapshot_intervals: boolean | null
          id: string
          max_monitors: number
          plan_key: string
          plan_name: string
          retention_days: number
          team_collaboration: boolean | null
        }
        Insert: {
          advanced_articles?: boolean | null
          allow_article_generation?: boolean | null
          allow_real_time?: boolean | null
          allow_snapshots?: boolean | null
          allow_stream?: boolean | null
          api_access?: boolean | null
          created_at?: string
          custom_snapshot_intervals?: boolean | null
          id?: string
          max_monitors: number
          plan_key: string
          plan_name: string
          retention_days: number
          team_collaboration?: boolean | null
        }
        Update: {
          advanced_articles?: boolean | null
          allow_article_generation?: boolean | null
          allow_real_time?: boolean | null
          allow_snapshots?: boolean | null
          allow_stream?: boolean | null
          api_access?: boolean | null
          created_at?: string
          custom_snapshot_intervals?: boolean | null
          id?: string
          max_monitors?: number
          plan_key?: string
          plan_name?: string
          retention_days?: number
          team_collaboration?: boolean | null
        }
        Relationships: []
      }
      mutes_blocks: {
        Row: {
          blocked_user_id: string
          blocker_user_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_user_id: string
          blocker_user_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_user_id?: string
          blocker_user_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      news_desk_types: {
        Row: {
          created_at: string
          id: string
          key: string
          name_ar: string | null
          name_en: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name_ar?: string | null
          name_en: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name_ar?: string | null
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          budget_currency: string
          budget_max: number | null
          budget_min: number | null
          city: string | null
          closes_at: string | null
          company_profile_id: string
          compensation_type: string
          country_code: string
          created_at: string
          created_by_user_id: string
          description: string
          description_ar: string | null
          id: string
          language_required: string[] | null
          nda_required: boolean
          opportunity_type: string
          published_at: string | null
          required_experience_years: number | null
          sector_tags: string[]
          status: string
          title: string
          title_ar: string | null
          updated_at: string
          urgency_level: number
          visibility: string
          work_location: string
        }
        Insert: {
          budget_currency?: string
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          closes_at?: string | null
          company_profile_id: string
          compensation_type?: string
          country_code: string
          created_at?: string
          created_by_user_id: string
          description: string
          description_ar?: string | null
          id?: string
          language_required?: string[] | null
          nda_required?: boolean
          opportunity_type: string
          published_at?: string | null
          required_experience_years?: number | null
          sector_tags?: string[]
          status?: string
          title: string
          title_ar?: string | null
          updated_at?: string
          urgency_level?: number
          visibility?: string
          work_location?: string
        }
        Update: {
          budget_currency?: string
          budget_max?: number | null
          budget_min?: number | null
          city?: string | null
          closes_at?: string | null
          company_profile_id?: string
          compensation_type?: string
          country_code?: string
          created_at?: string
          created_by_user_id?: string
          description?: string
          description_ar?: string | null
          id?: string
          language_required?: string[] | null
          nda_required?: boolean
          opportunity_type?: string
          published_at?: string | null
          required_experience_years?: number | null
          sector_tags?: string[]
          status?: string
          title?: string
          title_ar?: string | null
          updated_at?: string
          urgency_level?: number
          visibility?: string
          work_location?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunities_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      opportunity_applications: {
        Row: {
          application_type: string
          attachments: Json | null
          company_notes: string | null
          cover_note: string | null
          created_at: string
          deliverables: Json | null
          id: string
          journalist_profile_id: string
          opportunity_id: string
          proposal_text: string | null
          proposed_currency: string | null
          proposed_fee: number | null
          proposed_timeline_days: number | null
          status: string
          updated_at: string
        }
        Insert: {
          application_type?: string
          attachments?: Json | null
          company_notes?: string | null
          cover_note?: string | null
          created_at?: string
          deliverables?: Json | null
          id?: string
          journalist_profile_id: string
          opportunity_id: string
          proposal_text?: string | null
          proposed_currency?: string | null
          proposed_fee?: number | null
          proposed_timeline_days?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          application_type?: string
          attachments?: Json | null
          company_notes?: string | null
          cover_note?: string | null
          created_at?: string
          deliverables?: Json | null
          id?: string
          journalist_profile_id?: string
          opportunity_id?: string
          proposal_text?: string | null
          proposed_currency?: string | null
          proposed_fee?: number | null
          proposed_timeline_days?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_invites: {
        Row: {
          created_at: string
          id: string
          invited_by_user_id: string
          journalist_profile_id: string
          opportunity_id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by_user_id: string
          journalist_profile_id: string
          opportunity_id: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by_user_id?: string
          journalist_profile_id?: string
          opportunity_id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_invites_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_saves: {
        Row: {
          created_at: string
          id: string
          journalist_profile_id: string
          opportunity_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journalist_profile_id: string
          opportunity_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journalist_profile_id?: string
          opportunity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_journalist_profile_id_fkey"
            columns: ["journalist_profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "opportunity_saves_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      periodical_types: {
        Row: {
          created_at: string
          id: string
          key: string
          name_ar: string | null
          name_en: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name_ar?: string | null
          name_en: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name_ar?: string | null
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      platform_config: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      profile_claims: {
        Row: {
          admin_notes: string | null
          claimant_id: string
          created_at: string
          evidence: string | null
          id: string
          profile_id: string
          reviewed_at: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          claimant_id: string
          created_at?: string
          evidence?: string | null
          id?: string
          profile_id: string
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          claimant_id?: string
          created_at?: string
          evidence?: string | null
          id?: string
          profile_id?: string
          reviewed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_contact_details_table: {
        Row: {
          contact_email: string | null
          fax: string | null
          journalist_id: string | null
          phone: string | null
          preferred_contact_method: string | null
          profile_id: string
          telegram: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          contact_email?: string | null
          fax?: string | null
          journalist_id?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          profile_id: string
          telegram?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          contact_email?: string | null
          fax?: string | null
          journalist_id?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          profile_id?: string
          telegram?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_contact_details_journalist_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_contact_details_journalist_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "profile_contact_details_journalist_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_contact_flags: {
        Row: {
          created_at: string
          directory_profile_id: string
          has_email: boolean
          has_facebook: boolean
          has_instagram: boolean
          has_linkedin: boolean
          has_phone: boolean
          has_twitter: boolean
          has_website: boolean
          has_whatsapp: boolean
          has_youtube: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          directory_profile_id: string
          has_email?: boolean
          has_facebook?: boolean
          has_instagram?: boolean
          has_linkedin?: boolean
          has_phone?: boolean
          has_twitter?: boolean
          has_website?: boolean
          has_whatsapp?: boolean
          has_youtube?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          directory_profile_id?: string
          has_email?: boolean
          has_facebook?: boolean
          has_instagram?: boolean
          has_linkedin?: boolean
          has_phone?: boolean
          has_twitter?: boolean
          has_website?: boolean
          has_whatsapp?: boolean
          has_youtube?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_flags_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_contact_private: {
        Row: {
          created_at: string
          directory_profile_id: string
          email: string | null
          facebook: string | null
          instagram: string | null
          linkedin: string | null
          phone: string | null
          twitter: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
          youtube: string | null
        }
        Insert: {
          created_at?: string
          directory_profile_id: string
          email?: string | null
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
          youtube?: string | null
        }
        Update: {
          created_at?: string
          directory_profile_id?: string
          email?: string | null
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          phone?: string | null
          twitter?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_contact_private_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          profile_id: string
          rating: number
          reviewer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          profile_id: string
          rating: number
          reviewer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          profile_id?: string
          rating?: number
          reviewer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_settings: {
        Row: {
          allow_followups: boolean
          auto_reject_sectors: string[] | null
          created_at: string
          min_message_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_followups?: boolean
          auto_reject_sectors?: string[] | null
          created_at?: string
          min_message_cost?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_followups?: boolean
          auto_reject_sectors?: string[] | null
          created_at?: string
          min_message_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_types: {
        Row: {
          created_at: string
          id: string
          key: string
          name_ar: string | null
          name_en: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name_ar?: string | null
          name_en: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name_ar?: string | null
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      profile_unlocks: {
        Row: {
          coins_spent: number
          created_at: string
          id: string
          profile_id: string
          unlocker_user_id: string
        }
        Insert: {
          coins_spent?: number
          created_at?: string
          id?: string
          profile_id: string
          unlocker_user_id: string
        }
        Update: {
          coins_spent?: number
          created_at?: string
          id?: string
          profile_id?: string
          unlocker_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_unlocks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_view_credits: {
        Row: {
          credits_remaining: number
          is_subscriber: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          credits_remaining?: number
          is_subscriber?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          credits_remaining?: number
          is_subscriber?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_view_log: {
        Row: {
          charged: boolean
          id: string
          profile_id: string
          viewed_at: string
          viewed_on: string
          viewer_user_id: string
        }
        Insert: {
          charged?: boolean
          id?: string
          profile_id: string
          viewed_at?: string
          viewed_on?: string
          viewer_user_id: string
        }
        Update: {
          charged?: boolean
          id?: string
          profile_id?: string
          viewed_at?: string
          viewed_on?: string
          viewer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_view_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_views: {
        Row: {
          created_at: string
          period_key: string
          profile_id: string
          view_id: string
          viewer_user_id: string
        }
        Insert: {
          created_at?: string
          period_key: string
          profile_id: string
          view_id?: string
          viewer_user_id: string
        }
        Update: {
          created_at?: string
          period_key?: string
          profile_id?: string
          view_id?: string
          viewer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_visits: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          viewer_session_id: string | null
          viewer_user_id: string | null
          visit_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          viewer_session_id?: string | null
          viewer_user_id?: string | null
          visit_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          viewer_session_id?: string | null
          viewer_user_id?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      provider_config: {
        Row: {
          api_key_secret_name: string | null
          config: Json
          cost_per_request: number | null
          created_at: string
          headers: Json | null
          id: string
          provider_id: string
          rate_limit_per_minute: number
          updated_at: string
        }
        Insert: {
          api_key_secret_name?: string | null
          config?: Json
          cost_per_request?: number | null
          created_at?: string
          headers?: Json | null
          id?: string
          provider_id: string
          rate_limit_per_minute: number
          updated_at?: string
        }
        Update: {
          api_key_secret_name?: string | null
          config?: Json
          cost_per_request?: number | null
          created_at?: string
          headers?: Json | null
          id?: string
          provider_id?: string
          rate_limit_per_minute?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_config_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "social_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_usage: {
        Row: {
          created_at: string
          errors_count: number | null
          estimated_cost: number | null
          id: string
          posts_fetched: number | null
          provider_id: string
          requests_made: number
          usage_date: string
        }
        Insert: {
          created_at?: string
          errors_count?: number | null
          estimated_cost?: number | null
          id?: string
          posts_fetched?: number | null
          provider_id: string
          requests_made?: number
          usage_date: string
        }
        Update: {
          created_at?: string
          errors_count?: number | null
          estimated_cost?: number | null
          id?: string
          posts_fetched?: number | null
          provider_id?: string
          requests_made?: number
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_usage_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "social_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_contact_details_table: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          publication_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          publication_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          publication_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_contact_details_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publication_contact_details"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "publication_contact_details_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_contact_details_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["publication_id"]
          },
        ]
      }
      publication_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          job_title: string | null
          name: string | null
          other_details: string | null
          phone: string | null
          publication_id: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string | null
          name?: string | null
          other_details?: string | null
          phone?: string | null
          publication_id: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string | null
          name?: string | null
          other_details?: string | null
          phone?: string | null
          publication_id?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_contacts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      publication_journalists: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          journalist_id: string
          publication_id: string
          role_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          journalist_id: string
          publication_id: string
          role_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          journalist_id?: string
          publication_id?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_journalists_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "journalist_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_news_desk_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          job_title: string | null
          name: string | null
          news_desk_id: string
          other_details: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string | null
          name?: string | null
          news_desk_id: string
          other_details?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          job_title?: string | null
          name?: string | null
          news_desk_id?: string
          other_details?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_news_desk_contacts_news_desk_id_fkey"
            columns: ["news_desk_id"]
            isOneToOne: false
            referencedRelation: "publication_news_desks"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_news_desks: {
        Row: {
          created_at: string
          description: string | null
          desk_type_id: string | null
          id: string
          publication_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          desk_type_id?: string | null
          id?: string
          publication_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          desk_type_id?: string | null
          id?: string
          publication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_news_desks_desk_type_id_fkey"
            columns: ["desk_type_id"]
            isOneToOne: false
            referencedRelation: "news_desk_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_news_desks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      publication_periodicals: {
        Row: {
          created_at: string
          id: string
          periodical_type_id: string | null
          publication_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          periodical_type_id?: string | null
          publication_id: string
        }
        Update: {
          created_at?: string
          id?: string
          periodical_type_id?: string | null
          publication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_periodicals_periodical_type_id_fkey"
            columns: ["periodical_type_id"]
            isOneToOne: false
            referencedRelation: "periodical_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_periodicals_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      publication_profiles: {
        Row: {
          circulation_info: string | null
          created_at: string
          directory_profile_id: string
          editor_in_chief: string | null
          publication_status: string | null
          updated_at: string
        }
        Insert: {
          circulation_info?: string | null
          created_at?: string
          directory_profile_id: string
          editor_in_chief?: string | null
          publication_status?: string | null
          updated_at?: string
        }
        Update: {
          circulation_info?: string | null
          created_at?: string
          directory_profile_id?: string
          editor_in_chief?: string | null
          publication_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "publication_profiles_directory_profile_id_fkey"
            columns: ["directory_profile_id"]
            isOneToOne: true
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      publication_views: {
        Row: {
          created_at: string
          id: string
          period_key: string
          publication_id: string
          viewer_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_key: string
          publication_id: string
          viewer_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_key?: string
          publication_id?: string
          viewer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_views_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publication_contact_details"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "publication_views_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_views_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["publication_id"]
          },
        ]
      }
      publications: {
        Row: {
          audience_type: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          editorial_contact_email: string | null
          facebook_url: string | null
          headquarters_city: string | null
          id: string
          instagram_url: string | null
          is_verified: boolean | null
          legal_name: string | null
          linkedin_page: string | null
          logo_url: string | null
          main_focus_areas: string[] | null
          name: string
          name_ar: string | null
          primary_language: string | null
          regions_covered: string[] | null
          sector_id: string | null
          slug: string | null
          submission_guidelines: string | null
          twitter_handle: string | null
          type: string | null
          updated_at: string | null
          verification_status: string | null
          visibility: string | null
          website_url: string | null
        }
        Insert: {
          audience_type?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          editorial_contact_email?: string | null
          facebook_url?: string | null
          headquarters_city?: string | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          legal_name?: string | null
          linkedin_page?: string | null
          logo_url?: string | null
          main_focus_areas?: string[] | null
          name: string
          name_ar?: string | null
          primary_language?: string | null
          regions_covered?: string[] | null
          sector_id?: string | null
          slug?: string | null
          submission_guidelines?: string | null
          twitter_handle?: string | null
          type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          visibility?: string | null
          website_url?: string | null
        }
        Update: {
          audience_type?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          editorial_contact_email?: string | null
          facebook_url?: string | null
          headquarters_city?: string | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          legal_name?: string | null
          linkedin_page?: string | null
          logo_url?: string | null
          main_focus_areas?: string[] | null
          name?: string
          name_ar?: string | null
          primary_language?: string | null
          regions_covered?: string[] | null
          sector_id?: string | null
          slug?: string | null
          submission_guidelines?: string | null
          twitter_handle?: string | null
          type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          visibility?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          function_name: string
          id: string
          identifier: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          function_name: string
          id?: string
          identifier: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          function_name?: string
          id?: string
          identifier?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          id: string
          name: string
          name_ar: string | null
          slug: string
        }
        Insert: {
          id?: string
          name: string
          name_ar?: string | null
          slug: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string | null
          slug?: string
        }
        Relationships: []
      }
      social_providers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          provider_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider_name?: string
        }
        Relationships: []
      }
      source_types: {
        Row: {
          created_at: string
          id: string
          key: string
          name_ar: string | null
          name_en: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name_ar?: string | null
          name_en: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name_ar?: string | null
          name_en?: string
          sort_order?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          current_period_end: string | null
          current_period_start: string | null
          monthly_record_limit: number
          plan_key: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          current_period_end?: string | null
          current_period_start?: string | null
          monthly_record_limit?: number
          plan_key?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          current_period_end?: string | null
          current_period_start?: string | null
          monthly_record_limit?: number
          plan_key?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          name_ar: string | null
          slug: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_ar?: string | null
          slug: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_ar?: string | null
          slug?: string
          usage_count?: number
        }
        Relationships: []
      }
      tweets_processed: {
        Row: {
          id: string
          processed_at: string
          status: string
          tweet_id: string | null
        }
        Insert: {
          id?: string
          processed_at?: string
          status?: string
          tweet_id?: string | null
        }
        Update: {
          id?: string
          processed_at?: string
          status?: string
          tweet_id?: string | null
        }
        Relationships: []
      }
      unlocks: {
        Row: {
          id: number
          journalist_id: string
          pr_user_id: string
          publication_id: string | null
          unlocked_at: string | null
          unlocked_field: string
        }
        Insert: {
          id?: number
          journalist_id: string
          pr_user_id: string
          publication_id?: string | null
          unlocked_at?: string | null
          unlocked_field: string
        }
        Update: {
          id?: number
          journalist_id?: string
          pr_user_id?: string
          publication_id?: string | null
          unlocked_at?: string | null
          unlocked_field?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocks_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "journalists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocks_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "unlocks_journalist_id_fkey"
            columns: ["journalist_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["journalist_id"]
          },
          {
            foreignKeyName: "unlocks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publication_contact_details"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "unlocks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["publication_id"]
          },
        ]
      }
      user_coins: {
        Row: {
          balance: number
          total_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          total_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          total_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "directory_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_contact_details"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_all"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_experts"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_journalists"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_directory_publications"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_public_directory"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "user_favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_subscriber_directory_journalists"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      user_lists: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_monitoring_plan: {
        Row: {
          created_at: string
          plan_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          plan_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          plan_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_monitoring_plan_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "monitoring_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_bypass_coins: boolean
          can_override_limits: boolean
          can_view_all_contacts: boolean
          created_at: string
          user_id: string
        }
        Insert: {
          can_bypass_coins?: boolean
          can_override_limits?: boolean
          can_view_all_contacts?: boolean
          created_at?: string
          user_id: string
        }
        Update: {
          can_bypass_coins?: boolean
          can_override_limits?: boolean
          can_view_all_contacts?: boolean
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      x_monitors: {
        Row: {
          accounts: string[] | null
          created_at: string
          id: string
          is_active: boolean
          keywords: string[] | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accounts?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accounts?: string[] | null
          created_at?: string
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      x_post_snapshots: {
        Row: {
          captured_at: string
          id: string
          metrics: Json | null
          x_post_id: string
        }
        Insert: {
          captured_at?: string
          id?: string
          metrics?: Json | null
          x_post_id: string
        }
        Update: {
          captured_at?: string
          id?: string
          metrics?: Json | null
          x_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "x_post_snapshots_x_post_id_fkey"
            columns: ["x_post_id"]
            isOneToOne: false
            referencedRelation: "x_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      x_posts: {
        Row: {
          author_handle: string | null
          content: string | null
          created_at: string
          external_id: string | null
          id: string
          metrics: Json | null
          posted_at: string | null
        }
        Insert: {
          author_handle?: string | null
          content?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          metrics?: Json | null
          posted_at?: string | null
        }
        Update: {
          author_handle?: string | null
          content?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          metrics?: Json | null
          posted_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      profile_contact_details: {
        Row: {
          facebook_url: string | null
          instagram_url: string | null
          linkedin_url: string | null
          profile_id: string | null
          twitter_handle: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          facebook_url?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          profile_id?: string | null
          twitter_handle?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          facebook_url?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          profile_id?: string | null
          twitter_handle?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      publication_contact_details: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          publication_id: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          publication_id?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          publication_id?: string | null
        }
        Relationships: []
      }
      v_directory_all: {
        Row: {
          allow_subscribers_contact: boolean | null
          approval_status: string | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          country_code: string | null
          created_at: string | null
          display_name: string | null
          display_name_ar: string | null
          headline: string | null
          is_listed: boolean | null
          is_public: boolean | null
          languages: string[] | null
          linkedin_url: string | null
          outlet_name: string | null
          owner_user_id: string | null
          profile_id: string | null
          profile_type: string | null
          slug: string | null
          tags: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          allow_subscribers_contact?: boolean | null
          approval_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          display_name?: string | null
          display_name_ar?: string | null
          headline?: string | null
          is_listed?: boolean | null
          is_public?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          outlet_name?: string | null
          owner_user_id?: string | null
          profile_id?: string | null
          profile_type?: string | null
          slug?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          allow_subscribers_contact?: boolean | null
          approval_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          display_name?: string | null
          display_name_ar?: string | null
          headline?: string | null
          is_listed?: boolean | null
          is_public?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          outlet_name?: string | null
          owner_user_id?: string | null
          profile_id?: string | null
          profile_type?: string | null
          slug?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      v_directory_experts: {
        Row: {
          allow_subscribers_contact: boolean | null
          approval_status: string | null
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          contact_visibility_level: string | null
          country_code: string | null
          created_at: string | null
          current_organisation: string | null
          display_name: string | null
          display_name_ar: string | null
          expert_approval_status: string | null
          expert_id: string | null
          facebook_url: string | null
          full_name: string | null
          headline: string | null
          industry_focus: string[] | null
          instagram_url: string | null
          is_listed: boolean | null
          is_public: boolean | null
          languages: string[] | null
          linkedin_url: string | null
          media_experience: boolean | null
          outlet_name: string | null
          owner_user_id: string | null
          preferred_topics: string[] | null
          previous_quotes: string | null
          primary_expertise: string | null
          profile_id: string | null
          profile_type: string | null
          profile_visibility: string | null
          role_type: string | null
          secondary_expertise: string[] | null
          slug: string | null
          tags: string[] | null
          title: string | null
          twitter_handle: string | null
          updated_at: string | null
          verification_status: string | null
          website_url: string | null
          years_experience: number | null
          youtube_url: string | null
        }
        Relationships: []
      }
      v_directory_journalists: {
        Row: {
          affiliations: string[] | null
          allow_subscribers_contact: boolean | null
          approval_status: string | null
          avatar_url: string | null
          bio: string | null
          bio_long: string | null
          bio_short: string | null
          category: string | null
          city: string | null
          contact_visibility_level: string | null
          country_code: string | null
          created_at: string | null
          current_status: string | null
          display_name: string | null
          display_name_ar: string | null
          employment_type: string | null
          facebook_url: string | null
          full_name: string | null
          headline: string | null
          instagram_url: string | null
          is_listed: boolean | null
          is_public: boolean | null
          journalist_approval_status: string | null
          journalist_city: string | null
          journalist_country: string | null
          journalist_id: string | null
          languages: string[] | null
          linkedin_url: string | null
          outlet_name: string | null
          owner_user_id: string | null
          primary_beat: string | null
          primary_language: string | null
          profile_id: string | null
          profile_type: string | null
          profile_visibility: string | null
          regions_covered: string[] | null
          secondary_beats: string[] | null
          slug: string | null
          social_media_links: Json | null
          tags: string[] | null
          twitter_handle: string | null
          updated_at: string | null
          verification_status: string | null
          website_url: string | null
          years_experience: number | null
          youtube_url: string | null
        }
        Relationships: []
      }
      v_directory_publications: {
        Row: {
          allow_subscribers_contact: boolean | null
          approval_status: string | null
          audience_type: string | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country_code: string | null
          created_at: string | null
          description: string | null
          display_name: string | null
          display_name_ar: string | null
          editorial_contact_email: string | null
          facebook_url: string | null
          headline: string | null
          headquarters_city: string | null
          instagram_url: string | null
          is_listed: boolean | null
          is_public: boolean | null
          languages: string[] | null
          legal_name: string | null
          linkedin_url: string | null
          main_focus_areas: string[] | null
          name: string | null
          outlet_name: string | null
          owner_user_id: string | null
          primary_language: string | null
          profile_id: string | null
          profile_type: string | null
          publication_country: string | null
          publication_id: string | null
          publication_type: string | null
          regions_covered: string[] | null
          slug: string | null
          submission_guidelines: string | null
          tags: string[] | null
          twitter_handle: string | null
          updated_at: string | null
          verification_status: string | null
          visibility: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Relationships: []
      }
      v_public_directory: {
        Row: {
          approval_status: string | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          country_code: string | null
          created_at: string | null
          display_name: string | null
          display_name_ar: string | null
          headline: string | null
          is_listed: boolean | null
          is_public: boolean | null
          languages: string[] | null
          linkedin_url: string | null
          outlet_name: string | null
          profile_id: string | null
          profile_type: string | null
          slug: string | null
          tags: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          approval_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          display_name?: string | null
          display_name_ar?: string | null
          headline?: string | null
          is_listed?: boolean | null
          is_public?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          outlet_name?: string | null
          profile_id?: string | null
          profile_type?: string | null
          slug?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          approval_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          display_name?: string | null
          display_name_ar?: string | null
          headline?: string | null
          is_listed?: boolean | null
          is_public?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          outlet_name?: string | null
          profile_id?: string | null
          profile_type?: string | null
          slug?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      v_subscriber_directory_journalists: {
        Row: {
          affiliations: string[] | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          country_code: string | null
          display_name: string | null
          full_name: string | null
          headline: string | null
          journalist_id: string | null
          languages: string[] | null
          linkedin_url: string | null
          outlet_name: string | null
          owner_user_id: string | null
          primary_beat: string | null
          profile_id: string | null
          regions_covered: string[] | null
          secondary_beats: string[] | null
          slug: string | null
          tags: string[] | null
          updated_at: string | null
          website_url: string | null
          years_experience: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_view_contact: { Args: { p_profile_id: string }; Returns: boolean }
      charge_coins: {
        Args: {
          p_amount: number
          p_reason: string
          p_ref_id?: string
          p_ref_type?: string
        }
        Returns: undefined
      }
      consume_credit_and_log_view: {
        Args: { p_profile_id: string }
        Returns: Json
      }
      consume_credit_and_log_view_debug: {
        Args: { p_profile_id: string; p_viewer_user_id: string }
        Returns: Json
      }
      current_period_key: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { uid: string }; Returns: boolean }
      is_admin_or_subadmin: { Args: { p_user_id: string }; Returns: boolean }
      is_paid_pr: { Args: { uid: string }; Returns: boolean }
      is_pr_paid_active: { Args: never; Returns: boolean }
      rpc_search_journalists_subscriber: {
        Args: {
          p_city?: string
          p_cost?: number
          p_country_code?: string
          p_limit?: number
          p_query?: string
          p_tag?: string
        }
        Returns: {
          affiliations: string[] | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          country_code: string | null
          display_name: string | null
          full_name: string | null
          headline: string | null
          journalist_id: string | null
          languages: string[] | null
          linkedin_url: string | null
          outlet_name: string | null
          owner_user_id: string | null
          primary_beat: string | null
          profile_id: string | null
          regions_covered: string[] | null
          secondary_beats: string[] | null
          slug: string | null
          tags: string[] | null
          updated_at: string | null
          website_url: string | null
          years_experience: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "v_subscriber_directory_journalists"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      rpc_unlock_journalist_contact: {
        Args: {
          p_cost?: number
          p_journalist_id: string
          p_unlocked_field?: string
        }
        Returns: Json
      }
      rpc_view_profile: {
        Args: { p_cost?: number; p_profile_id: string }
        Returns: Json
      }
      track_profile_view: { Args: { p_profile_id: string }; Returns: Json }
      track_publication_view: {
        Args: { p_publication_id: string }
        Returns: Json
      }
      unlock_balance: {
        Args: { unlock_amount: number; user_id: string }
        Returns: Json
      }
      unlock_contact_details: {
        Args: { p_cost: number; p_journalist_id: string }
        Returns: Json
      }
      unlock_publication_details: {
        Args: { p_cost: number; p_pub_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "sub_admin"
        | "subscriber"
        | "user"
        | "general_sub_admin"
        | "content_sub_admin"
        | "journalist_pr"
        | "expert"
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
      app_role: [
        "admin",
        "sub_admin",
        "subscriber",
        "user",
        "general_sub_admin",
        "content_sub_admin",
        "journalist_pr",
        "expert",
      ],
    },
  },
} as const
