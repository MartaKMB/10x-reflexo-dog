-- Create predefined_schemas table
create table predefined_schemas (
    id uuid primary key default uuid_generate_v4(),
    name varchar(100) not null,
    description text not null,
    points jsonb not null,
    created_at timestamp with time zone default current_timestamp
); 
