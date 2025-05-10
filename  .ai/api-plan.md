# REST API Plan

## 1. Resources

### Users
- Table: `users`
- Core user management and authentication

### Dog Profiles
- Table: `dog_profiles`
- Dog information and medical history

### Reflexology Points
- Table: `reflexology_points`
- Reference data for treatment points

### Treatment Schemas
- Tables: `predefined_schemas`, `user_schemas`
- Treatment templates and custom schemas

### Treatment Sessions
- Tables: `treatment_sessions`, `session_points`
- Session records and point-specific data

### User Activity
- Table: `user_activity`
- User engagement tracking

## 2. Endpoints

### Dog Profiles

#### GET /api/v1/dogs
- Description: List user's dog profiles
- Query Parameters:
  - page: number
  - limit: number
- Response: 200 OK
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
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### POST /api/v1/dogs
- Description: Create new dog profile
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
- Response: 201 Created
```json
{
  "id": "uuid",
  "name": "string",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "allergies": "string[]",
  "medical_history": "string[]",
  "created_at": "timestamp"
}
```

### Reflexology Points

#### GET /api/v1/points
- Description: List reflexology points
- Query Parameters:
  - layer: string (musculoskeletal|digestive|nervous)
  - system: string
  - page: number
  - limit: number
- Response: 200 OK
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
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### Treatment Schemas

#### GET /api/v1/schemas
- Description: List user's custom schemas
- Query Parameters:
  - page: number
  - limit: number
- Response: 200 OK
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "points": "object[]",
      "created_at": "timestamp"
    }
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### POST /api/v1/schemas
- Description: Create custom treatment schema
- Request Body:
```json
{
  "name": "string",
  "description": "string",
  "points": "object[]"
}
```
- Response: 201 Created
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "points": "object[]",
  "created_at": "timestamp"
}
```

#### GET /api/v1/schemas/suggestions
- Description: Get suggested treatment schemas
- Query Parameters:
  - dog_id: uuid
- Response: 200 OK
```json
{
  "suggestions": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "points": "object[]",
      "confidence": "number"
    }
  ]
}
```

### Treatment Sessions

#### POST /api/v1/sessions
- Description: Create new treatment session
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
  ]
}
```
- Response: 201 Created
```json
{
  "id": "uuid",
  "dog_profile_id": "uuid",
  "user_schema_id": "uuid",
  "start_time": "timestamp",
  "points": "object[]",
  "created_at": "timestamp"
}
```

## 3. Authentication and Authorization

### Authentication
- JWT-based authentication using Supabase Auth
- Token expiration: 25 minutes
- Refresh token mechanism for extended sessions

### Authorization
- Row Level Security (RLS) policies implemented in database
- User can only access their own data
- 2FA required for accounts with >5 saved schemas

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
- Points must be valid reflexology points

#### Schemas
- Maximum 3 custom schemas per user
- Points must be valid reflexology points
- Schema name must be unique per user

### Business Logic Implementation

#### Schema Generation
- Algorithm considers:
  - Dog's medical history
  - Previous session reactions
  - Anatomical system focus
  - Contraindications

#### Session Tracking
- Automatic tagging by anatomical system
- Progress tracking over time

#### Security Measures
- AES-256 encryption for medical data
- Rate limiting: 100 requests per minute
- Input sanitization for all endpoints
- CORS configuration for specific origins 
