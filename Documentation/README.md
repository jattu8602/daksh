# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three user roles: Admins, Mentors, and Students. It also covers the relevant components of the application, including the admin dashboard, mentor page, layout files, database schema, and middleware.

## Table of Contents

1. [User Roles Overview](#user-roles-overview)
2. [Login and Signup Process](#login-and-signup-process)
   - [Admin Login and Signup](#admin-login-and-signup)
   - [Mentor Login and Signup](#mentor-login-and-signup)
   - [Student Login and Signup](#student-login-and-signup)
3. [Credentials Saved for Each User](#credentials-saved-for-each-user)
4. [Admin Dashboard](#admin-dashboard)
5. [Mentor Page](#mentor-page)
6. [Layout Files](#layout-files)
7. [Database Schema (schema.prisma)](#database-schema-schemaprism)
8. [Middleware](#middleware)

---

## User Roles Overview

- **Admin**: Manages the entire application, including user management and content moderation.
- **Mentor**: Provides guidance and support to students, manages classes, and tracks student progress.
- **Student**: Engages with the platform to learn, attend classes, and interact with mentors.

---

## Login and Signup Process

### Admin Login and Signup

- **Login**: Admins can log in using their email and password. Upon successful authentication, they are redirected to the admin dashboard.
- **Signup**: Admins can sign up by providing their name, email, and password. After successful signup, they receive a confirmation email.

### Mentor Login and Signup

- **Login**: Mentors log in using their email and password. Successful login redirects them to the mentor dashboard.
- **Signup**: Mentors can sign up by providing their name, email, password, and expertise. After signup, they may need to verify their email.

### Student Login and Signup

- **Login**: Students log in using their email and password. Successful login redirects them to the student dashboard.
- **Signup**: Students can sign up by providing their name, email, password, and preferred learning topics. A confirmation email is sent after signup.

---

## Credentials Saved for Each User

| User Role | Credentials Saved                     |
|-----------|---------------------------------------|
| Admin     | Name, Email, Password, Auth Token     |
| Mentor    | Name, Email, Password, Expertise, Auth Token |
| Student   | Name, Email, Password, Learning Topics, Auth Token |

---

## Admin Dashboard

The admin dashboard provides a comprehensive view of the application, allowing admins to manage users, view analytics, and moderate content. Key features include:

- User management (view, edit, delete users)
- Content moderation (approve or reject content)
- Analytics dashboard (view application usage statistics)

---

## Mentor Page

The mentor page allows mentors to manage their classes, track student progress, and communicate with students. Key features include:

- Class management (create, edit, delete classes)
- Student tracking (view student progress and feedback)
- Communication tools (chat with students)

---

## Layout Files

The layout files define the structure and design of the application. They include:

- **Header**: Contains navigation links for all user roles.
- **Footer**: Displays copyright information and additional links.
- **Main Content Area**: Renders the specific content based on the user role.

---

## Database Schema (schema.prisma)

The `schema.prisma` file defines the database structure for the application. Key models include:

```prisma
model Admin {
  id        Int     @id @default(autoincrement())
  name      String
  email     String  @unique
  password  String
  authToken String?
}

model Mentor {
  id        Int     @id @default(autoincrement())
  name      String
  email     String  @unique
  password  String
  expertise String
  authToken String?
}

model Student {
  id             Int     @id @default(autoincrement())
  name           String
  email          String  @unique
  password       String
  learningTopics String
  authToken      String?
}
```

---

## Middleware

The `middleware.js` file handles authentication for different user roles. It checks for authentication tokens in cookies and redirects users to the appropriate login pages if they are not authenticated.

### Key Features of Middleware

- **Admin Authentication**: Redirects to `/admin/login` if the admin is not authenticated.
- **Mentor Authentication**: Redirects to `/mentor/login` if the mentor is not authenticated.
- **Student Authentication**: Redirects to `/` (home) if the student is not authenticated.

### Example Middleware Code

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && !path.includes('/admin/login')) {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
    if (!adminAuthToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Similar checks for Mentor and Student...

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/mentor/:path*',
    '/dashboard/:path*',
    '/home',
    '/explore',
    '/learn',
    '/reels',
    '/profile',
  ],
};
```

---

This documentation provides a comprehensive overview of the login and signup processes for Admins, Mentors, and Students, along with the relevant components of the application. For further details, please refer to the codebase in the GitHub repository.