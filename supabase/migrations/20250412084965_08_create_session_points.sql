-- Create session_points table
create table session_points (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references treatment_sessions(id) on delete cascade,
    point_id uuid references reflexology_points(id) on delete cascade,
    reaction_rating integer check (reaction_rating >= 1 and reaction_rating <= 5),
    notes text,
    created_at timestamp with time zone default current_timestamp
); 
