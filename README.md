# ContentMetric

ContentMetric is a modern content analytics and management platform built with Next.js, Tailwind CSS, and Supabase. It helps teams track, analyze, and optimize their content performance across all platforms.

## Features

- **Content Analytics**: Track views, engagement, and conversions across all content channels
- **Brand Voice Management**: Create and maintain consistent tone and style across all content
- **Authentication**: Secure user authentication and authorization system
- **Modern UI**: Built with Tailwind CSS, Headless UI, and Next.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account for authentication and database

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```env
# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Architecture

### Authentication System

The authentication system uses Supabase and consists of:

1. **Client-side Auth Context**: Manages authentication state
2. **Server-side Auth Utilities**: Secure authentication verification
3. **Middleware**: Route protection and session management
4. **Auth Routes**: Login, registration, and password reset flows

#### Usage in Components

Client-side authentication:
```tsx
'use client';
import { useAuth } from '@/lib/auth';

export default function ProfileButton() {
  const { user, isLoading } = useAuth();
  return isLoading ? <div>Loading...</div> : <div>Welcome, {user?.email}</div>;
}
```

Server-side authentication:
```tsx
import { requireAuth } from '@/lib/auth-utils';

export default async function ProtectedPage() {
  const user = await requireAuth();
  return <div>Protected content for {user.email}</div>;
}
```

### Brand Voice Management

The brand voice system helps maintain consistent content tone and style:

- Create and manage multiple brand voices
- Set active brand voices
- Analyze content for brand voice compliance
- Get detailed feedback and improvements

#### Brand Voice Analysis

```tsx
const result = await analyzeBrandVoice({
  content: yourContent,
  brandVoiceId: activeBrandVoice.id
});
```

## Development

### Project Structure

- `/src/app/*` - Next.js 13+ app router pages
- `/src/components/*` - Reusable React components
- `/src/lib/*` - Utility functions and business logic

### Key Technologies

- **Framework**: Next.js 13+ with App Router
- **UI**: Tailwind CSS, Headless UI
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Context + Hooks
- **Type Safety**: TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the [Tailwind Plus license](https://tailwindcss.com/plus/license).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
