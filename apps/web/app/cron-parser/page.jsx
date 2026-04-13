import CronParserPage from '@/pages/CronParserPage';

export const metadata = {
  title: 'Cron Expression Parser – Explain & Test Cron Jobs Online | DevToolz',
  description:
    'Parse cron expressions into plain English and see the next scheduled run times. Supports all standard cron syntax plus @daily, @weekly, @monthly macros.',
};

export default function CronParser() {
  return <CronParserPage />;
}
