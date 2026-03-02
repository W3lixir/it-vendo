# Form Setup (Formspree)

To make the contact and trial forms work, you need a Formspree account:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form and get your form ID (e.g. `xabckxyz`)
3. Open `src/landing.ts` and replace `YOUR_FORMSPREE_ID` with your form ID:

```typescript
const FORMSPREE_ID = 'xabckxyz'; // Your actual Formspree form ID
```

4. Run `npm run build` to recompile

Submissions will be sent to your Formspree dashboard and optionally forwarded to your email.
