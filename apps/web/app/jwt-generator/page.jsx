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

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JWT Generator",
  "description": "Generate signed JSON Web Tokens (JWT) in your browser. Set a custom header, payload, and HMAC secret. Supports HS256, HS384, and HS512. Free and private.",
  "url": "https://devtoolz.net/jwt-generator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function JWTGenerator() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <JWTGeneratorPage />
    </>
  );
}
