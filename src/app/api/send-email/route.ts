import { NextResponse } from "next/server"
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    // Check if we have email service credentials
    const apiKey = serverRuntimeConfig.RESEND_API_KEY || serverRuntimeConfig.SENDGRID_API_KEY

    if (!apiKey) {
      console.warn("No email service API key found. Email not sent.")
      console.log("--- Email Details ---")
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log(`Body: ${html}`)
      console.log("--------------------")

      return NextResponse.json({ message: "Email service not configured. Check console for details." }, { status: 200 })
    }

    // Use Resend if available (recommended for Vercel)
    if (serverRuntimeConfig.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverRuntimeConfig.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: serverRuntimeConfig.EMAIL_FROM || "onboarding@resend.dev",
          to: [to],
          subject,
          html,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("Resend API error:", error)
        throw new Error("Failed to send email via Resend")
      }

      return NextResponse.json({ message: "Email sent successfully via Resend" })
    }

    // Fallback to SendGrid if available
    if (serverRuntimeConfig.SENDGRID_API_KEY) {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverRuntimeConfig.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: serverRuntimeConfig.EMAIL_FROM || "noreply@example.com" },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("SendGrid API error:", error)
        throw new Error("Failed to send email via SendGrid")
      }

      return NextResponse.json({ message: "Email sent successfully via SendGrid" })
    }

    return NextResponse.json({ message: "No email service configured" }, { status: 500 })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ message: "Failed to send email", error: String(error) }, { status: 500 })
  }
}
