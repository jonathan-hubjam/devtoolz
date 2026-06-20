import CSVJSONPage from '@/pages/CSVJSONPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'CSV to JSON Converter – Convert CSV ↔ JSON Online | DevToolz',
  description:
    'Convert CSV to JSON or JSON to CSV instantly online. Supports custom delimiters, quoted fields, header rows, and pretty-print output. Runs entirely in your browser.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What happens with nested JSON objects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CSV is a flat format — it cannot represent nested structures directly. Nested objects are typically serialised as a JSON string in a single CSV cell, or flattened into dot-notation column names (e.g. address.city). This tool serialises nested values as strings."
      }
    },
    {
      "@type": "Question",
      "name": "My CSV uses semicolons, not commas — will it work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Semicolon-separated files are common in European locales where commas are used as decimal separators. Select the correct delimiter in the options to handle semicolon, tab (TSV), or pipe-separated files."
      }
    },
    {
      "@type": "Question",
      "name": "Are all values treated as strings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By default, yes — CSV has no type information. The converter can optionally infer types (treating 123 as a number and true/false as booleans) when converting to JSON."
      }
    }
  ]
};

export default function CSVJSON() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <CSVJSONPage />
    </>
  );
}
