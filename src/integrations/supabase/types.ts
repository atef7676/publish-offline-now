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
      directory_profiles: {
        Row: {
          allow_subscribers_contact: boolean
          approval_status: string
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          country_code: string | null
          created_at: string
          display_name: string
          display_name_ar: string | null
          facebook_url: string | null
          headline: string | null
          instagram_url: string | null
          is_listed: boolean
          is_public: boolean
          languages: string[]
          linkedin_url: string | null
          outlet_name: string | null
          owner_user_id: string | null
          profile_id: string
          profile_type: string
          slug: string
          tags: string[]
          twitter_handle: string | null
          updated_at: string
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          allow_subscribers_contact?: boolean
          approval_status?: string
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          display_name: string
          display_name_ar?: string | null
          facebook_url?: string | null
          headline?: string | null
          instagram_url?: string | null
          is_listed?: boolean
          is_public?: boolean
          languages?: string[]
          linkedin_url?: string | null
          outlet_name?: string | null
          owner_user_id?: string | null
          profile_id?: string
          profile_type: string
          slug: string
          tags?: string[]
          twitter_handle?: string | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          allow_subscribers_contact?: boolean
          approval_status?: string
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          display_name?: string
          display_name_ar?: string | null
          facebook_url?: string | null
          headline?: string | null
          instagram_url?: string | null
          is_listed?: boolean
          is_public?: boolean
          languages?: string[]
          linkedin_url?: string | null
          outlet_name?: string | null
          owner_user_id?: string | null
          profile_id?: string
          profile_type?: string
          slug?: string
          tags?: string[]
          twitter_handle?: string | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
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
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          editorial_contact_email: string | null
          headquarters_city: string | null
          id: string
          legal_name: string | null
          linkedin_page: string | null
          main_focus_areas: string[] | null
          name: string
          primary_language: string | null
          regions_covered: string[] | null
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
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          editorial_contact_email?: string | null
          headquarters_city?: string | null
          id?: string
          legal_name?: string | null
          linkedin_page?: string | null
          main_focus_areas?: string[] | null
          name: string
          primary_language?: string | null
          regions_covered?: string[] | null
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
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          editorial_contact_email?: string | null
          headquarters_city?: string | null
          id?: string
          legal_name?: string | null
          linkedin_page?: string | null
          main_focus_areas?: string[] | null
          name?: string
          primary_language?: string | null
          regions_covered?: string[] | null
          slug?: string | null
          submission_guidelines?: string | null
          twitter_handle?: string | null
          type?: string | null
          updated_at?: string | null
          verification_status?: string | null
          visibility?: string | null
          website_url?: string | null
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
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { uid: string }; Returns: boolean }
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
