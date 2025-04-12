# Database Schema Plan for DogOwnerWithReflexoSkills

## 1. Tables

### users
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `email` VARCHAR(255) UNIQUE NOT NULL
- `password_hash` VARCHAR(255) NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
- `last_login` TIMESTAMP WITH TIME ZONE
- `is_2fa_enabled` BOOLEAN DEFAULT FALSE
- `2fa_secret` VARCHAR(255)

### dog_profiles
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `user_id` UUID REFERENCES users(id) ON DELETE CASCADE
- `name` VARCHAR(100) NOT NULL
- `breed` VARCHAR(100) NOT NULL
- `age` INTEGER CHECK (age >= 1 AND age <= 19) NOT NULL
- `weight` DECIMAL(5,2) CHECK (weight >= 2 AND weight <= 100) NOT NULL
- `allergies` TEXT[]
- `medical_history` TEXT[]
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

### reflexology_points
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `name` VARCHAR(100) NOT NULL
- `description` TEXT NOT NULL
- `anatomical_system` ENUM('musculoskeletal', 'digestive', 'nervous') NOT NULL
- `coordinates` JSONB NOT NULL
- `contraindications` TEXT[]

### predefined_schemas
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `name` VARCHAR(100) NOT NULL
- `description` TEXT NOT NULL
- `points` JSONB NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

### user_schemas
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `user_id` UUID REFERENCES users(id) ON DELETE CASCADE
- `name` VARCHAR(100) NOT NULL
- `description` TEXT
- `points` JSONB NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

### treatment_sessions
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `user_id` UUID REFERENCES users(id) ON DELETE CASCADE
- `dog_profile_id` UUID REFERENCES dog_profiles(id) ON DELETE CASCADE
- `user_schema_id` UUID REFERENCES user_schemas(id) ON DELETE SET NULL
- `start_time` TIMESTAMP WITH TIME ZONE NOT NULL
- `end_time` TIMESTAMP WITH TIME ZONE
- `is_completed` BOOLEAN DEFAULT FALSE
- `notes` TEXT
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

### session_points
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `session_id` UUID REFERENCES treatment_sessions(id) ON DELETE CASCADE
- `point_id` UUID REFERENCES reflexology_points(id) ON DELETE CASCADE
- `reaction_rating` INTEGER CHECK (reaction_rating >= 1 AND reaction_rating <= 5)
- `notes` TEXT
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

### user_activity
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `user_id` UUID REFERENCES users(id) ON DELETE CASCADE
- `date` DATE NOT NULL
- `sessions_count` INTEGER DEFAULT 0
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

## 2. Relationships

- `users` (1) -> (N) `dog_profiles`
- `users` (1) -> (N) `user_schemas`
- `users` (1) -> (N) `treatment_sessions`
- `users` (1) -> (N) `user_activity`
- `dog_profiles` (1) -> (N) `treatment_sessions`
- `user_schemas` (1) -> (N) `treatment_sessions`
- `treatment_sessions` (1) -> (N) `session_points`
- `reflexology_points` (1) -> (N) `session_points`

## 3. Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Dog Profiles
CREATE INDEX idx_dog_profiles_user_id ON dog_profiles(user_id);

-- Reflexology Points
CREATE INDEX idx_reflexology_points_anatomical_system ON reflexology_points(anatomical_system);
CREATE INDEX idx_reflexology_points_coordinates ON reflexology_points USING GIN(coordinates);

-- User Schemas
CREATE INDEX idx_user_schemas_user_id ON user_schemas(user_id);
CREATE INDEX idx_user_schemas_points ON user_schemas USING GIN(points);

-- Treatment Sessions
CREATE INDEX idx_treatment_sessions_user_id ON treatment_sessions(user_id);
CREATE INDEX idx_treatment_sessions_dog_profile_id ON treatment_sessions(dog_profile_id);
CREATE INDEX idx_treatment_sessions_user_schema_id ON treatment_sessions(user_schema_id);
CREATE INDEX idx_treatment_sessions_start_time ON treatment_sessions(start_time);

-- Session Points
CREATE INDEX idx_session_points_session_id ON session_points(session_id);
CREATE INDEX idx_session_points_point_id ON session_points(point_id);

-- User Activity
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_date ON user_activity(date);
```

## 4. PostgreSQL Policies (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can only access their own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own dog profiles" ON dog_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own schemas" ON user_schemas
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own treatment sessions" ON treatment_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own session points" ON session_points
    FOR ALL USING (auth.uid() = (SELECT user_id FROM treatment_sessions WHERE id = session_id));

CREATE POLICY "Users can only access their own activity" ON user_activity
    FOR ALL USING (auth.uid() = user_id);
```

## 5. Additional Notes

1. **Constraints**:
   - Maximum 3 user schemas per user is enforced through application logic
   - Age and weight constraints are enforced through CHECK constraints
   - Reaction rating is limited to 1-5 through CHECK constraint

2. **JSONB Usage**:
   - Used for storing flexible data structures like point coordinates and schema points
   - GIN indexes are created for efficient querying of JSONB fields

3. **Security**:
   - RLS policies ensure users can only access their own data
   - Password hashing is handled by Supabase Auth
   - 2FA support is included in the schema

4. **Performance**:
   - Appropriate indexes are created for frequently queried fields
   - GIN indexes for JSONB fields enable efficient querying of complex data structures

5. **Data Integrity**:
   - Foreign key constraints ensure referential integrity
   - Timestamps track creation and updates
   - NOT NULL constraints on required fields 
