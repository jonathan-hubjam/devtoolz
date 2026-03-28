import Base64EncoderPage from '@/pages/Base64EncoderPage';

export const metadata = {
  title: 'Base64 Encoder & Decoder – Free Online Tool | DevToolz',
  description: 'Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.',
  openGraph: {
    title: 'Base64 Encoder & Decoder – Free Online Tool | DevToolz',
    description: 'Encode and decode Base64 instantly with this free online tool. Convert plain text to Base64 or decode Base64 strings for use in APIs, data transfer, and debugging.',
  },
};

export default function Base64Encoder() {
  return <Base64EncoderPage />;
}
