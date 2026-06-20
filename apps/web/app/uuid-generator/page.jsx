import UUIDGeneratorPage from '@/pages/UUIDGeneratorPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'UUID Generator — Generate UUID v4 Online | DevToolz',
  description: 'Generate UUID v4 values online instantly. Copy single or multiple UUIDs, customize formatting, and validate UUIDs for free with DevToolz.',
  openGraph: {
    title: 'UUID Generator — Generate UUID v4 Online | DevToolz',
    description: 'Generate UUID v4 values online instantly. Copy single or multiple UUIDs, customize formatting, and validate UUIDs for free.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How likely is a UUID collision?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Extremely unlikely. With version 4 UUIDs you would need to generate about 2.7 × 10¹⁸ UUIDs before having a 50% chance of a single collision — more than the number of seconds since the Big Bang."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between UUID v4 and v7?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "UUID v4 is fully random with no time component. UUID v7 embeds a Unix millisecond timestamp in the most significant bits, making UUIDs sort chronologically — which improves database index performance for insert-heavy workloads."
      }
    },
    {
      "@type": "Question",
      "name": "Should I use uppercase or lowercase UUIDs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The RFC 4122 standard recommends lowercase. Most databases and languages accept both, but lowercase is more common in modern APIs and systems. Be consistent within your application."
      }
    }
  ]
};

export default function UUIDGenerator() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <UUIDGeneratorPage />
    </>
  );
}
