import Base64EncoderPage from '@/pages/Base64EncoderPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Base64 Encoder & Decoder – Free Online Tool | DevToolz',
  description: 'Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.',
  openGraph: {
    title: 'Base64 Encoder & Decoder – Free Online Tool | DevToolz',
    description: 'Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Base64 Encoder",
  "description": "Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.",
  "url": "https://devtoolz.net/base64-encoder",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function Base64Encoder() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <Base64EncoderPage />
    </>
  );
}
