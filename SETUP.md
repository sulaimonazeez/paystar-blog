# PayStar Blog — Setup & Deployment Guide

## Stack
- **Next.js 15** (App Router + Server Components)
- **MongoDB** (same cluster as PayStar main — separate DB `paystar_blog`)
- **TipTap** rich text editor + Markdown editor (toggle between both)
- **JWT** auth (HTTP-only cookies, edge-compatible)
- **Tailwind CSS** (PayStar dark orange design system)
- **Vercel** hosting → `blog.paystar.com.ng`

---

## Step 1 — Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
MONGODB_URI=mongodb+srv://...  # Same as your main PayStar site
MONGODB_DB=paystar_blog        # Separate DB — no conflict with main app
JWT_SECRET=                    # openssl rand -base64 64
NEXT_PUBLIC_SITE_URL=https://blog.paystar.com.ng
ADMIN_NAME=Azeez
ADMIN_EMAIL=admin@paystar.com.ng
ADMIN_PASSWORD=YourStrongPassword123!
```

---

## Step 2 — Install & Run Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Step 3 — Create Your Admin Account (ONE TIME)

After running locally or after first deploy, call:

```bash
curl -X POST http://localhost:3000/api/admin/seed
# or on production:
curl -X POST https://blog.paystar.com.ng/api/admin/seed
```

You'll get: `{"success":true,"message":"Admin \"Azeez\" created. Delete this route now!"}`

**IMPORTANT:** After creating admin, delete or comment out the seed route:
`app/api/admin/seed/route.ts`

---

## Step 4 — Deploy to Vercel

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Deploy
vercel --prod
```

Or push to GitHub and connect repo to Vercel dashboard.

**Set these env variables in Vercel Dashboard → Settings → Environment Variables:**
- `MONGODB_URI`
- `MONGODB_DB` → `paystar_blog`
- `JWT_SECRET`
- `NEXT_PUBLIC_SITE_URL` → `https://blog.paystar.com.ng`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (only needed for seed, can remove after)

---

## Step 5 — Add Subdomain on Cloudflare

Since your DNS is on Cloudflare:

1. Go to **Vercel → Project → Settings → Domains**
2. Add `blog.paystar.com.ng`
3. Vercel will show you a CNAME value like `cname.vercel-dns.com`
4. Go to **Cloudflare → DNS**
5. Add record:
   - Type: `CNAME`
   - Name: `blog`
   - Target: `cname.vercel-dns.com`
   - Proxy: **OFF (DNS only)** ← Important for Vercel SSL
6. Wait 2–5 minutes → `https://blog.paystar.com.ng` is live ✅

---

## Step 6 — First Login

1. Go to `https://blog.paystar.com.ng/admin/login`
2. Sign in with your `ADMIN_EMAIL` + `ADMIN_PASSWORD`
3. You land on the dashboard

---

## Using the Admin

### Create a Post
1. Admin → **New Post**
2. Write title, excerpt, content (rich text or markdown)
3. Set category, tags, cover image
4. Fill SEO fields (meta title, description)
5. Toggle **Featured** to show in blog hero
6. Hit **Publish Post** or **Save Draft**

### Manage Posts
- Admin → **All Posts** → Edit / Delete / Preview any post

### SEO is automatic
- Every post gets its own `<title>`, canonical URL, OG tags, Twitter card
- Sitemap at `/sitemap.xml` auto-includes all published posts
- JSON-LD structured data (BlogPosting schema) on every post

---

## MongoDB Collections Used

| Collection | Purpose |
|---|---|
| `posts` | All blog posts |
| `admins` | Admin accounts |

Both in the `paystar_blog` database — no conflict with your main PayStar collections.

---

## Adding More Admins Later

You can run the seed API again with different `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars,
or insert directly into MongoDB:

```js
db.admins.insertOne({
  name: "New Admin",
  email: "newadmin@paystar.com.ng",
  password: "<bcrypt hash>",
  createdAt: new Date()
})
```

---

## URL Structure

| URL | Description |
|---|---|
| `blog.paystar.com.ng` | Blog homepage |
| `blog.paystar.com.ng/[slug]` | Single post |
| `blog.paystar.com.ng/admin` | Redirects to dashboard |
| `blog.paystar.com.ng/admin/login` | Admin login |
| `blog.paystar.com.ng/admin/dashboard` | Stats dashboard |
| `blog.paystar.com.ng/admin/posts` | All posts |
| `blog.paystar.com.ng/admin/posts/new` | Create post |
| `blog.paystar.com.ng/admin/posts/[id]` | Edit post |
| `blog.paystar.com.ng/sitemap.xml` | Auto-generated sitemap |
| `blog.paystar.com.ng/robots.txt` | Auto-generated robots |
