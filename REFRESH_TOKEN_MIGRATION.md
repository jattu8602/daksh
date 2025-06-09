# Refresh Token System Migration Guide

## Overview

This migration implements a robust refresh token system that will keep students logged in for approximately 30 days instead of just 24 hours. The system includes:

- **Access Tokens**: Short-lived (1 hour) for API requests
- **Refresh Tokens**: Long-lived (30 days) for generating new access tokens
- **Automatic Token Refresh**: Seamless background refresh without user intervention
- **Enhanced Security**: Multiple layers of token validation

## Migration Steps

### 1. Update Database Schema

```bash
# Push the updated schema to your database
npx prisma db push

# Or if you prefer migrations
npx prisma migrate dev --name add-refresh-tokens
```

### 2. Run Migration Script (Optional but Recommended)

```bash
# This will clean up existing sessions for a fresh start
node scripts/migrate-session-schema.js
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Test the System

1. Try logging in as a student
2. Leave the app idle for more than 1 hour
3. Navigate to different pages - tokens should refresh automatically
4. Check browser localStorage - you should see both accessToken and refreshToken

## Key Features

### 🔄 Automatic Token Refresh

- Tokens refresh automatically 5 minutes before expiry
- No interruption to user experience
- Handles edge cases like browser tab switching

### 🛡️ Enhanced Security

- Separate short-lived access tokens for API calls
- Long-lived refresh tokens stored securely
- Automatic cleanup of expired sessions

### 📱 Persistent Sessions

- Students stay logged in for up to 30 days
- Sessions survive browser restarts
- Only manual logout or token expiry will end sessions

### 🎯 Smart Session Management

- Multiple active sessions prevented (one device at a time)
- Automatic session validation on page loads
- Graceful handling of network issues

## Code Changes Summary

### New Files

- `lib/auth.js` - Complete authentication manager
- `hooks/useAuth.js` - React hooks for auth state
- `scripts/migrate-session-schema.js` - Migration helper

### Updated Files

- `app/api/auth/session/route.js` - Added refresh token endpoints
- `app/page.jsx` - Updated login flow
- `app/dashboard/layout.js` - Added route protection
- `prisma/schema.prisma` - Added refresh token fields

## Environment Variables

No new environment variables needed! The system uses your existing DATABASE_URL.

## Monitoring

### Check Token Status (DevTools Console)

```javascript
// Check current tokens
console.log(localStorage.getItem('accessToken'))
console.log(localStorage.getItem('refreshToken'))

// Check expiry times
console.log(new Date(localStorage.getItem('accessTokenExpiresAt')))
console.log(new Date(localStorage.getItem('refreshTokenExpiresAt')))
```

### API Endpoints

- `POST /api/auth/session` - Create new session with both tokens
- `GET /api/auth/session` - Validate access token
- `PUT /api/auth/session` - Refresh access token using refresh token
- `DELETE /api/auth/session` - Logout (delete session)

## Troubleshooting

### Students Getting Logged Out

1. Check if refresh tokens are being stored properly
2. Verify database schema was updated correctly
3. Ensure migration script was run

### Token Refresh Failing

1. Check server logs for refresh token errors
2. Verify refresh token hasn't expired (30 days)
3. Clear localStorage and re-login

### Performance Issues

1. Monitor database for session cleanup
2. Check if automatic refresh is working
3. Verify token refresh isn't happening too frequently

## Rollback Plan

If issues occur:

1. Revert `prisma/schema.prisma` changes
2. Run `npx prisma db push`
3. Revert API route changes
4. Students will need to re-login

## Success Metrics

- Students staying logged in for days/weeks
- Reduced login support tickets
- Seamless app experience without interruptions
- No security incidents related to session management
