import CronParserPage from '@/pages/CronParserPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Cron Expression Parser – Explain & Test Cron Jobs Online | DevToolz',
  description:
    'Parse cron expressions into plain English and see the next scheduled run times. Supports all standard cron syntax plus @daily, @weekly, @monthly macros.',
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Cron Parser",
  "description": "Parse cron expressions into plain English and see the next scheduled run times. Supports all standard cron syntax plus @daily, @weekly, @monthly macros.",
  "url": "https://devtoolz.net/cron-parser",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function CronParser() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <CronParserPage />
    </>
  );
}
