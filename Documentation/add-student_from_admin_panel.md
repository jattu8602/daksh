# How to Add a New Student from the Admin Panel

This guide explains how admins can add new students to a class using the Daksh admin dashboard.

---

## Steps to Add a New Student

### 1. Navigate to the Class

- Go to the **Admin Dashboard**.
- Click on **Schools** in the sidebar.
- Select the desired school from the list.
- Click on the class where you want to add the student.

### 2. Open the Add Student Modal

- On the class detail page, click the **"Add Student"** button.
- A modal form will appear for entering student details.

### 3. Fill Out Student Details

- Enter the following information:
  - **Full Name** (required)
  - **Roll Number** (required, unique within the class)
  - (Optional fields may include gender, profile image, etc.)

### 4. Submit the Form

- Click the **"Add"** or **"Submit"** button.
- The system will create a new student and generate login credentials.

### 5. View Credentials

- After successful creation, the modal will display:
  - **Username**
  - **Password** (shown only once for security)
  - **QR Code** (for student login, if applicable)
- Save or print these credentials for the student.

### 6. Student Appears in the List

- The new student will now appear in the class’s student list.

---

## What Happens in the Backend?

- A new **User** record is created with the role `STUDENT`.
- A new **Student** record is linked to the user and the selected class.
- The password is securely hashed.
- A unique username and QR code are generated.
- Credentials are stored securely in the database.

---

## Bulk Import Option

- For adding multiple students at once, use the **Bulk Import** or **Smart Bulk Import** features.
- You can upload an Excel file or fill out a bulk form.

---

## Related Files

- `app/admin/schools/[schoolId]/classes/[classId]/page.jsx` (Class detail page)
- `prisma/schema.prisma` (Database schema)

---

**Tip:**
Always save the credentials after creation, as passwords are only shown once for security reasons.