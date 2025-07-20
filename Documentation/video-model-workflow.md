# Video Model Workflow

This guide explains the complete workflow for handling videos in the application, including how videos are scraped, uploaded, processed, and stored in the database using the `Video` model. It is intended for developers and contributors to understand the video pipeline and its integration with other parts of the system.

---

## Table of Contents

1. [Overview](#overview)
2. [Video Sources](#video-sources)
3. [Video Scraping and Uploading](#video-scraping-and-uploading)
4. [Video Model Structure](#video-model-structure)
5. [Saving Videos to the Database](#saving-videos-to-the-database)
6. [Video Assignment and Tagging](#video-assignment-and-tagging)
7. [Admin Dashboard Integration](#admin-dashboard-integration)
8. [Related Files and References](#related-files-and-references)

---

## Overview

The application supports uploading and managing videos from multiple sources. All videos, regardless of their origin, are normalized and stored in the database using the `Video` model. This enables consistent management, assignment, and display of video content across the platform.

---

## Video Sources

Videos can be added to the platform from the following sources:

- **YouTube**: By providing a video or channel URL.
- **Instagram**: By providing a post or reel URL.
- **Pinterest**: By providing a pin URL.
- **Manual Upload**: By uploading video or image files directly.

---

## Video Scraping and Uploading

### 1. Scraping from External Platforms

- **YouTube**: The backend fetches video metadata (title, description, thumbnail, etc.) using the YouTube API or a custom scraper. Admins can fetch a single video or all shorts from a channel.
- **Instagram/Pinterest**: The backend processes the provided URL, downloads the media, and extracts metadata.
- **Progress Feedback**: The admin dashboard shows real-time progress for scraping jobs.

### 2. Manual Upload

- Admins can upload video or image files directly from their device.
- Metadata can be entered or generated using AI tools (for meta description and hashtags).

### 3. Post-Processing

- After fetching/uploading, admins can edit video details, generate meta descriptions, and add hashtags.
- Videos can be assigned to mentors for review or distribution.

---

## Video Model Structure

The `Video` model in the Prisma schema defines how videos are stored in the database. Below is a representative structure (see your actual `schema.prisma` for details):

```prisma
model Video {
  id              String            @id @default(auto()) @map("_id") @db.ObjectId
  title           String
  description     String
  source          String
  sourcePlatform  String // 'youtube', 'instagram', 'pinterest', 'manual'
  url             String
  mediaType       String            @default("video") // 'video' or 'image'
  metaDescription String?
  videoHashtags   VideoHashtag[]
  assignments     VideoAssignment[]
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}
```

**Key Fields:**
- `title`: Video title.
- `description`: Video description.
- `source`: Original source URL or identifier.
- `sourcePlatform`: Platform name (`youtube`, `instagram`, `pinterest`, `manual`).
- `url`: Direct link to the video or image file.
- `mediaType`: Either `video` or `image`.
- `metaDescription`: AI-generated or manually written meta description.
- `videoHashtags`: Related hashtags for the video.
- `assignments`: Mentor assignments for the video.

---

## Saving Videos to the Database

1. **Metadata Extraction**: When a video is scraped or uploaded, its metadata is extracted or entered by the admin.
2. **Normalization**: All videos are normalized to fit the `Video` model structure.
3. **Database Save**: The video record is created in the database, including all relevant fields and relationships (hashtags, assignments, etc.).
4. **Assignment**: Videos can be assigned to mentors for further review or distribution.

---

## Video Assignment and Tagging

- **Hashtags**: Videos can be tagged with hashtags for better discoverability. These are stored in the `VideoHashtag` model and linked to the video.
- **Assignments**: Videos can be assigned to mentors using the `VideoAssignment` model, enabling workflow management and tracking.

---

## Admin Dashboard Integration

- The admin dashboard provides interfaces for:
  - Scraping/uploading videos from various sources.
  - Editing video metadata and generating AI-powered descriptions/hashtags.
  - Assigning videos to mentors.
  - Viewing and managing all uploaded videos.

- See [`app/admin/content/page.jsx`](../app/admin/content/page.jsx) and related files for the UI logic.

---

## Related Files and References

- **Prisma Schema**: [`prisma/schema.prisma`](../prisma/schema.prisma)
- **Admin Content Pages**:
  - [`app/admin/content/page.jsx`](../app/admin/content/page.jsx)
  - [`app/admin/content/youtube/page.jsx`](../app/admin/content/youtube/page.jsx)
  - [`app/admin/content/instagram/page.jsx`](../app/admin/content/instagram/page.jsx)
  - [`app/admin/content/manual/page.jsx`](../app/admin/content/manual/page.jsx)
  - [`app/admin/content/pinterest/page.jsx`](../app/admin/content/pinterest/page.jsx)
- **Video Assignment and Tagging**: See `VideoAssignment` and `VideoHashtag` models in the schema.

---

## Summary

The video model workflow ensures that all video content, regardless of source, is consistently processed, enriched, and stored in the database. This enables robust management, assignment, and discovery of video resources throughout the platform.

For further details, refer to the codebase and schema files linked above.