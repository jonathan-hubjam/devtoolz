'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'JSON Formatter', path: '/json-formatter' },
    { name: 'Base64 Encoder', path: '/base64-encoder' },
    { name: 'JWT Decoder', path: '/jwt-decoder' },
    { name: 'Unix Timestamp', path: '/unix-timestamp' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md group"
            aria-label="DevToolz Home"
          >
            <Image src="/logo.svg" alt="DevToolz" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">DevToolz</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-2",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Menu" className="hover:text-primary hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="flex items-center gap-2 group">
                    <Image src="/logo.svg" alt="DevToolz" width={32} height={32} className="rounded-lg" />
                    <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">DevToolz</span>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          href={link.path}
                          className={cn(
                            "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                          )}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;