# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three user roles: Admins, Mentors, and Students. It also covers the relevant components of the application, including the admin dashboard, mentor page, layout files, database schema (schema.prisma), and middleware for authentication.

## Table of Contents

1. [Overview](#overview)
2. [User Roles and Credentials](#user-roles-and-credentials)
   - [Admin](#admin)
   - [Mentor](#mentor)
   - [Student](#student)
3. [Login and Signup Process](#login-and-signup-process)
   - [Admin Login and Signup](#admin-login-and-signup)
   - [Mentor Login and Signup](#mentor-login-and-signup)
   - [Student Login and Signup](#student-login-and-signup)
4. [Admin Dashboard](#admin-dashboard)
5. [Mentor Page](#mentor-page)
6. [Layout Files](#layout-files)
7. [Database Schema (schema.prisma)](#database-schema-schema-prisma)
8. [Middleware](#middleware)

## Overview

This application provides a platform for Admins, Mentors, and Students to interact and manage educational content. Each user role has specific functionalities and access levels. The login and signup processes are designed to ensure secure access to the application.

## User Roles and Credentials

### Admin

- **Credentials Saved**:
  - Email
  - Password (hashed)
  - Admin Auth Token (for session management)

### Mentor

- **Credentials Saved**:
  - Email
  - Password (hashed)
  - Mentor Auth Token (for session management)

### Student

- **Credentials Saved**:
  - Email
  - Password (hashed)
  - Student Auth Token (for session management)

## Login and Signup Process

### Admin Login and Signup

1. **Signup**:
   - Admins can sign up by providing their email and password.
   - Upon successful signup, an admin auth token is generated and stored in cookies.

2. **Login**:
   - Admins log in using their email and password.
   - If the credentials are valid, an admin auth token is generated and stored in cookies.
   - If the credentials are invalid, an error message is displayed.

### Mentor Login and Signup

1. **Signup**:
   - Mentors can sign up by providing their email and password.
   - Upon successful signup, a mentor auth token is generated and stored in cookies.

2. **Login**:
   - Mentors log in using their email and password.
   - If the credentials are valid, a mentor auth token is generated and stored in cookies.
   - If the credentials are invalid, an error message is displayed.

### Student Login and Signup

1. **Signup**:
   - Students can sign up by providing their email and password.
   - Upon successful signup, a student auth token is generated and stored in cookies.

2. **Login**:
   - Students log in using their email and password.
   - If the credentials are valid, a student auth token is generated and stored in cookies.
   - If the credentials are invalid, an error message is displayed.

## Admin Dashboard

The Admin Dashboard is accessible only to authenticated Admin users. It provides functionalities such as:

- Managing users (Mentors and Students)
- Viewing analytics and reports
- Configuring application settings

### Middleware for Admin Dashboard

The middleware checks for the presence of an `admin_auth_token` cookie. If the token is not present, the user is redirected to the admin login page.

```javascript
if (path.startsWith('/admin') && !path.includes('/admin/login')) {
  const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
  if (!adminAuthToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}
```

## Mentor Page

The Mentor Page is accessible only to authenticated Mentor users. It provides functionalities such as:

- Managing classes and students
- Viewing student progress
- Accessing educational resources

### Middleware for Mentor Page

The middleware checks for the presence of a `mentor_auth_token` cookie. If the token is not present, the user is redirected to the mentor login page.

```javascript
if (path.startsWith('/mentor') && !path.includes('/mentor/login')) {
  const mentorAuthToken = request.cookies.get('mentor_auth_token')?.value;
  if (!mentorAuthToken) {
    return NextResponse.redirect(new URL('/mentor/login', request.url));
  }
}
```

## Layout Files

Layout files are used to define the structure and design of the application. They typically include:

- Header and footer components
- Navigation menus
- Responsive design elements

These files ensure a consistent look and feel across different pages of the application.

## Database Schema (schema.prisma)

The `schema.prisma` file defines the database structure for the application. It includes models for Admins, Mentors, and Students, with fields for storing user credentials and other relevant information.

Example schema for a User model:

```prisma
model User {
  id                Int      @id @default(autoincrement())
  email             String   @unique
  password          String
  role              String   // 'admin', 'mentor', 'student'
  authToken         String?
}
```

## Middleware

The middleware is responsible for handling authentication and authorization for different user roles. It checks for the presence of authentication tokens in cookies and redirects users to the appropriate login pages if they are not authenticated.

### Middleware Implementation

The middleware checks the request path and verifies the corresponding auth token:

```javascript
export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Admin authentication
  if (path.startsWith('/admin') && !path.includes('/admin/login')) {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
    if (!adminAuthToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Mentor authentication
  if (path.startsWith('/mentor') && !path.includes('/mentor/login')) {
    const mentorAuthToken = request.cookies.get('mentor_auth_token')?.value;
    if (!mentorAuthToken) {
      return NextResponse.redirect(new URL('/mentor/login', request.url));
    }
  }

  // Student authentication
  if (path.startsWith('/dashboard') || path.startsWith('/home')) {
    const studentAuthToken = request.cookies.get('student_auth_token')?.value;
    if (!studentAuthToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
```

## Conclusion

This documentation provides a comprehensive overview of the login and signup processes for Admins, Mentors, and Students. It also covers the relevant components of the application, including the admin dashboard, mentor page, layout files, database schema, and middleware. For further details, please refer to the code in the GitHub repository.