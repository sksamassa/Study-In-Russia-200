import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    const from = process.env.EMAIL_FROM;

    if (!from) {
        console.error("EMAIL_FROM environment variable is not set.");
        return NextResponse.json({ error: 'Server configuration error: EMAIL_FROM is not set.' }, { status: 500 });
    }
     if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY environment variable is not set.");
        return NextResponse.json({ error: 'Server configuration error: RESEND_API_KEY is not set.' }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: `Study In Russia 200 <${from}>`,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}
