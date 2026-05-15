'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { tools } from './Sidebar';

const Header = () => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="DevToolz Home">
          <Image src="/logo.svg" alt="DevToolz" width={26} height={26} className="rounded-md" />
          <span className="text-base font-bold text-white tracking-tight">DevToolz</span>
        </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open Menu" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0 bg-slate-950 border-slate-800/60">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <Link
                href="/"
                onClick={() => setSheetOpen(false)}
                className="flex items-center gap-2.5 px-4 h-14 border-b border-slate-800/60"
              >
                <Image src="/logo.svg" alt="DevToolz" width={26} height={26} className="rounded-md" />
                <span className="text-base font-bold text-white tracking-tight">DevToolz</span>
              </Link>
              <nav className="flex-1 overflow-y-auto py-3 px-2">
                <p className="px-2 mb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Tools</p>
                {tools.map((tool) => (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-colors mb-0.5',
                      pathname === tool.path
                        ? 'bg-blue-500/15 text-blue-400 font-medium'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
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
    </header>
  );
};

export default Header;
