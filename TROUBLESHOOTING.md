# Troubleshooting Guide

## Issue: APIs Returning 404

### Symptoms
- All API requests to `/api/short-urls/*` return 404
- Authentication appears to be working (user is logged in)
- Console shows session token exists

### Possible Causes and Solutions

#### 1. Backend Server Not Running
**Solution:** Make sure the backend server is running on port 8000
```bash
cd backend
pnpm dev
```

#### 2. Route Registration Order
Routes have been updated to register short URL routes BEFORE better-auth routes to avoid conflicts.

#### 3. Cookie Name Mismatch
Better-auth might be using a different cookie name. The middleware now checks multiple possible cookie names:
- `better-auth.session_token`
- `session_token`
- `__session`
- `better-auth.session-token`
- Any cookie containing "session" or "auth"

#### 4. CORS Issues
Make sure `NEXT_PUBLIC_API_URL` is set correctly in frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 5. Debug Routes
Try these debug endpoints:
- `GET http://localhost:8000/health` - Should return `{"status":"ok"}`
- `GET http://localhost:8000/api/test` - Should return cookies and headers

### Testing Steps

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check if routes are registered:**
   ```bash
   curl http://localhost:8000/api/test
   ```

3. **Check authentication:**
   - Open browser DevTools
   - Go to Application/Storage → Cookies
   - Check what cookies are present
   - Look for cookies with "session" or "auth" in the name

4. **Check browser console:**
   - Look for the actual cookie names being sent
   - Check Network tab for request headers

### Common Cookie Names Used by Better-Auth

Better-auth might use different cookie names depending on version:
- `better-auth.session_token` (most common)
- `session_token`
- Custom cookie name based on configuration

### If Still Not Working

1. Check backend console for error messages
2. Verify database connection is working
3. Check if sessions table has data:
   ```bash
   cd backend
   pnpm studio
   ```

4. Temporarily disable auth middleware to test routes:
   Comment out `authMiddleware` in `shortUrl.routes.ts` to see if routes work without auth

