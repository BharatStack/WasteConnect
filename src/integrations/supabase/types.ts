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
      ai_conversations: {
        Row: {
          context_used: string | null
          created_at: string
          id: string
          language: string | null
          question: string
          response: string | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_used?: string | null
          created_at?: string
          id?: string
          language?: string | null
          question: string
          response?: string | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_used?: string | null
          created_at?: string
          id?: string
          language?: string | null
          question?: string
          response?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_knowledge_base: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      biodiversity_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["biodiversity_activity_type"]
          area_sqm: number | null
          biodiversity_index: number | null
          coordinates: unknown | null
          created_at: string | null
          credits_earned: number | null
          habitat_type: string | null
          id: string
          location: string | null
          photo_evidence: Json | null
          species_involved: string[] | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["biodiversity_activity_type"]
          area_sqm?: number | null
          biodiversity_index?: number | null
          coordinates?: unknown | null
          created_at?: string | null
          credits_earned?: number | null
          habitat_type?: string | null
          id?: string
          location?: string | null
          photo_evidence?: Json | null
          species_involved?: string[] | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["biodiversity_activity_type"]
          area_sqm?: number | null
          biodiversity_index?: number | null
          coordinates?: unknown | null
          created_at?: string | null
          credits_earned?: number | null
          habitat_type?: string | null
          id?: string
          location?: string | null
          photo_evidence?: Json | null
          species_involved?: string[] | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Relationships: []
      }
      bond_impact_tracking: {
        Row: {
          bond_id: string | null
          created_at: string | null
          id: string
          impact_data: Json
          reporting_period_end: string
          reporting_period_start: string
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          bond_id?: string | null
          created_at?: string | null
          id?: string
          impact_data?: Json
          reporting_period_end: string
          reporting_period_start: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          bond_id?: string | null
          created_at?: string | null
          id?: string
          impact_data?: Json
          reporting_period_end?: string
          reporting_period_start?: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bond_impact_tracking_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "green_bonds"
            referencedColumns: ["id"]
          },
        ]
      }
      bond_interest_payments: {
        Row: {
          bond_id: string | null
          created_at: string | null
          due_date: string
          id: string
          investment_id: string | null
          investor_id: string | null
          payment_amount: number
          payment_date: string
          payment_reference: string | null
          processed_at: string | null
          status: string | null
        }
        Insert: {
          bond_id?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          investment_id?: string | null
          investor_id?: string | null
          payment_amount: number
          payment_date: string
          payment_reference?: string | null
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          bond_id?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          investment_id?: string | null
          investor_id?: string | null
          payment_amount?: number
          payment_date?: string
          payment_reference?: string | null
          processed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bond_interest_payments_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "green_bonds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bond_interest_payments_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "bond_investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bond_interest_payments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bond_investments: {
        Row: {
          bond_id: string | null
          created_at: string | null
          expected_return: number
          id: string
          investment_amount: number
          investment_tier: Database["public"]["Enums"]["investment_tier"]
          investor_id: string | null
          maturity_date: string
          purchase_date: string
          purchase_price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bond_id?: string | null
          created_at?: string | null
          expected_return: number
          id?: string
          investment_amount: number
          investment_tier?: Database["public"]["Enums"]["investment_tier"]
          investor_id?: string | null
          maturity_date: string
          purchase_date?: string
          purchase_price?: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bond_id?: string | null
          created_at?: string | null
          expected_return?: number
          id?: string
          investment_amount?: number
          investment_tier?: Database["public"]["Enums"]["investment_tier"]
          investor_id?: string | null
          maturity_date?: string
          purchase_date?: string
          purchase_price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bond_investments_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "green_bonds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bond_investments_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bond_market_orders: {
        Row: {
          bond_id: string | null
          buyer_id: string | null
          created_at: string | null
          expires_at: string | null
          filled_at: string | null
          id: string
          order_type: string
          price_per_unit: number
          quantity: number
          seller_id: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          bond_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          filled_at?: string | null
          id?: string
          order_type: string
          price_per_unit: number
          quantity: number
          seller_id?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          bond_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          filled_at?: string | null
          id?: string
          order_type?: string
          price_per_unit?: number
          quantity?: number
          seller_id?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bond_market_orders_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "green_bonds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bond_market_orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bond_market_orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bond_portfolios: {
        Row: {
          active_investments: number | null
          clean_energy_supported: number | null
          communities_benefited: number | null
          created_at: string | null
          current_value: number | null
          id: string
          jobs_created: number | null
          last_updated: string | null
          overall_yield: number | null
          total_co2_reduced: number | null
          total_invested: number | null
          total_returns: number | null
          user_id: string | null
        }
        Insert: {
          active_investments?: number | null
          clean_energy_supported?: number | null
          communities_benefited?: number | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          jobs_created?: number | null
          last_updated?: string | null
          overall_yield?: number | null
          total_co2_reduced?: number | null
          total_invested?: number | null
          total_returns?: number | null
          user_id?: string | null
        }
        Update: {
          active_investments?: number | null
          clean_energy_supported?: number | null
          communities_benefited?: number | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          jobs_created?: number | null
          last_updated?: string | null
          overall_yield?: number | null
          total_co2_reduced?: number | null
          total_invested?: number | null
          total_returns?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bond_portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_credit_orders: {
        Row: {
          created_at: string | null
          credits_amount: number
          expires_at: string | null
          filled_amount: number | null
          id: string
          order_type: Database["public"]["Enums"]["order_type"]
          price_per_credit: number
          status: Database["public"]["Enums"]["trade_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credits_amount: number
          expires_at?: string | null
          filled_amount?: number | null
          id?: string
          order_type: Database["public"]["Enums"]["order_type"]
          price_per_credit: number
          status?: Database["public"]["Enums"]["trade_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credits_amount?: number
          expires_at?: string | null
          filled_amount?: number | null
          id?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          price_per_credit?: number
          status?: Database["public"]["Enums"]["trade_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credit_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_credit_profiles: {
        Row: {
          aadhaar_number: string | null
          address_verified: boolean | null
          bank_account_number: string | null
          created_at: string | null
          document_urls: Json | null
          gps_coordinates: unknown | null
          id: string
          ifsc_code: string | null
          kyc_status: Database["public"]["Enums"]["verification_status"] | null
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          terms_accepted_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          address_verified?: boolean | null
          bank_account_number?: string | null
          created_at?: string | null
          document_urls?: Json | null
          gps_coordinates?: unknown | null
          id?: string
          ifsc_code?: string | null
          kyc_status?: Database["public"]["Enums"]["verification_status"] | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          address_verified?: boolean | null
          bank_account_number?: string | null
          created_at?: string | null
          document_urls?: Json | null
          gps_coordinates?: unknown | null
          id?: string
          ifsc_code?: string | null
          kyc_status?: Database["public"]["Enums"]["verification_status"] | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credit_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_credit_trades: {
        Row: {
          buy_order_id: string | null
          buyer_id: string | null
          created_at: string | null
          credits_amount: number
          id: string
          price_per_credit: number
          sell_order_id: string | null
          seller_id: string | null
          settlement_status: string | null
          total_amount: number
          trade_date: string | null
        }
        Insert: {
          buy_order_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          credits_amount: number
          id?: string
          price_per_credit: number
          sell_order_id?: string | null
          seller_id?: string | null
          settlement_status?: string | null
          total_amount: number
          trade_date?: string | null
        }
        Update: {
          buy_order_id?: string | null
          buyer_id?: string | null
          created_at?: string | null
          credits_amount?: number
          id?: string
          price_per_credit?: number
          sell_order_id?: string | null
          seller_id?: string | null
          settlement_status?: string | null
          total_amount?: number
          trade_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credit_trades_buy_order_id_fkey"
            columns: ["buy_order_id"]
            isOneToOne: false
            referencedRelation: "carbon_credit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_credit_trades_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_credit_trades_sell_order_id_fkey"
            columns: ["sell_order_id"]
            isOneToOne: false
            referencedRelation: "carbon_credit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_credit_trades_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_credits: {
        Row: {
          activity_id: string | null
          created_at: string | null
          credits_amount: number
          credits_type: string | null
          earned_date: string | null
          expiry_date: string | null
          id: string
          status: string | null
          transaction_hash: string | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          credits_amount: number
          credits_type?: string | null
          earned_date?: string | null
          expiry_date?: string | null
          id?: string
          status?: string | null
          transaction_hash?: string | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          credits_amount?: number
          credits_type?: string | null
          earned_date?: string | null
          expiry_date?: string | null
          id?: string
          status?: string | null
          transaction_hash?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_credits_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "waste_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      community_leaderboards: {
        Row: {
          activities_count: number | null
          created_at: string | null
          credits_earned: number | null
          id: string
          leaderboard_type: string
          period_end: string
          period_start: string
          rank_position: number | null
          user_id: string | null
        }
        Insert: {
          activities_count?: number | null
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          leaderboard_type: string
          period_end: string
          period_start: string
          rank_position?: number | null
          user_id?: string | null
        }
        Update: {
          activities_count?: number | null
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          leaderboard_type?: string
          period_end?: string
          period_start?: string
          rank_position?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_leaderboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      corporate_accounts: {
        Row: {
          annual_emissions: number | null
          api_key: string | null
          company_name: string
          contact_person_id: string | null
          created_at: string | null
          employee_count: number | null
          headquarters_location: string | null
          id: string
          industry_sector: Database["public"]["Enums"]["industry_sector"]
          offset_target_percentage: number | null
          subscription_tier: string | null
        }
        Insert: {
          annual_emissions?: number | null
          api_key?: string | null
          company_name: string
          contact_person_id?: string | null
          created_at?: string | null
          employee_count?: number | null
          headquarters_location?: string | null
          id?: string
          industry_sector: Database["public"]["Enums"]["industry_sector"]
          offset_target_percentage?: number | null
          subscription_tier?: string | null
        }
        Update: {
          annual_emissions?: number | null
          api_key?: string | null
          company_name?: string
          contact_person_id?: string | null
          created_at?: string | null
          employee_count?: number | null
          headquarters_location?: string | null
          id?: string
          industry_sector?: Database["public"]["Enums"]["industry_sector"]
          offset_target_percentage?: number | null
          subscription_tier?: string | null
        }
        Relationships: []
      }
      corporate_offset_programs: {
        Row: {
          asset_types: Database["public"]["Enums"]["asset_type"][] | null
          corporate_account_id: string
          created_at: string | null
          employee_participation: boolean | null
          end_date: string | null
          id: string
          program_name: string
          program_type: string | null
          purchased_credits: number | null
          start_date: string | null
          status: string | null
          target_credits: number | null
        }
        Insert: {
          asset_types?: Database["public"]["Enums"]["asset_type"][] | null
          corporate_account_id: string
          created_at?: string | null
          employee_participation?: boolean | null
          end_date?: string | null
          id?: string
          program_name: string
          program_type?: string | null
          purchased_credits?: number | null
          start_date?: string | null
          status?: string | null
          target_credits?: number | null
        }
        Update: {
          asset_types?: Database["public"]["Enums"]["asset_type"][] | null
          corporate_account_id?: string
          created_at?: string | null
          employee_participation?: boolean | null
          end_date?: string | null
          id?: string
          program_name?: string
          program_type?: string | null
          purchased_credits?: number | null
          start_date?: string | null
          status?: string | null
          target_credits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_offset_programs_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_conversions: {
        Row: {
          conversion_rate: number
          created_at: string | null
          effective_date: string | null
          expires_date: string | null
          from_asset_type: Database["public"]["Enums"]["asset_type"]
          id: string
          region: string | null
          to_asset_type: Database["public"]["Enums"]["asset_type"]
        }
        Insert: {
          conversion_rate: number
          created_at?: string | null
          effective_date?: string | null
          expires_date?: string | null
          from_asset_type: Database["public"]["Enums"]["asset_type"]
          id?: string
          region?: string | null
          to_asset_type: Database["public"]["Enums"]["asset_type"]
        }
        Update: {
          conversion_rate?: number
          created_at?: string | null
          effective_date?: string | null
          expires_date?: string | null
          from_asset_type?: Database["public"]["Enums"]["asset_type"]
          id?: string
          region?: string | null
          to_asset_type?: Database["public"]["Enums"]["asset_type"]
        }
        Relationships: []
      }
      environmental_assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at: string | null
          expiry_date: string | null
          id: string
          metadata: Json | null
          quantity: number
          unit: string
          updated_at: string | null
          user_id: string
          verification_date: string | null
          verification_level:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verification_status:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          metadata?: Json | null
          quantity: number
          unit?: string
          updated_at?: string | null
          user_id: string
          verification_date?: string | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          metadata?: Json | null
          quantity?: number
          unit?: string
          updated_at?: string | null
          user_id?: string
          verification_date?: string | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Relationships: []
      }
      environmental_credit_orders: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at: string | null
          credits_amount: number
          expires_at: string | null
          filled_amount: number | null
          id: string
          metadata: Json | null
          order_type: Database["public"]["Enums"]["order_type"]
          price_per_credit: number
          status: Database["public"]["Enums"]["trade_status"] | null
          total_amount: number
          user_id: string
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          credits_amount: number
          expires_at?: string | null
          filled_amount?: number | null
          id?: string
          metadata?: Json | null
          order_type: Database["public"]["Enums"]["order_type"]
          price_per_credit: number
          status?: Database["public"]["Enums"]["trade_status"] | null
          total_amount: number
          user_id: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          credits_amount?: number
          expires_at?: string | null
          filled_amount?: number | null
          id?: string
          metadata?: Json | null
          order_type?: Database["public"]["Enums"]["order_type"]
          price_per_credit?: number
          status?: Database["public"]["Enums"]["trade_status"] | null
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      environmental_tokens: {
        Row: {
          backing_ratio: number | null
          circulating_supply: number | null
          contract_address: string | null
          created_at: string | null
          environmental_backing: Database["public"]["Enums"]["asset_type"]
          id: string
          token_name: string
          token_symbol: string
          total_supply: number | null
        }
        Insert: {
          backing_ratio?: number | null
          circulating_supply?: number | null
          contract_address?: string | null
          created_at?: string | null
          environmental_backing: Database["public"]["Enums"]["asset_type"]
          id?: string
          token_name: string
          token_symbol: string
          total_supply?: number | null
        }
        Update: {
          backing_ratio?: number | null
          circulating_supply?: number | null
          contract_address?: string | null
          created_at?: string | null
          environmental_backing?: Database["public"]["Enums"]["asset_type"]
          id?: string
          token_name?: string
          token_symbol?: string
          total_supply?: number | null
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
      green_bonds: {
        Row: {
          available_amount: number
          bond_name: string
          bond_rating: Database["public"]["Enums"]["bond_rating"] | null
          bond_symbol: string
          category: Database["public"]["Enums"]["bond_category"]
          created_at: string | null
          description: string | null
          documents: Json | null
          environmental_impact: Json | null
          id: string
          interest_rate: number
          issue_date: string
          issuer_id: string | null
          issuer_name: string
          maturity_date: string
          maximum_investment: number | null
          minimum_investment: number
          payment_frequency: Database["public"]["Enums"]["payment_frequency"]
          project_details: Json | null
          risk_factors: string[] | null
          status: Database["public"]["Enums"]["bond_status"]
          total_amount: number
          updated_at: string | null
          use_of_proceeds: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          available_amount: number
          bond_name: string
          bond_rating?: Database["public"]["Enums"]["bond_rating"] | null
          bond_symbol: string
          category: Database["public"]["Enums"]["bond_category"]
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          environmental_impact?: Json | null
          id?: string
          interest_rate: number
          issue_date: string
          issuer_id?: string | null
          issuer_name: string
          maturity_date: string
          maximum_investment?: number | null
          minimum_investment?: number
          payment_frequency?: Database["public"]["Enums"]["payment_frequency"]
          project_details?: Json | null
          risk_factors?: string[] | null
          status?: Database["public"]["Enums"]["bond_status"]
          total_amount: number
          updated_at?: string | null
          use_of_proceeds?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          available_amount?: number
          bond_name?: string
          bond_rating?: Database["public"]["Enums"]["bond_rating"] | null
          bond_symbol?: string
          category?: Database["public"]["Enums"]["bond_category"]
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          environmental_impact?: Json | null
          id?: string
          interest_rate?: number
          issue_date?: string
          issuer_id?: string | null
          issuer_name?: string
          maturity_date?: string
          maximum_investment?: number | null
          minimum_investment?: number
          payment_frequency?: Database["public"]["Enums"]["payment_frequency"]
          project_details?: Json | null
          risk_factors?: string[] | null
          status?: Database["public"]["Enums"]["bond_status"]
          total_amount?: number
          updated_at?: string | null
          use_of_proceeds?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "green_bonds_issuer_id_fkey"
            columns: ["issuer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      green_crypto_transactions: {
        Row: {
          amount: number
          blockchain_hash: string | null
          created_at: string | null
          environmental_backing_id: string | null
          gas_fee: number | null
          id: string
          transaction_type: Database["public"]["Enums"]["crypto_activity_type"]
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Insert: {
          amount: number
          blockchain_hash?: string | null
          created_at?: string | null
          environmental_backing_id?: string | null
          gas_fee?: number | null
          id?: string
          transaction_type: Database["public"]["Enums"]["crypto_activity_type"]
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Update: {
          amount?: number
          blockchain_hash?: string | null
          created_at?: string | null
          environmental_backing_id?: string | null
          gas_fee?: number | null
          id?: string
          transaction_type?: Database["public"]["Enums"]["crypto_activity_type"]
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "green_crypto_transactions_environmental_backing_id_fkey"
            columns: ["environmental_backing_id"]
            isOneToOne: false
            referencedRelation: "environmental_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          listing_id: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          listing_id: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          listing_id?: string
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "waste_listings"
            referencedColumns: ["id"]
          },
        ]
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
      material_conversion_factors: {
        Row: {
          conversion_factor: number
          created_at: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          material_type: Database["public"]["Enums"]["waste_material"]
          region: string | null
          regional_factor: number | null
        }
        Insert: {
          conversion_factor: number
          created_at?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          material_type: Database["public"]["Enums"]["waste_material"]
          region?: string | null
          regional_factor?: number | null
        }
        Update: {
          conversion_factor?: number
          created_at?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          material_type?: Database["public"]["Enums"]["waste_material"]
          region?: string | null
          regional_factor?: number | null
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
      password_reset_requests: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
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
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          credits_amount: number | null
          gateway_response: Json | null
          id: string
          payment_gateway_id: string | null
          payment_method: string | null
          processed_at: string | null
          status: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          credits_amount?: number | null
          gateway_response?: Json | null
          id?: string
          payment_gateway_id?: string | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          credits_amount?: number | null
          gateway_response?: Json | null
          id?: string
          payment_gateway_id?: string | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      plastic_activities: {
        Row: {
          collection_location: string | null
          collection_method: string | null
          created_at: string | null
          credits_earned: number | null
          id: string
          photo_urls: Json | null
          plastic_type: Database["public"]["Enums"]["plastic_type"]
          processing_facility_id: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["asset_status"]
            | null
          weight_kg: number
        }
        Insert: {
          collection_location?: string | null
          collection_method?: string | null
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          photo_urls?: Json | null
          plastic_type: Database["public"]["Enums"]["plastic_type"]
          processing_facility_id?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
          weight_kg: number
        }
        Update: {
          collection_location?: string | null
          collection_method?: string | null
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          photo_urls?: Json | null
          plastic_type?: Database["public"]["Enums"]["plastic_type"]
          processing_facility_id?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
          weight_kg?: number
        }
        Relationships: []
      }
      plastic_collection_points: {
        Row: {
          address: string | null
          contact_info: Json | null
          coordinates: unknown | null
          created_at: string | null
          id: string
          name: string
          operating_hours: Json | null
          plastic_types_accepted:
            | Database["public"]["Enums"]["plastic_type"][]
            | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          name: string
          operating_hours?: Json | null
          plastic_types_accepted?:
            | Database["public"]["Enums"]["plastic_type"][]
            | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          name?: string
          operating_hours?: Json | null
          plastic_types_accepted?:
            | Database["public"]["Enums"]["plastic_type"][]
            | null
          verified?: boolean | null
        }
        Relationships: []
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
      recycling_facilities: {
        Row: {
          certification_level: string | null
          contact_info: Json | null
          coordinates: unknown | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          plastic_types_processed:
            | Database["public"]["Enums"]["plastic_type"][]
            | null
          processing_capacity: number | null
        }
        Insert: {
          certification_level?: string | null
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          plastic_types_processed?:
            | Database["public"]["Enums"]["plastic_type"][]
            | null
          processing_capacity?: number | null
        }
        Update: {
          certification_level?: string | null
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          plastic_types_processed?:
            | Database["public"]["Enums"]["plastic_type"][]
            | null
          processing_capacity?: number | null
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
      species_registry: {
        Row: {
          common_name: string
          conservation_status: string | null
          created_at: string | null
          credit_multiplier: number | null
          geographic_range: string[] | null
          habitat_types: string[] | null
          id: string
          scientific_name: string | null
        }
        Insert: {
          common_name: string
          conservation_status?: string | null
          created_at?: string | null
          credit_multiplier?: number | null
          geographic_range?: string[] | null
          habitat_types?: string[] | null
          id?: string
          scientific_name?: string | null
        }
        Update: {
          common_name?: string
          conservation_status?: string | null
          created_at?: string | null
          credit_multiplier?: number | null
          geographic_range?: string[] | null
          habitat_types?: string[] | null
          id?: string
          scientific_name?: string | null
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
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          badge_url: string | null
          created_at: string | null
          description: string | null
          earned_at: string | null
          id: string
          points_earned: number | null
          user_id: string | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          badge_url?: string | null
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          badge_url?: string | null
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "waste_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolios: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          available_credits: number | null
          id: string
          last_updated: string | null
          locked_credits: number | null
          total_credits: number | null
          total_value: number | null
          user_id: string
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          available_credits?: number | null
          id?: string
          last_updated?: string | null
          locked_credits?: number | null
          total_credits?: number | null
          total_value?: number | null
          user_id: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          available_credits?: number | null
          id?: string
          last_updated?: string | null
          locked_credits?: number | null
          total_credits?: number | null
          total_value?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_reviews: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          rating: number
          review_text: string | null
          reviewed_user_id: string
          reviewer_id: string
          transaction_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          review_text?: string | null
          reviewed_user_id: string
          reviewer_id: string
          transaction_type: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          review_text?: string | null
          reviewed_user_id?: string
          reviewer_id?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "waste_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          co2_saved: number | null
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          level_points: number | null
          longest_streak: number | null
          total_activities: number | null
          total_credits_earned: number | null
          total_credits_traded: number | null
          total_earnings: number | null
          total_waste_processed: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          co2_saved?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          level_points?: number | null
          longest_streak?: number | null
          total_activities?: number | null
          total_credits_earned?: number | null
          total_credits_traded?: number | null
          total_earnings?: number | null
          total_waste_processed?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          co2_saved?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          level_points?: number | null
          longest_streak?: number | null
          total_activities?: number | null
          total_credits_earned?: number | null
          total_credits_traded?: number | null
          total_earnings?: number | null
          total_waste_processed?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      verification_appeals: {
        Row: {
          activity_id: string | null
          created_at: string | null
          id: string
          reason: string
          resolved_at: string | null
          reviewer_comments: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          supporting_documents: Json | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          reason: string
          resolved_at?: string | null
          reviewer_comments?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          supporting_documents?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string
          resolved_at?: string | null
          reviewer_comments?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          supporting_documents?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_appeals_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "waste_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_appeals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_activities: {
        Row: {
          activity_date: string | null
          activity_type: Database["public"]["Enums"]["waste_material"]
          ai_classification_confidence: number | null
          batch_id: string | null
          carbon_credits_earned: number | null
          created_at: string | null
          id: string
          location: unknown | null
          location_name: string | null
          notes: string | null
          photo_urls: Json | null
          quantity: number
          status: Database["public"]["Enums"]["activity_status"] | null
          unit: string | null
          updated_at: string | null
          user_id: string | null
          verification_score: number | null
          verification_tier:
            | Database["public"]["Enums"]["verification_tier"]
            | null
          video_urls: Json | null
        }
        Insert: {
          activity_date?: string | null
          activity_type: Database["public"]["Enums"]["waste_material"]
          ai_classification_confidence?: number | null
          batch_id?: string | null
          carbon_credits_earned?: number | null
          created_at?: string | null
          id?: string
          location?: unknown | null
          location_name?: string | null
          notes?: string | null
          photo_urls?: Json | null
          quantity: number
          status?: Database["public"]["Enums"]["activity_status"] | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_score?: number | null
          verification_tier?:
            | Database["public"]["Enums"]["verification_tier"]
            | null
          video_urls?: Json | null
        }
        Update: {
          activity_date?: string | null
          activity_type?: Database["public"]["Enums"]["waste_material"]
          ai_classification_confidence?: number | null
          batch_id?: string | null
          carbon_credits_earned?: number | null
          created_at?: string | null
          id?: string
          location?: unknown | null
          location_name?: string | null
          notes?: string | null
          photo_urls?: Json | null
          quantity?: number
          status?: Database["public"]["Enums"]["activity_status"] | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_score?: number | null
          verification_tier?:
            | Database["public"]["Enums"]["verification_tier"]
            | null
          video_urls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      waste_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
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
      waste_listings: {
        Row: {
          availability_end: string | null
          availability_start: string | null
          created_at: string
          delivery_available: boolean | null
          delivery_radius: number | null
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          pickup_available: boolean | null
          price_per_unit: number
          quantity: number
          seller_id: string
          status: string
          title: string
          total_price: number
          unit: string
          updated_at: string
          waste_category_id: string
        }
        Insert: {
          availability_end?: string | null
          availability_start?: string | null
          created_at?: string
          delivery_available?: boolean | null
          delivery_radius?: number | null
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          pickup_available?: boolean | null
          price_per_unit: number
          quantity: number
          seller_id: string
          status?: string
          title: string
          total_price: number
          unit?: string
          updated_at?: string
          waste_category_id: string
        }
        Update: {
          availability_end?: string | null
          availability_start?: string | null
          created_at?: string
          delivery_available?: boolean | null
          delivery_radius?: number | null
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          pickup_available?: boolean | null
          price_per_unit?: number
          quantity?: number
          seller_id?: string
          status?: string
          title?: string
          total_price?: number
          unit?: string
          updated_at?: string
          waste_category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waste_listings_waste_category_id_fkey"
            columns: ["waste_category_id"]
            isOneToOne: false
            referencedRelation: "waste_categories"
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
      water_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["water_activity_type"]
          conservation_method: string | null
          created_at: string | null
          credits_earned: number | null
          id: string
          location: string | null
          regional_scarcity_factor: number | null
          user_id: string
          verification_evidence: Json | null
          verification_status:
            | Database["public"]["Enums"]["asset_status"]
            | null
          water_saved_liters: number
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["water_activity_type"]
          conservation_method?: string | null
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          location?: string | null
          regional_scarcity_factor?: number | null
          user_id: string
          verification_evidence?: Json | null
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
          water_saved_liters: number
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["water_activity_type"]
          conservation_method?: string | null
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          location?: string | null
          regional_scarcity_factor?: number | null
          user_id?: string
          verification_evidence?: Json | null
          verification_status?:
            | Database["public"]["Enums"]["asset_status"]
            | null
          water_saved_liters?: number
        }
        Relationships: []
      }
      water_meters: {
        Row: {
          created_at: string | null
          id: string
          installation_date: string | null
          is_smart_meter: boolean | null
          last_reading: number | null
          last_reading_date: string | null
          location: string | null
          meter_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          is_smart_meter?: boolean | null
          last_reading?: number | null
          last_reading_date?: string | null
          location?: string | null
          meter_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          is_smart_meter?: boolean | null
          last_reading?: number | null
          last_reading_date?: string | null
          location?: string | null
          meter_id?: string | null
          user_id?: string
        }
        Relationships: []
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
      activity_status: "pending" | "verified" | "rejected" | "expired"
      asset_status: "pending" | "verified" | "retired" | "traded"
      asset_type:
        | "carbon"
        | "plastic"
        | "water"
        | "biodiversity"
        | "green_crypto"
      biodiversity_activity_type:
        | "habitat_protection"
        | "species_conservation"
        | "restoration"
        | "planting"
        | "monitoring"
      bond_category:
        | "renewable_energy"
        | "energy_efficiency"
        | "clean_transportation"
        | "sustainable_water"
        | "waste_management"
        | "biodiversity"
        | "climate_adaptation"
      bond_rating:
        | "AAA"
        | "AA+"
        | "AA"
        | "AA-"
        | "A+"
        | "A"
        | "A-"
        | "BBB+"
        | "BBB"
        | "BBB-"
        | "BB+"
        | "BB"
        | "BB-"
        | "B+"
        | "B"
        | "B-"
      bond_status: "draft" | "active" | "closed" | "matured" | "defaulted"
      collection_status: "scheduled" | "in_progress" | "completed" | "missed"
      compliance_status: "compliant" | "non_compliant" | "pending_review"
      crypto_activity_type:
        | "environmental_mining"
        | "asset_tokenization"
        | "staking"
        | "trading"
      industry_sector:
        | "technology"
        | "manufacturing"
        | "finance"
        | "healthcare"
        | "retail"
        | "energy"
        | "transportation"
        | "agriculture"
        | "other"
      investment_tier: "retail" | "accredited" | "institutional"
      marketplace_item_status: "available" | "reserved" | "sold" | "removed"
      order_type: "buy" | "sell"
      payment_frequency: "monthly" | "quarterly" | "semi_annual" | "annual"
      pickup_status: "scheduled" | "in_progress" | "completed" | "cancelled"
      plastic_type: "PET" | "HDPE" | "PVC" | "LDPE" | "PP" | "PS" | "Others"
      route_status: "planned" | "in_progress" | "completed" | "cancelled"
      tracking_status:
        | "generated"
        | "collected"
        | "in_transit"
        | "processing"
        | "disposed"
      trade_status: "active" | "completed" | "cancelled" | "expired"
      user_role: "individual" | "community" | "organization" | "municipal"
      user_type:
        | "individual"
        | "business"
        | "processor"
        | "collector"
        | "government"
        | "household"
      verification_level: "tier1_ai" | "tier2_manual" | "tier3_expert"
      verification_status: "pending" | "approved" | "rejected" | "under_review"
      verification_tier: "tier1_ai" | "tier2_community" | "tier3_auditor"
      waste_material:
        | "organic"
        | "recyclable"
        | "hazardous"
        | "ewaste"
        | "plastic"
        | "paper"
        | "metal"
        | "glass"
      waste_type:
        | "organic"
        | "recyclable"
        | "hazardous"
        | "electronic"
        | "general"
      water_activity_type:
        | "conservation"
        | "harvesting"
        | "recycling"
        | "restoration"
        | "efficiency"
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
      activity_status: ["pending", "verified", "rejected", "expired"],
      asset_status: ["pending", "verified", "retired", "traded"],
      asset_type: [
        "carbon",
        "plastic",
        "water",
        "biodiversity",
        "green_crypto",
      ],
      biodiversity_activity_type: [
        "habitat_protection",
        "species_conservation",
        "restoration",
        "planting",
        "monitoring",
      ],
      bond_category: [
        "renewable_energy",
        "energy_efficiency",
        "clean_transportation",
        "sustainable_water",
        "waste_management",
        "biodiversity",
        "climate_adaptation",
      ],
      bond_rating: [
        "AAA",
        "AA+",
        "AA",
        "AA-",
        "A+",
        "A",
        "A-",
        "BBB+",
        "BBB",
        "BBB-",
        "BB+",
        "BB",
        "BB-",
        "B+",
        "B",
        "B-",
      ],
      bond_status: ["draft", "active", "closed", "matured", "defaulted"],
      collection_status: ["scheduled", "in_progress", "completed", "missed"],
      compliance_status: ["compliant", "non_compliant", "pending_review"],
      crypto_activity_type: [
        "environmental_mining",
        "asset_tokenization",
        "staking",
        "trading",
      ],
      industry_sector: [
        "technology",
        "manufacturing",
        "finance",
        "healthcare",
        "retail",
        "energy",
        "transportation",
        "agriculture",
        "other",
      ],
      investment_tier: ["retail", "accredited", "institutional"],
      marketplace_item_status: ["available", "reserved", "sold", "removed"],
      order_type: ["buy", "sell"],
      payment_frequency: ["monthly", "quarterly", "semi_annual", "annual"],
      pickup_status: ["scheduled", "in_progress", "completed", "cancelled"],
      plastic_type: ["PET", "HDPE", "PVC", "LDPE", "PP", "PS", "Others"],
      route_status: ["planned", "in_progress", "completed", "cancelled"],
      tracking_status: [
        "generated",
        "collected",
        "in_transit",
        "processing",
        "disposed",
      ],
      trade_status: ["active", "completed", "cancelled", "expired"],
      user_role: ["individual", "community", "organization", "municipal"],
      user_type: [
        "individual",
        "business",
        "processor",
        "collector",
        "government",
        "household",
      ],
      verification_level: ["tier1_ai", "tier2_manual", "tier3_expert"],
      verification_status: ["pending", "approved", "rejected", "under_review"],
      verification_tier: ["tier1_ai", "tier2_community", "tier3_auditor"],
      waste_material: [
        "organic",
        "recyclable",
        "hazardous",
        "ewaste",
        "plastic",
        "paper",
        "metal",
        "glass",
      ],
      waste_type: [
        "organic",
        "recyclable",
        "hazardous",
        "electronic",
        "general",
      ],
      water_activity_type: [
        "conservation",
        "harvesting",
        "recycling",
        "restoration",
        "efficiency",
      ],
    },
  },
} as const
