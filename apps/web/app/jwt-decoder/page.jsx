import JWTDecoderPage from '@/pages/JWTDecoderPage';

export const metadata = {
  title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
  description: 'Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.',
  openGraph: {
    title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
    description: 'Decode and inspect JWT tokens instantly. View payload data, expiration times, and token structure to debug authentication and API requests.',
  },
};

export default function JWTDecoder() {
  return <JWTDecoderPage />;
}
