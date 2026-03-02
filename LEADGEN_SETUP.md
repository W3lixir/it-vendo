# Lead Generation Setup

The marketplace has been converted from direct sales to lead generation. Here's what to configure:

## 1. Phone Number
- Update `(02) 8123-4567` and `tel:+639171234567` throughout the site with your real number.
- Search for both in: `landing-page.html`, `apps/rxaudit.html`, and other app pages.

## 2. Formspree (Demo & Contact Forms)
- Replace `YOUR_FORMSPREE_ID` in `src/landing.ts` with your Formspree form ID.
- Run `npm run build` after changing.
- Demo form captures: name, email, phone, app interest.
- Contact form captures: name, email, message, app interest.

## 3. App Detail Pages
- `apps/rxaudit.html` has been updated for lead gen.
- Other app pages (`dentalcare.html`, `medsched.html`, etc.) can be updated similarly:
  - Change "Buy Now" / "Start Free Trial" → "Schedule Demo"
  - Link to `../landing-page.html#contact`
  - Add phone in header
  - Update CTA copy to be consultative
