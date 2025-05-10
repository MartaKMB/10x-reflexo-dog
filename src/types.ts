// Base types for database entities
export type UUID = string;
export type Timestamp = Date;

// Dog Profile DTOs
export interface DogProfileDTO {
  id: UUID;
  name: string;
  breed: string;
  age: number;
  weight: number;
  allergies: string[];
  medical_history: string[];
}

export type CreateDogProfileCommand = Omit<DogProfileDTO, "id">;

// Reflexology Points DTOs
export interface ReflexologyPointDTO {
  id: UUID;
  name: string;
  description: string;
  anatomical_system: "musculoskeletal" | "digestive" | "nervous";
  coordinates: {
    x: number;
    y: number;
  };
  contraindications: string[];
}

// Treatment Session DTOs
export interface SessionPointDTO {
  point_id: UUID;
  reaction_rating: number;
  notes: string;
}

export interface CreateTreatmentSessionCommand {
  dog_profile_id: UUID;
  user_schema_id: UUID;
  points: SessionPointDTO[];
  notes?: string;
}

export interface TreatmentSessionDTO {
  id: UUID;
  dog_profile_id: UUID;
  user_schema_id: UUID;
  start_time: Timestamp;
  end_time?: Timestamp;
  is_completed: boolean;
  notes?: string;
}

// User Schema DTOs
export interface UserSchemaDTO {
  id: UUID;
  name: string;
  description?: string;
  points: Record<
    string,
    {
      point_id: UUID;
      order: number;
    }
  >;
}

export type CreateUserSchemaCommand = Omit<UserSchemaDTO, "id">;

// API Response Types
export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
