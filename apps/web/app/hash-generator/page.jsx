import HashGeneratorPage from '@/pages/HashGeneratorPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online | DevToolz',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.',
  openGraph: {
    title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online | DevToolz',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Hash Generator",
  "description": "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.",
  "url": "https://devtoolz.net/hash-generator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function HashGenerator() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <HashGeneratorPage />
    </>
  );
}
