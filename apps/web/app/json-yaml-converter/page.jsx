import JSONYAMLConverterPage from '@/pages/JSONYAMLConverterPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'JSON to YAML Converter – Free Online Tool | DevToolz',
  description: 'Convert JSON to YAML and YAML to JSON instantly. Two-way real-time conversion with syntax validation. No data stored.',
  openGraph: {
    title: 'JSON to YAML Converter – Free Online Tool | DevToolz',
    description: 'Convert JSON to YAML and YAML to JSON instantly. Two-way real-time conversion with syntax validation.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON ↔ YAML",
  "description": "Convert JSON to YAML and YAML to JSON instantly. Two-way real-time conversion with syntax validation. No data stored.",
  "url": "https://devtoolz.net/json-yaml-converter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function JSONYAMLConverter() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <JSONYAMLConverterPage />
    </>
  );
}
