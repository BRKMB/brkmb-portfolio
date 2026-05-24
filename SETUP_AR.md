# دليل نشر brkmb.com — مجاني 100%

الموقع static (HTML/CSS/JS) — **لا استضافة مدفوعة** ولا سيرفر.

**للنشر التلقائي (push = تحديث الموقع):** راجع [CLOUDFLARE_AUTO.md](./CLOUDFLARE_AUTO.md)

الخطة الموصى بها: **Cloudflare Pages** (مجاني، SSL، CDN عالمي، دومين مخصص).

---

## الخطوة 1: رفع الكود على GitHub (مجاني)

1. أنشئ حساب على [github.com](https://github.com) إن لم يكن موجوداً.
2. أنشئ repository جديد باسم `brkmb-portfolio` (Public).
3. من مجلد المشروع على جهازك:

```bash
cd ~/Projects/brkmb-portfolio
git add .
git commit -m "Initial BRKMB portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brkmb-portfolio.git
git push -u origin main
```

استبدل `YOUR_USERNAME` باسم مستخدمك.

---

## الخطوة 2: Cloudflare Pages (استضافة مجانية)

1. سجّل مجاناً على [dash.cloudflare.com](https://dash.cloudflare.com).
2. من القائمة: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. اختر GitHub واسمح بالربط، ثم اختر repo `brkmb-portfolio`.
4. إعدادات البناء:

| الحقل | القيمة |
|--------|--------|
| Framework preset | **None** |
| Build command | *(فارغ)* |
| Build output directory | `/` أو `.` |

5. اضغط **Save and Deploy**.
6. بعد الدقيقة الأولى ستحصل على رابط مثل: `brkmb-portfolio.pages.dev` — افتحه وتأكد أن الموقع يعمل.

---

## الخطوة 3: ربط الدومين brkmb.com

### الخيار أ — الأفضل: نقل DNS لـ Cloudflare (مجاني + أسرع)

1. في Cloudflare: **Add a site** → اكتب `brkmb.com` → الخطة **Free**.
2. Cloudflare يعطيك **Nameservers** (مثلاً `ada.ns.cloudflare.com` و `bob.ns.cloudflare.com`).
3. في **Spaceship**:
   - ادخل على [spaceship.com](https://www.spaceship.com) → Domains → `brkmb.com`
   - **Nameservers** → **Custom** / **Change**
   - الصق الـ nameservers من Cloudflare واحفظ
4. انتظر من 5 دقائق إلى 48 ساعة (غالباً أقل من ساعة).
5. في Cloudflare Pages → مشروعك → **Custom domains** → **Set up a custom domain**:
   - `brkmb.com`
   - `www.brkmb.com` (اختياري)
6. Cloudflare يضيف سجلات DNS تلقائياً ويُفعّل SSL مجاناً.

### الخيار ب — الإبقاء على DNS في Spaceship

إذا لا تريد تغيير الـ nameservers، في **Spaceship DNS** أضف:

| النوع | الاسم | القيمة | ملاحظة |
|--------|--------|--------|--------|
| **CNAME** | `@` | `brkmb-portfolio.pages.dev` | إن Spaceship يدعم CNAME على الجذر |
| **CNAME** | `www` | `brkmb-portfolio.pages.dev` | للنسخة www |

> بعض المسجّلين لا يدعمون CNAME على `@`. عندها استخدم **خيار أ** (Cloudflare nameservers) أو أضف في Pages الدومين واتبع التعليمات التي يعرضها Cloudflare (قد يطلب A record لـ IPs محددة).

بعد الربط في Pages → **Custom domains** أدخل `brkmb.com` واتبع ما يظهر لك بالضبط.

---

## الخطوة 4: تعديلات شخصية

1. **الإيميل**: في `index.html` غيّر `hello@brkmb.com` لإيميلك الحقيقي (في `mailto:` وفي `form action`).
2. **FormSubmit**: أول مرة يرسل أحد فورم، FormSubmit يرسل لك إيميل تأكيد — اضغط Confirm.
3. **المشاريع**: عدّل عناوين وروابط كروت قسم `#ventures`.
4. **سوشيال**: LinkedIn / Behance / GitHub في قسم التواصل.

---

## بدائل مجانية (إن فضّلت غير Cloudflare)

| المنصة | التكلفة | ملاحظة |
|--------|---------|--------|
| [Cloudflare Pages](https://pages.cloudflare.com) | مجاني | **موصى به** مع دومينك |
| [GitHub Pages](https://pages.github.com) | مجاني | Custom domain مدعوم |
| [Netlify](https://www.netlify.com) | مجاني | 100GB bandwidth/شهر |
| [Vercel](https://vercel.com) | مجاني | مناسب لو حوّلت لـ Next لاحقاً |

كلها تدعم `brkmb.com` بدون دفع استضافة.

---

## ماذا تدفع فعلاً؟

- **الدومين** `brkmb.com` من Spaceship — هذا الوحيد (سنوي).
- **الاستضافة + SSL + CDN** = **0 جنيه** مع Cloudflare Pages.

---

## تحديث الموقع لاحقاً

```bash
# عدّل الملفات محلياً ثم:
git add .
git commit -m "Update portfolio"
git push
```

Cloudflare يعيد النشر تلقائياً خلال ~1 دقيقة.

---

## مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| الموقع لا يفتح على الدومين | انتظر انتشار DNS؛ تحقق من Custom domain في Pages |
| SSL غير آمن | في Cloudflare: SSL/TLS → **Full** |
| الفورم لا يصل | أكّد إيميل FormSubmit من أول رسالة |
| www لا يعمل | أضف `www.brkmb.com` في Custom domains + Redirect |

---

**المشروع جاهز في:** `~/Projects/brkmb-portfolio`
