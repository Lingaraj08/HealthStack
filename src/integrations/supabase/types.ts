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
      appointments: {
        Row: {
          appointment_time: string
          created_at: string | null
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          status: string | null
        }
        Insert: {
          appointment_time: string
          created_at?: string | null
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
        }
        Update: {
          appointment_time?: string
          created_at?: string | null
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_for_consultation: boolean | null
          avatar_url: string | null
          created_at: string | null
          full_name: string
          hospital: string | null
          id: string
          qualification: string[] | null
          rating: number | null
          specialization: string
          user_id: string | null
          years_of_experience: number | null
        }
        Insert: {
          available_for_consultation?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          hospital?: string | null
          id?: string
          qualification?: string[] | null
          rating?: number | null
          specialization: string
          user_id?: string | null
          years_of_experience?: number | null
        }
        Update: {
          available_for_consultation?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          hospital?: string | null
          id?: string
          qualification?: string[] | null
          rating?: number | null
          specialization?: string
          user_id?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          record_type: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          record_type: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          record_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          first_name: string | null
          gender: string | null
          health_id: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string | null
          user_role: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          gender?: string | null
          health_id?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_role?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          gender?: string | null
          health_id?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          user_role?: string | null
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
      [_ in never]: never
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
