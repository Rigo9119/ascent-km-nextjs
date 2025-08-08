import { Tables } from '@/lib/types/supabase'
import { NextResponse } from 'next/server'

// For now, we'll use a simple email service
// You can replace this with SendGrid, Resend, Nodemailer, etc.

export async function POST(request: Request) {
  try {
    const { event, user } = await request.json()

    // Email service configuration (you'll need to set up your preferred service)
    const emailData = {
      to: user.email,
      subject: `Event Registration Confirmation: ${event.name}`,
      html: generateEventConfirmationEmail(event, user)
    }

    // TODO: Replace with your preferred email service
    // Example services you can use:

    // 1. RESEND (Recommended for Next.js)
    // const { Resend } = require('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send(emailData)

    // 2. SENDGRID
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // await sgMail.send(emailData)

    // 3. NODEMAILER
    // const nodemailer = require('nodemailer')
    // const transporter = nodemailer.createTransporter(...)
    // await transporter.sendMail(emailData)

    // For development, just log the email content
    console.log('📧 Event Registration Email:')
    console.log('To:', emailData.to)
    console.log('Subject:', emailData.subject)
    console.log('Content:', emailData.html)

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent'
    })

  } catch (error) {
    console.error('Email service error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

function generateEventConfirmationEmail(event: Tables<'events'>, user: Tables<'profiles'>) {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Event Registration Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
            .event-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .cta-button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 You're Registered!</h1>
            <p>Thank you for joining our event</p>
        </div>

        <div class="content">
            <h2>Hi ${user.full_name || user.username || 'there'}!</h2>

            <p>Great news! You've successfully registered for <strong>${event.name}</strong>. We're excited to see you there!</p>

            <div class="event-details">
                <h3>📅 Event Details</h3>

                <div class="detail-row">
                    <span class="detail-label">Event Name:</span>
                    <span class="detail-value">${event.name}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${eventDate}</span>
                </div>

                ${event.time ? `
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${event.time}</span>
                </div>
                ` : ''}

                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">TBD</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value">${event.is_free ? 'Free' : event.price || 'Contact organizer'}</span>
                </div>

                ${event.organizer ? `
                <div class="detail-row">
                    <span class="detail-label">Organizer:</span>
                    <span class="detail-value">${event.organizer}</span>
                </div>
                ` : ''}

                ${event.contact ? `
                <div class="detail-row">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${event.contact}</span>
                </div>
                ` : ''}
            </div>

            ${event.requirements && event.requirements.length > 0 ? `
            <div class="event-details">
                <h3>📋 Requirements</h3>
                <ul>
                    ${event.requirements.map((req: string) => `<li>${req}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <p>If you need to make any changes to your registration or have questions about the event, please contact the organizer.</p>

            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.id}" class="cta-button">
                    View Event Details
                </a>
            </div>
        </div>

        <div class="footer">
            <p>This email was sent because you registered for an event on NextRoots.</p>
            <p>If you have any questions, please contact us.</p>
        </div>
    </body>
    </html>
  `
}
