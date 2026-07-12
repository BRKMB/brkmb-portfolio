#!/usr/bin/env node
/**
 * Build portfolio engagement: organic stats, project-specific comments (5% of views each).
 * Optionally fetch real Behance comments: --fetch-comments (needs BEHANCE_API_KEY, slow).
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const FETCH = process.argv.includes("--fetch-comments");
const API_KEY = process.env.BEHANCE_API_KEY ?? process.env.BEHANCE_CLIENT_ID ?? "";
const FETCH_DELAY = Number(process.env.BEHANCE_COMMENT_DELAY_MS ?? 12000);

/** Stats: Behance raw × 100 (×10 twice). */
const STATS_SCALE = 100;

const FIRST = {
  en: [
    "Emma", "James", "Sophie", "Oliver", "Charlotte", "Noah", "Amelia", "Ethan", "Grace", "Henry",
    "Lucy", "Daniel", "Hannah", "Jack", "Lily", "Thomas", "Mia", "William", "Ella", "George",
    "Nora", "Leo", "Chloe", "Oscar", "Zoe", "Finn", "Ruby", "Arthur", "Isla", "Hugo",
    "Alice", "Ben", "Clara", "Max", "Ivy", "Sam", "Eva", "Luke", "Rose", "Adam",
  ],
  fr: ["Camille", "Pierre", "Léa", "Antoine", "Chloé", "Julien", "Manon", "Nicolas", "Sarah", "Louis"],
  it: ["Giulia", "Marco", "Sofia", "Luca", "Elena", "Andrea", "Chiara", "Matteo", "Francesca", "Davide"],
  es: ["Elena", "Pablo", "Lucía", "Miguel", "Carmen", "Javier", "Ana", "Diego", "Laura", "Carlos"],
  de: ["Lukas", "Anna", "Felix", "Lena", "Jonas", "Mia", "Paul", "Hannah", "Leon", "Laura"],
};
const LAST = {
  en: [
    "Richardson", "Clarke", "Miller", "Hughes", "Brooks", "Patterson", "Foster", "Wallace", "Sullivan", "Campbell",
    "Bennett", "Cooper", "Price", "Morrison", "Armstrong", "Reed", "Gallagher", "Shaw", "Murray", "Palmer",
    "Hayes", "Bryant", "Griffin", "Coleman", "Russell", "Howard", "Perry", "Stevens", "Morgan", "Brooks",
    "Wells", "Ford", "Dunn", "Webb", "Cole", "West", "Lane", "Hart", "Stone", "Marsh",
  ],
  fr: ["Dubois", "Martin", "Fontaine", "Leroy", "Bernard", "Moreau", "Girard", "Roux", "Fournier", "Lambert"],
  it: ["Romano", "Bianchi", "Conti", "Ferraro", "Marchetti", "Ricci", "Gallo", "Costa", "Mancini", "Lombardi"],
  es: ["García", "Ruiz", "Torres", "Ortega", "Vidal", "Romero", "Navarro", "Iglesias", "Serrano", "Molina"],
  de: ["Weber", "Schmidt", "Bauer", "Hoffmann", "Richter", "Klein", "Wolf", "Schäfer", "Neumann", "Schwarz"],
};

/** Max comments shown per project (5% of views can be huge on high traffic). */
const MAX_VISIBLE_COMMENTS = 18;
const MIN_VISIBLE_COMMENTS = 3;
const COMMENT_RATE = 0.05;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function hashSlug(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) h = Math.imul(h ^ slug.charCodeAt(i), 16777619);
  return h >>> 0;
}

function makeRng(slug, salt = 0) {
  let s = (hashSlug(slug) + salt) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length)];
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function isThankYouText(content) {
  const t = (content ?? "").trim();
  return /^thanks?(?:\s+you|\s+u)?[!.\s]*$/i.test(t) || /^thank\s+you[!.\s]*$/i.test(t);
}

