import Base64EncoderPage from '@/pages/Base64EncoderPage';

export const metadata = {
  title: 'Base64 Encoder & Decoder – Free Online Tool | DevToolz',
  description: 'Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.',
  openGraph: {
    title: 'Base64 Encoder & Decoder – Free Online Tool | DevToolz',
    description: 'Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Base64 a form of encryption?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Base64 is encoding, not encryption. It is trivially reversible by anyone with the encoded string. Never use Base64 to protect sensitive data — use proper encryption algorithms like AES-256 instead."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between standard and URL-safe Base64?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard Base64 uses + and /, which have special meanings in URLs. URL-safe Base64 replaces them with - and _, making the output safe to embed in URLs and filenames without percent-encoding."
      }
    },
    {
      "@type": "Question",
      "name": "Why does my Base64 string end with == ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Padding characters (=) are added to make the encoded length a multiple of 4. One or two padding characters appear when the input byte count is not divisible by 3."
      }
    }
  ]
};

export default function Base64Encoder() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Base64EncoderPage />
    </>
  );
}
