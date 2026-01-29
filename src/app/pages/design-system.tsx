import { Button } from '@/app/components/button';
import { ReleaseCard } from '@/app/components/release-card';
import { EventCard } from '@/app/components/event-card';
import { ProductCard } from '@/app/components/product-card';
import { upcomingEvents, merchProducts } from '@/data/mock-data';
import { releases } from '@/data/releases';

export function DesignSystemPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-6xl mb-4">DESIGN SYSTEM</h1>
        <p className="text-muted-foreground text-xl mb-12">
          The PM Brand Guidelines & Component Library
        </p>

        {/* Colors */}
        <section className="mb-16">
          <h2 className="font-heading text-4xl mb-6">COLORS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="h-32 bg-background border border-border rounded-lg"></div>
              <p className="font-heading">Background</p>
              <p className="text-muted-foreground text-sm">#0A0A0A</p>
            </div>
            <div className="space-y-3">
              <div className="h-32 bg-surface border border-border rounded-lg"></div>
              <p className="font-heading">Surface</p>
              <p className="text-muted-foreground text-sm">#1A1A1A</p>
            </div>
            <div className="space-y-3">
              <div className="h-32 bg-accent rounded-lg"></div>
              <p className="font-heading">Accent (Neon)</p>
              <p className="text-muted-foreground text-sm">#00F0FF</p>
            </div>
            <div className="space-y-3">
              <div className="h-32 bg-muted-foreground rounded-lg"></div>
              <p className="font-heading">Muted Text</p>
              <p className="text-muted-foreground text-sm">#A0A0A0</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="font-heading text-4xl mb-6">TYPOGRAPHY</h2>
          <div className="space-y-6 bg-surface border border-border rounded-xl p-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">H1 - Bebas Neue, 3rem (48px)</p>
              <h1>THE QUICK BROWN FOX</h1>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">H2 - Bebas Neue, 2.25rem (36px)</p>
              <h2>THE QUICK BROWN FOX</h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">H3 - Bebas Neue, 1.875rem (30px)</p>
              <h3>THE QUICK BROWN FOX</h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Body - Inter, 1rem (16px)</p>
              <p>The quick brown fox jumps over the lazy dog. Regular body text for content and descriptions.</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="font-heading text-4xl mb-6">BUTTONS</h2>
          <div className="space-y-8 bg-surface border border-border rounded-xl p-8">
            <div>
              <p className="text-sm text-muted-foreground mb-4">Primary (Accent)</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">Small Button</Button>
                <Button variant="primary" size="md">Medium Button</Button>
                <Button variant="primary" size="lg">Large Button</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-4">Outline</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm">Small Button</Button>
                <Button variant="outline" size="md">Medium Button</Button>
                <Button variant="outline" size="lg">Large Button</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-4">Secondary</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="sm">Small Button</Button>
                <Button variant="secondary" size="md">Medium Button</Button>
                <Button variant="secondary" size="lg">Large Button</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-4">Ghost</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="ghost" size="sm">Small Button</Button>
                <Button variant="ghost" size="md">Medium Button</Button>
                <Button variant="ghost" size="lg">Large Button</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="font-heading text-4xl mb-6">CARDS</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-2xl mb-4">Release Card</h3>
              <div className="max-w-sm">
                <ReleaseCard release={releases[0]} />
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl mb-4">Event Card</h3>
              <div className="max-w-md">
                <EventCard event={upcomingEvents[0]} />
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl mb-4">Product Card</h3>
              <div className="max-w-sm">
                <ProductCard product={merchProducts[0]} />
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-16">
          <h2 className="font-heading text-4xl mb-6">SPACING</h2>
          <div className="bg-surface border border-border rounded-xl p-8 space-y-4">
            <p className="text-muted-foreground mb-4">8px Grid System</p>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent"></div>
              <p>8px</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-accent"></div>
              <p>16px</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-accent"></div>
              <p>24px</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent"></div>
              <p>32px</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent"></div>
              <p>48px</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent"></div>
              <p>64px</p>
            </div>
          </div>
        </section>

        {/* Grid System */}
        <section>
          <h2 className="font-heading text-4xl mb-6">GRID SYSTEM</h2>
          <div className="bg-surface border border-border rounded-xl p-8">
            <p className="text-muted-foreground mb-4">Desktop: 12-column grid (max 1280px)</p>
            <p className="text-muted-foreground mb-6">Mobile: 4-column grid</p>
            <div className="grid grid-cols-4 lg:grid-cols-12 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-accent/20 rounded"></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
