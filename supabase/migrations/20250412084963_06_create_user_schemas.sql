-- Create user_schemas table
create table user_schemas (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    name varchar(100) not null,
    description text,
    points jsonb not null,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
); 
