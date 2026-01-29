import { Button } from '@/app/components/button';
import { Mail, Phone, Instagram, Twitter } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-5xl sm:text-6xl mb-4">BOOK THE PM</h1>
        <p className="text-muted-foreground text-xl mb-4">
          Available for club nights, festivals, private events and collaborations
        </p>
        <p className="text-foreground/80 text-base mb-12 max-w-2xl">
          Get in touch for DJ bookings, event curation, collaborations, or press enquiries
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-3xl mb-6">SEND A MESSAGE</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-heading text-sm mb-2">
                  NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-heading text-sm mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block font-heading text-sm mb-2">
                  ENQUIRY TYPE *
                </label>
                <select
                  id="type"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="booking">Booking</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="press">Press</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block font-heading text-sm mb-2">
                  EVENT DATE (if applicable)
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block font-heading text-sm mb-2">
                  MESSAGE *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your event or enquiry..."
                />
              </div>
              
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="font-heading text-3xl mb-6">DIRECT CONTACT</h2>
            
            <div className="space-y-6 mb-12">
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-accent" />
                  <p className="font-heading">BOOKINGS</p>
                </div>
                <a
                  href="mailto:bookings@thepm.uk"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  bookings@thepm.uk
                </a>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={20} className="text-accent" />
                  <p className="font-heading">MANAGEMENT</p>
                </div>
                <a
                  href="mailto:management@thepm.uk"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  management@thepm.uk
                </a>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-accent" />
                  <p className="font-heading">PHONE</p>
                </div>
                <a
                  href="tel:+447700900000"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  +44 7700 900000
                </a>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-heading text-xl mb-4">SOCIAL MEDIA</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-accent/10 border border-accent rounded-xl">
              <h3 className="font-heading text-lg mb-2">FOR PROMOTERS</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Response time: Within 48 hours
              </p>
              <a href="#" download>
                <Button variant="outline" size="sm">
                  Download Technical Rider
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
