import UUIDGeneratorPage from '@/pages/UUIDGeneratorPage';

export const metadata = {
  title: 'UUID Generator — Generate UUID v4 Online | DevToolz',
  description: 'Generate UUID v4 values online instantly. Copy single or multiple UUIDs, customize formatting, and validate UUIDs for free with DevToolz.',
  openGraph: {
    title: 'UUID Generator — Generate UUID v4 Online | DevToolz',
    description: 'Generate UUID v4 values online instantly. Copy single or multiple UUIDs, customize formatting, and validate UUIDs for free.',
  },
};

export default function UUIDGenerator() {
  return <UUIDGeneratorPage />;
}
