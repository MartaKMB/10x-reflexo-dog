-- Create treatment_sessions table
create table treatment_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    dog_profile_id uuid references dog_profiles(id) on delete cascade,
    user_schema_id uuid references user_schemas(id) on delete set null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    is_completed boolean default false,
    notes text,
    created_at timestamp with time zone default current_timestamp
); 
