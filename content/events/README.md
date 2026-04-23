# Event content (JSON)

The site **automatically** applies one layout to every event card (image, title, details, **From / £** or **Tickets / TBC**, **View details**). You only need to follow the rules below; **do not** change `EventCard` for a single event.

## Poster / flyer image

| Rule | Why |
|------|-----|
| **16∶9** landscape (e.g. **1920×1080** px, or 1280×720) | Fills the card image area without odd cropping. |
| sRGB, **PNG** or **JPEG** | Consistent with other uploads. |
| Safe text ~**8–10%** inset from edges | The card crops with `object-cover` + top anchor; very tight text can clip. |
| **One** image per event, path in JSON like `/uploads/your-filename.png` | Images live in `public/uploads/`. |

Upload via **/admin** (Decap) or add the file under `public/uploads/` and reference it in JSON.

## JSON file

- **One file** per event: `content/events/{slug}.json` (the slug is the event `id` in code).
- **Required fields** (must parse correctly): `title`, `date` (`YYYY-MM-DD`), `time`, `venue`, `city`, `image` (public path), `description`, and at least one `ticketTiers` **name** (see `mock-data` if validation fails).
- **venueName** (optional): short name used before ` · ` in the card (e.g. `GB10 Sports`).

## Event type

- `boat-party` | `club-night` | `festival` — controls the **badge** (BOAT PARTY / CLUB NIGHT / FESTIVAL) only; layout is the same.

## Tickets and Fixr

- **Live tickets:** one tier with `"available": true`, correct **price** (number, GBP), and **payment link** in `stripeLink` (Fixr and Stripe links both work; the key name is historical).
- **Not on sale yet:** set `"comingSoon": true` and either omit available tiers or set `available: false`. The card shows **Tickets / TBC** in the same slot as **From / £** so alignment matches priced events.
- **Sold out:** `"soldOut": true` and update tiers as needed.

## Checklist before publishing

1. Date and time copy matches the poster.  
2. Image is **16∶9** and path starts with `/uploads/`.  
3. Fixr/Stripe link is the full `https://…` URL.  
4. Run `npm run build` locally if you can; merge to `main` — GitHub Pages deploys from there.

## Do not

- Rely on custom HTML in JSON (description is plain text).  
- Add extra keys expecting the card to read them, unless a developer extends `parseEvent` in `src/data/mock-data.ts`.

If something looks off on **one** event, fix the **image aspect ratio** or the **JSON** first—layout is shared.
