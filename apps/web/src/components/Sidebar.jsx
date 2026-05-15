'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const tools = [
  { name: 'Base64 Encoder',        path: '/base64-encoder' },
  { name: 'Case Converter',        path: '/case-converter' },
  { name: 'Color Converter',       path: '/color-converter' },
  { name: 'Cron Parser',           path: '/cron-parser' },
  { name: 'CSV ↔ JSON',            path: '/csv-json' },
  { name: 'Hash Generator',        path: '/hash-generator' },
  { name: 'JSON Formatter',        path: '/json-formatter' },
  { name: 'JSON ↔ YAML',           path: '/json-yaml-converter' },
  { name: 'JWT Decoder',           path: '/jwt-decoder' },
  { name: 'JWT Generator',         path: '/jwt-generator' },
  { name: 'Number Base Converter', path: '/number-base-converter' },
  { name: 'Regex Tester',          path: '/regex-tester' },
  { name: 'SQL Formatter',         path: '/sql-formatter' },
  { name: 'Text Diff',             path: '/text-diff' },
  { name: 'Unix Timestamp',        path: '/unix-timestamp' },
  { name: 'URL Encoder',           path: '/url-encoder' },
  { name: 'UUID Generator',        path: '/uuid-generator' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 fixed top-0 left-0 h-screen bg-slate-950 border-r border-slate-800/60 z-40">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-4 h-14 border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors shrink-0"
        aria-label="DevToolz Home"
      >
        <Image src="/logo.svg" alt="DevToolz" width={26} height={26} className="rounded-md" />
        <span className="text-base font-bold text-white tracking-tight">DevToolz</span>
      </Link>

      {/* Tool list */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="px-2 mb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Tools</p>
        {tools.map((tool) => (
          <Link
            key={tool.path}
            href={tool.path}
            className={cn(
              'block px-3 py-1.5 rounded-md text-sm transition-colors mb-0.5',
              pathname === tool.path
                ? 'bg-blue-500/15 text-blue-400 font-medium'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
            )}
          >
            {tool.name}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-slate-800/60 shrink-0">
        <p className="text-[11px] text-slate-600">© 2025 DevToolz</p>
      </div>
    </aside>
  );
}
