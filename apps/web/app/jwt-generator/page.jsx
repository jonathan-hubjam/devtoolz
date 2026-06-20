import JWTGeneratorPage from '@/pages/JWTGeneratorPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'JWT Generator — Build & Sign JSON Web Tokens Online | DevToolz',
  description: 'Generate signed JSON Web Tokens (JWT) in your browser. Set a custom header, payload, and HMAC secret. Supports HS256, HS384, and HS512. Free and private.',
  openGraph: {
    title: 'JWT Generator — Build & Sign JSON Web Tokens Online | DevToolz',
    description: 'Generate signed JSON Web Tokens (JWT) in your browser. Supports HS256, HS384, and HS512. Free and private.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is it safe to use this tool with real secrets?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Signing runs in your browser and nothing is transmitted, but treat production secrets with care. For sensitive environments, prefer generating tokens locally with a library like jsonwebtoken (Node.js) rather than any online tool."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between HS256 and RS256?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HS256 uses a shared secret (HMAC-SHA256) — both the issuer and verifier need the same key, so it is only suitable when you control both sides. RS256 uses an RSA private key to sign and a public key to verify — the public key can be shared freely, making it suitable for public-facing APIs."
      }
    },
    {
      "@type": "Question",
      "name": "What should I put in the payload?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Include only the claims your application needs: user ID, roles, expiry, and issuer. Avoid storing sensitive data (passwords, PII) in the payload — JWT payloads are Base64-encoded, not encrypted, so anyone with the token can read them."
      }
    }
  ]
};

export default function JWTGenerator() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JWTGeneratorPage />
    </>
  );
}
