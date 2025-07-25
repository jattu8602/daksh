import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    console.log('Search query:', query);

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ users: [] });
    }

    const searchTerm = query.trim().toLowerCase();
    console.log('Search term:', searchTerm);

    // First, let's get all users to see what we have
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        profileImage: true,
        mentor: {
          select: {
            tag: true,
            isOrganic: true
          }
        },
        student: {
          select: {
            class: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 20
    });

    console.log('All users found:', allUsers.map(u => ({ id: u.id, username: u.username, name: u.name })));

    // Filter users based on search term
    const users = allUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm)
    );

    console.log('Found users:', users.length);
    console.log('Users:', users.map(u => ({ id: u.id, username: u.username, name: u.name })));

    // Format the response
    const formattedUsers = users.map(user => {
      let tag = 'user';
      let tagColor = 'bg-gray-100 text-gray-800';

      if (user.mentor) {
        tag = user.mentor.isOrganic ? 'mentor' : 'daksh';
        tagColor = user.mentor.isOrganic ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
      } else if (user.student) {
        tag = 'student';
        tagColor = 'bg-green-100 text-green-800';
      }

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.profileImage || '/placeholder.svg',
        tag,
        tagColor,
        class: user.student?.class?.name
      };
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}