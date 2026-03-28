import './globals.css';
import Header from '@/components/Header';
import FaviconLoader from '@/components/FaviconLoader';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'DevToolz - Free Developer Tools',
  description: 'Free online developer tools for formatting, encoding and debugging.',
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
      </body>
    </html>
  );
}
