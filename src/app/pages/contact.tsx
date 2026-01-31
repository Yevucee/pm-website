import { Button } from '@/app/components/button';
import { Mail, Phone, Instagram, Twitter } from 'lucide-react';
import { getPageContent } from '@/data/pages';

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
              <div className="flex gap-3">
                {(contact.socialLinks || []).map((social) => (
                  <a
                    key={social.label}
                    href={social.url || '#'}
                    className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                    aria-label={social.label}
                  >
                    {social.label?.toLowerCase().includes('instagram') ? (
                      <Instagram size={20} />
                    ) : (
                      <Twitter size={20} />
                    )}
                  </a>
                ))}
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
