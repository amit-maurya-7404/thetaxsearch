import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
 
// Email HTML Templates
const ownerEmailTemplate = (name: string, email: string, phone: string, message: string) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #1e40af; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
      .content { border: 1px solid #ddd; padding: 20px; }
      .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
      .field { margin-bottom: 15px; }
      .label { font-weight: bold; color: #1e40af; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>New Contact Form Submission</h2>
      </div>
      <div class="content">
        <div class="field">
          <span class="label">Name:</span> ${name}
        </div>
        <div class="field">
          <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
        </div>
        <div class="field">
          <span class="label">Phone:</span> ${phone || 'Not provided'}
        </div>
        <div class="field">
          <span class="label">Message:</span><br/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #666;">
          This is an automated message from your contact form. You can reply directly to ${email}
        </p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} The Tax Search. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
 
const userConfirmationTemplate = (userName: string) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #10b981; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
      .content { border: 1px solid #ddd; padding: 20px; }
      .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Thank You for Contacting Us!</h2>
      </div>
      <div class="content">
        <p>Dear ${userName},</p>
        <p>Thank you for reaching out to us. We have received your message and appreciate you taking the time to contact us.</p>
        <p>Our team will review your inquiry and get back to you as soon as possible, typically within 24 business hours.</p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          If you have any urgent matters, please feel free to call us directly.
        </p>
        <p>Best regards,<br/><strong>The Tax Search</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} The Tax Search. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
 
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()
 
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      )
    }
 
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
 
    // Check for required Gmail environment variables
    const gmailEmail = process.env.GMAIL_EMAIL
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
    const siteOwnerEmail = process.env.SITE_OWNER_EMAIL
 
    if (!gmailEmail || !gmailAppPassword) {
      console.error('Missing Gmail configuration')
      return NextResponse.json(
        { error: 'Email service is not properly configured' },
        { status: 500 }
      )
    }
 
    // Create Nodemailer transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: gmailEmail,
        pass: gmailAppPassword,
      },
    })
 
    // Verify transporter configuration
    try {
      await transporter.verify()
    } catch (verifyError: any) {
      console.error('SMTP verification failed:', verifyError.message)
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }
 
    const ownerEmail = siteOwnerEmail || gmailEmail
 
    // Email 1: Send to site owner
    const ownerMailResult = await transporter.sendMail({
      from: `The Tax Search <${gmailEmail}>`,
      to: ownerEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: ownerEmailTemplate(name, email, phone || '', message),
      text: `New Contact from ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`,
    })
 
    // Email 2: Send confirmation to user
    const userMailResult = await transporter.sendMail({
      from: `The Tax Search <${gmailEmail}>`,
      to: email,
      subject: 'We Received Your Message',
      html: userConfirmationTemplate(name),
      text: `Dear ${name},\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nBest regards,\nThe Tax Search`,
    })
 
    console.log('Owner email sent:', ownerMailResult.messageId)
    console.log('User confirmation email sent:', userMailResult.messageId)
 
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will contact you soon.',
        data: { name, email, phone },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Contact form error:', error.message || error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
 
 