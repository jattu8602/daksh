# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three types of users in the application: Admins, Mentors, and Students. It also covers the relevant components, including the admin dashboard, mentor page, layout files, database schema, and middleware configuration.

## Table of Contents
1. [User Types](#user-types)
2. [Login Process](#login-process)
   - [Admin Login](#admin-login)
   - [Mentor Login](#mentor-login)
   - [Student Login](#student-login)
3. [Signup Process](#signup-process)
   - [Admin Signup](#admin-signup)
   - [Mentor Signup](#mentor-signup)
   - [Student Signup](#student-signup)
4. [Credentials Saved](#credentials-saved)
5. [Admin Dashboard](#admin-dashboard)
6. [Mentor Page](#mentor-page)
7. [Layout Files](#layout-files)
8. [Database Schema (schema.prisma)](#database-schema-schema-prisma)
9. [Middleware Configuration](#middleware-configuration)

---

## User Types

1. **Admin**: Manages the overall application, including user management and content moderation.
2. **Mentor**: Provides guidance and support to students, managing their learning paths and progress.
3. **Student**: Engages with the platform to learn and interact with mentors.

---

## Login Process

### Admin Login
- **Endpoint**: `/admin/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "admin_username",
    "password": "admin_password"
  }
  ```
- **Response**: On successful login, an `admin_auth_token` is set in cookies for session management.

### Mentor Login
- **Endpoint**: `/mentor/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "mentor_email",
    "password": "mentor_password"
  }
  ```
- **Response**: On successful login, a `mentor_auth_token` is set in cookies for session management.

### Student Login
- **Endpoint**: `/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "student_email",
    "password": "student_password"
  }
  ```
- **Response**: On successful login, a `student_auth_token` is set in cookies for session management.

---

## Signup Process

### Admin Signup
- **Endpoint**: `/admin/signup`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "username": "new_admin_username",
    "password": "new_admin_password"
  }
  ```
- **Response**: On successful signup, the admin can log in using the provided credentials.

### Mentor Signup
- **Endpoint**: `/mentor/signup`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "new_mentor_email",
    "password": "new_mentor_password",
    "name": "Mentor Name"
  }
  ```
- **Response**: On successful signup, the mentor can log in using the provided credentials.

### Student Signup
- **Endpoint**: `/signup`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "new_student_email",
    "password": "new_student_password",
    "name": "Student Name"
  }
  ```
- **Response**: On successful signup, the student can log in using the provided credentials.

---

## Credentials Saved

For each user type, the following credentials are saved:

- **Admin**:
  - Username
  - Password (hashed)

- **Mentor**:
  - Email
  - Password (hashed)
  - Name

- **Student**:
  - Email
  - Password (hashed)
  - Name

---

## Admin Dashboard

The Admin Dashboard allows admins to manage users, view analytics, and moderate content. It is accessible at `/admin` and requires an `admin_auth_token` for access. The middleware checks for this token and redirects to the login page if not authenticated.

---

## Mentor Page

The Mentor Page allows mentors to manage their students and track progress. It is accessible at `/mentor` and requires a `mentor_auth_token` for access. The middleware checks for this token and redirects to the login page if not authenticated.

---

## Layout Files

The layout files define the structure and design of the application. They include components such as headers, footers, and navigation bars that are common across different pages. Ensure that the layout files are responsive and user-friendly.

---

## Database Schema (schema.prisma)

The database schema defines the structure of the database. Below is a simplified version of the schema for users:

```prisma
model Admin {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
}

model Mentor {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  name     String
}

model Student {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  name     String
}
```

---

## Middleware Configuration

The middleware is responsible for handling authentication and authorization for different user types. The `middleware.js` file checks for the presence of authentication tokens in cookies and redirects users to the login page if they are not authenticated.

### Middleware Logic
- For Admin:
  - Checks if the path starts with `/admin` and if the user is not trying to access the login page.
  - Validates the `admin_auth_token` cookie.

- For Mentor:
  - Checks if the path starts with `/mentor` and if the user is not trying to access the login page.
  - Validates the `mentor_auth_token` cookie.

- For Student:
  - Checks if the path starts with `/dashboard`, `/home`, `/explore`, `/learn`, `/reels`, or `/profile`.
  - Validates the `student_auth_token` cookie.

### Example Middleware Code
```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Authentication logic here...
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

This documentation should provide a comprehensive overview of the login and signup processes, as well as the relevant components of the application. For further details, please refer to the code in the GitHub repository.