# How Classes Are Created (Admin Panel Guide)

This guide explains how to create new classes (global class templates) in the Daksh admin panel. Classes are the foundation for organizing boards, subjects, and educational content across all schools.

---

## Steps to Create a New Class

### 1. Navigate to the Classes Section

- Go to the **Admin Dashboard**.
- Click on **Classes** in the sidebar.
- You will see a list of existing global class templates.

### 2. Open the "Add New Class" Dialog

- Click the **"Add New Class"** button.
- A dialog/modal will appear with a form to enter class details.

### 3. Fill Out the Class Details

- **Class Name**: Enter the name of the class (e.g., "11th Class", "Pre-K", etc.).
- This name will be used as a template for all schools.

### 4. Submit the Form

- Click the **"Create Global Template"** button.
- The system will send a POST request to `/api/classes` with the class name.

### 5. Backend Processing

- The backend creates a new class record in the database.
- The new class appears instantly in the classes list.

### 6. Next Steps

- After creating a class, you can click on it to:
  - Add boards (e.g., NCERT, CBSE, ICSE)
  - Add subjects to each board
  - Assign mentors and upload content

---

## What Data Is Saved?

- **Class Name** (required)
- **ID** (auto-generated)
- **Timestamps** (createdAt, updatedAt)

---

## Related Files

- [`app/admin/class/page.jsx`](../app/admin/class/page.jsx) — UI for managing classes
- [`/api/classes`](../pages/api/classes.js) — API endpoint for class creation
- [`prisma/schema.prisma`](../prisma/schema.prisma) — Database schema

---

## Example: Creating a Class

1. Click **Add New Class**.
2. Enter: `11th Class`
3. Click **Create Global Template**.
4. The new class appears in the list and is ready for boards and subjects.

---

**Tip:**
Global class templates are inherited by all schools, making it easy to standardize boards and subjects across your platform.