import { useState } from 'react';
import { Button } from '@/app/components/button';
import { Mail, Phone, Instagram, Youtube, MessageCircle, ExternalLink } from 'lucide-react';
import { getPageContent } from '@/data/pages';
import { SpotifyIcon, AppleMusicIcon } from '@/app/components/streaming-icons';
import { submitGoogleWebApp } from '@/utils/googleWebAppSubmit';
import { combineDialAndNational } from '@/utils/phoneCountryCodes';
import { PhoneWithCountryFields } from '@/app/components/phone-with-country-fields';

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
  mailingListShow?: boolean;
  mailingListHeading?: string;
  mailingListDescription?: string;
  mailingListNameLabel?: string;
  mailingListNamePlaceholder?: string;
  mailingListEmailLabel?: string;
  mailingListEmailPlaceholder?: string;
  mailingListWhatsAppLabel?: string;
  mailingListWhatsAppPlaceholder?: string;
  mailingListConsentLabel?: string;
  mailingListSubmitLabel?: string;
  whatsappGroupUrl?: string;
  whatsappGroupLabel?: string;
  whatsappGroupDescription?: string;
  whatsappGroupButtonLabel?: string;
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
  const [mailingStatus, setMailingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [mailingVerified, setMailingVerified] = useState(true);
  const [mailingError, setMailingError] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [bookingVerified, setBookingVerified] = useState(true);
  const [bookingError, setBookingError] = useState('');

  const handleMailingSubmit = async (formData: FormData) => {
    setMailingStatus('sending');
    setMailingError('');
    const consent = formData.get('ml-consent') === 'on';
    const combinedPhone = combineDialAndNational(
      String(formData.get('ml-phone-cc') || '44'),
      String(formData.get('ml-phone-national') || '')
    );
    const result = await submitGoogleWebApp({
      source: 'mailing_list',
      name: String(formData.get('ml-name') || ''),
      email: String(formData.get('ml-email') || ''),
      whatsapp: combinedPhone,
      marketing_opt_in: consent,
    });
    if (result.ok) {
      setMailingVerified(result.verified);
      setMailingStatus('success');
    } else {
      setMailingError(result.error);
      setMailingStatus('error');
    }
  };

  const handleBookingSubmit = async (formData: FormData) => {
    setBookingStatus('sending');
    setBookingError('');
    const result = await submitGoogleWebApp({
      source: 'contact_booking',
      name: String(formData.get('booking-name') || ''),
      email: String(formData.get('booking-email') || ''),
      enquiry_type: String(formData.get('booking-type') || ''),
      event_date: String(formData.get('booking-date') || ''),
      time_start: String(formData.get('booking-time-start') || ''),
      time_end: String(formData.get('booking-time-end') || ''),
      message: String(formData.get('booking-message') || ''),
    });
    if (result.ok) {
      setBookingVerified(result.verified);
      setBookingStatus('success');
    } else {
      setBookingError(result.error);
      setBookingStatus('error');
    }
  };

  const showMailing = contact.mailingListShow !== false;
  const showWhatsappGroup = Boolean(contact.whatsappGroupUrl?.trim());

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
            'Get in touch for DJ bookings, event curation, or collaborations'}
        </p>
        {contact.subText && (
          <p className="text-foreground/80 text-base mb-12 max-w-2xl">
            {contact.subText}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-12">
            {showMailing && (
              <div id="mailing-list" className="scroll-mt-28">
                <h2 className="font-heading text-3xl mb-2">
                  {contact.mailingListHeading || 'MAILING LIST & UPDATES'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {contact.mailingListDescription ||
                    'Sign up for email and WhatsApp updates about parties, tickets and announcements.'}
                </p>
                {mailingStatus === 'success' ? (
                  <div className="bg-accent/10 border border-accent rounded-xl p-6 text-center space-y-2">
                    <p className="font-heading text-accent">
                      Thanks — you&apos;re on the list.
                    </p>
                    {!mailingVerified && (
                      <p className="text-xs text-muted-foreground">
                        We could not confirm the server reply (browser/network). Check the sheet in a minute or use email/WhatsApp on this page if nothing appears.
                      </p>
                    )}
                  </div>
                ) : (
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleMailingSubmit(new FormData(e.currentTarget));
                    }}
                  >
                    <div>
                      <label htmlFor="ml-name" className="block font-heading text-sm mb-2">
                        {contact.mailingListNameLabel || 'NAME *'}
                      </label>
                      <input
                        type="text"
                        id="ml-name"
                        name="ml-name"
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder={contact.mailingListNamePlaceholder || 'Your name'}
                      />
                    </div>
                    <div>
                      <label htmlFor="ml-email" className="block font-heading text-sm mb-2">
                        {contact.mailingListEmailLabel || 'EMAIL *'}
                      </label>
                      <input
                        type="email"
                        id="ml-email"
                        name="ml-email"
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder={
                          contact.mailingListEmailPlaceholder || 'your@email.com'
                        }
                      />
                    </div>
                    <div>
                      <span className="block font-heading text-sm mb-2">
                        {contact.mailingListWhatsAppLabel || 'PHONE / WHATSAPP'}
                      </span>
                      <p className="text-xs text-muted-foreground mb-2">
                        Choose country code, then your mobile number only (skip the leading 0).
                      </p>
                      <PhoneWithCountryFields
                        countrySelectName="ml-phone-cc"
                        nationalInputName="ml-phone-national"
                        countrySelectId="ml-phone-cc"
                        nationalInputId="ml-phone-national"
                        nationalPlaceholder={
                          contact.mailingListWhatsAppPlaceholder || 'e.g. 7900 123456'
                        }
                        fieldClassName="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="ml-consent"
                        name="ml-consent"
                        required
                        className="mt-1 rounded border-border"
                      />
                      <label htmlFor="ml-consent" className="text-sm text-muted-foreground leading-snug">
                        {contact.mailingListConsentLabel ||
                          'I agree to receive updates about events and releases. You can opt out anytime.'}
                      </label>
                    </div>
                    {mailingStatus === 'error' && (
                      <p className="text-sm text-error">
                        {mailingError || 'Something went wrong. Try again.'}
                      </p>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={mailingStatus === 'sending'}
                    >
                      {mailingStatus === 'sending'
                        ? 'Sending…'
                        : contact.mailingListSubmitLabel || 'Join the list'}
                    </Button>
                  </form>
                )}
              </div>
            )}

            {contact.formShow !== false && (
              <div>
                <h2 className="font-heading text-3xl mb-6">
                  {contact.formHeading || 'SEND A MESSAGE'}
                </h2>
                {contact.formDescription && (
                  <p className="text-muted-foreground mb-6">{contact.formDescription}</p>
                )}
                {bookingStatus === 'success' ? (
                  <div className="bg-accent/10 border border-accent rounded-xl p-6 text-center space-y-2">
                    <p className="font-heading text-accent">Message sent. We&apos;ll get back to you soon.</p>
                    {!bookingVerified && (
                      <p className="text-xs text-muted-foreground">
                        We could not confirm the server reply. Check your sheet or contact us directly if needed.
                      </p>
                    )}
                  </div>
                ) : (
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleBookingSubmit(new FormData(e.currentTarget));
                    }}
                  >
                    <div>
                      <label htmlFor="booking-name" className="block font-heading text-sm mb-2">
                        {contact.formNameLabel || 'NAME *'}
                      </label>
                      <input
                        type="text"
                        id="booking-name"
                        name="booking-name"
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder={contact.formNamePlaceholder || 'Your name'}
                      />
                    </div>

                    <div>
                      <label htmlFor="booking-email" className="block font-heading text-sm mb-2">
                        {contact.formEmailLabel || 'EMAIL *'}
                      </label>
                      <input
                        type="email"
                        id="booking-email"
                        name="booking-email"
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                        placeholder={contact.formEmailPlaceholder || 'your@email.com'}
                      />
                    </div>

                    <div>
                      <label htmlFor="booking-type" className="block font-heading text-sm mb-2">
                        {contact.formEnquiryLabel || 'ENQUIRY TYPE *'}
                      </label>
                      <select
                        id="booking-type"
                        name="booking-type"
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
                      <label htmlFor="booking-date" className="block font-heading text-sm mb-2">
                        {contact.formDateLabel || 'EVENT DATE (if applicable)'}
                      </label>
                      <input
                        type="date"
                        id="booking-date"
                        name="booking-date"
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-heading text-sm mb-2">
                        {contact.formTimeLabel || 'EVENT TIME (if applicable)'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="booking-time-start"
                            className="block text-xs text-muted-foreground mb-2"
                          >
                            {contact.formTimeStartLabel || 'Start time'}
                          </label>
                          <input
                            type="time"
                            id="booking-time-start"
                            name="booking-time-start"
                            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="booking-time-end"
                            className="block text-xs text-muted-foreground mb-2"
                          >
                            {contact.formTimeEndLabel || 'End time'}
                          </label>
                          <input
                            type="time"
                            id="booking-time-end"
                            name="booking-time-end"
                            className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="booking-message" className="block font-heading text-sm mb-2">
                        {contact.formMessageLabel || 'MESSAGE *'}
                      </label>
                      <textarea
                        id="booking-message"
                        name="booking-message"
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-accent focus:outline-none transition-colors resize-none"
                        placeholder={
                          contact.formMessagePlaceholder ||
                          'Tell us about your event or enquiry...'
                        }
                      />
                    </div>

                    {bookingStatus === 'error' && (
                      <p className="text-sm text-error">
                        {bookingError || 'Something went wrong. Please try again or email us directly.'}
                      </p>
                    )}
                    <Button
                      type="submit"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      disabled={bookingStatus === 'sending'}
                    >
                      {bookingStatus === 'sending'
                        ? 'Sending…'
                        : contact.formSubmitLabel || 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-heading text-3xl mb-6">
              {contact.directContactHeading || 'DIRECT CONTACT'}
            </h2>

            <div className="space-y-6 mb-12">
              {(contact.directContacts || []).map((item) => (
                <div key={item.label} className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {item.link?.includes('wa.me') ? (
                      <MessageCircle size={20} className="text-accent" />
                    ) : item.link?.startsWith('tel:') ? (
                      <Phone size={20} className="text-accent" />
                    ) : (
                      <Mail size={20} className="text-accent" />
                    )}
                    <p className="font-heading">{item.label}</p>
                  </div>
                  <a
                    href={item.link || '#'}
                    target={item.link?.includes('wa.me') ? '_blank' : undefined}
                    rel={item.link?.includes('wa.me') ? 'noopener noreferrer' : undefined}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>

            {showWhatsappGroup && (
              <div className="mb-8 p-6 bg-accent/10 border border-accent rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={22} className="text-accent" />
                  <h3 className="font-heading text-lg">
                    {contact.whatsappGroupLabel || 'WhatsApp community'}
                  </h3>
                </div>
                {contact.whatsappGroupDescription && (
                  <p className="text-muted-foreground text-sm mb-4">{contact.whatsappGroupDescription}</p>
                )}
                <a
                  href={contact.whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="primary" size="sm" className="gap-2">
                    {contact.whatsappGroupButtonLabel || 'Join WhatsApp group'}
                    <ExternalLink size={16} />
                  </Button>
                </a>
              </div>
            )}

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
