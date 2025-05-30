export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      citizen_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      collection_schedules: {
        Row: {
          collection_type: string
          collector_assigned: string | null
          created_at: string
          id: string
          location: string
          scheduled_date: string
          scheduled_time: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["collection_status"]
          updated_at: string
          user_id: string
          waste_types: string[] | null
        }
        Insert: {
          collection_type: string
          collector_assigned?: string | null
          created_at?: string
          id?: string
          location: string
          scheduled_date: string
          scheduled_time?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["collection_status"]
          updated_at?: string
          user_id: string
          waste_types?: string[] | null
        }
        Update: {
          collection_type?: string
          collector_assigned?: string | null
          created_at?: string
          id?: string
          location?: string
          scheduled_date?: string
          scheduled_time?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["collection_status"]
          updated_at?: string
          user_id?: string
          waste_types?: string[] | null
        }
        Relationships: []
      }
      compliance_reports: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          compliance_data: Json
          created_at: string
          id: string
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status: Database["public"]["Enums"]["compliance_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          compliance_data: Json
          created_at?: string
          id?: string
          report_type: string
          reporting_period_end: string
          reporting_period_start: string
          status?: Database["public"]["Enums"]["compliance_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          compliance_data?: Json
          created_at?: string
          id?: string
          report_type?: string
          reporting_period_end?: string
          reporting_period_start?: string
          status?: Database["public"]["Enums"]["compliance_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_analytics: {
        Row: {
          analytics_type: string
          created_at: string
          data: Json
          generated_by: string | null
          id: string
          period_end: string
          period_start: string
        }
        Insert: {
          analytics_type: string
          created_at?: string
          data: Json
          generated_by?: string | null
          id?: string
          period_end: string
          period_start: string
        }
        Update: {
          analytics_type?: string
          created_at?: string
          data?: Json
          generated_by?: string | null
          id?: string
          period_end?: string
          period_start?: string
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          buyer_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          item_name: string
          location: string | null
          material_type: Database["public"]["Enums"]["waste_type"]
          price_per_unit: number | null
          quantity: number
          seller_id: string
          status: Database["public"]["Enums"]["marketplace_item_status"]
          total_price: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          item_name: string
          location?: string | null
          material_type: Database["public"]["Enums"]["waste_type"]
          price_per_unit?: number | null
          quantity: number
          seller_id: string
          status?: Database["public"]["Enums"]["marketplace_item_status"]
          total_price?: number | null
          unit?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          item_name?: string
          location?: string | null
          material_type?: Database["public"]["Enums"]["waste_type"]
          price_per_unit?: number | null
          quantity?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["marketplace_item_status"]
          total_price?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      municipality_responses: {
        Row: {
          after_image_url: string | null
          created_at: string
          id: string
          message: string | null
          report_id: string | null
          user_id: string | null
        }
        Insert: {
          after_image_url?: string | null
          created_at?: string
          id?: string
          message?: string | null
          report_id?: string | null
          user_id?: string | null
        }
        Update: {
          after_image_url?: string | null
          created_at?: string
          id?: string
          message?: string | null
          report_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "municipality_responses_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "citizen_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          token: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      phone_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          phone_number: string
          user_id: string
          verification_code: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          phone_number: string
          user_id: string
          verification_code: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          phone_number?: string
          user_id?: string
          verification_code?: string
          verified?: boolean
        }
        Relationships: []
      }
      pickup_requests: {
        Row: {
          collector_id: string | null
          created_at: string
          id: string
          notes: string | null
          pickup_date: string | null
          pickup_time: string | null
          requester_id: string
          status: Database["public"]["Enums"]["pickup_status"]
          updated_at: string
          waste_item_id: string
        }
        Insert: {
          collector_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          pickup_date?: string | null
          pickup_time?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["pickup_status"]
          updated_at?: string
          waste_item_id: string
        }
        Update: {
          collector_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          pickup_date?: string | null
          pickup_time?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["pickup_status"]
          updated_at?: string
          waste_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_collector_id_fkey"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_requests_waste_item_id_fkey"
            columns: ["waste_item_id"]
            isOneToOne: false
            referencedRelation: "waste_items"
            referencedColumns: ["id"]
          },
        ]
      }
      processor_connections: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          price_per_unit: number | null
          processing_capacity: number | null
          processor_id: string
          waste_generator_id: string
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          price_per_unit?: number | null
          processing_capacity?: number | null
          processor_id: string
          waste_generator_id: string
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          price_per_unit?: number | null
          processing_capacity?: number | null
          processor_id?: string
          waste_generator_id?: string
          waste_type?: Database["public"]["Enums"]["waste_type"]
        }
        Relationships: [
          {
            foreignKeyName: "processor_connections_processor_id_fkey"
            columns: ["processor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processor_connections_waste_generator_id_fkey"
            columns: ["waste_generator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      producer_compliance: {
        Row: {
          compliance_data: Json
          compliance_period_end: string
          compliance_period_start: string
          created_at: string
          id: string
          producer_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          compliance_data: Json
          compliance_period_end: string
          compliance_period_start: string
          created_at?: string
          id?: string
          producer_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          compliance_data?: Json
          compliance_period_end?: string
          compliance_period_start?: string
          created_at?: string
          id?: string
          producer_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_locked_until: string | null
          address: string | null
          city: string | null
          created_at: string
          email: string
          failed_login_attempts: number | null
          full_name: string | null
          id: string
          last_login_at: string | null
          phone: string | null
          phone_verified: boolean | null
          state: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          verification_status: string | null
          zip_code: string | null
        }
        Insert: {
          account_locked_until?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          email: string
          failed_login_attempts?: number | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          state?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_status?: string | null
          zip_code?: string | null
        }
        Update: {
          account_locked_until?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string
          failed_login_attempts?: number | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          state?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_status?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      report_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          report_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          report_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          report_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_messages_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "citizen_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      route_optimizations: {
        Row: {
          carbon_reduction: number | null
          created_at: string
          end_location: string
          estimated_distance: number | null
          estimated_time: number | null
          fuel_saved: number | null
          id: string
          route_name: string
          start_location: string
          status: Database["public"]["Enums"]["route_status"]
          updated_at: string
          user_id: string
          waypoints: Json | null
        }
        Insert: {
          carbon_reduction?: number | null
          created_at?: string
          end_location: string
          estimated_distance?: number | null
          estimated_time?: number | null
          fuel_saved?: number | null
          id?: string
          route_name: string
          start_location: string
          status?: Database["public"]["Enums"]["route_status"]
          updated_at?: string
          user_id: string
          waypoints?: Json | null
        }
        Update: {
          carbon_reduction?: number | null
          created_at?: string
          end_location?: string
          estimated_distance?: number | null
          estimated_time?: number | null
          fuel_saved?: number | null
          id?: string
          route_name?: string
          start_location?: string
          status?: Database["public"]["Enums"]["route_status"]
          updated_at?: string
          user_id?: string
          waypoints?: Json | null
        }
        Relationships: []
      }
      sustainable_practices: {
        Row: {
          created_at: string
          description: string | null
          id: string
          impact_metrics: Json | null
          implementation_date: string | null
          is_active: boolean
          practice_name: string
          practice_type: string
          recommendations: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          impact_metrics?: Json | null
          implementation_date?: string | null
          is_active?: boolean
          practice_name: string
          practice_type: string
          recommendations?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          impact_metrics?: Json | null
          implementation_date?: string | null
          is_active?: boolean
          practice_name?: string
          practice_type?: string
          recommendations?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_verification_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      waste_analytics: {
        Row: {
          analytics_data: Json | null
          carbon_footprint: number | null
          cost_savings: number | null
          created_at: string
          id: string
          period_end: string
          period_start: string
          recycling_rate: number | null
          total_waste_generated: number | null
          user_id: string
        }
        Insert: {
          analytics_data?: Json | null
          carbon_footprint?: number | null
          cost_savings?: number | null
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          recycling_rate?: number | null
          total_waste_generated?: number | null
          user_id: string
        }
        Update: {
          analytics_data?: Json | null
          carbon_footprint?: number | null
          cost_savings?: number | null
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          recycling_rate?: number | null
          total_waste_generated?: number | null
          user_id?: string
        }
        Relationships: []
      }
      waste_data_logs: {
        Row: {
          collection_date: string | null
          created_at: string
          environmental_impact: Json | null
          id: string
          location: string | null
          notes: string | null
          quantity: number
          unit: string
          updated_at: string
          user_id: string
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Insert: {
          collection_date?: string | null
          created_at?: string
          environmental_impact?: Json | null
          id?: string
          location?: string | null
          notes?: string | null
          quantity: number
          unit?: string
          updated_at?: string
          user_id: string
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Update: {
          collection_date?: string | null
          created_at?: string
          environmental_impact?: Json | null
          id?: string
          location?: string | null
          notes?: string | null
          quantity?: number
          unit?: string
          updated_at?: string
          user_id?: string
          waste_type?: Database["public"]["Enums"]["waste_type"]
        }
        Relationships: []
      }
      waste_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          location: string | null
          quantity: number
          title: string
          unit: string
          updated_at: string
          user_id: string
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          location?: string | null
          quantity: number
          title: string
          unit?: string
          updated_at?: string
          user_id: string
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          location?: string | null
          quantity?: number
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
          waste_type?: Database["public"]["Enums"]["waste_type"]
        }
        Relationships: [
          {
            foreignKeyName: "waste_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_tracking: {
        Row: {
          actual_processing_date: string | null
          created_at: string
          current_location: string | null
          current_status: Database["public"]["Enums"]["tracking_status"]
          estimated_processing_date: string | null
          id: string
          tracking_history: Json | null
          tracking_number: string
          updated_at: string
          user_id: string
          waste_item_id: string | null
        }
        Insert: {
          actual_processing_date?: string | null
          created_at?: string
          current_location?: string | null
          current_status?: Database["public"]["Enums"]["tracking_status"]
          estimated_processing_date?: string | null
          id?: string
          tracking_history?: Json | null
          tracking_number: string
          updated_at?: string
          user_id: string
          waste_item_id?: string | null
        }
        Update: {
          actual_processing_date?: string | null
          created_at?: string
          current_location?: string | null
          current_status?: Database["public"]["Enums"]["tracking_status"]
          estimated_processing_date?: string | null
          id?: string
          tracking_history?: Json | null
          tracking_number?: string
          updated_at?: string
          user_id?: string
          waste_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_tracking_waste_item_id_fkey"
            columns: ["waste_item_id"]
            isOneToOne: false
            referencedRelation: "waste_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_audit_log: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      collection_status: "scheduled" | "in_progress" | "completed" | "missed"
      compliance_status: "compliant" | "non_compliant" | "pending_review"
      marketplace_item_status: "available" | "reserved" | "sold" | "removed"
      pickup_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      route_status: "planned" | "in_progress" | "completed" | "cancelled"
      tracking_status:
        | "generated"
        | "collected"
        | "in_transit"
        | "processing"
        | "disposed"
      user_type:
        | "individual"
        | "business"
        | "processor"
        | "collector"
        | "government"
      waste_type:
        | "organic"
        | "recyclable"
        | "hazardous"
        | "electronic"
        | "general"
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
  public: {
    Enums: {
      collection_status: ["scheduled", "in_progress", "completed", "missed"],
      compliance_status: ["compliant", "non_compliant", "pending_review"],
      marketplace_item_status: ["available", "reserved", "sold", "removed"],
      pickup_status: ["scheduled", "in_progress", "completed", "cancelled"],
      route_status: ["planned", "in_progress", "completed", "cancelled"],
      tracking_status: [
        "generated",
        "collected",
        "in_transit",
        "processing",
        "disposed",
      ],
      user_type: [
        "individual",
        "business",
        "processor",
        "collector",
        "government",
      ],
      waste_type: [
        "organic",
        "recyclable",
        "hazardous",
        "electronic",
        "general",
      ],
    },
  },
} as const
