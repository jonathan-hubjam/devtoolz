import URLEncoderPage from '@/pages/URLEncoderPage';

export const metadata = {
  title: 'URL Encoder & Decoder – Percent-Encode URLs Online | DevToolz',
  description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.',
  openGraph: {
    title: 'URL Encoder & Decoder – Percent-Encode URLs Online | DevToolz',
    description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between encodeURI and encodeURIComponent?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "encodeURI is designed for full URLs — it preserves characters like :, /, ?, and # that have structural meaning. encodeURIComponent encodes those characters too, making it suitable for individual query parameter values."
      }
    },
    {
      "@type": "Question",
      "name": "Why is a space sometimes encoded as + instead of %20?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The + encoding for spaces is part of the application/x-www-form-urlencoded format used by HTML forms — it is not standard percent-encoding. Modern APIs typically prefer %20; always check what the target system expects."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to encode the entire URL or just parts of it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Only encode the dynamic parts — query parameter names and values, path segments that contain special characters. Encoding the whole URL would break the structural characters (://, /, ?, &) that define URL structure."
      }
    }
  ]
};

export default function URLEncoder() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <URLEncoderPage />
    </>
  );
}
