import HashGeneratorPage from '@/pages/HashGeneratorPage';

export const metadata = {
  title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online | DevToolz',
  description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.',
  openGraph: {
    title: 'Hash Generator – MD5, SHA-1, SHA-256, SHA-512 Online | DevToolz',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. All hashing runs locally in your browser — no data is sent anywhere.',
  },
};

export default function HashGenerator() {
  return <HashGeneratorPage />;
}
