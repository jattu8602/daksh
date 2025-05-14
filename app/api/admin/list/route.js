import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        admin: {
          select: {
            email: true,
          },
        },
      },
    });

    // Flatten the email field for easier frontend use
    const formattedAdmins = admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      username: admin.username,
      role: admin.role,
      email: admin.admin?.email || "",
    }));

    return NextResponse.json({ admins: formattedAdmins });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}