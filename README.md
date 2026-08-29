# Brand Consistency Checker — {COMPANY} Lead Magnet

Micro-SaaS lead magnet built for cold email campaigns. A prospect types in
their company name, the app pulls their website, Google Business Profile,
Facebook, and Instagram, and shows a side-by-side grid flagging logo,
color, and bio/tagline mismatches — with a Book a Free Strategy Call CTA
at the end.

## How the analysis works (no paid API keys required to start)

1. `lib/search.ts` finds each platform's public URL for the given company
   name using DuckDuckGo's free HTML search endpoint (no key needed).
2. `lib/microlink.ts` pulls title, description, logo/profile image, and a
   color palette for each URL via the free Microlink.io API.
3. `lib/compare.ts` diff-checks colors (RGB distance), logos, and bio/title
   text similarity across all four platforms and flags mismatches.
4. `app/api/analyze/route.ts` orchestrates the above and returns JSON to
   the client.

This ships functional out of the box. For higher reliability/volume in
production, swap the DuckDuckGo step for Google Custom Search JSON API
(`GOOGLE_CSE_ID` / `GOOGLE_CSE_KEY` in `.env`) and add a Microlink API key
for higher rate limits.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_CALENDAR_LINK, NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GTM_ID
npm run dev
```

## Branding checklist before sending traffic

- [ ] Replace placeholder hex codes in `tailwind.config.js` (`brand.bg`,
      `brand.primary`, `brand.accent`) with your exact LVL7 hex values.
- [ ] Set `NEXT_PUBLIC_LOGO_URL` to your hosted logo (e.g. the
      `lvl7logoflat.svg` already on your VPS).
- [ ] Set `NEXT_PUBLIC_CALENDAR_LINK` to your real booking link.
- [ ] Add your real `NEXT_PUBLIC_META_PIXEL_ID` and `NEXT_PUBLIC_GTM_ID`.

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repo directly in the Vercel dashboard and set the
same environment variables under Project Settings → Environment Variables.

## Notes on the demo build

- Instagram and Facebook block most unauthenticated scraping once you go
  beyond public OG metadata, so this build relies on what's publicly
  exposed via Microlink rather than the official Graph API (which requires
  app review). This is intentional — it keeps the app free to run without
  any Meta developer approval process, at the cost of occasionally missing
  private or heavily-locked-down profiles.
- If a platform can't be found or scraped, its card renders with
  "Not found" instead of breaking the page.
- Mobile-responsive via Tailwind's `sm:` / `lg:` breakpoints on the grid.
