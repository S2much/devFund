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
      transactions: {
        Row: {
          id: string
          label: string
          type: 'revenue' | 'expense' | 'budget'
          amount: number
          category: string
          date: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          label: string
          type: 'revenue' | 'expense' | 'budget'
          amount: number
          category?: string
          date?: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          label?: string
          type?: 'revenue' | 'expense' | 'budget'
          amount?: number
          category?: string
          date?: string
          created_at?: string
          user_id?: string
        }
      }
      assets: {
        Row: {
          id: string
          name: string
          value: number
          category: string
          acquired_date: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          value: number
          category?: string
          acquired_date?: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          value?: number
          category?: string
          acquired_date?: string
          created_at?: string
          user_id?: string
        }
      }
      roadmap_items: {
        Row: {
          id: string
          title: string
          description: string
          type: 'user_defined' | 'suggested'
          status: 'planned' | 'in_progress' | 'completed'
          target_date: string | null
          priority: 'low' | 'medium' | 'high'
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          type: 'user_defined' | 'suggested'
          status?: 'planned' | 'in_progress' | 'completed'
          target_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'user_defined' | 'suggested'
          status?: 'planned' | 'in_progress' | 'completed'
          target_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
