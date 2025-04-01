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
      meeting_logs: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          is_bot_action: boolean
          meeting_id: number
          text: string
          type: Database["public"]["Enums"]["meeting_log_types"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_bot_action?: boolean
          meeting_id: number
          text: string
          type: Database["public"]["Enums"]["meeting_log_types"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          is_bot_action?: boolean
          meeting_id?: number
          text?: string
          type?: Database["public"]["Enums"]["meeting_log_types"]
        }
        Relationships: [
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
      organizations: {
        Row: {
          created_at: string
          dashboard_id: number
          id: number
          last_synced: string | null
          name: string
          sync_error: string | null
          url: string
        }
        Insert: {
          created_at?: string
          dashboard_id: number
          id?: number
          last_synced?: string | null
          name: string
          sync_error?: string | null
          url: string
        }
        Update: {
          created_at?: string
          dashboard_id?: number
          id?: number
          last_synced?: string | null
          name?: string
          sync_error?: string | null
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
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
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
      meeting_log_types: "lifecycle" | "comment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

