export function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl sm:text-5xl mb-8">TERMS OF SERVICE</h1>
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString('en-GB')}
        </p>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            By using this website, you agree to these terms of service. If you do not agree, please
            do not use the site.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Use of the Site</h2>
          <p>
            This website is for informational purposes. You may not use it for any unlawful purpose
            or in any way that could damage or impair the site or its availability.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Intellectual Property</h2>
          <p>
            All content on this site, including text, images, and branding, is owned by The PM and
            protected by copyright. Unauthorised use is prohibited.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Event Tickets & Merchandise</h2>
          <p>
            Ticket and merchandise purchases are subject to the terms of the respective payment
            provider (e.g. Stripe) and any event-specific terms communicated at the point of sale.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Contact</h2>
          <p>
            For questions about these terms, contact{' '}
            <a href="mailto:theonlypm@gmail.com" className="text-accent hover:underline">
              theonlypm@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
