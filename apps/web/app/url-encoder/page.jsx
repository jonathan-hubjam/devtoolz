import URLEncoderPage from '@/pages/URLEncoderPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'URL Encoder & Decoder – Percent-Encode URLs Online | DevToolz',
  description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.',
  openGraph: {
    title: 'URL Encoder & Decoder – Percent-Encode URLs Online | DevToolz',
    description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "URL Encoder",
  "description": "Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.",
  "url": "https://devtoolz.net/url-encoder",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function URLEncoder() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <URLEncoderPage />
    </>
  );
}
