import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP to email
export async function POST(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
      include: { user: true },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    await prisma.emailVerification.create({
      data: {
        email,
        otp,
        userId: admin.userId,
        expiresAt,
      },
    })

    // Send email using Resend
    try {
      await resend.emails.send({
        from: 'noreply@daksh.edu', // Use your verified domain
        to: email,
        subject: 'Email Verification - Daksh Admin Panel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Hello ${admin.user.name},</p>
            <p>Your email verification code is:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from Daksh Admin Panel. Please do not reply to this email.
            </p>
          </div>
        `,
      })

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to your email',
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

// Verify OTP
export async function PUT(request) {
  try {
    const adminAuthToken = request.cookies.get('admin_auth_token')?.value

    if (!adminAuthToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { userId: adminAuthToken },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Find valid OTP
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        otp,
        userId: admin.userId,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    })

    // Update admin email as verified
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        email,
        emailVerified: true,
        lastActiveAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
