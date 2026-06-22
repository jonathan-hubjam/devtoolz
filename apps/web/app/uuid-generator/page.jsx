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

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "UUID Generator",
  "description": "Generate UUID v4 values online instantly. Copy single or multiple UUIDs, customize formatting, and validate UUIDs for free with DevToolz.",
  "url": "https://devtoolz.net/uuid-generator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function UUIDGenerator() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <UUIDGeneratorPage />
    </>
  );
}
