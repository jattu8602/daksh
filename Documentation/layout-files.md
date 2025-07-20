# Documentation for Login and Signup Process

This documentation outlines the login and signup processes for three types of users in the application: Admins, Mentors, and Students. It also covers the relevant components, including the admin dashboard, mentor page, layout files, `schema.prisma`, and `middleware.js`. This guide is designed to be clear and comprehensive for anyone accessing the GitHub repository.

## Table of Contents

1. [User Types](#user-types)
   - [Admins](#admins)
   - [Mentors](#mentors)
   - [Students](#students)
2. [Credentials Saved for Each User](#credentials-saved-for-each-user)
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
8. [Schema.prisma](#schema.prisma)
9. [Middleware.js](#middleware.js)

---

## User Types

### Admins
Admins have full access to the application, including user management, content moderation, and analytics. They can log in to the admin dashboard to manage the platform.

### Mentors
Mentors can create and manage courses, interact with students, and track their progress. They have access to a dedicated mentor page.

### Students
Students can enroll in courses, interact with mentors, and track their learning progress. They have access to a student dashboard.

## Credentials Saved for Each User

### Admin
- **Username**: Unique identifier for the admin.
- **Password**: Hashed password for authentication.
- **Email**: Contact email for the admin.

### Mentor
- **Username**: Unique identifier for the mentor.
- **Password**: Hashed password for authentication.
- **Email**: Contact email for the mentor.
- **Profile Information**: Includes bio, expertise, and courses offered.

### Student
- **Username**: Unique identifier for the student.
- **Password**: Hashed password for authentication.
- **Email**: Contact email for the student.
- **Profile Information**: Includes name, age, and enrolled courses.

## Login Process

### Admin Login
1. Navigate to `/admin/login`.
2. Enter the admin username and password.
3. If the credentials are valid, the admin is redirected to the admin dashboard. If invalid, an error message is displayed.

### Mentor Login
1. Navigate to `/mentor/login`.
2. Enter the mentor username and password.
3. If the credentials are valid, the mentor is redirected to the mentor page. If invalid, an error message is displayed.

### Student Login
1. Navigate to `/`.
2. Enter the student username and password.
3. If the credentials are valid, the student is redirected to the student dashboard. If invalid, an error message is displayed.

## Signup Process

### Admin Signup
1. Navigate to `/admin/signup`.
2. Fill in the required fields: username, password, and email.
3. Submit the form to create a new admin account.

### Mentor Signup
1. Navigate to `/mentor/signup`.
2. Fill in the required fields: username, password, email, and profile information.
3. Submit the form to create a new mentor account.

### Student Signup
1. Navigate to `/signup`.
2. Fill in the required fields: username, password, email, and profile information.
3. Submit the form to create a new student account.

## Admin Dashboard
The admin dashboard provides a comprehensive view of user management, content moderation, and analytics. Admins can:
- View and manage all users (admins, mentors, students).
- Access reports and analytics on user engagement.
- Moderate content and manage courses.

## Mentor Page
The mentor page allows mentors to:
- Create and manage courses.
- Interact with students through messaging or forums.
- Track student progress and provide feedback.

## Layout Files
Layout files define the structure and design of the application. They typically include:
- Header and footer components.
- Navigation menus for different user types.
- Responsive design elements for mobile and desktop views.

## Schema.prisma
The `schema.prisma` file defines the database schema for the application. It includes models for:
- **Admin**: Contains fields for username, password, and email.
- **Mentor**: Contains fields for username, password, email, and profile information.
- **Student**: Contains fields for username, password, email, and profile information.

Example:
```prisma
model Admin {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  email    String @unique
}

model Mentor {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  email    String @unique
  bio      String?
  expertise String?
}

model Student {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  email    String @unique
  name     String?
  age      Int?
}
```

## Middleware.js
The `middleware.js` file handles authentication and authorization for different user types. It checks for authentication tokens in cookies and redirects users to the appropriate login pages if they are not authenticated.

### Key Features:
- Checks for `admin_auth_token`, `mentor_auth_token`, and `student_auth_token` based on the requested path.
- Redirects unauthenticated users to their respective login pages.
- Allows requests with `multipart/form-data` content type to proceed without authentication checks.

### Example:
```javascript
export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && !path.includes('/admin/login')) {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value;
    if (!adminAuthToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  // Additional checks for mentors and students...
}
```

---

This documentation provides a comprehensive overview of the login and signup processes for admins, mentors, and students, along with the relevant components of the application. For further details, please refer to the code in the GitHub repository.