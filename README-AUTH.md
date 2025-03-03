# Next.js App Router with Supabase Authentication

This document provides a comprehensive guide to the authentication system implemented in this application using Next.js App Router and Supabase.

## Architecture Overview

The authentication system consists of the following components:

1. **Client-side Auth Context Provider**: Manages authentication state across the application
2. **Server-side Authentication Utilities**: Secure functions for verifying authentication in server components
3. **Middleware**: Protects routes and handles session refreshing
4. **Logout Functionality**: Properly clears sessions across the entire app
5. **Auth Routes**: Handles login, registration, password reset, and callbacks

## Key Files

- `/lib/auth-context.tsx`: Client-side auth context provider
- `/lib/auth-utils.ts`: Server-side authentication utilities
- `/lib/auth.ts`: Re-exports from auth-context and auth-utils
- `/middleware.ts`: Route protection and session refreshing
- `/app/auth/logout/route.ts`: Server-side logout handler
- `/app/logout/route.ts`: Client-side logout route
- `/app/logout/page.tsx`: Logout page with loading state

## How to Use

### 1. Initializing the Auth Provider

The auth provider is initialized in the root layout:

```tsx
// app/layout.tsx
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Client-side Authentication

Use the `useAuth` hook in client components:

```tsx
'use client';

import { useAuth } from '@/lib/auth';

export default function ProfileButton() {
  const { user, isLoading, signOut } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Not logged in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### 3. Server-side Authentication

Use the server-side utilities in server components:

```tsx
// app/profile/page.tsx
import { requireAuth, getUserProfile } from '@/lib/auth-utils';

export default async function ProfilePage() {
  // This will redirect to login if not authenticated
  const user = await requireAuth();
  
  // Get additional profile data
  const profile = await getUserProfile(user.id);
  
  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Bio: {profile.bio}</p>
        </div>
      )}
    </div>
  );
}
```

### 4. Protected Routes

Routes are automatically protected by the middleware if they match the patterns defined in `PROTECTED_ROUTES`. You can also manually protect routes using the `requireAuth` function.

### 5. Authentication Flows

#### Login Flow

1. User navigates to `/login`
2. User enters credentials
3. Client calls `signIn` from auth context
4. On success, user is redirected to dashboard
5. Auth context updates with user information

#### Logout Flow

1. User clicks logout button
2. Client calls `signOut` from auth context
3. Auth context clears local state
4. User is redirected to login page
5. Server-side logout handler clears cookies

#### Registration Flow

1. User navigates to `/register`
2. User enters credentials
3. Client calls `signUp` from auth context
4. User receives confirmation email
5. User clicks link in email to confirm account
6. User is redirected to login page

## Best Practices

1. **Always use the auth context** for client-side authentication operations
2. **Use server-side utilities** for server components
3. **Don't store sensitive information** in client-side state
4. **Protect routes** using the middleware or `requireAuth` function
5. **Handle loading states** to provide a good user experience

## Troubleshooting

### Common Issues

1. **"Auth session missing!"**: The user's session has expired or is invalid. Try logging out and back in.
2. **Redirect loops**: Check your middleware configuration to ensure you're not redirecting authenticated users to protected routes.
3. **Session not persisting**: Ensure cookies are being properly set and not being cleared unexpectedly.

### Debugging

1. Check browser console for errors
2. Inspect cookies in browser developer tools
3. Check server logs for authentication errors
4. Verify Supabase configuration in environment variables

## Security Considerations

1. **CSRF Protection**: Implemented through Supabase's cookie-based authentication
2. **XSS Protection**: Avoid storing sensitive information in localStorage
3. **Session Management**: Sessions are properly refreshed and invalidated
4. **Rate Limiting**: Implement rate limiting for login attempts to prevent brute force attacks 