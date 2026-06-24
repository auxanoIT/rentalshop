# ITShop Equipment Leasing

SEO-first rental ecommerce application for `rent.itshop.ng`.

The phase-one architecture follows the supplied blueprint:

- Next.js App Router on Vercel
- Route Handlers under `src/app/api`
- NestJS-ready service/repository modules under `src/lib/server/modules`
- Prisma + Neon PostgreSQL for operational data
- Sanity for SEO content, guides, FAQs, homepage sections, policies, and testimonials
- Cloudflare R2 for product assets and private customer documents
- Resend for transactional email
- Paystack for online payments, with bank transfer review fallback
- Guest checkout for customers and protected admin dashboard from day one

## Local Setup

PowerShell on this machine blocks `npm.ps1`, so use `npm.cmd`.

```bash
npm.cmd install
copy .env.example .env.local
npm.cmd run db:generate
npm.cmd run dev
```

Add database values before running migrations:

```bash
npm.cmd run db:migrate
npm.cmd run db:seed
```

The initial migration is checked in under `prisma/migrations/20260624110000_init`. Prisma configuration lives in `prisma.config.ts`, with `.env` loading enabled for local CLI commands.

The app includes launch-data fallbacks when `DATABASE_URL`, Sanity, R2, Resend, or Paystack secrets are not configured. That lets the public catalogue, checkout shell, and admin dashboard render during local setup.

## Environment Variables

Use `.env.example` as the complete launch checklist. Required production values include:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_SESSION_SECRET`
- `RESEND_API_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_REVALIDATE_SECRET`

For local admin login without a database, set:

- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`
- `ADMIN_SESSION_SECRET`

## Important Routes

Public SEO routes:

- `/`
- `/equipment`
- `/equipment/laptops`
- `/laptop-rental-lagos`
- `/laptop-rental-for-training`
- `/bulk-laptop-rental`
- `/laptop-rental-for-cbt-exams`
- `/laptop-rental-price`
- `/it-equipment-rental-nigeria`
- `/how-it-works`
- `/faq`
- `/rental-agreement`
- `/delivery-return-policy`
- `/contact`

Private/noindex routes:

- `/admin/*`
- `/cart`
- `/checkout`
- `/payment/success`
- `/payment/failed`
- `/studio`
- `/api/*`

## Admin

Admin auth uses hashed passwords in PostgreSQL, signed httpOnly cookies, and a protected `/admin/*` proxy redirect. All sensitive route handlers re-check the admin session server-side.

Launch admin sections:

- dashboard summary
- products
- categories
- pricing rules
- inventory
- orders
- customers
- documents
- payments
- deliveries
- returns
- special requests
- settings

Operational admin pages are backed by authenticated APIs and server actions for product, category, pricing, inventory, order, document, payment, delivery, return, and special request updates. Sensitive actions write audit log records when PostgreSQL is connected.

## Data and Integrations

Prisma schema lives in `prisma/schema.prisma`.

Seed data creates:

- one admin user
- default pricing rules
- laptop category
- three active Dell Latitude rental products
- one special-specification request product
- inventory units for launch laptops
- default business settings

Sanity schemas live in `src/sanity/schemas`. The current `/studio` route is a setup placeholder; use the schemas with a Sanity project or add the full embedded Studio package when you are ready to manage content inside this app.

R2 document uploads validate file type and size before writing to the private bucket.

Paystack webhooks verify `x-paystack-signature` when `PAYSTACK_WEBHOOK_SECRET` is set and update payment/order status by payment reference.

## Deployment

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Add all environment variables.
4. Provision Neon, Sanity, Resend, Cloudflare R2, and Paystack.
5. Run Prisma migration and seed against Neon.
6. Configure Paystack webhook: `https://rent.itshop.ng/api/payments/paystack/webhook`.
7. Configure Sanity webhook: `https://rent.itshop.ng/api/revalidate/sanity`.
8. Submit `https://rent.itshop.ng/sitemap.xml` after launch QA.

## QA Checklist

- Homepage and SEO pages have unique metadata and canonical URLs.
- Sitemap excludes admin, cart, checkout, payment, studio, API, and filter URLs.
- Guest checkout requires rental agreement acceptance.
- Pricing calculator enforces minimum rental days.
- Admin login is required before dashboard access.
- Product pages expose Product and Breadcrumb schema.
- FAQ pages expose FAQ schema.
- Paystack test payment initializes and webhook updates status.
- R2 document upload rejects invalid file types and oversized files.
- Mobile layouts do not overlap or resize controls unexpectedly.
