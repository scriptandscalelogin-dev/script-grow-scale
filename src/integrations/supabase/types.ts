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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          target_id: string | null
          target_kind: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_kind?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_kind?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string
          company_type: string | null
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
        }
        Insert: {
          company: string
          company_type?: string | null
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
        }
        Update: {
          company?: string
          company_type?: string | null
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      content_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          content_id: string
          id: string
          profile_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          content_id: string
          id?: string
          profile_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          content_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_assignments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          body: string
          created_at: string
          created_by: string
          current_version: number
          id: string
          kind: Database["public"]["Enums"]["content_kind"]
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          created_by: string
          current_version?: number
          id?: string
          kind: Database["public"]["Enums"]["content_kind"]
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          current_version?: number
          id?: string
          kind?: Database["public"]["Enums"]["content_kind"]
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          body: string
          change_notes: string | null
          content_id: string
          created_at: string
          created_by: string
          id: string
          title: string
          version_number: number
        }
        Insert: {
          body: string
          change_notes?: string | null
          content_id: string
          created_at?: string
          created_by: string
          id?: string
          title: string
          version_number: number
        }
        Update: {
          body?: string
          change_notes?: string | null
          content_id?: string
          created_at?: string
          created_by?: string
          id?: string
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          closed_at: string
          created_at: string
          id: string
          profile_id: string
          title: string
          updated_at: string
          value_gbp: number
        }
        Insert: {
          closed_at?: string
          created_at?: string
          id?: string
          profile_id: string
          title: string
          updated_at?: string
          value_gbp: number
        }
        Update: {
          closed_at?: string
          created_at?: string
          id?: string
          profile_id?: string
          title?: string
          updated_at?: string
          value_gbp?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_entries: {
        Row: {
          avg_deal_value: number
          client_id: string
          close_rate_est: number
          closed_deal_value: number
          created_at: string
          dead_pipeline_value: number
          id: string
          month: string
          notes: string | null
          opportunities: number
          updated_at: string
        }
        Insert: {
          avg_deal_value?: number
          client_id: string
          close_rate_est?: number
          closed_deal_value?: number
          created_at?: string
          dead_pipeline_value?: number
          id?: string
          month: string
          notes?: string | null
          opportunities?: number
          updated_at?: string
        }
        Update: {
          avg_deal_value?: number
          client_id?: string
          close_rate_est?: number
          closed_deal_value?: number
          created_at?: string
          dead_pipeline_value?: number
          id?: string
          month?: string
          notes?: string | null
          opportunities?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          monthly_fee: number | null
          notes: string | null
          phone: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["client_status"]
          tier: Database["public"]["Enums"]["tier"] | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          monthly_fee?: number | null
          notes?: string | null
          phone?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tier?: Database["public"]["Enums"]["tier"] | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          monthly_fee?: number | null
          notes?: string | null
          phone?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          tier?: Database["public"]["Enums"]["tier"] | null
          updated_at?: string
        }
        Relationships: []
      }
      roleplay_recordings: {
        Row: {
          client_id: string
          created_at: string
          id: string
          mime_type: string | null
          notes: string | null
          recorded_on: string
          session_id: string | null
          storage_path: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          recorded_on?: string
          session_id?: string | null
          storage_path: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          recorded_on?: string
          session_id?: string | null
          storage_path?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roleplay_recordings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roleplay_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workshop_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshop_sessions: {
        Row: {
          action_items: string | null
          attended: boolean
          client_id: string
          covered: string | null
          created_at: string
          id: string
          notes: string | null
          session_date: string
          updated_at: string
        }
        Insert: {
          action_items?: string | null
          attended?: boolean
          client_id: string
          covered?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_date: string
          updated_at?: string
        }
        Update: {
          action_items?: string | null
          attended?: boolean
          client_id?: string
          covered?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "client"
      client_status: "active" | "paused" | "ended"
      content_kind: "script" | "sop" | "objection"
      content_status: "draft" | "published" | "archived"
      tier: "starter" | "growth" | "scale"
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
      app_role: ["admin", "client"],
      client_status: ["active", "paused", "ended"],
      content_kind: ["script", "sop", "objection"],
      content_status: ["draft", "published", "archived"],
      tier: ["starter", "growth", "scale"],
    },
  },
} as const
