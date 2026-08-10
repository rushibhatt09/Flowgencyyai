# Deploying to Vercel

This is a static site (`index.html`) plus one serverless function
(`api/contact.js`) that sends real emails when someone submits the contact
form. No build step, no framework — Vercel will deploy it as-is.

## 1. Push to GitHub
```
git init
git add .
git commit -m "FlowgencyyAI site"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## 2. Import into Vercel
- Go to vercel.com -> **Add New Project** -> import the GitHub repo.
- Framework preset: **Other** (it's plain static HTML — no build command needed).
- Click **Deploy**. Your site goes live at `<project>.vercel.app`.

## 3. Set up real email delivery (Resend)
The contact form posts to `/api/contact`, which sends mail through
[Resend](https://resend.com) — a free-tier email API that works cleanly
with Vercel serverless functions.

1. Sign up at resend.com (free tier: 3,000 emails/month).
2. **Fastest way to test:** skip domain verification — Resend gives you a
   shared sender `onboarding@resend.dev` you can use immediately, but it
   only sends to the email address on your Resend account.
3. **For production:** Add and verify your own domain in Resend (DNS
   records — a few minutes), then use an address like
   `inquiries@yourdomain.com` as the sender.
4. Grab your API key from the Resend dashboard.
5. In Vercel: **Project Settings -> Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `RESEND_API_KEY` | your Resend API key (`re_...`) |
   | `CONTACT_TO_EMAIL` | the inbox that should receive inquiries |
   | `CONTACT_FROM_EMAIL` | verified sender address (or `onboarding@resend.dev` while testing) |
6. Redeploy (Vercel -> Deployments -> ... -> Redeploy) so the function
   picks up the new env vars.

That's it — submissions on the live site will now land as real emails.

## 4. Custom domain (optional)
Vercel -> Project -> Settings -> Domains -> add your domain, then point
its DNS at Vercel per their instructions.

## Notes on what changed from your original files
- `threadline-homepage.html` is now `index.html` (Vercel serves that as
  the root automatically) — the design is untouched.
- The dead "Book a Free Consultation" / "Get a Marketing Audit" buttons
  were replaced with a real contact form (name, email, company, service,
  message) that posts to `/api/contact`.
- Your old `dev-server.js`, `babel_min.js`, the empty Vite/React scaffold,
  and `inquiries.json` (test data) aren't part of this deploy — they were
  either local-dev-only tooling or incomplete, and aren't needed for a
  static Vercel deployment.
