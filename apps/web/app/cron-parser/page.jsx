import CronParserPage from '@/pages/CronParserPage';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Cron Expression Parser – Explain & Test Cron Jobs Online | DevToolz',
  description:
    'Parse cron expressions into plain English and see the next scheduled run times. Supports all standard cron syntax plus @daily, @weekly, @monthly macros.',
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does */5 mean in a cron expression?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "*/5 means \"every 5 units.\" In the minutes field, */5 means every 5 minutes (at 0, 5, 10, 15 … 55). The step operator divides the allowed range by the step value."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between 0 and * in the seconds field?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "0 fires at the exact start of the minute; * fires every second. Most jobs should use 0 in the seconds field to run once per minute trigger."
      }
    },
    {
      "@type": "Question",
      "name": "Why does my cron job run twice in some hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Daylight saving time transitions can cause an hour to repeat, firing a job scheduled for that hour twice, or skip an hour, causing a job to be missed. Schedule critical jobs at times that do not fall within DST transition windows, or use UTC."
      }
    }
  ]
};

export default function CronParser() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <CronParserPage />
    </>
  );
}
