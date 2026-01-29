# The PM - Artist Website

A premium dark luxury website for UK-based artist The PM (The Prhyme Minister) - rapper, DJ, and event organiser specialising in boat parties and club nights.

## Features

### Design System
- **Dark Luxury + Neon Theme**: Near-black background with electric cyan (#00F0FF) accents
- **Typography**: Bebas Neue for headings, Inter for body text
- **Responsive**: Mobile-first design with desktop optimization
- **8px Grid System**: Consistent spacing throughout

### Pages
1. **Home** - Hero with latest release, upcoming events, featured merch
2. **Music** - Filterable grid of releases (singles/EPs/albums)
3. **Release Detail** - Individual release pages with streaming links
4. **Events** - Upcoming and past events (boat parties & club nights)
5. **Event Detail** - Full event info with ticket tiers and Stripe integration
6. **Merch** - Product grid with apparel and accessories
7. **Product Detail** - Size selector and Stripe checkout
8. **Media** - Photos and videos gallery with press kit download
9. **About** - Bio, timeline, press quotes, career highlights
10. **Contact** - Booking form with direct contact information

### Components
- **Navigation**: Sticky header with hamburger menu on mobile
- **Mobile Action Bar**: Bottom sticky bar with "Listen" and "Buy Tickets" CTAs
- **Cards**: Release cards, event cards, product cards with hover effects
- **Buttons**: Primary (neon), Secondary, Ghost, Outline variants
- **Forms**: Styled inputs, textareas, selects with accent color focus

### Content Management (Decap CMS)
The site includes Decap CMS (formerly Netlify CMS) for easy content management via Git:

**Access CMS Admin**: Navigate to `/admin` in your browser

**Available Collections**:
- Music Releases (title, artwork, streaming links, tracklist)
- Events (dates, venues, ticket tiers, Stripe links)
- Merchandise (products, prices, sizes, Stripe links)
- Media (photos, videos with thumbnails)
- Site Settings (contact info, social links)

All content is stored as markdown/JSON files in the `content/` folder and committed to your Git repository.

## Tech Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Decap CMS** for content management
- **Motion** (Framer Motion) for animations
- **React Responsive Masonry** for media gallery

## Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access the site at http://localhost:5173
# Access CMS admin at http://localhost:5173/admin
```

### Building for Production
```bash
# Build the site
npm run build

# The built files will be in the `dist/` folder
```

### Deploying to GitHub Pages

1. **Configure Decap CMS for GitHub**:
   - Go to your repository settings on GitHub
   - Enable GitHub Pages from Settings > Pages
   - Set up OAuth for Decap CMS (see Decap CMS documentation)

2. **Update `public/admin/config.yml`**:
   ```yaml
   backend:
     name: github
     repo: your-username/your-repo-name
     branch: main
   ```

3. **Deploy**:
   - Push your code to GitHub
   - GitHub Pages will automatically build and deploy your site

### Environment Setup for Decap CMS

For local CMS development, you can use:
```bash
npx decap-server
```

This creates a local proxy server for Git Gateway, allowing you to test the CMS locally.

## Customization

### Colors
Edit `/src/styles/theme.css` to change the color scheme:
- `--accent`: Main neon accent color (default: #00F0FF)
- `--background`: Background color (default: #0A0A0A)
- `--surface`: Card/surface color (default: #1A1A1A)

### Content
- **Mock Data**: Located in `/src/data/mock-data.ts`
- **CMS Data**: Will be stored in `/content/` folders after CMS setup

### Fonts
Google Fonts are loaded in `/src/styles/fonts.css`:
- Bebas Neue (headings)
- Inter (body text)

## Payment Integration

The site is ready for Stripe integration:
- Event tickets: Add Stripe Payment Links to event ticket tiers via CMS
- Merchandise: Add Stripe Payment Links to products via CMS
- All "Buy Now" buttons link to these payment URLs

## UK-Specific Features
- GBP (£) currency throughout
- UK date formats (DD/MM/YYYY)
- UK city examples (London, Manchester, Birmingham)
- UK contact phone number format

## Mobile Optimization
- Hamburger menu on mobile
- Sticky bottom action bar on key pages
- Touch-friendly 44px minimum tap targets
- Optimized images and responsive grids

## Accessibility
- High contrast text (white on near-black)
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

## License
© 2025 The PM. All rights reserved.

## Support
For bookings and enquiries: bookings@thepm.uk
