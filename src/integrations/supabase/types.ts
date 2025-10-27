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
      badges: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      caregiver_relationships: {
        Row: {
          caregiver_id: string
          created_at: string | null
          dependent_id: string
          id: string
          relationship_type: string
          status: string
        }
        Insert: {
          caregiver_id: string
          created_at?: string | null
          dependent_id: string
          id?: string
          relationship_type: string
          status?: string
        }
        Update: {
          caregiver_id?: string
          created_at?: string | null
          dependent_id?: string
          id?: string
          relationship_type?: string
          status?: string
        }
        Relationships: []
      }
      medication_interactions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          interaction_type: string
          medication_name_1: string
          medication_name_2: string
          recommendation: string | null
          severity: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          interaction_type: string
          medication_name_1: string
          medication_name_2: string
          recommendation?: string | null
          severity: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          interaction_type?: string
          medication_name_1?: string
          medication_name_2?: string
          recommendation?: string | null
          severity?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          notes: string | null
          scheduled_for: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          medication_id: string
          notes?: string | null
          scheduled_for: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          medication_id?: string
          notes?: string | null
          scheduled_for?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean | null
          created_at: string | null
          dosage: string
          frequency: string
          id: string
          name: string
          notes: string | null
          refill_date: string | null
          time_of_day: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          dosage: string
          frequency: string
          id?: string
          name: string
          notes?: string | null
          refill_date?: string | null
          time_of_day: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          dosage?: string
          frequency?: string
          id?: string
          name?: string
          notes?: string | null
          refill_date?: string | null
          time_of_day?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          energy_level: number | null
          id: string
          logged_at: string | null
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          energy_level?: number | null
          id?: string
          logged_at?: string | null
          mood: string
          notes?: string | null
          user_id: string
        }
        Update: {
          energy_level?: number | null
          id?: string
          logged_at?: string | null
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pharmacy_refills: {
        Row: {
          id: string
          medication_id: string
          pharmacy_name: string
          pharmacy_phone: string | null
          picked_up_at: string | null
          ready_at: string | null
          refill_status: string
          requested_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          medication_id: string
          pharmacy_name: string
          pharmacy_phone?: string | null
          picked_up_at?: string | null
          ready_at?: string | null
          refill_status?: string
          requested_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          medication_id?: string
          pharmacy_name?: string
          pharmacy_phone?: string | null
          picked_up_at?: string | null
          ready_at?: string | null
          refill_status?: string
          requested_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_refills_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_level: number | null
          avatar_xp: number | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          id: string
          max_streak: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_level?: number | null
          avatar_xp?: number | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          id: string
          max_streak?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_level?: number | null
          avatar_xp?: number | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          id?: string
          max_streak?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      side_effects: {
        Row: {
          effect: string
          id: string
          logged_at: string | null
          medication_id: string
          notes: string | null
          severity: string
          user_id: string
        }
        Insert: {
          effect: string
          id?: string
          logged_at?: string | null
          medication_id: string
          notes?: string | null
          severity: string
          user_id: string
        }
        Update: {
          effect?: string
          id?: string
          logged_at?: string | null
          medication_id?: string
          notes?: string | null
          severity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "side_effects_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
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
