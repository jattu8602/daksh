# Student Dashboard Guide (`/dashboard`)

This guide explains the features and structure of the **Student Dashboard** in Daksh, accessible at `/dashboard`. The dashboard is the main hub for students to access learning resources, track progress, and manage their profile.

---

## How to Access

- After logging in as a student, you are redirected to `/dashboard` (which further redirects to `/dashboard/home`).

---

## Main Sections

The dashboard is organized into several key sections, accessible via the bottom navigation bar:

### 1. Home (`/dashboard/home`)
- Personalized feed with updates, announcements, and quick links.
- Shows recent activity, notifications, and recommended content.

### 2. Explore (`/dashboard/explore`)
- Browse educational content: videos, posts, playlists, NCERT books, and documents.
- Search and discover new learning materials.

### 3. Learn (`/dashboard/learn`)
- Access your assigned courses, lessons, and learning statistics.
- Track your progress and view rewards.

### 4. Reels (`/dashboard/reels`)
- Watch short educational videos and interact with the community.

### 5. Profile (`/dashboard/profile`)
- View and edit your profile information.
- Access settings, language preferences, reminders, and contact support.

---

## Navigation

- The bottom navigation bar provides quick access to all main sections.
- Profile image is always visible for easy access to your profile.

---

## Authentication & Security

- Only authenticated students can access the dashboard.
- If not authenticated, you will be redirected to the login page.
- Session is managed securely and cached for a smooth experience.

---

## Related Files

- [`app/dashboard/layout.js`](../app/dashboard/layout.js) — Handles layout, navigation, and authentication.
- [`app/dashboard/page.jsx`](../app/dashboard/page.jsx) — Redirects to `/dashboard/home`.
- [`app/dashboard/home/page.jsx`](../app/dashboard/home/page.jsx) — Home section.
- [`app/dashboard/explore/page.jsx`](../app/dashboard/explore/page.jsx) — Explore section.
- [`app/dashboard/learn/page.jsx`](../app/dashboard/learn/page.jsx) — Learn section.
- [`app/dashboard/reels/page.jsx`](../app/dashboard/reels/page.jsx) — Reels section.
- [`app/dashboard/profile/page.jsx`](../app/dashboard/profile/page.jsx) — Profile section.

---

## Tips

- Use the navigation bar to quickly switch between sections.
- Keep your profile updated for personalized recommendations.
- Explore all sections to make the most of the platform’s resources.

---

**For more details, see the codebase and explore each section in the dashboard.**