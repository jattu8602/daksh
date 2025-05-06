import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { generateQRCode } from "@/lib/qrcode";

// POST /api/seed - Seed the database with initial data
export async function POST() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (existingSuperAdmin) {
      return NextResponse.json({
        message: "Super admin already exists",
        success: false,
      });
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      return NextResponse.json(
        {
          error: "Super admin credentials not configured",
          message: "Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD environment variables",
        },
        { status: 500 }
      );
    }

    // Generate QR code for super admin
    const qrData = JSON.stringify({
      username: "superadmin",
      role: UserRole.SUPER_ADMIN,
    });
    const qrCode = await generateQRCode(qrData);

    // Create super admin user
    const superAdmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        username: "superadmin",
        password: superAdminPassword,
        role: UserRole.SUPER_ADMIN,
        qrCode,
        admin: {
          create: {
            email: superAdminEmail,
          },
        },
      },
    });

    // Remove password from response
    const { password, ...superAdminData } = superAdmin;

    return NextResponse.json({
      message: "Database seeded successfully",
      superAdmin: superAdminData,
      success: true,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  }
}