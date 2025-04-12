-- Create reflexology_points table
create table reflexology_points (
    id uuid primary key default uuid_generate_v4(),
    name varchar(100) not null,
    description text not null,
    anatomical_system anatomical_system not null,
    coordinates jsonb not null,
    contraindications text[]
); 
