import RegexTesterPage from '@/pages/RegexTesterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Regex Tester – Free Online Regular Expression Tool | DevToolz',
  description: 'Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags. All processing happens locally in your browser.',
  openGraph: {
    title: 'Regex Tester – Free Online Regular Expression Tool | DevToolz',
    description: 'Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Regex Tester",
  "description": "Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags. All processing happens locally in your browser.",
  "url": "https://devtoolz.net/regex-tester",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function RegexTester() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <RegexTesterPage />
    </>
  );
}
