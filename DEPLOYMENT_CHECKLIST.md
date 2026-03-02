# Deployment Checklist – IT Vendo Landing Page

## ✅ Ready (naka-configure na)

| Item | Status |
|------|--------|
| Git repo | ✅ Initialized, pushed to GitHub |
| vercel.json | ✅ Static site, framework: null |
| index.html | ✅ Redirect sa root → landing-page.html |
| Build (TypeScript) | ✅ `npm run build` → dist/landing.js |
| .gitignore | ✅ node_modules excluded |
| Structure | ✅ landing-page, apps/, dist/ |

---

## ⚠️ Kailangan mo pa gawin

### 1. Formspree (required para sa forms)

**Contact at Demo forms** ay naka-set sa Formspree pero placeholder pa ang ID.

**Steps:**
1. Punta sa [formspree.io](https://formspree.io) at gawa ng free account
2. Create new form → kuhanin ang Form ID (hal. `xyzabc12`)
3. Sa `src/landing.ts`, palitan ang line 328:
   ```ts
   const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';  // ← palitan dito
   ```
   Gawing:
   ```ts
   const FORMSPREE_ID = 'xyzabc12';  // your actual ID
   ```
4. I-build ulit: `npm run build`
5. Commit at push:
   ```bash
   git add src/landing.ts dist/landing.js
   git commit -m "Add Formspree form ID"
   git push
   ```

Kung hindi gagawin ito, mag-fail ang form submissions (404 o invalid endpoint).

---

### 2. Phone number (optional pero recommended)

Palitan ang placeholder number sa buong site:
- `(02) 8123-4567`
- `tel:+639171234567`

**Files:** `landing-page.html`, `apps/*.html`

---

### 3. Email (optional)

Sa `apps/rxaudit.html` at iba pang app pages, naka-display ang `hello@itvendo.com`. Palitan kung iba ang gusto mong email.

---

## Quick test bago i-push

```bash
npm run build          # dapat walang error
# Buksan landing-page.html sa browser
# Test: search, category filter, Schedule Demo button
```

---

## Summary

| Kung... | Gawin... |
|---------|----------|
| Walang Formspree ID pa | Forms ay hindi magwowork. Setup muna sa formspree.io |
| Meron ka nang Formspree ID | Palitan sa `src/landing.ts`, build, push |
| Ok na lahat | Push lang – Vercel mag-de-deploy automatically |
