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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are JSON and YAML fully interchangeable?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nearly. Every valid JSON document is also valid YAML, but YAML supports features JSON does not — such as comments, anchors, and aliases. Comments are lost when converting YAML to JSON. Multi-document YAML files (separated by ---) also cannot be represented as a single JSON document."
      }
    },
    {
      "@type": "Question",
      "name": "Why does YAML use indentation instead of braces?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YAML was designed for human readability. Indentation removes the visual noise of braces and quotes, making configuration files easier to write and review. The trade-off is that indentation errors are a common source of bugs."
      }
    },
    {
      "@type": "Question",
      "name": "Which format should I use for config files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YAML is the standard for Kubernetes, Docker Compose, GitHub Actions, and most DevOps tooling. JSON is better for API payloads, web storage, and situations where comments are not needed and strict parsing is important."
      }
    }
  ]
};

export default function JSONYAMLConverter() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JSONYAMLConverterPage />
    </>
  );
}
