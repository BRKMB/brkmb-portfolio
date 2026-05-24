# Design engagement — already configured

Views, likes, and comments on `/design` use **Cloudflare D1** (`brkmb-portfolio-engagement`).

Setup is done in this repo:

- `wrangler.toml` — D1 binding `DB`
- `migrations/d1/001_design_engagement.sql` — applied on Cloudflare
- `functions/api/design/` — API routes

No dashboard steps needed unless you create a new Pages project from scratch.

## Quick test

```bash
curl "https://brkmb.com/api/design/stats?slugs=baryq-identity"
```

You should see JSON with `views` and `likes`.
