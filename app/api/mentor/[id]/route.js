import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const id = await params.id;
  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, username: true },
        },
        videoAssignments: {
          include: {
            video: {
              include: {
                videoHashtags: {
                  include: {
                    hashtag: true
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!mentor) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
    }

    // Group assignments by content type
    const contentByType = {
      videos: [],
      shorts: [],
      post: [],
      highlights: []
    };

    mentor.videoAssignments.forEach(assignment => {
      // Validate content type
      if (!contentByType.hasOwnProperty(assignment.contentType)) {
        console.warn(`Invalid content type: ${assignment.contentType}`);
        return;
      }

      const video = {
        ...assignment.video,
        hashtags: assignment.video.videoHashtags.map(vh => vh.hashtag.tag),
        thumbnailUrl: assignment.video.url.includes('youtube.com') || assignment.video.url.includes('youtu.be')
          ? `https://img.youtube.com/vi/${assignment.video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}/maxresdefault.jpg`
          : null
      };
      contentByType[assignment.contentType].push(video);
    });

    // Add content counts to mentor object
    const mentorWithContent = {
      ...mentor,
      contentCounts: {
        videos: contentByType.videos.length,
        shorts: contentByType.shorts.length,
        post: contentByType.post.length,
        highlights: contentByType.highlights.length
      },
      contentByType
    };

    return NextResponse.json({ mentor: mentorWithContent });
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json({ message: "Failed to fetch mentor" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    // Update mentor fields
    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        profilePhoto: body.profilePhoto,
        tag: body.tag,
        email: body.email,
        bio: body.bio,
        skills: body.skills,
        socialLinks: body.socialLinks,
        subject: body.subject,
        language: body.language,
        reels: body.reels,
        videos: body.videos,
        highlights: body.highlights,
        posts: body.posts,
        isOrganic: body.isOrganic,
      },
      include: { user: true },
    });
    // Update user fields (name, username)
    await prisma.user.update({
      where: { id: mentor.userId },
      data: {
        name: body.name,
        username: body.username,
      },
    });
    // Return updated mentor
    const updatedMentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, username: true },
        },
      },
    });
    return NextResponse.json({ mentor: updatedMentor });
  } catch (error) {
    console.error("Error updating mentor:", error);
    return NextResponse.json({ message: "Failed to update mentor" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    // Find mentor and user
    const mentor = await prisma.mentor.findUnique({ where: { id } });
    if (!mentor) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
    }
    // Delete mentor and user
    await prisma.mentor.delete({ where: { id } });
    await prisma.user.delete({ where: { id: mentor.userId } });
    return NextResponse.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    console.error("Error deleting mentor:", error);
    return NextResponse.json({ message: "Failed to delete mentor" }, { status: 500 });
  }
}