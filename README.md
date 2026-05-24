# BRKMB — Premium Personal Site

Digital headquarters for **Baher (Joo)** — Designer, Founder, Product Builder.

**Live:** [brkmb.com](https://brkmb.com)

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Static export → Cloudflare Pages (free)

## Local dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## Add content (no core code edits)

Edit JSON in `src/data/`:

| File | Content |
|------|---------|
| `site.json` | Name, tagline, stats, email |
| `brands.json` | Ventures (BARYQ, Benou, …) |
| `projects.json` | Project cards + case study pages |
| `portfolio.json` | Masonry gallery items |
| `timeline.json` | Currently building section |
| `about.json` | About copy + role cards |
| `contact.json` | Social links |
| `resume.json` | CV / experience |

Add images to `public/images/`.

## Deploy (auto via Git)

Push to `main` → Cloudflare Pages rebuilds.

**Build settings:**

| Field | Value |
|-------|--------|
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 20+ |

See [CLOUDFLARE_AUTO.md](./CLOUDFLARE_AUTO.md).
