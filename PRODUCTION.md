# Careerfolio production checklist

The running app is a local MVP: it proves account, portfolio, template and Pro-plan flows without pretending to charge money. Before public launch:

1. Create a Supabase project and run `supabase/schema.sql`.
2. Add the Supabase URL and anonymous key to `.env.local` using `.env.example`.
3. Replace local preview storage with Supabase Auth and the `portfolios` table.
4. Create a protected server-side Razorpay or Stripe order endpoint. Keep secret keys only in server environment variables.
5. Activate Pro only from the verified payment webhook, which writes `subscriptions` and updates `profiles.plan`.
6. Deploy the frontend to Cloudflare Pages and the protected payment endpoint to a serverless runtime.
7. Add an email provider, image-storage rules, legal pages, abuse reporting, and error monitoring.

The database policies intentionally block browsers from granting themselves Pro access, charging a card, or writing analytics. Those actions must be verified server-side.
