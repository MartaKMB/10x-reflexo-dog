# REST API Plan

## 1. Resources

### Users
- Table: `users`
- Endpoints: `/api/users`

### Dog Profiles
- Table: `dog_profiles`
- Endpoints: `/api/dog-profiles`

### Reflexology Points
- Table: `reflexology_points`
- Endpoints: `/api/reflexology-points`

### Predefined Schemas
- Table: `predefined_schemas`
- Endpoints: `/api/predefined-schemas`

### User Schemas
- Table: `user_schemas`
- Endpoints: `/api/user-schemas`

### Treatment Sessions
- Table: `treatment_sessions`
- Endpoints: `/api/treatment-sessions`

### Session Points
- Table: `session_points`
- Endpoints: `/api/session-points`

### User Activity
- Table: `user_activity`
- Endpoints: `/api/user-activity`

## 2. Endpoints

### Dog Profiles

#### GET /api/dog-profiles
- Description: List all dog profiles for authenticated user
- Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "breed": "string",
      "age": "number",
      "weight": "number",
      "allergies": "string[]",
      "medical_history": "string[]"
    }
  ]
}
```

#### POST /api/dog-profiles
- Description: Create a new dog profile
- Request Body:
```json
{
  "name": "string",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "allergies": "string[]",
  "medical_history": "string[]"
}
```
- Response (201):
```json
{
  "id": "uuid",
  "name": "string",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "allergies": "string[]",
  "medical_history": "string[]"
}
```

### Reflexology Points

#### GET /api/reflexology-points
- Description: Get reflexology points with optional filtering
- Query Parameters:
  - `system`: Filter by anatomical system
  - `search`: Search by name or description
- Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "anatomical_system": "string",
      "coordinates": "object",
      "contraindications": "string[]"
    }
  ]
}
```

### Treatment Sessions

#### POST /api/treatment-sessions
- Description: Create a new treatment session
- Request Body:
```json
{
  "dog_profile_id": "uuid",
  "user_schema_id": "uuid",
  "points": [
    {
      "point_id": "uuid",
      "reaction_rating": "number",
      "notes": "string"
    }
  ],
  "notes": "string"
}
```
- Response (201):
```json
{
  "id": "uuid",
  "dog_profile_id": "uuid",
  "user_schema_id": "uuid",
  "start_time": "timestamp",
  "end_time": "timestamp",
  "is_completed": "boolean",
  "notes": "string"
}
```

### User Schemas

#### GET /api/user-schemas
- Description: List user's custom schemas
- Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "points": "object"
    }
  ]
}
```

#### POST /api/user-schemas
- Description: Create a new custom schema
- Request Body:
```json
{
  "name": "string",
  "description": "string",
  "points": "object"
}
```
- Response (201):
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "points": "object"
}
```

## 3. Authentication and Authorization

### Authentication
- JWT-based authentication
- Token expiration: 25 minutes
- 2FA required for accounts with >5 schemas
- Token refresh mechanism

### Authorization
- Row Level Security (RLS) policies enforced at database level
- User can only access their own data
- Role-based access control for admin functions

## 4. Validation and Business Logic

### Validation Rules

#### Dog Profiles
- Age: 1-19 years
- Weight: 2-100kg
- Required fields: name, breed, age, weight
- Maximum 3 profiles per user

#### Treatment Sessions
- Reaction rating: 1-5
- Required fields: dog_profile_id, points
- Points must exist in reflexology_points table

#### User Schemas
- Maximum 3 schemas per user
- Points must be valid reflexology points
- Schema name must be unique per user

### Business Logic Implementation

#### Schema Generation
- Endpoint: POST /api/user-schemas/generate
- Uses historical treatment data
- Considers dog's medical history
- Suggests points based on anatomical systems

#### Treatment Session Tracking
- Automatically tags sessions by anatomical systems
- Tracks user activity
- Generates treatment history reports

#### Data Encryption
- Medical data encrypted using AES-256
- Encryption keys managed by Supabase
- Secure transmission using HTTPS

### Error Handling
- Standard HTTP status codes
- Detailed error messages
- Validation error responses include field-level details
- Rate limiting responses include retry-after header 
