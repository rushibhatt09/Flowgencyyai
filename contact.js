// Vercel Serverless Function — POST /api/contact
// Sends the contact form submission as a real email using Resend (https://resend.com).
//
// SETUP REQUIRED (see README-DEPLOY.md):
//   1. Create a free Resend account, verify a sending domain (or use their
//      shared onboarding domain for testing).
//   2. Grab an API key from the Resend dashboard.
//   3. In Vercel: Project Settings -> Environment Variables, add:
//        RESEND_API_KEY   = re_xxxxxxxx
//        CONTACT_TO_EMAIL = the inbox that should receive inquiries
//        CONTACT_FROM_EMAIL = a verified sender, e.g. inquiries@yourdomain.com
//
// No other setup needed — Vercel auto-detects any file in /api as a function.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, company, service, message } = req.body || {};

  if (!name || !email || !service) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.CONTACT_TO_EMAIL;
  const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!RESEND_API_KEY || !TO_EMAIL) {
    console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars');
    return res.status(500).json({ success: false, error: 'Email service not configured' });
  }

  const safe = (v) => String(v || '').replace(/[<>]/g, '');

  const html = `
    <h2>New inquiry from FlowgencyyAI site</h2>
    <p><strong>Name:</strong> ${safe(name)}</p>
    <p><strong>Email:</strong> ${safe(email)}</p>
    <p><strong>Company:</strong> ${safe(company) || 'N/A'}</p>
    <p><strong>Service:</strong> ${safe(service)}</p>
    <p><strong>Message:</strong><br>${safe(message) || 'No message provided'}</p>
  `;

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: email,
        subject: `New inquiry from ${name} (${service})`,
        html
      })
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('Resend API error:', errBody);
      return res.status(502).json({ success: false, error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, message: 'Inquiry sent' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
}
