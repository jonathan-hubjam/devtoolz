import CSVJSONPage from '@/pages/CSVJSONPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'CSV to JSON Converter – Convert CSV ↔ JSON Online | DevToolz',
  description:
    'Convert CSV to JSON or JSON to CSV instantly online. Supports custom delimiters, quoted fields, header rows, and pretty-print output. Runs entirely in your browser.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CSV ↔ JSON",
  "description": "Convert CSV to JSON or JSON to CSV instantly online. Supports custom delimiters, quoted fields, header rows, and pretty-print output. Runs entirely in your browser.",
  "url": "https://devtoolz.net/csv-json",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function CSVJSON() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <CSVJSONPage />
    </>
  );
}
