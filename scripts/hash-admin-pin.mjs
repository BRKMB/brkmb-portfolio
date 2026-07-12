#!/usr/bin/env node
/**
 * Generate Cloudflare secrets for admin PIN login.
 * Usage: node scripts/hash-admin-pin.mjs YOUR_PIN
 * Prints ADMIN_PIN_SHA256 — set via Cloudflare Pages → Settings → Environment variables (encrypted).
 */

import { createHash, randomBytes } from "node:crypto";

const pin = process.argv[2];
if (!pin) {
  console.error("Usage: node scripts/hash-admin-pin.mjs YOUR_PIN");
  process.exit(1);
}

const hash = createHash("sha256").update(pin, "utf8").digest("hex");
const sessionSecret = randomBytes(32).toString("hex");

console.log("Set these as encrypted secrets on Cloudflare Pages (Production):");
console.log("");
console.log(`ADMIN_PIN_SHA256=${hash}`);
console.log(`ADMIN_SESSION_SECRET=${sessionSecret}`);
console.log("");
console.log("Do not commit these values to git.");
