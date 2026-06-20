import JSONFormatterPage from '@/pages/JSONFormatterPage';

export const metadata = {
  title: 'JSON Formatter & Validator – Free Online Tool | DevToolz',
  description: 'Format, validate and beautify JSON instantly with this free online JSON formatter and validator from DevToolz.',
  openGraph: {
    title: 'JSON Formatter & Validator – Free Online Tool | DevToolz',
    description: 'Format, validate and beautify JSON instantly with this free online JSON formatter and validator from DevToolz.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between JSON and JavaScript objects?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JSON requires keys to be double-quoted strings and does not support functions, undefined, or comments. JavaScript objects are more permissive. Always use a JSON formatter/validator to check that your data strictly conforms to the JSON spec."
      }
    },
    {
      "@type": "Question",
      "name": "Why does the formatter reorder my keys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The JSON specification does not guarantee key order. Some parsers sort keys alphabetically for predictability. If you need a specific order, you will need to construct the object manually or use a serialization library that supports ordered output."
      }
    },
    {
      "@type": "Question",
      "name": "Can I format very large JSON files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Browser-based formatters can handle files up to a few megabytes comfortably. For very large files (10 MB+) consider using a CLI tool like jq or a native desktop application to avoid browser memory limits."
      }
    }
  ]
};

export default function JSONFormatter() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <JSONFormatterPage />
    </>
  );
}
