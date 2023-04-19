export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      clues: {
        Row: {
          clue: string | null;
          created_at: string | null;
          id: number;
          max_attempts: number;
          sort_order: number;
          word_id: number;
        };
        Insert: {
          clue?: string | null;
          created_at?: string | null;
          id?: number;
          max_attempts?: number;
          sort_order: number;
          word_id: number;
        };
        Update: {
          clue?: string | null;
          created_at?: string | null;
          id?: number;
          max_attempts?: number;
          sort_order?: number;
          word_id?: number;
        };
      };
      date_assignment: {
        Row: {
          date: string;
          id: number;
          word_id: number;
        };
        Insert: {
          date: string;
          id?: number;
          word_id: number;
        };
        Update: {
          date?: string;
          id?: number;
          word_id?: number;
        };
      };
      game: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          user_id: string | null;
          word_id: number;
        };
        Insert: {
          created_at?: string | null;
          date?: string;
          id?: string;
          user_id?: string | null;
          word_id?: number;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          user_id?: string | null;
          word_id?: number;
        };
      };
      given_clues: {
        Row: {
          clue_id: number;
          created_at: string | null;
          game_id: string;
          id: number;
        };
        Insert: {
          clue_id: number;
          created_at?: string | null;
          game_id: string;
          id?: number;
        };
        Update: {
          clue_id?: number;
          created_at?: string | null;
          game_id?: string;
          id?: number;
        };
      };
      guesses: {
        Row: {
          correct: boolean;
          created_at: string | null;
          game_id: string;
          given_clue_id: number;
          guess: string;
          id: number;
        };
        Insert: {
          correct?: boolean;
          created_at?: string | null;
          game_id: string;
          given_clue_id: number;
          guess: string;
          id?: number;
        };
        Update: {
          correct?: boolean;
          created_at?: string | null;
          game_id?: string;
          given_clue_id?: number;
          guess?: string;
          id?: number;
        };
      };
      role_assignment: {
        Row: {
          created_at: string | null;
          id: number;
          role_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          role_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          role_id?: number;
          user_id?: string;
        };
      };
      roles: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
        };
      };
      words: {
        Row: {
          created_at: string | null;
          id: number;
          word: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          word?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          word?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_date: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_current_word: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_time_until_tomorrow: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
