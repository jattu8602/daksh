import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import nodemailer from 'nodemailer'

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
    },
  })
}

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

    // Send email using Nodemailer
    try {
      console.log('Attempting to send email via Gmail to:', email)
      console.log('Gmail credentials configured:', {
        user: !!process.env.GMAIL_USER,
        pass: !!process.env.GMAIL_APP_PASSWORD,
      })

      const transporter = createTransporter()

      const mailOptions = {
        from: `"Daksh Admin Panel" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Email Verification - Daksh Admin Panel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0; font-size: 28px;">🛡️ Daksh Admin</h1>
                <p style="color: #666; margin: 10px 0 0 0;">Email Verification</p>
              </div>

              <h2 style="color: #333; margin-bottom: 20px;">Hello ${admin.user.name}!</h2>

              <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
                You requested to verify your email address for your Daksh Admin account.
                Please use the verification code below:
              </p>

              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; border-radius: 10px; margin: 30px 0;">
                <div style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                  ${otp}
                </div>
              </div>

              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  ⏰ This code will expire in <strong>10 minutes</strong>
                </p>
              </div>

              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request this verification, please ignore this email or contact support if you're concerned about your account security.
              </p>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

              <div style="text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  This email was sent from Daksh Admin Panel<br>
                  Please do not reply to this email
                </p>
              </div>
            </div>
          </div>
        `,
      }

      const result = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully via Gmail:', result.messageId)

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to your email',
      })
    } catch (emailError) {
      console.error('Detailed Gmail error:', {
        message: emailError.message,
        code: emailError.code,
        stack: emailError.stack,
      })

      return NextResponse.json(
        {
          error: 'Failed to send OTP email',
          details: emailError.message,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

// Verify OTP (same as the original)
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
