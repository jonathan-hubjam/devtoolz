import JWTDecoderPage from '@/pages/JWTDecoderPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
  description: 'Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.',
  openGraph: {
    title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
    description: 'Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JWT Decoder",
  "description": "Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.",
  "url": "https://devtoolz.net/jwt-decoder",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function JWTDecoder() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <JWTDecoderPage />
    </>
  );
}
