# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three user roles: Admins, Mentors, and Students. It also provides details about the relevant components, including the admin dashboard, mentor page, layout files, database schema (schema.prisma), and middleware.js for authentication.

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
7. [Database Schema (schema.prisma)](#database-schema-schema.prisma)
8. [Middleware.js](#middleware.js)

---

## User Roles Overview

- **Admin**: Manages the entire application, including user management and content moderation.
- **Mentor**: Provides guidance and support to students, manages their classes, and tracks student progress.
- **Student**: Engages with the platform to learn, attend classes, and interact with mentors.

---

## Login and Signup Process

### Admin Login and Signup

- **Login**: Admins can log in using their credentials (email and password). Upon successful login, they are redirected to the admin dashboard.
- **Signup**: Admins can create an account by providing their email, password, and other required information. After signup, they receive a confirmation email.

### Mentor Login and Signup

- **Login**: Mentors log in using their email and password. Successful login redirects them to the mentor dashboard.
- **Signup**: Mentors can sign up by filling out a registration form with their details, including name, email, password, and expertise. A confirmation email is sent upon successful signup.

### Student Login and Signup

- **Login**: Students log in using their email and password. Successful login redirects them to their dashboard.
- **Signup**: Students can create an account by providing their name, email, password, and other necessary information. A confirmation email is sent after signup.

---

## Credentials Saved for Each User

### Admin Credentials
- **Email**: Unique identifier for the admin.
- **Password**: Hashed password for authentication.
- **Role**: Set to "admin".

### Mentor Credentials
- **Email**: Unique identifier for the mentor.
- **Password**: Hashed password for authentication.
- **Name**: Full name of the mentor.
- **Expertise**: Areas of expertise or subjects taught.

### Student Credentials
- **Email**: Unique identifier for the student.
- **Password**: Hashed password for authentication.
- **Name**: Full name of the student.
- **Profile Information**: Additional details like age, interests, etc.

---

## Admin Dashboard

The admin dashboard provides a comprehensive interface for managing users, content, and application settings. Key features include:

- User management (view, edit, delete users)
- Content moderation (approve or reject content submissions)
- Analytics and reporting tools

### Authentication Middleware

The middleware.js file ensures that only authenticated admins can access the dashboard. If an admin tries to access the dashboard without a valid authentication token, they are redirected to the login page.

---

## Mentor Page

The mentor page allows mentors to manage their classes, track student progress, and communicate with students. Key features include:

- Class management (create, edit, delete classes)
- Student tracking (view student performance and attendance)
- Communication tools (message students directly)

### Authentication Middleware

Similar to the admin dashboard, the middleware.js file restricts access to the mentor page for authenticated mentors only.

---

## Layout Files

Layout files define the structure and design of the application. They typically include:

- Header and footer components
- Navigation menus for different user roles
- Responsive design elements for mobile and desktop views

---

## Database Schema (schema.prisma)

The schema.prisma file defines the database structure for the application. Key models include:

```prisma
model Admin {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  role      String  @default("admin")
}

model Mentor {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  name      String
  expertise String
}

model Student {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  name      String
  profile   Json?
}
```

---

## Middleware.js

The middleware.js file is responsible for handling authentication and authorization for different user roles. It checks for authentication tokens in cookies and redirects users to the appropriate login pages if they are not authenticated.

### Key Features

- **Admin Authentication**: Redirects unauthenticated admins to the login page.
- **Mentor Authentication**: Redirects unauthenticated mentors to the login page.
- **Student Authentication**: Redirects unauthenticated students to the main login page.

### Example Code

```javascript
export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && !path.includes('/admin/login')) {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
    if (!adminAuthToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Similar checks for mentors and students...
}
```

---

This documentation provides a comprehensive overview of the login and signup processes for admins, mentors, and students, along with the relevant components and configurations in the application. For further details, please refer to the codebase in the GitHub repository.