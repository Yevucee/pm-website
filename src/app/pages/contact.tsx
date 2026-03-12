import { Button } from '@/app/components/button';
import { Mail, Phone, Instagram, Youtube } from 'lucide-react';
import { getPageContent } from '@/data/pages';
import { SpotifyIcon, AppleMusicIcon } from '@/app/components/streaming-icons';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className || 'h-5 w-5'}>
    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.493 11.24h-6.64l-5.2-6.8-5.94 6.8H1.73l7.73-8.84L1.4 2.25h6.81l4.7 6.2 5.334-6.2z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className || 'h-5 w-5'}>
    <path fill="currentColor" d="M16.62 2c.33 2.13 1.98 3.8 4.11 4.12v3.07c-1.88.01-3.65-.61-5.11-1.67v6.14c0 3.46-2.8 6.27-6.25 6.27-3.45 0-6.25-2.8-6.25-6.27 0-3.46 2.8-6.27 6.25-6.27.33 0 .65.03.97.08v3.15a3.15 3.15 0 0 0-.97-.15 3.12 3.12 0 0 0-3.12 3.12 3.12 3.12 0 1 0 6.24 0V2h4.13z" />
  </svg>
);

const getSocialIcon = (label: string) => {
  const l = label?.toLowerCase() || '';
  if (l.includes('instagram')) return Instagram;
  if (l.includes('youtube')) return Youtube;
  if (l.includes('spotify')) return SpotifyIcon;
  if (l.includes('apple')) return AppleMusicIcon;
  if (l.includes('tiktok')) return TikTokIcon;
  if (l.includes('x') || l.includes('twitter')) return XIcon;
  return Instagram;
};

interface ContactPageContent {
  heroShow?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  introText?: string;
  subText?: string;
  formShow?: boolean;
  formHeading?: string;
  formDescription?: string;
  formNameLabel?: string;
  formNamePlaceholder?: string;
  formEmailLabel?: string;
  formEmailPlaceholder?: string;
  formEnquiryLabel?: string;
  formEnquiryOptions?: { label?: string; value?: string }[];
  formDateLabel?: string;
  formTimeLabel?: string;
  formTimeStartLabel?: string;
  formTimeEndLabel?: string;
  formMessageLabel?: string;
  formMessagePlaceholder?: string;
  formSubmitLabel?: string;
  links?: { label?: string; url?: string }[];
  directContactHeading?: string;
  directContacts?: { label?: string; value?: string; link?: string }[];
  socialHeading?: string;
  socialLinks?: { label?: string; url?: string }[];
  promoterHeading?: string;
  promoterText?: string;
  promoterButtonLabel?: string;
  promoterButtonUrl?: string;
}

export function ContactPage() {
  const contact = getPageContent<ContactPageContent>('contact', {});

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {contact.heroShow !== false && (
          <h1 className="font-heading text-5xl sm:text-6xl mb-4">
            {contact.heroTitle || 'BOOK THE PM'}
          </h1>
        )}
        <p className="text-muted-foreground text-xl mb-4">
          {contact.heroSubtitle ||
            'Available for club nights, festivals, private events and collaborations'}
        </p>
        <p className="text-foreground/80 text-base mb-12 max-w-2xl">
          {contact.introText ||
            'Get in touch for DJ bookings, event curation, collaborations, or press enquiries'}
        </p>
        {contact.subText && (
          <p className="text-foreground/80 text-base mb-12 max-w-2xl">
            {contact.subText}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          {contact.formShow !== false && (
          <div>
            <h2 className="font-heading text-3xl mb-6">
              {contact.formHeading || 'SEND A MESSAGE'}
            </h2>
            {contact.formDescription && (
              <p className="text-muted-foreground mb-6">{contact.formDescription}</p>
            )}
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-heading text-sm mb-2">
                  {contact.formNameLabel || 'NAME *'}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  placeholder={contact.formNamePlaceholder || 'Your name'}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-heading text-sm mb-2">
                  {contact.formEmailLabel || 'EMAIL *'}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                  placeholder={contact.formEmailPlaceholder || 'your@email.com'}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block font-heading text-sm mb-2">
                  {contact.formEnquiryLabel || 'ENQUIRY TYPE *'}
                </label>
                <select
                  id="type"
                  required
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  {(contact.formEnquiryOptions || []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block font-heading text-sm mb-2">
                  {contact.formDateLabel || 'EVENT DATE (if applicable)'}
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-heading text-sm mb-2">
                  {contact.formTimeLabel || 'EVENT TIME (if applicable)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="time-start" className="block text-xs text-muted-foreground mb-2">
                      {contact.formTimeStartLabel || 'Start time'}
                    </label>
                    <input
                      type="time"
                      id="time-start"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="time-end" className="block text-xs text-muted-foreground mb-2">
                      {contact.formTimeEndLabel || 'End time'}
                    </label>
                    <input
                      type="time"
                      id="time-end"
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block font-heading text-sm mb-2">
                  {contact.formMessageLabel || 'MESSAGE *'}
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors resize-none"
                  placeholder={contact.formMessagePlaceholder || 'Tell us about your event or enquiry...'}
                />
              </div>
              
              <Button type="submit" variant="primary" size="lg" className="w-full">
                {contact.formSubmitLabel || 'Send Message'}
              </Button>
            </form>
          </div>
          )}

          {/* Contact Information */}
          <div>
            <h2 className="font-heading text-3xl mb-6">
              {contact.directContactHeading || 'DIRECT CONTACT'}
            </h2>
            
            <div className="space-y-6 mb-12">
              {(contact.directContacts || []).map((item) => (
                <div key={item.label} className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {item.link?.startsWith('tel:') ? (
                      <Phone size={20} className="text-accent" />
                    ) : (
                      <Mail size={20} className="text-accent" />
                    )}
                    <p className="font-heading">{item.label}</p>
                  </div>
                  <a
                    href={item.link || '#'}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-heading text-xl mb-4">
                {contact.socialHeading || 'SOCIAL MEDIA'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {(contact.socialLinks || []).map((social) => {
                  const Icon = getSocialIcon(social.label || '');
                  return (
                    <a
                      key={social.label}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 p-6 bg-accent/10 border border-accent rounded-xl">
              <h3 className="font-heading text-lg mb-2">
                {contact.promoterHeading || 'FOR PROMOTERS'}
              </h3>
              {contact.promoterText && (
                <p className="text-muted-foreground text-sm mb-3">
                  {contact.promoterText}
                </p>
              )}
              {contact.promoterButtonLabel && (
                <a href={contact.promoterButtonUrl || '#'} download>
                  <Button variant="outline" size="sm">
                    {contact.promoterButtonLabel}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
