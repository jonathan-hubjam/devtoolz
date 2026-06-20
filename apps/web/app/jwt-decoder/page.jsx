import JWTDecoderPage from '@/pages/JWTDecoderPage';

export const metadata = {
  title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
  description: 'Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.',
  openGraph: {
    title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
    description: 'Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.',
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is it safe to paste a JWT into this tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Decoding runs entirely in your browser using JavaScript — nothing is transmitted to a server. That said, avoid pasting production tokens containing sensitive data into any online tool as a best practice."
      }
    },
    {
      "@type": "Question",
      "name": "Can this tool verify the JWT signature?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Signature verification requires the secret key (HMAC) or public key (RSA/ECDSA), which you should never share with a third-party tool. This decoder only reads the payload claims."
      }
    },
    {
      "@type": "Question",
      "name": "What does \"token expired\" mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The exp claim is a Unix timestamp indicating when the token stops being valid. If the current time is past that timestamp, the token is expired and will be rejected by most servers."
      }
    }
  ]
};

export default function JWTDecoder() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <JWTDecoderPage />
    </>
  );
}
