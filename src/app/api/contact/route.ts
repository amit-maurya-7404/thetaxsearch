import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Do not persist to database per request — only send email and return submitted data

    // Prepare mail
    // Default recipient set to the requested Gmail address; can be overridden by CONTACT_EMAIL env
    const to = process.env.CONTACT_EMAIL || 'amit.maurya7404@gmail.com'
    const from = process.env.FROM_EMAIL || email || 'no-reply@example.com'
    const subject = `New contact from ${name}`
    const html = `<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'N/A'}</p>
<p><strong>Message:</strong><br/>${(message || '').replace(/\n/g, '<br/>')}</p>`

    let transporter: any
    let previewUrl: string | null = null

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    } else {
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      })
    }

    const info = await transporter.sendMail({ from, to, subject, html, text: `${name}\n${email}\n${phone || ''}\n\n${message}` })

    try {
      // @ts-ignore
      previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null
    } catch (e) {
      previewUrl = null
    }

    // Return submitted data along with preview URL (if any)
    return NextResponse.json({ success: true, data: { name, email, phone, message }, previewUrl }, { status: 200 })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Contact route error:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
