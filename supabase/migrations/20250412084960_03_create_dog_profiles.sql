-- Create dog_profiles table
create table dog_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    name varchar(100) not null,
    breed varchar(100) not null,
    age integer check (age >= 1 and age <= 19) not null,
    weight decimal(5,2) check (weight >= 2 and weight <= 100) not null,
    allergies text[],
    medical_history text[],
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
); 
