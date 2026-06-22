import JSONFormatterPage from '@/pages/JSONFormatterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'JSON Formatter & Validator – Free Online Tool | DevToolz',
  description: 'Format, validate and beautify JSON instantly with this free online JSON formatter and validator from DevToolz.',
  openGraph: {
    title: 'JSON Formatter & Validator – Free Online Tool | DevToolz',
    description: 'Format, validate and beautify JSON instantly with this free online JSON formatter and validator from DevToolz.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON Formatter",
  "description": "Format, validate and beautify JSON instantly with this free online JSON formatter and validator from DevToolz.",
  "url": "https://devtoolz.net/json-formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function JSONFormatter() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <JSONFormatterPage />
    </>
  );
}
