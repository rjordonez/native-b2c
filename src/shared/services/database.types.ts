// Database types for Supabase tables
// You can generate these types using Supabase CLI:
// npx supabase gen types typescript --project-id your-project-id

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          title: string;
          category: string;
          difficulty: string;
          description: string;
          estimated_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          difficulty: string;
          description: string;
          estimated_time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          difficulty?: string;
          description?: string;
          estimated_time?: string;
          created_at?: string;
        };
      };
      user_topic_progress: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string;
          progress: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id: string;
          progress?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic_id?: string;
          progress?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}