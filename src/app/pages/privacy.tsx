export function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl sm:text-5xl mb-8">PRIVACY POLICY</h1>
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString('en-GB')}
        </p>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            The PM (The Prhyme Minister) respects your privacy. This policy describes how we collect,
            use, and protect your information when you use this website.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Information We Collect</h2>
          <p>
            We may collect information you provide when contacting us (e.g. name, email, message content)
            and usage data such as pages visited and referral sources.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">How We Use Your Information</h2>
          <p>
            We use your information to respond to enquiries, improve our services, and communicate
            with you about events and updates where you have opted in.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Cookies</h2>
          <p>
            This site may use cookies for essential functionality and analytics. You can control
            cookie preferences through your browser settings.
          </p>
          <h2 className="font-heading text-xl text-foreground mt-8">Contact</h2>
          <p>
            For privacy-related questions, contact us at{' '}
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
