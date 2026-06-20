export default function PrivacyPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

      <div className="prose-custom space-y-8">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DevToolz is a collection of free, browser-based developer utilities available at devtoolz.net.
            We are committed to your privacy. This page explains what data we collect, why, and what we do with it.
            The short version: we collect almost nothing, and everything you type into any tool stays in your browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Data processed in your browser</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All DevToolz tools run entirely client-side. Any text, tokens, keys, data, or other input you enter
            into a tool is processed locally in your browser using JavaScript. It is never transmitted to our
            servers or any third party. This applies to all tools including JWT Decoder, Hash Generator, SQL
            Formatter, and every other tool on the site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use <strong className="text-foreground font-medium">Umami</strong>, a privacy-focused, open-source analytics platform.
            Umami does not use cookies, does not track you across websites, and does not collect personally
            identifiable information. The data collected is limited to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Page views and referrer URLs (to understand which pages are visited)</li>
            <li>Browser type, operating system, and screen size (aggregated, not tied to you individually)</li>
            <li>Country-level location derived from your IP address (the IP itself is not stored)</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Umami analytics data is not shared with advertisers or data brokers. You can read more about
            Umami's privacy approach at <span className="text-foreground/80 font-mono text-xs">umami.is</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Cookies and local storage</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DevToolz does not set any tracking or advertising cookies. Some tools may use your browser's
            <strong className="text-foreground font-medium"> localStorage</strong> to remember your last input or
            preferences (for example, a formatter's indentation setting) — this data never leaves your device.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Third-party services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DevToolz is hosted on <strong className="text-foreground font-medium">Vercel</strong>. Vercel may log
            standard server access data (IP addresses, request timestamps) as part of its infrastructure operation.
            This data is subject to <span className="text-foreground/80">Vercel's privacy policy</span> and is not
            controlled by DevToolz.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use Google Fonts and no other third-party scripts beyond Umami analytics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Children's privacy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DevToolz does not knowingly collect any information from children under the age of 13. The site
            contains no registration, account creation, or data submission forms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Changes to this policy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update this policy occasionally. The "last updated" date at the top of this page will
            reflect any changes. Continued use of DevToolz after an update constitutes acceptance of the
            revised policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have any questions about this privacy policy, please contact us at{' '}
            <a href="mailto:hello@devtoolz.net" className="text-primary hover:underline">hello@devtoolz.net</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
