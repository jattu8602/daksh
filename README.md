# Daksh - Student Learning Platform

Daksh is a progressive web application (PWA) designed for students, mentors, and administrators. It provides a platform for educational institutions to manage students, classes, and learning materials.

## Features

- **Authentication**: Login using username/password or QR codes
- **Role-based Access**: Separate interfaces for students, mentors, administrators, and super admins
- **School Management**: Add and manage schools, classes, and students
- **Student Portal**: Features home feed, learning materials, reels, and profile management
- **Mentor Portal**: Tools for uploading content, chatting with students, and creating reels
- **Admin Dashboard**: Comprehensive management of school data with export capabilities

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/daksh.git
   cd daksh
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.sample` to `.env.local`
   - Update the database connection string and other environment variables

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```



6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/` - Next.js application code
  - `api/` - Backend API routes
  - `admin/` - Admin interface
  - `mentor/` - Mentor interface
  - `(dashboard)/` - Student dashboard
  - `(auth)/` - Authentication pages
- `prisma/` - Database schema and migrations
- `public/` - Static assets
- `lib/` - Shared utility functions

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SUPER_ADMIN_EMAIL` - Default super admin email
- `SUPER_ADMIN_PASSWORD` - Default super admin password

## License

This project is licensed under the MIT License - see the LICENSE file for details.




# Docker Commands
```
docker build -t daksh-app .
docker run -p 3000:3000 --env-file .env daksh-app
```
## docker easy compose
```
docker-compose up
```

## The Image Library (Container Registry)
Right now, your Docker image (daksh-app) lives only on your computer. To use it in the cloud, you need to upload it to a public or private library for images called a Container Registry.
Think of it like publishing a book. You wrote the book (your image), and now you need to put it in a library (a registry) so others (your cloud provider) can check it out.
Popular registries include:
Docker Hub: The default, like a giant public library.
GitHub Packages: Great if your code is already on GitHub.
Amazon ECR, Google Container Registry, Azure Container Registry: These are provided by cloud companies and integrate well with their services.


## Tag and Push Your Image
Once you've created an account with a registry (e.g., Docker Hub), you need to do two things:
Tag your image: Give your image a new name that includes your registry username, so Docker knows where to push it.
```
  # docker tag <local_image_name> <your_registry_username>/<image_name>:<tag>
  ```
```

    docker tag daksh-app your-username/daksh-app:latest
   ```
(You would replace your-username with your actual Docker Hub username).
Push the image: Upload your tagged image to the registry.
```
    # docker tag <local_image_name> <your_registry_username>/<image_name>:<tag>
    docker tag daksh-app your-username/daksh-app:latest
```


## Step 3: Deploy on Your Cloud Provider
This is the final step! The specifics will change depending on your cloud provider (like AWS, Google Cloud, DigitalOcean, etc.), but the main idea is always the same. You'll log into your cloud provider's console and tell it:
"I want to run a new application."
"Here's the address of my image in the library: your-username/daksh-app:latest."
"Here are the secret environment variables it needs to run." (You will copy and paste the contents of your .env file into a secure form in your cloud provider's dashboard).
"Run it on port 3000."
The cloud provider will then go to the registry, pull your image, and run it for you, making it available to the world.
And that's it! You've successfully taken your application from local development to being ready for a cloud deployment using Docker. I hope this "kid-friendly" guide was helpful! Let me know if you have any more questions.










## teleport inside container
```
docker exec -it daksh-app-1 sh
```