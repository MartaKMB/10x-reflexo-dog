-- Create user_activity table
create table user_activity (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    date date not null,
    sessions_count integer default 0,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
); 
