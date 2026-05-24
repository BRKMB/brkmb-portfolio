# نشر تلقائي — brkmb.com

أي تعديل على `main` → GitHub → Cloudflare Pages → الموقع يتحدّث (~دقيقة).

---

## إعداد مرة واحدة (10 دقائق)

### 1) GitHub — repository

1. [github.com/new](https://github.com/new) → اسم: `brkmb-portfolio` → Public → **Create**
2. من الماك:

```bash
cd ~/Projects/brkmb-portfolio
git add .
git commit -m "BRKMB portfolio + auto deploy"
git remote set-url origin https://github.com/BRKMB/brkmb-portfolio.git
git push -u origin main
```

### 2) Cloudflare — مشروع Pages

**طريقة A (اللي كنت بتعملها — أسهل): ربط Git من Cloudflare**

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. اختر GitHub → repo `brkmb-portfolio`
3. الإعدادات:

| | |
|--|--|
| Production branch | `main` |
| Build command | *(فارغ)* |
| Build output | `.` |

4. **Save and Deploy**

بعد كده: أي `git push` على `main` = نشر تلقائي. **مش محتاج GitHub Actions.**

---

**طريقة B: GitHub Actions + Wrangler** (اختياري — يحتاج PAT بصلاحية `workflow`)

> ملف الـ workflow اتشال من المشروع لأن **طريقة A** كافية. لو احتجت B، أنشئ `.github/workflows/deploy.yml` من جديد.

**طريقة B (قديمة): GitHub Actions + Wrangler** (لو مش عايز تربط Git من Cloudflare)

1. Cloudflare → **My Profile** → **API Tokens** → **Create** → قالب **Edit Cloudflare Workers**
2. انسخ الـ Token
3. **Account ID** من صفحة Overview لأي zone/account
4. GitHub → repo → **Settings** → **Secrets** → أضف:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. أول push على `main` يشغّل workflow `.github/workflows/deploy.yml`

أنشئ المشروع لو مش موجود:

```bash
cd ~/Projects/brkmb-portfolio
npx wrangler pages project create brkmb-portfolio --production-branch main
```

---

### 3) الدومين brkmb.com

1. Cloudflare → **Add site** → `brkmb.com` (Free)
2. Spaceship → Nameservers → حط nameservers بتاعة Cloudflare
3. Pages → المشروع → **Custom domains** → `brkmb.com` + `www.brkmb.com`

---

## بعد الإعداد — سير العمل

```
أنت تطلب تعديل → Agent يعدّل الملفات → git commit + push → الموقع يتحدّث
```

مفيش رفع يدوي ولا zip.

---

## تحقق سريع

- GitHub: **Actions** tab (طريقة B) أو Cloudflare **Deployments** (طريقة A)
- الموقع: `https://brkmb-portfolio.pages.dev` ثم `https://brkmb.com`

---

## ملاحظة للـ Agent

بعد أي تعديل على الموقع:

```bash
cd ~/Projects/brkmb-portfolio
git add -A && git commit -m "..." && git push origin main
```

يفترض `origin` يشير لـ `github.com/.../brkmb-portfolio.git`.
