-- Create users table
create table users (
    id uuid primary key default uuid_generate_v4(),
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    last_login timestamp with time zone,
    is_2fa_enabled boolean default false,
    two_factor_secret varchar(255)
); 
