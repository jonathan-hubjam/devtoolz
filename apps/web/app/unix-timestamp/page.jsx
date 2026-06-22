import UnixTimestampPage from '@/pages/UnixTimestampPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Unix Timestamp Converter – Seconds to Date & Back | DevToolz',
  description: 'Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.',
  openGraph: {
    title: 'Unix Timestamp Converter – Seconds to Date & Back | DevToolz',
    description: 'Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Unix Timestamp",
  "description": "Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.",
  "url": "https://devtoolz.net/unix-timestamp",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function UnixTimestamp() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <UnixTimestampPage />
    </>
  );
}
