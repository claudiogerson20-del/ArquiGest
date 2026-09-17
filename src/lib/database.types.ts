export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
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
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          org_id: string
          phone: string | null
          tax_id: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          org_id: string
          phone?: string | null
          tax_id?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          org_id?: string
          phone?: string | null
          tax_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          created_at: string
          description: string
          due_date: string | null
          id: string
          org_id: string
          project_id: string
          requested_by: string | null
          review_note: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["request_status"]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          org_id: string
          project_id: string
          requested_by?: string | null
          review_note?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          org_id?: string
          project_id?: string
          requested_by?: string | null
          review_note?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["document_kind"]
          mime_type: string | null
          name: string
          org_id: string
          phase_id: string | null
          project_id: string
          request_id: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
          version: number
          visible_to_client: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["document_kind"]
          mime_type?: string | null
          name: string
          org_id: string
          phase_id?: string | null
          project_id: string
          request_id?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
          version?: number
          visible_to_client?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["document_kind"]
          mime_type?: string | null
          name?: string
          org_id?: string
          phase_id?: string | null
          project_id?: string
          request_id?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
          version?: number
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "document_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          org_id: string
          project_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          org_id: string
          project_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          org_id?: string
          project_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          description: string
          done_at: string | null
          due_date: string
          id: string
          org_id: string
          phase_id: string | null
          project_id: string
          title: string
          visible_to_client: boolean
        }
        Insert: {
          created_at?: string
          description?: string
          done_at?: string | null
          due_date: string
          id?: string
          org_id: string
          phase_id?: string | null
          project_id: string
          title: string
          visible_to_client?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          done_at?: string | null
          due_date?: string
          id?: string
          org_id?: string
          phase_id?: string | null
          project_id?: string
          title?: string
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "milestones_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invitations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          currency: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          country: Database["public"]["Enums"]["country_code"]
          created_at?: string
          currency: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      phase_templates: {
        Row: {
          code: string
          country: Database["public"]["Enums"]["country_code"]
          default_weeks: number
          description: string
          name: string
          position: number
        }
        Insert: {
          code: string
          country: Database["public"]["Enums"]["country_code"]
          default_weeks?: number
          description?: string
          name: string
          position: number
        }
        Update: {
          code?: string
          country?: Database["public"]["Enums"]["country_code"]
          default_weeks?: number
          description?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      project_events: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          org_id: string
          project_id: string
          title: string
          type: string
          visible_to_client: boolean
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          org_id: string
          project_id: string
          title: string
          type: string
          visible_to_client?: boolean
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          org_id?: string
          project_id?: string
          title?: string
          type?: string
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_events_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          code: string
          completed_at: string | null
          description: string
          due_date: string | null
          id: string
          name: string
          org_id: string
          position: number
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["phase_status"]
        }
        Insert: {
          code: string
          completed_at?: string | null
          description?: string
          due_date?: string | null
          id?: string
          name: string
          org_id: string
          position: number
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["phase_status"]
        }
        Update: {
          code?: string
          completed_at?: string | null
          description?: string
          due_date?: string | null
          id?: string
          name?: string
          org_id?: string
          position?: number
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["phase_status"]
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          code: string | null
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          created_by: string | null
          description: string
          due_date: string | null
          id: string
          lead_architect_id: string | null
          location: string
          name: string
          org_id: string
          progress: number
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          typology: string
          updated_at: string
        }
        Insert: {
          client_id: string
          code?: string | null
          country: Database["public"]["Enums"]["country_code"]
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string | null
          id?: string
          lead_architect_id?: string | null
          location?: string
          name: string
          org_id: string
          progress?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          typology?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          code?: string | null
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string | null
          id?: string
          lead_architect_id?: string | null
          location?: string
          name?: string
          org_id?: string
          progress?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          typology?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lead_architect_id_fkey"
            columns: ["lead_architect_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_project: { Args: { p_project: string }; Returns: boolean }
      can_see_profile: { Args: { p_user: string }; Returns: boolean }
      create_organization: {
        Args: {
          p_country: Database["public"]["Enums"]["country_code"]
          p_name: string
        }
        Returns: string
      }
      create_project: {
        Args: {
          p_client: string
          p_code?: string
          p_description?: string
          p_due?: string
          p_location?: string
          p_name: string
          p_org: string
          p_start?: string
          p_typology?: string
        }
        Returns: string
      }
      is_org_admin: { Args: { p_org: string }; Returns: boolean }
      is_org_client: { Args: { p_org: string }; Returns: boolean }
      is_org_member: { Args: { p_org: string }; Returns: boolean }
      is_project_client: { Args: { p_project: string }; Returns: boolean }
      is_project_staff: { Args: { p_project: string }; Returns: boolean }
      log_event: {
        Args: {
          p_project: string
          p_title: string
          p_type: string
          p_visible?: boolean
        }
        Returns: undefined
      }
      review_document_request: {
        Args: { p_approve: boolean; p_note?: string; p_request: string }
        Returns: undefined
      }
      storage_project_id: { Args: { p_name: string }; Returns: string }
    }
    Enums: {
      country_code: "PT" | "AO" | "BR"
      document_kind:
        | "drawing"
        | "model"
        | "render"
        | "contract"
        | "client_upload"
        | "other"
      org_role: "owner" | "admin" | "architect"
      phase_status: "pending" | "in_progress" | "awaiting_client" | "completed"
      project_status: "draft" | "active" | "on_hold" | "completed" | "cancelled"
      request_status: "pending" | "submitted" | "approved" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      country_code: ["PT", "AO", "BR"],
      document_kind: [
        "drawing",
        "model",
        "render",
        "contract",
        "client_upload",
        "other",
      ],
      org_role: ["owner", "admin", "architect"],
      phase_status: ["pending", "in_progress", "awaiting_client", "completed"],
      project_status: ["draft", "active", "on_hold", "completed", "cancelled"],
      request_status: ["pending", "submitted", "approved", "rejected"],
    },
  },
} as const

