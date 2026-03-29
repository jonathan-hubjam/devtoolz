import UnixTimestampPage from '@/pages/UnixTimestampPage';

export const metadata = {
  title: 'Unix Timestamp Converter – Seconds to Date & Back | DevToolz',
  description: 'Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.',
  openGraph: {
    title: 'Unix Timestamp Converter – Seconds to Date & Back | DevToolz',
    description: 'Convert Unix timestamps to human-readable dates and back instantly. Supports seconds and milliseconds, shows UTC and local time.',
  },
};

export default function UnixTimestamp() {
  return <UnixTimestampPage />;
}
