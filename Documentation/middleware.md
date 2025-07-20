# Documentation for Login and Signup Process

This documentation provides a comprehensive overview of the login and signup processes for mentors, students, and admins in the application. It covers the necessary credentials, the structure of the admin dashboard, mentor pages, layout files, the Prisma schema, and middleware configurations.

## Table of Contents

1. [Overview](#overview)
2. [User Roles and Credentials](#user-roles-and-credentials)
   - [Admin](#admin)
   - [Mentor](#mentor)
   - [Student](#student)
3. [Login and Signup Process](#login-and-signup-process)
   - [Admin Login/Signup](#admin-loginsignup)
   - [Mentor Login/Signup](#mentor-loginsignup)
   - [Student Login/Signup](#student-loginsignup)
4. [Admin Dashboard](#admin-dashboard)
5. [Mentor Page](#mentor-page)
6. [Layout Files](#layout-files)
7. [Schema.prisma](#schemaprisma)
8. [Middleware.js](#middlewarejs)

---

## Overview

The application supports three types of users: Admins, Mentors, and Students. Each user type has a specific login and signup process, with unique credentials stored in the database. The middleware ensures that only authenticated users can access their respective dashboards.

## User Roles and Credentials

### Admin

- **Credentials:**
  - Email: Unique identifier for the admin.
  - Password: Secure password for authentication.
  
- **Access Level:**
  - Full access to the admin dashboard, including user management and analytics.

### Mentor

- **Credentials:**
  - Email: Unique identifier for the mentor.
  - Password: Secure password for authentication.
  
- **Access Level:**
  - Access to the mentor dashboard, where they can manage their classes and students.

### Student

- **Credentials:**
  - Email: Unique identifier for the student.
  - Password: Secure password for authentication.
  
- **Access Level:**
  - Access to the student dashboard, where they can view courses, assignments, and personal progress.

## Login and Signup Process

### Admin Login/Signup

1. **Signup:**
   - Admins can create an account by providing their email and password.
   - The credentials are validated and stored in the database.

2. **Login:**
   - Admins enter their email and password.
   - The application checks the credentials against the database.
   - If valid, the admin is redirected to the admin dashboard; otherwise, an error message is displayed.

### Mentor Login/Signup

1. **Signup:**
   - Mentors can sign up by providing their email and password.
   - The application validates the input and stores the credentials in the database.

2. **Login:**
   - Mentors enter their email and password.
   - The application verifies the credentials.
   - If valid, the mentor is redirected to the mentor dashboard; otherwise, an error message is displayed.

### Student Login/Signup

1. **Signup:**
   - Students can create an account by providing their email and password.
   - The application validates the input and stores the credentials in the database.

2. **Login:**
   - Students enter their email and password.
   - The application checks the credentials.
   - If valid, the student is redirected to the student dashboard; otherwise, an error message is displayed.

## Admin Dashboard

The admin dashboard provides a comprehensive interface for managing users, viewing analytics, and overseeing the overall application. Key features include:

- User management (view, edit, delete users)
- Analytics dashboard (user statistics, engagement metrics)
- Settings for application configuration

## Mentor Page

The mentor page allows mentors to manage their classes and students. Key features include:

- Class management (create, edit, delete classes)
- Student management (view student progress, assign tasks)
- Communication tools for interacting with students

## Layout Files

The layout files define the structure and design of the application. They include:

- **Header:** Navigation links for different user roles.
- **Footer:** Contact information and links to policies.
- **Main Content Area:** Dynamic content based on the user role.

## Schema.prisma

The `schema.prisma` file defines the database schema for the application. Key models include:

```prisma
model Admin {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
}

model Mentor {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
}

model Student {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
}
```

## Middleware.js

The `middleware.js` file handles authentication and authorization for different user roles. Key functionalities include:

- **Admin Authentication:**
  - Checks for the presence of an `admin_auth_token` cookie.
  - Redirects to the admin login page if not authenticated.

- **Mentor Authentication:**
  - Checks for the presence of a `mentor_auth_token` cookie.
  - Redirects to the mentor login page if not authenticated.

- **Student Authentication:**
  - Checks for the presence of a `student_auth_token` cookie.
  - Redirects to the student login page if not authenticated.

### Example Middleware Code

```javascript
export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && !path.includes('/admin/login')) {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
    if (!adminAuthToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Similar checks for Mentor and Student
  return NextResponse.next();
}
```

---

This documentation should provide a clear understanding of the login and signup processes for all user roles, as well as the structure and functionality of the application. For further details, please refer to the codebase in the GitHub repository.