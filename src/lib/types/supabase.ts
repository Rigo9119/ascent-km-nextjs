export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories_backup: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: number | null
          name: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          category: string | null
          category_id: string | null
          community_type_id: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_public: boolean | null
          location: string | null
          long_description: string | null
          meeting_frequency: string | null
          member_count: number | null
          name: string
          next_meeting_date: string | null
          next_meeting_details: Json | null
          next_meeting_location: string | null
          organizer_id: string | null
          recent_discussions: Json | null
          rules: string[] | null
          tags: string[] | null
          upcoming_events: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          community_type_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          location?: string | null
          long_description?: string | null
          meeting_frequency?: string | null
          member_count?: number | null
          name: string
          next_meeting_date?: string | null
          next_meeting_details?: Json | null
          next_meeting_location?: string | null
          organizer_id?: string | null
          recent_discussions?: Json | null
          rules?: string[] | null
          tags?: string[] | null
          upcoming_events?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          category_id?: string | null
          community_type_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          location?: string | null
          long_description?: string | null
          meeting_frequency?: string | null
          member_count?: number | null
          name?: string
          next_meeting_date?: string | null
          next_meeting_details?: Json | null
          next_meeting_location?: string | null
          organizer_id?: string | null
          recent_discussions?: Json | null
          rules?: string[] | null
          tags?: string[] | null
          upcoming_events?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "communities_community_type_id_fkey"
            columns: ["community_type_id"]
            isOneToOne: false
            referencedRelation: "community_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities_backup: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number | null
          image: string | null
          is_featured: boolean | null
          is_public: boolean | null
          member_count: number | null
          name: string | null
          tags: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number | null
          image?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          member_count?: number | null
          name?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number | null
          image?: string | null
          is_featured?: boolean | null
          is_public?: boolean | null
          member_count?: number | null
          name?: string | null
          tags?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string | null
          id: number
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          id?: number
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          id?: number
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
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
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
        ]
      }
      community_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discussions: {
        Row: {
          community_id: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          check_in_time: string | null
          created_at: string | null
          event_id: string
          feedback_comment: string | null
          feedback_rating: number | null
          id: string
          registered_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          check_in_time?: string | null
          created_at?: string | null
          event_id: string
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          registered_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          check_in_time?: string | null
          created_at?: string | null
          event_id?: string
          feedback_comment?: string | null
          feedback_rating?: number | null
          id?: string
          registered_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_types_backup: {
        Row: {
          created_at: string | null
          description: string | null
          id: number | null
          is_free: boolean | null
          name: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          is_free?: boolean | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          is_free?: boolean | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees: string[] | null
          capacity: number | null
          category_id: string | null
          contact: string | null
          created_at: string | null
          date: string
          description: string | null
          event_type_id: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_free: boolean | null
          location_id: string | null
          long_description: string | null
          name: string
          organizer: string | null
          owner_id: string | null
          price: string | null
          rating: number | null
          requirements: string[] | null
          time: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          attendees?: string[] | null
          capacity?: number | null
          category_id?: string | null
          contact?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          event_type_id?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_free?: boolean | null
          location_id?: string | null
          long_description?: string | null
          name: string
          organizer?: string | null
          owner_id?: string | null
          price?: string | null
          rating?: number | null
          requirements?: string[] | null
          time?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          attendees?: string[] | null
          capacity?: number | null
          category_id?: string | null
          contact?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          event_type_id?: string | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_free?: boolean | null
          location_id?: string | null
          long_description?: string | null
          name?: string
          organizer?: string | null
          owner_id?: string | null
          price?: string | null
          rating?: number | null
          requirements?: string[] | null
          time?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["event_type_id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      events_backup: {
        Row: {
          capacity: number | null
          category: string | null
          category_id: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          currency: string | null
          current_attendees: number | null
          date: string | null
          description: string | null
          event_type_id: number | null
          fee: boolean | null
          highlights: string[] | null
          id: number | null
          image: string | null
          is_featured: boolean | null
          location_id: number | null
          location_text: string | null
          long_description: string | null
          name: string | null
          organizer_id: string | null
          organizer_name: string | null
          price: number | null
          requirements: string[] | null
          status: string | null
          tags: string[] | null
          time: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          category_id?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          currency?: string | null
          current_attendees?: number | null
          date?: string | null
          description?: string | null
          event_type_id?: number | null
          fee?: boolean | null
          highlights?: string[] | null
          id?: number | null
          image?: string | null
          is_featured?: boolean | null
          location_id?: number | null
          location_text?: string | null
          long_description?: string | null
          name?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          price?: number | null
          requirements?: string[] | null
          status?: string | null
          tags?: string[] | null
          time?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          capacity?: number | null
          category?: string | null
          category_id?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          currency?: string | null
          current_attendees?: number | null
          date?: string | null
          description?: string | null
          event_type_id?: number | null
          fee?: boolean | null
          highlights?: string[] | null
          id?: number | null
          image?: string | null
          is_featured?: boolean | null
          location_id?: number | null
          location_text?: string | null
          long_description?: string | null
          name?: string | null
          organizer_id?: string | null
          organizer_name?: string | null
          price?: number | null
          requirements?: string[] | null
          status?: string | null
          tags?: string[] | null
          time?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          comment_id: string | null
          created_at: string | null
          discussion_id: string | null
          id: string
          interaction_type: string | null
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          interaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          interaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_types: {
        Row: {
          category_id: string | null
          community_type_id: string | null
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          community_type_id?: string | null
          created_at?: string
          description?: string | null
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          community_type_id?: string | null
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interest_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interest_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "interest_types_community_type_id_fkey"
            columns: ["community_type_id"]
            isOneToOne: false
            referencedRelation: "community_types"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          best_time: string | null
          close_hour: number | null
          created_at: string | null
          days_open: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          lat: number | null
          lng: number | null
          name: string
          open_hour: number | null
          phone: string | null
          price: string | null
          rating: number | null
          review_count: number | null
          tags: string[] | null
          tips: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          best_time?: string | null
          close_hour?: number | null
          created_at?: string | null
          days_open?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          lat?: number | null
          lng?: number | null
          name: string
          open_hour?: number | null
          phone?: string | null
          price?: string | null
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
          tips?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          best_time?: string | null
          close_hour?: number | null
          created_at?: string | null
          days_open?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string
          open_hour?: number | null
          phone?: string | null
          price?: string | null
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
          tips?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      locations_backup: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          id: number | null
          image: string | null
          is_featured: boolean | null
          lat: number | null
          lng: number | null
          name: string | null
          rating: number | null
          review_count: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          image?: string | null
          is_featured?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          image?: string | null
          is_featured?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          rating?: number | null
          review_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      preference_types: {
        Row: {
          created_at: string
          data_type: string
          default_value: boolean | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          data_type: string
          default_value?: boolean | null
          description?: string | null
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          data_type?: string
          default_value?: boolean | null
          description?: string | null
          id?: never
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          last_active: string | null
          phone_number: string | null
          preferences: Json | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          last_active?: string | null
          phone_number?: string | null
          preferences?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          last_active?: string | null
          phone_number?: string | null
          preferences?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          badge: string | null
          category: string
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: number
          is_active: boolean | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          badge?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          badge?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      user_communities: {
        Row: {
          community_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_event_history: {
        Row: {
          event_id: string
          user_id: string
          visited_at: string | null
        }
        Insert: {
          event_id: string
          user_id: string
          visited_at?: string | null
        }
        Update: {
          event_id?: string
          user_id?: string
          visited_at?: string | null
        }
        Relationships: []
      }
      user_favorite_communities: {
        Row: {
          community_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_communities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_events: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "user_favorite_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_locations: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "user_favorite_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorite_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      community_details: {
        Row: {
          category_color: string | null
          category_id: string | null
          category_name: string | null
          community_type: string | null
          community_type_description: string | null
          community_type_id: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          is_public: boolean | null
          location: string | null
          long_description: string | null
          meeting_frequency: string | null
          member_count: number | null
          name: string | null
          next_meeting_date: string | null
          next_meeting_details: Json | null
          next_meeting_location: string | null
          organizer_id: string | null
          organizer_name: string | null
          organizer_username: string | null
          rules: string[] | null
          tags: string[] | null
          updated_at: string | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "communities_community_type_id_fkey"
            columns: ["community_type_id"]
            isOneToOne: false
            referencedRelation: "community_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_details: {
        Row: {
          attendees_count: number | null
          capacity: number | null
          category_id: string | null
          category_name: string | null
          contact: string | null
          created_at: string | null
          date: string | null
          description: string | null
          event_type_id: string | null
          event_type_name: string | null
          highlights: string[] | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          is_free: boolean | null
          location_address: string | null
          location_id: string | null
          location_name: string | null
          long_description: string | null
          name: string | null
          organizer: string | null
          price: string | null
          rating: number | null
          requirements: string[] | null
          time: string | null
          updated_at: string | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["event_type_id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      events_with_details: {
        Row: {
          capacity: number | null
          category_id: string | null
          category_name: string | null
          contact: string | null
          created_at: string | null
          date: string | null
          description: string | null
          event_type_id: string | null
          highlights: string[] | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          is_free: boolean | null
          location_id: string | null
          location_name: string | null
          long_description: string | null
          name: string | null
          organizer: string | null
          price: string | null
          rating: number | null
          requirements: string[] | null
          time: string | null
          updated_at: string | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["event_type_id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "events_with_details_v2"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      events_with_details_v2: {
        Row: {
          category_color: string | null
          category_id: string | null
          category_name: string | null
          date: string | null
          event_description: string | null
          event_id: string | null
          event_image_url: string | null
          event_name: string | null
          event_type_id: string | null
          event_type_name: string | null
          is_featured: boolean | null
          is_free: boolean | null
          lat: number | null
          lng: number | null
          location_address: string | null
          location_id: string | null
          location_name: string | null
          rating: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_communities_by_classification: {
        Args: {
          p_category_id?: string
          p_community_type_id?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          category_color: string | null
          category_id: string | null
          category_name: string | null
          community_type: string | null
          community_type_description: string | null
          community_type_id: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          is_public: boolean | null
          location: string | null
          long_description: string | null
          meeting_frequency: string | null
          member_count: number | null
          name: string | null
          next_meeting_date: string | null
          next_meeting_details: Json | null
          next_meeting_location: string | null
          organizer_id: string | null
          organizer_name: string | null
          organizer_username: string | null
          rules: string[] | null
          tags: string[] | null
          updated_at: string | null
          website: string | null
        }[]
      }
      get_event_by_id: {
        Args: { event_id_param: string }
        Returns: {
          id: string
          name: string
          description: string
          date: string
          time: string
          location_id: string
          location_name: string
          category_id: string
          category_name: string
          event_type_id: string
          event_type_name: string
          is_free: boolean
          price: number
          image_url: string
          capacity: number
          organizer: string
          contact: string
          website: string
          requirements: string
          highlights: string
          long_description: string
          is_featured: boolean
          rating: number
          attendees_count: number
          created_at: string
          updated_at: string
        }[]
      }
      get_events_with_details_v2: {
        Args: Record<PropertyKey, never>
        Returns: {
          event_id: string
          event_name: string
          event_description: string
          date: string
          is_free: boolean
          event_image: string
          event_image_url: string
          is_featured: boolean
          rating: number
          category_id: string
          category_name: string
          category_color: string
          location_id: string
          location_name: string
          location_address: string
          lat: number
          lng: number
          event_type_id: string
          event_type_name: string
        }[]
      }
      get_location_names_and_ids: {
        Args: Record<PropertyKey, never>
        Returns: {
          location_id: string
          location_name: string
        }[]
      }
      get_user_communities: {
        Args: { user_uuid: string }
        Returns: {
          community_id: number
          community_name: string
          community_description: string
          community_image: string
          community_address: string
          user_role: string
          joined_at: string
        }[]
      }
      get_user_events: {
        Args: {
          p_user_id?: string
          p_status?: string
          p_from_date?: string
          p_to_date?: string
        }
        Returns: {
          event_id: string
          event_name: string
          event_description: string
          event_date: string
          event_location: string
          event_image_url: string
          attendance_status: string
          registered_at: string
        }[]
      }
      get_user_favorite_communities: {
        Args: { user_uuid: string }
        Returns: {
          community_id: string
          community_name: string
          community_description: string
          community_member_count: number
          favorited_at: string
        }[]
      }
      get_user_favorite_events: {
        Args: { user_uuid: string }
        Returns: {
          event_id: string
          event_name: string
          event_description: string
          event_date: string
          favorited_at: string
        }[]
      }
      get_user_favorite_locations: {
        Args: { user_uuid: string }
        Returns: {
          location_id: string
          location_name: string
          location_description: string
          location_address: string
          location_rating: number
          favorited_at: string
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      join_community: {
        Args: { community_id_param: number; user_uuid: string }
        Returns: boolean
      }
      leave_community: {
        Args: { community_id_param: number; user_uuid: string }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      toggle_favorite_community: {
        Args: { user_uuid: string; community_uuid: string }
        Returns: boolean
      }
      toggle_favorite_event: {
        Args: { user_uuid: string; event_uuid: string }
        Returns: boolean
      }
      toggle_favorite_location: {
        Args: { user_uuid: string; location_uuid: string }
        Returns: boolean
      }
      update_event_details: {
        Args: {
          p_event_id: string
          p_time: string
          p_capacity: number
          p_organizer: string
          p_contact: string
          p_website: string
          p_price: string
          p_requirements: string[]
          p_highlights: string[]
          p_long_description: string
          p_is_featured: boolean
          p_rating: number
          p_image_url: string
          p_image_path: string
        }
        Returns: {
          attendees: string[] | null
          capacity: number | null
          category_id: string | null
          contact: string | null
          created_at: string | null
          date: string
          description: string | null
          event_type_id: string | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_free: boolean | null
          location_id: string | null
          long_description: string | null
          name: string
          organizer: string | null
          owner_id: string | null
          price: string | null
          rating: number | null
          requirements: string[] | null
          time: string | null
          updated_at: string | null
          website: string | null
        }[]
      }
      user_avatars_access_policy: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
