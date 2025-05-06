# Daksh - Student Learning Platform

Daksh is a progressive web application (PWA) designed for students, mentors, and administrators. It provides a platform for educational institutions to manage students, classes, and learning materials.

## Features

- **Authentication**: Login using username/password or QR codes
- **Role-based Access**: Separate interfaces for students, mentors, administrators, and super admins
- **School Management**: Add and manage schools, classes, and students
- **Student Portal**: Features home feed, learning materials, reels, and profile management
- **Mentor Portal**: Tools for uploading content, chatting with students, and creating reels
- **Admin Dashboard**: Comprehensive management of school data with export capabilities

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/daksh.git
   cd daksh
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.sample` to `.env.local`
   - Update the database connection string and other environment variables

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/` - Next.js application code
  - `api/` - Backend API routes
  - `admin/` - Admin interface
  - `mentor/` - Mentor interface
  - `(dashboard)/` - Student dashboard
  - `(auth)/` - Authentication pages
- `prisma/` - Database schema and migrations
- `public/` - Static assets
- `lib/` - Shared utility functions

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SUPER_ADMIN_EMAIL` - Default super admin email
- `SUPER_ADMIN_PASSWORD` - Default super admin password

## License

This project is licensed under the MIT License - see the LICENSE file for details.
