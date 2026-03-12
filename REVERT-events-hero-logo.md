# Revert: Events Page Hero Logo (partiesbythepm)

To revert the partiesbythepm logo from the Events page hero:

1. **Remove `heroImage` from `content/pages/events.json`**
   - Delete the line: `"heroImage": "/uploads/partiesbythepm-logo.png",`

2. **In `src/app/pages/events.tsx`**, remove:
   - `heroImage?: string;` from the `EventsPageContent` interface
   - The `heroImageSrc` variable and the entire hero image block (lines with `{/* REVERT: ... */}` and the `{heroImageSrc && (...)}` block)
   - The `resolvePublicAsset` import if no longer used

3. **Optional**: Remove `public/uploads/partiesbythepm-logo.png` if no longer needed

4. **Optional**: In `public/admin/config.yml`, remove the heroImage field from the Events page config