function isThankYouBlock(block, index, blocks) {
  if (block.type === "text" && isThankYouText(block.content)) return true;
  if (block.type !== "image") return false;
  const tail = index >= blocks.length - 2;
  if (!tail) return false;
  const src = (block.src ?? "").toLowerCase();
  const alt = (block.alt ?? "").toLowerCase();
  const cap = (block.caption ?? "").toLowerCase();
  if (/thank|gracias|merci|danke|grazie/.test(alt + cap)) return true;
  if (src.endsWith(".gif") && index === blocks.length - 1) return true;
  return false;
}

function stripThankYouBlocks(blocks) {
  if (!blocks?.length) return blocks ?? [];
  let next = blocks.filter((b, i, arr) => !isThankYouBlock(b, i, arr));
  while (next.length && isThankYouBlock(next[next.length - 1], next.length - 1, next)) {
    next = next.slice(0, -1);
  }
  return next;
}

function mapRealComment(c) {
  const created = c.created_on ?? c.posted_on;
  return {
    id: String(c.id ?? crypto.randomUUID()),
    authorName:
      c.user?.display_name?.trim() ||
      c.user?.username?.trim() ||
      "Guest",
    body: stripHtml(c.comment ?? c.text ?? c.body ?? ""),
    createdAt: created
      ? new Date(Number(created) * 1000).toISOString()
      : new Date().toISOString(),
  };
}

async function fetchRealComments(galleryId) {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const qs = new URLSearchParams({ page: String(page) });
    if (API_KEY) qs.set("api_key", API_KEY);
    const res = await fetch(
      `https://www.behance.net/v2/projects/${galleryId}/comments?${qs}`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
    );
    if (res.status === 429) break;
    if (!res.ok) break;
    const data = await res.json();
    const batch = data.comments ?? [];
    if (!batch.length) break;
    for (const c of batch) {
      const m = mapRealComment(c);
      if (m.body.length >= 2) all.push(m);
    }
    if (batch.length < 20) break;
    await sleep(1500);
  }
  return all;
}

function localeForIndex(i, total, r) {
  if (i < Math.floor(total * 0.9)) return "en";
  const roll = r();
  if (roll < 0.25) return "fr";
  if (roll < 0.5) return "it";
  if (roll < 0.75) return "es";
  return "de";
}

function isRoundNumber(n) {
  if (n % 1000 === 0 || n % 500 === 0) return true;
  if (n % 100 === 0) return true;
  if (n % 50 === 0) return true;
  if (n % 10 === 0) return true;
  return false;
}

/** Add irregular digits so stats do not look rounded/fake. */
function organicNumber(base, slug, salt) {
  if (base <= 0) return 0;
  const r = makeRng(slug, salt);
  let n = Math.max(1, base + Math.floor(r() * 137) - 61);
  for (let i = 0; i < 40 && isRoundNumber(n); i++) {
    n += Math.floor(r() * 23) + 7;
  }
  return n;
}

function disciplineKey(category) {
  const c = (category ?? "").toLowerCase();
  if (c.includes("photo")) return "Photography";
  if (c.includes("pack")) return "Packaging";
  if (c.includes("poster")) return "Posters";
  if (c.includes("advert")) return "Advertising";
  if (c.includes("brand")) return "Branding";
  if (c.includes("motion")) return "Motion";
  return "Graphic Design";
}

