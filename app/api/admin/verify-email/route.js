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

    // Clean up all old/expired OTPs first
    await prisma.emailVerification.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // Expired OTPs
          { verified: true }, // Already verified OTPs
        ],
      },
    })

    // Check for recent OTP requests (rate limiting - max 1 every 30 seconds)
    const recentOTP = await prisma.emailVerification.findFirst({
      where: {
        email,
        userId: admin.userId,
        verified: false,
        createdAt: {
          gt: new Date(Date.now() - 30 * 1000), // Within last 30 seconds
        },
      },
    })

    if (recentOTP) {
      const waitTime = Math.ceil(
        30 - (Date.now() - recentOTP.createdAt.getTime()) / 1000
      )
      return NextResponse.json(
        {
          success: false,
          error: 'Please wait before requesting another OTP',
          details: `You can request a new OTP in ${waitTime} seconds`,
          waitTime,
        },
        { status: 429 }
      )
    }

    // Delete any remaining unverified OTPs for this user/email
    await prisma.emailVerification.deleteMany({
      where: {
        email,
        userId: admin.userId,
        verified: false,
      },
    })

    // Save new OTP to database
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
      console.log('=== EMAIL SENDING DEBUG ===')
      console.log('Attempting to send email to:', email)
      console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)
      console.log('Environment:', process.env.NODE_ENV)
      console.log('Generated OTP:', otp)

      // Determine sender email based on environment and domain setup
      const isProduction = process.env.NODE_ENV === 'production'
      const fromEmail = isProduction
        ? `Daksh Admin <noreply@dakshedu.in>` // Your verified domain
        : `Daksh Admin <onboarding@resend.dev>` // Resend's testing domain for localhost

      console.log('Using from email:', fromEmail)

      const emailData = {
        from: fromEmail,
        to: [email], // Ensure it's an array for better delivery
        subject: '🔐 Email Verification - Daksh Admin Panel',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🛡️ Daksh Admin Panel</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Email Verification Required</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Hello ${admin.user.name}! 👋</h2>

                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                  We received a request to verify your email address for the Daksh Admin Panel. Please use the verification code below:
                </p>

                <!-- OTP Code -->
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0;">
                  <p style="color: white; margin: 0 0 10px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                  <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 6px; display: inline-block;">
                    <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
                  </div>
                </div>

                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 25px 0;">
                  <p style="color: #856404; margin: 0; font-size: 14px;">
                    ⏰ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
                  </p>
                </div>

                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                  If you didn't request this verification, please ignore this email or contact support if you have concerns.
                </p>

                <!-- Support -->
                <div style="background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
                  <p style="color: #666; margin: 0; font-size: 14px;">
                    Need help? Contact us at <a href="mailto:support@dakshedu.in" style="color: #667eea; text-decoration: none;">support@dakshedu.in</a>
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef;">
                <p style="color: #6c757d; margin: 0; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} Daksh Education. All rights reserved.<br>
                  This is an automated message, please do not reply to this email.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
        // Add text version for better deliverability
        text: `
Email Verification - Daksh Admin Panel

Hello ${admin.user.name},

Your email verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this verification, please ignore this email.

© ${new Date().getFullYear()} Daksh Education
        `,
      }

      console.log('Email payload prepared:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
      })

      const result = await resend.emails.send(emailData)

      console.log('✅ Email sent successfully!')
      console.log('Resend Response:', result)
      console.log('Email ID:', result.data?.id)

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully to your email',
        emailId: result.data?.id, // For debugging
        debug: {
          otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Show OTP in dev mode only
          resendId: result.data?.id,
        },
      })
    } catch (emailError) {
      console.error('❌ EMAIL SENDING FAILED!')
      console.error('Error details:', {
        message: emailError.message,
        name: emailError.name,
        stack: emailError.stack,
        response: emailError.response,
        status: emailError.status,
        statusText: emailError.statusText,
      })

      // More detailed error response
      let errorMessage = 'Failed to send OTP email'
      let errorDetails = emailError.message

      if (emailError.message?.includes('API key')) {
        errorMessage = 'Email service configuration error'
        errorDetails = 'Invalid or missing Resend API key'
      } else if (emailError.message?.includes('domain')) {
        errorMessage = 'Email domain not verified'
        errorDetails =
          'Please verify your domain with Resend or use testing domain'
      } else if (emailError.message?.includes('rate limit')) {
        errorMessage = 'Email rate limit exceeded'
        errorDetails = 'Please wait before sending another email'
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorDetails,
          debug:
            process.env.NODE_ENV === 'development'
              ? {
                  fullError: emailError.message,
                  stack: emailError.stack,
                }
              : undefined,
        },
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
