# Design engagement

Views, likes, and comments on `/design` are stored in `portfolio.json` under each project’s `engagement` field.

## Refresh stats & comments

```bash
npm run build:engagement
```

Optional: merge real comment text from Behance (slow; API key recommended):

```bash
BEHANCE_API_KEY=your_client_id npm run build:engagement -- --fetch-comments
```

Then rebuild and deploy.
