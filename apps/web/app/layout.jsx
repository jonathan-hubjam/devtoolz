import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import FaviconLoader from '@/components/FaviconLoader';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'DevToolz - Free Developer Tools',
  description: 'Free online developer tools for formatting, encoding and debugging.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'DevToolz - Free Developer Tools',
    description: 'Free online developer tools for formatting, encoding and debugging.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <FaviconLoader />
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Toaster />
        </div>
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="02567dea-c872-453c-9ff4-3247b288e15e" />
      </body>
    </html>
  );
}