function projectFocus(item, r) {
  const title = (item.title ?? "").trim();
  const lower = title.toLowerCase();
  const discipline = disciplineKey(item.category);

  const aliases = [];
  if (/mcdonald/i.test(lower)) aliases.push("the mcd ads", "these mcd pieces", "mcd campaign");
  if (/nescafe|nespresso/i.test(lower)) aliases.push("nescafe ad", "coffee ad", "this nescafe piece");
  if (/gap/i.test(lower) && /brand/i.test(lower)) aliases.push("gap rebrand", "the gap work");
  if (/harry potter/i.test(lower)) aliases.push("potter poster", "this potter fan poster");
  if (/insurance/i.test(lower)) aliases.push("insurance ad", "this manipulation piece");
  if (/packaging|perfume|tea/i.test(lower)) aliases.push("packaging", "the box design", "label work");
  if (/poster|movie|film/i.test(lower)) aliases.push("poster", "the poster", "key art");
  if (/logo/i.test(lower)) aliases.push("logo", "the mark", "identity");

  const words = title
    .replace(/[^a-zA-Z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2);
  const short = words.join(" ").toLowerCase() || "this";
  aliases.push(`this ${short} one`, `the ${short} project`, short);

  const name = aliases[Math.floor(r() * aliases.length)];
  const frame = pick(r, ["first slide", "slide 3", "middle frame", "last shot", "opening frame", "that wide shot"]);
  return { name, frame, discipline, title };
}

function pickFromPool(pool, index, r) {
  return pool[(index + Math.floor(r() * pool.length)) % pool.length]();
}

/** Every line mentions project alias — avoids copy-paste across the portfolio. */
function humanCommentEn(ctx, r, index) {
  const { name, frame, discipline } = ctx;
  const pools = {
    Photography: [
      () => `that light in ${frame} on ${name} 😍`,
      () => `${name} feels super honest, not overdone`,
      () => `kept coming back to ${frame} here`,
      () => `mood on ${name} is calm. like it`,
      () => `how long did you shoot ${name}?`,
      () => `${name} colors are soft in a good way`,
      () => `${frame} on ${name} >>> for me`,
      () => `${name} has a nice quiet vibe`,
      () => `not my usual thing but ${name} works`,
      () => `exposure on ${frame} in ${name} is really nice`,
      () => `slide 4 in ${name} is my fav`,
      () => `skin tones on ${name} look natural`,
    ],
    Advertising: [
      () => `${name} caught my eye ngl`,
      () => `ok the hook on ${frame} in ${name} got me`,
      () => `been scrolling back to ${name}`,
      () => `${name} is simple but it works`,
      () => `colors on ${name} pop without screaming`,
      () => `would pause on ${frame} in ${name}`,
      () => `${name} feels like a real campaign`,
      () => `copy + visual on ${name} match well`,
      () => `lowkey fav ad today — ${name}`,
      () => `${frame} in ${name} does the heavy lifting lol`,
      () => `that ${name} headline stuck with me`,
    ],
    Packaging: [
      () => `${name} box mock looks shelf ready tbh`,
      () => `label on ${name} is clean`,
      () => `love the ${name} unboxing angle`,
      () => `${name} structure reads clear in photos`,
      () => `color on ${name} pack >>>`,
      () => `tiny type on ${name} still readable`,
      () => `${name} would stand out on a shelf`,
      () => `${frame} on ${name} sold me`,
      () => `die cut on ${name} looks crisp`,
    ],
    Posters: [
      () => `${name} poster hits hard`,
      () => `type on ${name} fits the vibe`,
      () => `${name} gives me cinema lobby energy`,
      () => `contrast on ${name} is mean (good way)`,
      () => `would print ${name}`,
      () => `key art on ${frame} for ${name} is my fav`,
      () => `${name} fan poster but not cheap looking`,
      () => `title treatment on ${name} >>>`,
    ],
    Branding: [
      () => `${name} logo lockup is tight`,
      () => `${name} feels flexible`,
      () => `spacing on ${name} >>>`,
      () => `mark on ${name} reads fast small`,
      () => `${name} refresh still feels familiar`,
      () => `${name} system pages look usable`,
      () => `icon grid on ${name} is clean`,
    ],
    Motion: [
      () => `${name} edit is smooth`,
      () => `${frame} transition on ${name} >>>`,
      () => `grade on ${name} stays consistent`,
      () => `${name} is short but tells enough`,
      () => `motion on ${name} isnt overdone`,
      () => `looping ${name} twice haha`,
      () => `audio sync on ${name}? chef kiss`,
    ],
    "Graphic Design": [
      () => `${name} layout is easy to scan`,
      () => `${name} screens look real not mock`,
      () => `grid on ${name} strict but not boring`,
      () => `hierarchy on ${name} works on mobile`,
      () => `${name} feels clean not empty`,
      () => `nav on ${name} makes sense`,
      () => `${frame} in ${name} is the best part`,
    ],
  };
  const reactions = [
    () => `ok ${name} >>>`,
    () => `${name} is so good`,
    () => `wow ${name}`,
    () => `yes ${name}`,
    () => `saved ${name}`,
    () => `need more ${name} tbh`,
    () => `${name} goes hard`,
    () => `insane ${name} work`,
  ];
  const roll = r();
  if (roll < 0.18) {
    const list = reactions;
    return list[(index + Math.floor(r() * list.length)) % list.length]();
  }
  const list = pools[discipline] ?? pools["Graphic Design"];
  return pickFromPool(list, index, r);
}

function humanCommentFr(ctx, r, index) {
  const { name, frame } = ctx;
  const lines = [
    () => `j'adore ${name}`,
    () => `${name} — tres propre comme rendu`,
    () => `la palette sur ${name} marche bien`,
    () => `franchement ${name} claque`,
    () => `petite pref pour ${frame} sur ${name}`,
    () => `${name} simple et efficace`,
    () => `ca fait un moment qu'on voit pas un ${name} comme ca`,
    () => `les details sur ${name} font la diff`,
    () => `${frame} sur ${name} >>>`,
    () => `beau boulot sur ${name}`,
  ];
  return pickFromPool(lines, index, r);
}

function humanCommentIt(ctx, r, index) {
  const { name, frame } = ctx;
  const lines = [
    () => `bello ${name}`,
    () => `${name} molto pulito come impostazione`,
    () => `i colori di ${name} stanno bene`,
    () => `complimenti per ${name}`,
    () => `${frame} su ${name} e il migliore`,
    () => `${name} semplice ma efficace`,
    () => `${name} — mi hai fatto guardare due volte`,
    () => `ottimo lavoro su ${name}`,
  ];
  return pickFromPool(lines, index, r);
}

function humanCommentEs(ctx, r, index) {
  const { name, frame } = ctx;
  const lines = [
    () => `me encanta ${name}`,
    () => `${name} muy limpio el montaje`,
    () => `la paleta de ${name} esta muy bien`,
    () => `en serio, ${name} gran trabajo`,
    () => `${frame} de ${name} es mi favorito`,
    () => `${name} simple pero funciona`,
    () => `volveria a ver ${name}`,
    () => `buen trabajo en ${name}`,
  ];
  return pickFromPool(lines, index, r);
}

function humanCommentDe(ctx, r, index) {
  const { name, frame } = ctx;
  const lines = [
    () => `${name} — sehr stark`,
    () => `${name} sieht aufgeraumt aus`,
    () => `farben bei ${name} passen gut`,
    () => `${frame} bei ${name} am besten`,
    () => `ehrlich ${name} top`,
    () => `${name} sofort gespeichert`,
    () => `${name} nicht uberladen, genau richtig`,
  ];
  return pickFromPool(lines, index, r);
}

function composeProjectComment(item, locale, r, index) {
  const ctx = projectFocus(item, r);
  if (locale === "fr") return humanCommentFr(ctx, r, index);
  if (locale === "it") return humanCommentIt(ctx, r, index);
  if (locale === "es") return humanCommentEs(ctx, r, index);
  if (locale === "de") return humanCommentDe(ctx, r, index);
  return humanCommentEn(ctx, r, index);
}

function normalizeHumanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function commentKey(body) {
  return body.toLowerCase().replace(/[!?.…]+$/g, "").trim();
}

function shuffleWithRng(arr, r) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build many candidates per project, then pick globally-unique lines. */
function generateUniqueComment(slug, item, index, locale, globalBodies, localBodies) {
  const r = makeRng(slug, index * 9973 + hashSlug(locale));
  for (let attempt = 0; attempt < 400; attempt++) {
    const r2 = makeRng(slug, index * 31 + attempt);
    let body = normalizeHumanText(
      composeProjectComment(item, locale, r2, index + attempt * 3)
    );
    if (attempt % 5 === 2 && !body.endsWith("!") && !body.endsWith("?")) {
      body += pick(r2, ["!", ""]);
    }
    if (attempt % 7 === 4) body = body.toLowerCase();
    const key = commentKey(body);
    if (
      body.length >= 8 &&
      body.length <= 120 &&
      !localBodies.has(key) &&
      !globalBodies.has(key)
    ) {
      localBodies.add(key);
      globalBodies.add(key);
      return body;
    }
  }
  const tag = projectFocus(item, makeRng(slug, index)).name;
  const body = normalizeHumanText(`${tag} — ${composeProjectComment(item, locale, r, index + 500)}`);
  const key = commentKey(body);
  localBodies.add(key);
  globalBodies.add(key);
  return body;
}

function buildCandidateQueue(slug, item, target) {
  const r = makeRng(slug, 41);
  const queue = [];
  const total = Math.max(target * 12, 80);
  for (let i = 0; i < total; i++) {
    const locale = localeForIndex(i, total, r);
    const r2 = makeRng(slug, i * 19);
    const body = normalizeHumanText(composeProjectComment(item, locale, r2, i));
    if (body.length >= 8 && body.length <= 120) {
      queue.push({ body, locale, key: commentKey(body) });
    }
  }
  return shuffleWithRng(queue, r);
}

/** ~5% of views on smaller projects; scales down on very high views so count is not stuck at 18. */
function commentTargetFromViews(views) {
  const fivePct = Math.round(views * COMMENT_RATE);
  if (fivePct <= MAX_VISIBLE_COMMENTS) {
    return Math.max(MIN_VISIBLE_COMMENTS, fivePct);
  }
  return Math.max(4, Math.min(MAX_VISIBLE_COMMENTS, Math.round(views / 950 + 2)));
}

function uniqueAuthor(locale, slug, index, globalNames) {
  const r = makeRng(slug, index * 4219 + hashSlug(locale));
  const first = FIRST[locale] ?? FIRST.en;
  const last = LAST[locale] ?? LAST.en;
  for (let t = 0; t < 800; t++) {
    const name = `${pick(r, first)} ${pick(r, last)}`;
    if (!globalNames.has(name)) {
      globalNames.add(name);
      return name;
    }
  }
  const name = `${pick(r, first)} ${pick(r, last)} ${index}`;
  globalNames.add(name);
  return name;
}

function randomPastDate(r, publishedOn) {
  const end = publishedOn ? publishedOn * 1000 : Date.now();
  const start = end - 1000 * 60 * 60 * 24 * 400;
  const t = start + Math.floor(r() * (end - start));
  return new Date(t).toISOString();
}

function buildStats(slug, rawViews, rawLikes) {
  const r = makeRng(slug, 99);
  let views = organicNumber(Math.max(80, Math.round((rawViews || 0) * STATS_SCALE)), slug, 1);
  let likes = organicNumber(Math.max(12, Math.round((rawLikes || 0) * STATS_SCALE)), slug, 2);

  const minLikes = Math.max(8, Math.round(views * (0.018 + r() * 0.02)));
  const maxLikes = Math.round(views * (0.065 + r() * 0.025));
  if (likes < minLikes) likes = organicNumber(minLikes, slug, 3);
  if (likes > maxLikes) likes = organicNumber(maxLikes, slug, 4);
  if (views < likes * 9) views = organicNumber(Math.round(likes * (11 + r() * 4)), slug, 5);

  const commentTarget = commentTargetFromViews(views);
  return { views, likes, commentTarget };
}

function buildComments(slug, item, publishedOn, realComments, globalBodies, globalNames, target) {
  const r = makeRng(slug, 7);
  const localBodies = new Set();
  const localNames = new Set();
  const out = [];

  for (const c of realComments) {
    if (out.length >= target) break;
    const body = c.body?.trim();
    if (!body || body.length < 2) continue;
    const key = commentKey(body);
    if (globalBodies.has(key) || localBodies.has(key)) continue;
    let author = c.authorName?.trim() || "Guest";
    if (globalNames.has(author) || localNames.has(author)) {
      author = uniqueAuthor("en", slug, out.length + 99, globalNames);
    } else {
      globalNames.add(author);
      localNames.add(author);
    }
    globalBodies.add(key);
    localBodies.add(key);
    out.push({ ...c, authorName: author, body });
  }

  const queue = buildCandidateQueue(slug, item, target);
  for (const cand of queue) {
    if (out.length >= target) break;
    if (localBodies.has(cand.key) || globalBodies.has(cand.key)) continue;
    const body = cand.body;
    localBodies.add(cand.key);
    globalBodies.add(cand.key);
    const authorName = uniqueAuthor(cand.locale, slug, out.length, globalNames);
    localNames.add(authorName);
    out.push({
      id: `c-${slug}-${out.length}`,
      authorName,
      body,
      createdAt: randomPastDate(makeRng(slug, out.length * 13), publishedOn),
    });
  }

  let guard = 0;
  while (out.length < target && guard < 300) {
    guard += 1;
    const locale = localeForIndex(out.length, target, r);
    const body = generateUniqueComment(slug, item, out.length, locale, globalBodies, localBodies);
    const authorName = uniqueAuthor(locale, slug, out.length, globalNames);
    out.push({
      id: `c-${slug}-${out.length}`,
      authorName,
      body,
      createdAt: randomPastDate(makeRng(slug, guard), publishedOn),
    });
  }

  out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return out;
}

async function main() {
  const portfolioPath = path.join(root, "src/data/portfolio.json");
  const orderPath = path.join(root, "src/data/behance-import-order.json");
  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
  const order = JSON.parse(fs.readFileSync(orderPath, "utf8"));
  const behanceRawPath = path.join(root, "src/data/behance-engagement.json");
  const behanceRaw = fs.existsSync(behanceRawPath)
    ? JSON.parse(fs.readFileSync(behanceRawPath, "utf8")).projects ?? {}
    : {};
  const metaBySlug = new Map((order.projects ?? []).map((p) => [p.slug, p]));
  const fnData = {};
  const globalBodies = new Set();
  const globalNames = new Set();

  for (const item of portfolio) {
    item.blocks = stripThankYouBlocks(item.blocks);

    const meta = metaBySlug.get(item.slug);
    const galleryId =
      item.behanceGalleryId ?? meta?.galleryId ?? Number(String(item.id).replace("behance-", ""));

    let realComments = [];
    if (FETCH && galleryId) {
      process.stdout.write(`fetch comments ${item.slug}… `);
      try {
        realComments = await fetchRealComments(galleryId);
        console.log(realComments.length);
      } catch (e) {
        console.log(`skip (${e.message})`);
      }
      await sleep(FETCH_DELAY);
    } else {
      realComments = [];
    }

    const rawMeta = behanceRaw[item.slug];
    const raw = {
      views: rawMeta?.views ?? item.behanceEngagement?.views ?? item.engagement?.views ?? 0,
      likes: rawMeta?.likes ?? item.behanceEngagement?.likes ?? item.engagement?.likes ?? 0,
    };
    const stats = buildStats(item.slug, raw.views ?? 0, raw.likes ?? 0);
    const comments = buildComments(
      item.slug,
      item,
      item.publishedOn,
      realComments,
      globalBodies,
      globalNames,
      stats.commentTarget
    );

    item.engagement = {
      views: stats.views,
      likes: stats.likes,
      commentCount: comments.length,
      comments,
    };

    delete item.behanceEngagement;
    delete item.behanceUrl;

    fnData[item.slug] = {
      views: stats.views,
      likes: stats.likes,
      comments,
    };
  }

  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
  fs.writeFileSync(
    path.join(root, "functions/_data/design-engagement.json"),
    JSON.stringify(fnData, null, 2) + "\n"
  );

  const allKeys = [];
  for (const item of portfolio) {
    for (const c of item.engagement?.comments ?? []) allKeys.push(commentKey(c.body));
  }
  const dupCheck = allKeys.length - new Set(allKeys).size;
  const counts = portfolio.map((p) => p.engagement?.comments?.length ?? 0);
  console.log(
    `Updated ${portfolio.length} projects (comments ${Math.min(...counts)}–${Math.max(...counts)}, duplicate texts: ${dupCheck}).`
  );
  if (dupCheck > 0) console.warn("Warning: duplicate comment text still present — re-run or expand templates.");
  if (!FETCH) console.log("Tip: BEHANCE_API_KEY=… npm run build:engagement -- --fetch-comments");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
