export interface Database {
  public: {
    Tables: {
      reflexology_points: {
        Row: {
          id: string;
          name: string;
          description: string;
          anatomical_system: "musculoskeletal" | "digestive" | "nervous";
          coordinates: {
            x: number;
            y: number;
          };
          contraindications: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reflexology_points"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reflexology_points"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
