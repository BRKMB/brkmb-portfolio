# Design engagement (views, likes, comments)

The `/design` grid and project pages use **Cloudflare D1** via Pages Functions (`/api/design/...`).

## One-time setup

1. Create the database:

```bash
npx wrangler d1 create brkmb-portfolio-engagement
```

2. Copy the `database_id` from the output into `wrangler.toml` (replace the placeholder).

3. Apply the schema:

```bash
npx wrangler d1 execute brkmb-portfolio-engagement --remote --file=./migrations/d1/001_design_engagement.sql
```

4. In **Cloudflare Dashboard** → your Pages project → **Settings** → **Functions** → **D1 bindings**:
   - Variable name: `DB`
   - D1 database: `brkmb-portfolio-engagement`

5. Redeploy the site.

## Behaviour

- **Views**: counted once per browser tab session per project.
- **Likes**: toggled per visitor (anonymous ID in `localStorage`), no login.
- **Comments**: name + text only, no login.

Until D1 is bound, the UI shows `0` and actions no-op silently.
