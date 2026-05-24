#!/bin/bash
# Shrink Behance assets for Cloudflare Pages (25 MiB file limit).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/public/images/behance"

echo "Compressing large JPG/PNG in $DIR …"
while IFS= read -r -d '' f; do
  before=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if [[ "$f" == *.png ]]; then
    sips -Z 2000 "$f" >/dev/null
  else
    sips -Z 2000 -s format jpeg -s formatOptions 85 "$f" --out "$f" >/dev/null 2>&1 || sips -Z 2000 "$f" >/dev/null
  fi
  after=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  echo "  $(basename "$f"): $((before/1024/1024))MB → $((after/1024/1024))MB"
done < <(find "$DIR" \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' \) -size +5M -print0)

if command -v gifsicle >/dev/null 2>&1; then
  echo "Compressing large GIFs with gifsicle …"
  while IFS= read -r -d '' f; do
    before=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
    gifsicle -O3 --lossy=35 "$f" -o "$f.opt" && mv "$f.opt" "$f"
    after=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
    echo "  $(basename "$f"): $((before/1024/1024))MB → $((after/1024/1024))MB"
  done < <(find "$DIR" -name '*.gif' -size +8M -print0)
else
  echo "gifsicle not installed — skipping GIF optimization (install with: brew install gifsicle)"
  find "$DIR" -name '*.gif' -size +20M -print
fi

echo "Files still over 24MB:"
find "$DIR" -type f -size +24M -print || true
