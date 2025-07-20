# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three types of users in the application: Admins, Mentors, and Students. It also covers the relevant components, including the admin dashboard, mentor page, layout files, `schema.prisma`, and `middleware.js`. This guide is designed to be comprehensive and easy to understand for anyone accessing the GitHub repository.

## Table of Contents

1. [User Types](#user-types)
   - [Admins](#admins)
   - [Mentors](#mentors)
   - [Students](#students)
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
9. [Middleware.js](#middleware.js)

---

## User Types

### Admins
Admins have full access to the application, including user management, content moderation, and analytics. They can log in to the admin dashboard to manage the platform.

### Mentors
Mentors can create and manage courses, interact with students, and track their progress. They have access to a dedicated mentor page.

### Students
Students can enroll in courses, track their learning progress, and interact with mentors. They have access to a student dashboard.

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
   - On success: Set `admin_auth_token` in cookies and redirect to `/admin/dashboard`.
   - On failure: Return an error message.

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
   - On success: Set `mentor_auth_token` in cookies and redirect to `/mentor/dashboard`.
   - On failure: Return an error message.

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
   - On success: Set `student_auth_token` in cookies and redirect to `/dashboard`.
   - On failure: Return an error message.

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
   - On success: Create admin account and redirect to `/admin/login`.
   - On failure: Return an error message.

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
   - On success: Create mentor account and redirect to `/mentor/login`.
   - On failure: Return an error message.

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
   - On success: Create student account and redirect to `/login`.
   - On failure: Return an error message.

---

## Credentials Saved

### Admin
- **Username**: Unique identifier for the admin.
- **Password**: Hashed password for authentication.
- **Email**: Contact email for the admin.

### Mentor
- **Name**: Full name of the mentor.
- **Email**: Unique email address for the mentor.
- **Password**: Hashed password for authentication.

### Student
- **Name**: Full name of the student.
- **Email**: Unique email address for the student.
- **Password**: Hashed password for authentication.

---

## Admin Dashboard
The admin dashboard provides a comprehensive interface for managing users, content, and analytics. Admins can view statistics, manage mentor and student accounts, and moderate content.

---

## Mentor Page
The mentor page allows mentors to create and manage courses, view student progress, and interact with students. It provides tools for effective teaching and communication.

---

## Layout Files
Layout files define the structure and design of the application. They include components such as headers, footers, and navigation bars, ensuring a consistent user experience across different pages.

---

## Schema.prisma
The `schema.prisma` file defines the database schema for the application. It includes models for Admin, Mentor, and Student, specifying the fields and relationships between them. Here’s a simplified example:

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

## Middleware.js
The `middleware.js` file handles authentication for different user types. It checks for authentication tokens in cookies and redirects users to the appropriate login pages if they are not authenticated. The middleware is configured to match specific paths for Admin, Mentor, and Student dashboards.

### Key Functions:
- **Admin Authentication**: Checks for `admin_auth_token` for admin routes.
- **Mentor Authentication**: Checks for `mentor_auth_token` for mentor routes.
- **Student Authentication**: Checks for `student_auth_token` for student routes.

### Example Code:
```javascript
export function middleware(request) {
  // Authentication checks for Admin, Mentor, and Student
  // Redirects to login if not authenticated
}
```

---

This documentation provides a comprehensive overview of the login and signup processes, user types, and the relevant components of the application. For further details, please refer to the codebase in the GitHub repository.