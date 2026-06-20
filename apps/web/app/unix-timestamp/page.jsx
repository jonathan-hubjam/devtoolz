import UnixTimestampPage from '@/pages/UnixTimestampPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Unix Timestamp Converter – Seconds to Date & Back | DevToolz',
  description: 'Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.',
  openGraph: {
    title: 'Unix Timestamp Converter – Seconds to Date & Back | DevToolz',
    description: 'Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What happens after the year 2038?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The \"Year 2038 problem\" affects systems that store Unix timestamps as a 32-bit signed integer — it overflows on 19 January 2038. Modern systems use 64-bit integers, which will not overflow for about 292 billion years."
      }
    },
    {
      "@type": "Question",
      "name": "Does the Unix timestamp account for timezones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. A Unix timestamp always represents a moment in UTC. Timezone conversion happens only at the display layer — the underlying number is the same everywhere in the world at the same instant."
      }
    },
    {
      "@type": "Question",
      "name": "Is the timestamp in seconds or milliseconds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The original Unix standard uses seconds. JavaScript's Date.now() returns milliseconds. Many modern APIs (including some databases) use milliseconds. A 13-digit timestamp is almost certainly in milliseconds; a 10-digit one is in seconds."
      }
    }
  ]
};

export default function UnixTimestamp() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <UnixTimestampPage />
    </>
  );
}
