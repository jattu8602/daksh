# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for mentors, students, and admins in the application. It also provides details on the admin dashboard, mentor page, layout files, `schema.prisma`, and `middleware.js`. This guide is intended for developers and contributors accessing the GitHub repository.

## Table of Contents

1. [Overview](#overview)
2. [User Roles and Credentials](#user-roles-and-credentials)
   - [Admin](#admin)
   - [Mentor](#mentor)
   - [Student](#student)
3. [Login Process](#login-process)
   - [Admin Login](#admin-login)
   - [Mentor Login](#mentor-login)
   - [Student Login](#student-login)
4. [Signup Process](#signup-process)
   - [Admin Signup](#admin-signup)
   - [Mentor Signup](#mentor-signup)
   - [Student Signup](#student-signup)
5. [Admin Dashboard](#admin-dashboard)
6. [Mentor Page](#mentor-page)
7. [Layout Files](#layout-files)
8. [Schema Definition](#schema-definition)
9. [Middleware](#middleware)

---

## Overview

The application supports three types of users: Admins, Mentors, and Students. Each user type has its own login and signup processes, which are secured through authentication tokens stored in cookies. The middleware ensures that only authenticated users can access specific routes.

## User Roles and Credentials

### Admin

- **Credentials Saved**:
  - `admin_auth_token`: A token used for authenticating admin users.
  - Other relevant admin details (e.g., email, password) are stored in the database.

### Mentor

- **Credentials Saved**:
  - `mentor_auth_token`: A token used for authenticating mentor users.
  - Other relevant mentor details (e.g., email, password, subject expertise) are stored in the database.

### Student

- **Credentials Saved**:
  - `student_auth_token`: A token used for authenticating student users.
  - Other relevant student details (e.g., email, password, enrolled classes) are stored in the database.

## Login Process

### Admin Login

1. **Endpoint**: `/admin/login`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "email": "admin@example.com",
     "password": "yourpassword"
   }
   ```
4. **Response**:
   - On success: Returns an `admin_auth_token` in a cookie.
   - On failure: Returns an error message.

### Mentor Login

1. **Endpoint**: `/mentor/login`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "email": "mentor@example.com",
     "password": "yourpassword"
   }
   ```
4. **Response**:
   - On success: Returns a `mentor_auth_token` in a cookie.
   - On failure: Returns an error message.

### Student Login

1. **Endpoint**: `/login`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "email": "student@example.com",
     "password": "yourpassword"
   }
   ```
4. **Response**:
   - On success: Returns a `student_auth_token` in a cookie.
   - On failure: Returns an error message.

## Signup Process

### Admin Signup

1. **Endpoint**: `/admin/signup`
2. **Method**: POST
3. **Request Body**:
   ```json
   {
     "email": "admin@example.com",
     "password": "yourpassword"
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
     "email": "mentor@example.com",
     "password": "yourpassword",
     "expertise": "Math"
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
     "email": "student@example.com",
     "password": "yourpassword",
     "class": "10th Grade"
   }
   ```
4. **Response**:
   - On success: Returns a success message.
   - On failure: Returns an error message.

## Admin Dashboard

The admin dashboard is accessible at `/admin`. It allows admins to manage users, view reports, and perform administrative tasks. Access to this dashboard is restricted to authenticated admins only, as enforced by the middleware.

## Mentor Page

The mentor page is accessible at `/mentor`. It provides mentors with tools to manage their classes, view student progress, and communicate with students. Access is restricted to authenticated mentors only.

## Layout Files

Layout files are used to define the structure of the application’s pages. They typically include headers, footers, and navigation elements. Ensure that the layout files are designed to accommodate the different user roles and their respective functionalities.

## Schema Definition

The `schema.prisma` file defines the database schema for the application. It includes models for Admins, Mentors, and Students, along with their relationships and fields. Below is a simplified example:

```prisma
model Admin {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
}

model Mentor {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  expertise String
}

model Student {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  class     String
}
```

## Middleware

The `middleware.js` file is responsible for protecting routes based on user authentication. It checks for the presence of authentication tokens in cookies and redirects users to the login page if they are not authenticated. Below is a summary of the middleware logic:

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

  if (path.startsWith('/mentor')) {
    const mentorAuthToken = request.cookies.get('mentor_auth_token')?.value;
    if (!mentorAuthToken) {
      return NextResponse.redirect(new URL('/mentor/login', request.url));
    }
  }

  if (path.startsWith('/dashboard') || path.startsWith('/home')) {
    const studentAuthToken = request.cookies.get('student_auth_token')?.value;
    if (!studentAuthToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
```

---

This documentation should provide a comprehensive understanding of the login and signup processes, user roles, and the structure of the application. For any further questions or clarifications, please refer to the code comments or reach out to the project maintainers.