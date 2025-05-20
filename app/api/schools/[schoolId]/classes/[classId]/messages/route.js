import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { classId } = params;
  try {
    const messages = await prisma.message.findMany({
      where: { classId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            username: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { classId } = params;
  try {
    const { senderId, text } = await request.json();
    if (!senderId || !text) {
      return NextResponse.json({ success: false, error: "senderId and text are required" }, { status: 400 });
    }

    // Verify that the sender belongs to this class
    const student = await prisma.student.findUnique({
      where: { id: senderId },
      select: { classId: true }
    });

    if (!student) {
      return NextResponse.json({ success: false, error: "Invalid student ID" }, { status: 400 });
    }

    if (student.classId !== classId) {
      return NextResponse.json({ success: false, error: "Student does not belong to this class" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        classId,
        senderId,
        text,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}