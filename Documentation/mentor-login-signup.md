# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three types of users in the application: Admins, Mentors, and Students. It also covers the relevant components such as the admin dashboard, mentor page, layout files, Prisma schema, and middleware configurations.

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
8. [Schema.prisma](#schema.prisma)
9. [Middleware](#middleware)

---

## User Types

1. **Admin**: Manages the overall application, including user management and content moderation.
2. **Mentor**: Provides guidance and support to students, managing their learning paths.
3. **Student**: Engages with the platform to learn and interact with mentors.

---

## Login Process

### Admin Login

1. **Endpoint**: `/admin/login`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "username": "admin_username",
     "password": "admin_password"
   }
   ```
4. **Response**:
   - On success: Returns an authentication token stored in a cookie (`admin_auth_token`).
   - On failure: Returns an error message.

### Mentor Login

1. **Endpoint**: `/mentor/login`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "email": "mentor_email",
     "password": "mentor_password"
   }
   ```
4. **Response**:
   - On success: Returns an authentication token stored in a cookie (`mentor_auth_token`).
   - On failure: Returns an error message.

### Student Login

1. **Endpoint**: `/login`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "email": "student_email",
     "password": "student_password"
   }
   ```
4. **Response**:
   - On success: Returns an authentication token stored in a cookie (`student_auth_token`).
   - On failure: Returns an error message.

---

## Signup Process

### Admin Signup

1. **Endpoint**: `/admin/signup`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "username": "admin_username",
     "password": "admin_password",
     "email": "admin_email"
   }
   ```
4. **Response**:
   - On success: Returns a success message.
   - On failure: Returns an error message.

### Mentor Signup

1. **Endpoint**: `/mentor/signup`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "name": "mentor_name",
     "email": "mentor_email",
     "password": "mentor_password"
   }
   ```
4. **Response**:
   - On success: Returns a success message.
   - On failure: Returns an error message.

### Student Signup

1. **Endpoint**: `/signup`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "name": "student_name",
     "email": "student_email",
     "password": "student_password"
   }
   ```
4. **Response**:
   - On success: Returns a success message.
   - On failure: Returns an error message.

---

## Credentials Saved

For each user type, the following credentials are saved in the database:

- **Admin**:
  - Username
  - Password (hashed)
  - Email

- **Mentor**:
  - Name
  - Email
  - Password (hashed)

- **Student**:
  - Name
  - Email
  - Password (hashed)

---

## Admin Dashboard

The Admin Dashboard is accessible at `/admin`. It allows admins to manage users, view analytics, and moderate content. Access is restricted to authenticated admins only, as enforced by the middleware.

---

## Mentor Page

The Mentor Page is accessible at `/mentor`. Mentors can manage their profiles, view their assigned students, and track progress. Access is restricted to authenticated mentors only, as enforced by the middleware.

---

## Layout Files

The layout files define the structure of the application. They typically include headers, footers, and navigation elements. Ensure that the layout files are designed to accommodate the different user types, providing appropriate links and information based on the user's role.

---

## Schema.prisma

The `schema.prisma` file defines the database schema for the application. It includes models for Admin, Mentor, and Student, specifying the fields and relationships. Here’s a simplified example:

```prisma
model Admin {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  email    String @unique
}

model Mentor {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}

model Student {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}
```

---

## Middleware

The middleware is responsible for handling authentication and authorization for different routes. The `middleware.js` file checks for authentication tokens in cookies and redirects users to the appropriate login pages if they are not authenticated.

### Key Middleware Logic

- **Admin Routes**: Checks for `admin_auth_token`.
- **Mentor Routes**: Checks for `mentor_auth_token`.
- **Student Routes**: Checks for `student_auth_token`.

### Example Middleware Code

```javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
    if (!adminAuthToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Similar checks for Mentor and Student routes...

  return NextResponse.next();
}
```

---

This documentation should provide a comprehensive overview of the login and signup processes for Admins, Mentors, and Students, along with the necessary components and configurations in the application. For further details, please refer to the codebase in the GitHub repository.