import URLEncoderPage from '@/pages/URLEncoderPage';

export const metadata = {
  title: 'URL Encoder & Decoder – Percent-Encode URLs Online | DevToolz',
  description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.',
  openGraph: {
    title: 'URL Encoder & Decoder – Percent-Encode URLs Online | DevToolz',
    description: 'Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.',
  },
};

export default function URLEncoder() {
  return <URLEncoderPage />;
}
