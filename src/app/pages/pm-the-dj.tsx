import { useState } from 'react';
import { Button } from '@/app/components/button';
import { Music2, Radio, Sparkles, Star } from 'lucide-react';
import { getPageContent, resolvePublicAsset } from '@/data/pages';

interface PmDjContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  bioHeading?: string;
  bioText?: string;
  highlightsHeading?: string;
  highlights?: string[];
  bookingHeading?: string;
  bookingIntro?: string;
}

const GENRE_OPTIONS = [
  'Afrobeats',
  'Amapiano',
  'Hip-Hop',
  'R&B',
  'Old School',
  'Dancehall',
  'House',
  'Mixed vibes',
];

export function PmTheDjPage() {
  const page = getPageContent<PmDjContent>('pm-the-dj', {});
  const heroImage = resolvePublicAsset(page.heroImage);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (formData: FormData) => {
    setStatus('sending');
    try {
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        occasion: formData.get('occasion'),
        eventDate: formData.get('eventDate'),
        location: formData.get('location'),
        timeWindow: formData.get('timeWindow'),
        guestCount: formData.get('guestCount'),
        genres: selectedGenres.join(', '),
        source: 'pm-the-dj',
      };

      await fetch(
        'https://script.google.com/macros/s/AKfycbwi6dZZkeBbSxprzpaa4bLxf8ys8X_MsMzRy14ZmsUcFO9xmjXCH1je0Z3hPZBO1NP5RQ/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20">
      {page.heroShow !== false && (
        <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={page.heroTitle || 'PM the DJ'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-xs sm:text-sm font-heading uppercase tracking-wider mb-6">
              <Radio size={16} />
              {page.heroSubtitle || 'DJ • Host • Curator'}
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl mb-4 text-white drop-shadow-2xl">
              {page.heroTitle || 'PM the DJ'}
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              {page.heroDescription ||
                "From Rainbow Radio to headline nights, PM delivers high-energy sets that move every crowd. Expect seamless blends, big moments, and a vibe tailored to your event."}
            </p>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl mb-4">
              {page.bioHeading || 'About PM as a DJ'}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              {page.bioText ||
                'A former Rainbow Radio star DJ and trusted selector across London’s nightlife scene, PM brings deep musical knowledge and crowd control to every set. From intimate celebrations to packed club nights, he curates unforgettable experiences across all genres.'}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Music2, title: 'All-genre flexibility', text: 'Afrobeats, Amapiano, Hip-Hop, R&B, Old School, Dancehall, House.' },
                { icon: Sparkles, title: 'Crowd-first approach', text: 'Reads the room and builds momentum throughout the night.' },
                { icon: Radio, title: 'Broadcast pedigree', text: 'Rainbow Radio International host with years of live mix experience.' },
                { icon: Star, title: 'Signature energy', text: 'High-impact transitions and iconic moments for your event.' },
              ].map((item) => (
                <div key={item.title} className="bg-surface border border-border rounded-xl p-5">
                  <item.icon size={22} className="text-accent mb-3" />
                  <h3 className="font-heading text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="font-heading text-3xl sm:text-4xl mb-4">
              {page.bookingHeading || 'Book PM the DJ'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {page.bookingIntro ||
                "Tell us the basics and we’ll follow up to confirm availability and details."}
            </p>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit(new FormData(event.currentTarget));
              }}
            >
              <div>
                <label className="block font-heading text-sm mb-2" htmlFor="occasion">
                  Occasion *
                </label>
                <select
                  id="occasion"
                  name="occasion"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option>Birthday</option>
                  <option>Wedding</option>
                  <option>Club Night</option>
                  <option>Corporate</option>
                  <option>House Party</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-heading text-sm mb-2" htmlFor="eventDate">
                  Event Date *
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-heading text-sm mb-2" htmlFor="location">
                  Venue + Postcode *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="Venue name and postcode"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-heading text-sm mb-2" htmlFor="timeWindow">
                  Time Window *
                </label>
                <input
                  id="timeWindow"
                  name="timeWindow"
                  type="text"
                  required
                  placeholder="Start time – End time"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-heading text-sm mb-2" htmlFor="guestCount">
                  Approx. Guest Count *
                </label>
                <input
                  id="guestCount"
                  name="guestCount"
                  type="number"
                  min="1"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-heading text-sm mb-2">Music Genres (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-2 rounded-full text-xs sm:text-sm border transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-accent text-black border-accent'
                          : 'bg-background border-border text-muted-foreground hover:border-accent'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-heading text-sm mb-2" htmlFor="name">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-heading text-sm mb-2" htmlFor="phone">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading text-sm mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              {status === 'success' ? (
                <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center">
                  <p className="font-heading text-accent">Thanks! We’ll be in touch shortly.</p>
                </div>
              ) : (
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Submit Booking Request'}
                </Button>
              )}

              {status === 'error' && (
                <p className="text-sm text-error text-center">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
