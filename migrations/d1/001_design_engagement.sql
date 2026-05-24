CREATE TABLE IF NOT EXISTS design_stats (
  slug TEXT PRIMARY KEY,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS design_likes (
  slug TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (slug, visitor_id)
);

CREATE TABLE IF NOT EXISTS design_comments (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_design_comments_slug ON design_comments(slug);
