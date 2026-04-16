'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const tools = [
  { name: 'Base64 Encoder', path: '/base64-encoder' },
  { name: 'Case Converter', path: '/case-converter' },
  { name: 'Cron Parser', path: '/cron-parser' },
  { name: 'Hash Generator', path: '/hash-generator' },
  { name: 'JSON Formatter', path: '/json-formatter' },
  { name: 'JSON ↔ YAML', path: '/json-yaml-converter' },
  { name: 'JWT Decoder', path: '/jwt-decoder' },
  { name: 'JWT Generator', path: '/jwt-generator' },
  { name: 'Regex Tester', path: '/regex-tester' },
  { name: 'SQL Formatter', path: '/sql-formatter' },
  { name: 'Text Diff', path: '/text-diff' },
  { name: 'Unix Timestamp', path: '/unix-timestamp' },
  { name: 'URL Encoder', path: '/url-encoder' },
  { name: 'UUID Generator', path: '/uuid-generator' },
];

const Header = () => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTool = tools.find((t) => t.path === pathname);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md group"
            aria-label="DevToolz Home"
          >
            <Image src="/logo.svg" alt="DevToolz" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">DevToolz</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary py-2",
                  activeTool ? "text-primary" : "text-muted-foreground"
                )}
              >
                {activeTool ? activeTool.name : 'Tools'}
                <ChevronDown className={cn("w-4 h-4 transition-transform", dropdownOpen && "rotate-180")} />
                {activeTool && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-background border rounded-xl shadow-lg py-1 z-50">
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      href={tool.path}
                      onClick={() => setDropdownOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 text-sm transition-colors hover:bg-muted hover:text-primary",
                        pathname === tool.path ? "text-primary font-medium bg-muted/50" : "text-muted-foreground"
                      )}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                    {tools.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={() => setSheetOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                          pathname === tool.path
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        {tool.name}
                      </Link>
                    ))}
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
