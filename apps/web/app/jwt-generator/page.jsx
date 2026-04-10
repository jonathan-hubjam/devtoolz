import JWTGeneratorPage from '@/pages/JWTGeneratorPage';

export const metadata = {
  title: 'JWT Generator — Build & Sign JSON Web Tokens Online | DevToolz',
  description: 'Generate signed JSON Web Tokens (JWT) in your browser. Set a custom header, payload, and HMAC secret. Supports HS256, HS384, and HS512. Free and private.',
  openGraph: {
    title: 'JWT Generator — Build & Sign JSON Web Tokens Online | DevToolz',
    description: 'Generate signed JSON Web Tokens (JWT) in your browser. Supports HS256, HS384, and HS512. Free and private.',
  },
};

export default function JWTGenerator() {
  return <JWTGeneratorPage />;
}
