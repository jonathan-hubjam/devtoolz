import HashGeneratorPage from '@/pages/HashGeneratorPage';

export const metadata = {
  title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online | DevToolz',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.',
  openGraph: {
    title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online | DevToolz',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Should I use MD5 or SHA-256 for checksums?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SHA-256 is preferred for anything security-related because MD5 is vulnerable to collision attacks. For non-security checksums (detecting accidental data corruption), MD5 is fast and still reliable."
      }
    },
    {
      "@type": "Question",
      "name": "Can two different inputs produce the same hash?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — this is called a \"collision.\" Modern algorithms like SHA-256 make finding collisions computationally infeasible. MD5 and SHA-1 have known collision vulnerabilities, which is why they are not recommended for digital signatures or certificates."
      }
    },
    {
      "@type": "Question",
      "name": "Is hashing the same as encryption?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Hashing is one-way and cannot be reversed. Encryption is two-way — data can be decrypted with the correct key. Use hashing for integrity checks and storing passwords (with a salt); use encryption when you need to recover the original data."
      }
    }
  ]
};

export default function HashGenerator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HashGeneratorPage />
    </>
  );
}
