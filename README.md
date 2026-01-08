# Shrinkly - URL Shortener Service

A full-stack web application that converts long URLs into short, shareable links. Users can create shortened URLs, track their performance, and manage their links through a dashboard.

## Features

- ✅ **User Authentication** - Secure registration and login with better-auth
- ✅ **URL Shortening** - Convert long URLs to 6-8 character short codes
- ✅ **URL Redirection** - Automatic redirection to original URLs
- ✅ **Click Tracking** - Track total clicks for each shortened URL
- ✅ **Dashboard** - Manage all your URLs in one place
- ✅ **Usage Limits** - Free tier allows up to 100 URLs per user
- ✅ **Copy to Clipboard** - Easy sharing with one-click copy
- ✅ **Delete URLs** - Remove URLs you no longer need

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **Better Auth** - Authentication library
- **Cookie Parser** - Session management

### Frontend
- **Next.js 16** with **TypeScript** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Axios** - HTTP client
- **Zod** - Schema validation

## Project Structure

```
Shrinkly/
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.ts           # Express app configuration
│   │   ├── config/
│   │   │   └── config.ts        # Configuration settings
│   │   ├── lib/
│   │   │   ├── auth.ts          # Better-auth configuration
│   │   │   ├── auth-middleware.ts # Authentication middleware
│   │   │   └── prisma.ts        # Prisma client
│   │   ├── modules/
│   │   │   └── shortUrl/
│   │   │       ├── shortUrl.controller.ts
│   │   │       ├── shortUrl.service.ts
│   │   │       └── shortUrl.routes.ts
│   │   └── server.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   └── page.tsx     # Authentication page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx     # Dashboard page
│   │   │   ├── r/
│   │   │   │   └── [code]/
│   │   │   │       └── page.tsx # Redirect page
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/
│   │   │   ├── UrlShortener.tsx # URL shortening component
│   │   │   └── UrlTable.tsx     # URL table component
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx      # Authentication hook
│   │   │   └── useAxiosPublic.tsx # Axios hook
│   │   └── lib/
│   │       └── auth-client.ts   # Better-auth client
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10 or higher)
- PostgreSQL (v14 or higher)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the `backend` directory:
```env
PORT=8000
NODE_ENV=development
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/shrinkly?schema=public
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret-key-here-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view database
pnpm studio
```

5. Start the backend server:
```bash
pnpm dev
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
pnpm dev
```

The frontend will run on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

All authentication endpoints are handled by Better Auth at `/api/auth/*`. Refer to [Better Auth documentation](https://www.better-auth.com/docs) for details.

**Base URL:** `http://localhost:8000/api`

### Short URL Endpoints

#### 1. Create Short URL
**POST** `/v1/shorten`

**Headers:**
```
Content-Type: application/json
Cookie: better-auth.session_token=<token>
```

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "id": "uuid",
    "userId": "user-id",
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123",
    "clicks": 0,
    "createdAt": "2026-01-07T12:00:00.000Z",
    "updatedAt": "2026-01-07T12:00:00.000Z"
  }
}
```

#### 2. Get User's URLs
**GET** `/short-urls`

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "original_url": "https://example.com/very/long/url",
      "short_code": "abc123",
      "clicks": 42,
      "created_at": "2026-01-07T12:00:00.000Z"
    }
  ]
}
```

#### 3. Get URL Count
**GET** `/short-urls/count`

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url_count": 25,
    "max_urls": 100
  }
}
```

#### 4. Redirect Short URL
**GET** `/redirect/:code`

**Public endpoint** - No authentication required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "originalUrl": "https://example.com/very/long/url"
  }
}
```

**Note:** The frontend handles the actual redirect. Clicks are incremented automatically.

#### 5. Delete Short URL
**DELETE** `/short-urls/:code`

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Short URL deleted successfully"
}
```

#### 6. Check Short Code Availability
**GET** `/short-urls/check?code=abc123`

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "exists": false
  }
}
```

## Design Decisions

### Short Code Generation
- Short codes are randomly generated with 6-8 characters
- Uses alphanumeric characters (A-Z, a-z, 0-9)
- Uniqueness is enforced at the database level
- If a duplicate is detected, the frontend can retry with a new code

### Authentication
- Uses Better Auth for secure session-based authentication
- Sessions are stored in the database with expiration
- Middleware validates sessions on protected routes
- Cookies are used for session management

### Database Schema
- Uses PostgreSQL with Prisma ORM
- Separate tables for users, sessions, accounts, and short URLs
- Foreign key constraints ensure data integrity
- Cascading deletes remove related data when a user is deleted

### URL Limits
- Free tier: 100 URLs per user
- Limit is enforced at the service layer
- Frontend displays an alert when limit is reached
- No actual upgrade functionality (as per requirements)

### Click Tracking
- Clicks are incremented asynchronously to avoid blocking redirects
- Click count is stored in the database
- Dashboard displays total clicks per URL and aggregate statistics

### Error Handling
- Consistent error response format across all endpoints
- Proper HTTP status codes
- User-friendly error messages
- Frontend handles errors gracefully with toast notifications

## Known Limitations

1. **Short Code Collisions**: While rare, duplicate short codes can occur. The system handles this by checking for duplicates before creation, but if a collision happens during concurrent requests, the database constraint will catch it.

2. **No Custom Short Codes**: Users cannot specify custom short codes. All codes are randomly generated.

3. **No URL Expiration**: URLs do not expire automatically. They must be manually deleted.

4. **No Analytics Details**: Click tracking only shows total counts, not detailed analytics (time of clicks, referrer, etc.).

5. **No Bulk Operations**: URLs must be deleted one at a time.

6. **No URL Preview**: The system doesn't validate if the original URL is accessible before creating a short link.

## Security Considerations

- Passwords are hashed using Better Auth's secure hashing
- Session tokens are stored securely in cookies
- Authentication middleware protects all sensitive endpoints
- CORS is configured to only allow requests from the frontend origin
- SQL injection is prevented through Prisma's parameterized queries
- User ownership is verified before allowing deletions

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
pnpm dev
```

**Frontend:**
```bash
cd frontend
pnpm dev
```

### Building for Production

**Backend:**
```bash
cd backend
pnpm build
pnpm start
```

**Frontend:**
```bash
cd frontend
pnpm build
pnpm start
```

### Database Migrations

To create a new migration:
```bash
cd backend
npx prisma migrate dev --name migration_name
```

To apply migrations:
```bash
npx prisma migrate deploy
```

## Testing

The application should be tested with:
1. User registration and login
2. Creating short URLs
3. Redirecting using short URLs
4. Viewing dashboard with URL list
5. Deleting URLs
6. Reaching the 100 URL limit
7. Copy to clipboard functionality

## Contributing

This is a project assignment. For questions or issues, please contact: hr@technext.it

## License

This project is part of a technical assignment.

