export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      offices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          address: string | null
          city: string | null
          country: string
          phone: string | null
          email: string
          logo_url: string | null
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          address?: string | null
          city?: string | null
          country?: string
          phone?: string | null
          email: string
          logo_url?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          address?: string | null
          city?: string | null
          country?: string
          phone?: string | null
          email?: string
          logo_url?: string | null
          settings?: Json
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          office_id: string
          auth_id: string
          email: string
          full_name: string | null
          role: string
          is_active: boolean
          last_login: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          office_id: string
          auth_id: string
          email: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          office_id?: string
          auth_id?: string
          email?: string
          full_name?: string | null
          role?: string
          is_active?: boolean
          last_login?: string | null
        }
      }
    }
  }
}