export default function TermsPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: June 2026</p>

      <div className="space-y-8">

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Acceptance of terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing or using DevToolz at devtoolz.net ("the Service"), you agree to be bound by these
            Terms of Service. If you do not agree, please do not use the Service. These terms apply to all
            visitors and users of DevToolz.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Description of service</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            DevToolz provides a collection of free, browser-based developer utilities including formatters,
            encoders, converters, and related tools. All tools run entirely client-side — no data you enter
            is transmitted to our servers. The Service is provided free of charge with no registration required.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Acceptable use</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You may use DevToolz for any lawful purpose. You agree not to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Use the Service for any illegal or unauthorised purpose</li>
            <li>Attempt to probe, scan, or test the vulnerability of the Service or its infrastructure</li>
            <li>Use automated scripts to excessively request pages in a manner that degrades the Service for others</li>
            <li>Reproduce, duplicate, or resell any part of the Service without express written permission</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Disclaimer of warranties</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Service is provided <strong className="text-foreground font-medium">"as is"</strong> and
            <strong className="text-foreground font-medium"> "as available"</strong> without warranties of any kind,
            either express or implied, including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, or non-infringement.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do not warrant that the tools will be error-free, uninterrupted, or that the results obtained
            from their use will be accurate or reliable. You use the outputs of these tools at your own risk
            and should verify critical results independently.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Limitation of liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the fullest extent permitted by applicable law, DevToolz and its operators shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages arising from your use
            of or inability to use the Service, even if we have been advised of the possibility of such damages.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our total liability for any claims arising under these terms shall not exceed the amount you paid
            to use the Service (which, as the Service is free, is zero).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Intellectual property</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The DevToolz name, logo, and site design are the property of DevToolz. The underlying source code
            of individual tools may be open-source — see the project repository for licensing details.
            Any content you input into the tools remains entirely your own; we claim no rights over it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Availability and changes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to modify, suspend, or discontinue the Service (or any part of it) at any
            time without notice. We may also update or remove individual tools. We will not be liable to you
            or any third party for any modification, suspension, or discontinuation of the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Governing law</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These terms shall be governed by and construed in accordance with applicable law. Any disputes
            arising under these terms will be subject to the exclusive jurisdiction of the relevant courts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Changes to these terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update these terms from time to time. The "last updated" date at the top of this page
            will reflect any changes. Continued use of the Service after an update constitutes your acceptance
            of the revised terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questions about these terms? Contact us at{' '}
            <a href="mailto:hello@devtoolz.net" className="text-primary hover:underline">hello@devtoolz.net</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
