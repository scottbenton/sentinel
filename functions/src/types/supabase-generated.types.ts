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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      dashboard_user_invites: {
        Row: {
          created_at: string
          dashboard_id: number
          email_address: string
          id: number
          invited_by: string
        }
        Insert: {
          created_at?: string
          dashboard_id: number
          email_address: string
          id?: number
          invited_by: string
        }
        Update: {
          created_at?: string
          dashboard_id?: number
          email_address?: string
          id?: number
          invited_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_user_invites_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_user_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_users: {
        Row: {
          can_manage_meetings: boolean
          can_manage_users: boolean
          created_at: string
          dashboard_id: number
          is_admin: boolean
          user_id: string
        }
        Insert: {
          can_manage_meetings?: boolean
          can_manage_users?: boolean
          created_at?: string
          dashboard_id: number
          is_admin?: boolean
          user_id: string
        }
        Update: {
          can_manage_meetings?: boolean
          can_manage_users?: boolean
          created_at?: string
          dashboard_id?: number
          is_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_users_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          created_at: string
          id: number
          label: string
        }
        Insert: {
          created_at?: string
          id?: number
          label: string
        }
        Update: {
          created_at?: string
          id?: number
          label?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          additional_context: Json
          created_at: string
          created_by: string | null
          edited_at: string | null
          id: number
          is_bot_action: boolean
          meeting_id: number | null
          org_id: number | null
          text: string | null
          type: Database["public"]["Enums"]["meeting_log_types"]
        }
        Insert: {
          additional_context?: Json
          created_at?: string
          created_by?: string | null
          edited_at?: string | null
          id?: number
          is_bot_action?: boolean
          meeting_id?: number | null
          org_id?: number | null
          text?: string | null
          type: Database["public"]["Enums"]["meeting_log_types"]
        }
        Update: {
          additional_context?: Json
          created_at?: string
          created_by?: string | null
          edited_at?: string | null
          id?: number
          is_bot_action?: boolean
          meeting_id?: number | null
          org_id?: number | null
          text?: string | null
          type?: Database["public"]["Enums"]["meeting_log_types"]
        }
        Relationships: [
          {
            foreignKeyName: "logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_logs_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_documents: {
        Row: {
          created_at: string
          created_by: string | null
          file_hash: string | null
          filename: string
          id: number
          meeting_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_hash?: string | null
          filename: string
          id?: number
          meeting_id: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_hash?: string | null
          filename?: string
          id?: number
          meeting_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "meeting_document_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_document_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          meeting_date: string
          name: string
          organization_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          meeting_date: string
          name: string
          organization_id: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          meeting_date?: string
          name?: string
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          dashboard_id: number | null
          id: number
          meeting_id: number | null
          organization_id: number | null
          settings: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_id?: number | null
          id?: number
          meeting_id?: number | null
          organization_id?: number | null
          settings?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_id?: number | null
          id?: number
          meeting_id?: number | null
          organization_id?: number | null
          settings?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_settings_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          additional_context: Json
          created_at: string
          has_been_read: boolean
          id: string
          log_id: number | null
          type: Database["public"]["Enums"]["notification_types"]
          user_id: string
        }
        Insert: {
          additional_context?: Json
          created_at?: string
          has_been_read?: boolean
          id?: string
          log_id?: number | null
          type: Database["public"]["Enums"]["notification_types"]
          user_id: string
        }
        Update: {
          additional_context?: Json
          created_at?: string
          has_been_read?: boolean
          id?: string
          log_id?: number | null
          type?: Database["public"]["Enums"]["notification_types"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          dashboard_id: number
          description: string | null
          id: number
          last_synced: string | null
          name: string
          sync_error: string | null
          sync_pending: boolean
          url: string
        }
        Insert: {
          created_at?: string
          dashboard_id: number
          description?: string | null
          id?: number
          last_synced?: string | null
          name: string
          sync_error?: string | null
          sync_pending?: boolean
          url: string
        }
        Update: {
          created_at?: string
          dashboard_id?: number
          description?: string | null
          id?: number
          last_synced?: string | null
          name?: string
          sync_error?: string | null
          sync_pending?: boolean
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          display_name: string | null
          email_address: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email_address?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email_address?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      meeting_log_types:
        | "lifecycle"
        | "comment"
        | "meeting_created"
        | "meeting_document_added"
        | "meeting_document_deleted"
        | "meeting_name_changed"
        | "meeting_date_changed"
        | "meeting_deleted"
      notification_types:
        | "meeting_created"
        | "comment_added"
        | "meeting_document_added"
        | "user_invited"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      meeting_log_types: [
        "lifecycle",
        "comment",
        "meeting_created",
        "meeting_document_added",
        "meeting_document_deleted",
        "meeting_name_changed",
        "meeting_date_changed",
        "meeting_deleted",
      ],
      notification_types: [
        "meeting_created",
        "comment_added",
        "meeting_document_added",
        "user_invited",
      ],
    },
  },
} as const

