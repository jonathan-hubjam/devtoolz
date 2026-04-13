'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CaseSensitive, Copy, Trash2, Clipboard, CheckCircle2, ArrowRight, FileJson, Hash, ShieldCheck, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap, GitCompare, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── Word splitting ────────────────────────────────────────────────────────
// Handles: space-separated, camelCase, PascalCase, snake_case, kebab-case
function toWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_./]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function cap(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// ─── Conversions ───────────────────────────────────────────────────────────
const CASES = [
  {
    id: 'lower',
    label: 'lowercase',
    description: 'All letters in lower case',
    mono: false,
    convert: (s) => s.toLowerCase(),
  },
  {
    id: 'upper',
    label: 'UPPERCASE',
    description: 'All letters in upper case',
    mono: false,
    convert: (s) => s.toUpperCase(),
  },
  {
    id: 'title',
    label: 'Title Case',
    description: 'First letter of each word capitalised',
    mono: false,
    convert: (s) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()),
  },
  {
    id: 'sentence',
    label: 'Sentence case',
    description: 'First letter of each sentence capitalised',
    mono: false,
    convert: (s) =>
      s.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (c) => c.toUpperCase()),
  },
  {
    id: 'camel',
    label: 'camelCase',
    description: 'No spaces, each word capitalised except the first',
    mono: true,
    convert: (s) => {
      const words = toWords(s);
      if (!words.length) return '';
      return words[0].toLowerCase() + words.slice(1).map(cap).join('');
    },
  },
  {
    id: 'pascal',
    label: 'PascalCase',
    description: 'No spaces, every word capitalised',
    mono: true,
    convert: (s) => toWords(s).map(cap).join(''),
  },
  {
    id: 'snake',
    label: 'snake_case',
    description: 'Lowercase words joined by underscores',
    mono: true,
    convert: (s) => toWords(s).map((w) => w.toLowerCase()).join('_'),
  },
  {
    id: 'kebab',
    label: 'kebab-case',
    description: 'Lowercase words joined by hyphens',
    mono: true,
    convert: (s) => toWords(s).map((w) => w.toLowerCase()).join('-'),
  },
  {
    id: 'constant',
    label: 'CONSTANT_CASE',
    description: 'Uppercase words joined by underscores',
    mono: true,
    convert: (s) => toWords(s).map((w) => w.toUpperCase()).join('_'),
  },
  {
    id: 'alternating',
    label: 'aLtErNaTiNg',
    description: 'Alternates between lower and upper case letters',
    mono: false,
    convert: (s) => {
      let n = 0;
      return s
        .split('')
        .map((c) => (/[a-zA-Z]/.test(c) ? (n++ % 2 === 0 ? c.toLowerCase() : c.toUpperCase()) : c))
        .join('');
    },
  },
];

// ─── Main component ────────────────────────────────────────────────────────
export default function CaseConverterPage() {
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const results = useMemo(
    () => CASES.map((c) => ({ ...c, output: input ? c.convert(input) : '' })),
    [input]
  );

  const wordCount = useMemo(() => {
    if (!input.trim()) return 0;
    return input.trim().split(/\s+/).length;
  }, [input]);

  const charCount = input.length;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) { toast({ title: 'Clipboard empty', variant: 'destructive' }); return; }
      setInput(text);
      toast({ title: 'Pasted', description: 'Text pasted from clipboard.' });
    } catch {
      toast({ title: 'Paste failed', description: 'Clipboard inaccessible.', variant: 'destructive' });
    }
  };

  const handleCopy = async (text, label) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: `${label} copied to clipboard.` });
  };

  const handleClear = () => {
    setInput('');
    toast({ title: 'Cleared' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Case Converter</h1>
          <p className="text-sm text-slate-400">
            Paste any text and instantly convert it to lowercase, UPPERCASE, camelCase, snake_case, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />10 case formats</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Live conversion</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              Input text
              {charCount > 0 && (
                <span className="ml-2 text-xs text-muted-foreground/70">
                  {charCount.toLocaleString()} char{charCount !== 1 ? 's' : ''} · {wordCount.toLocaleString()} word{wordCount !== 1 ? 's' : ''}
                </span>
              )}
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5" /> Paste
              </button>
              <button
                onClick={handleClear}
                disabled={!input}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type your text here — all formats update instantly below…"
            className="w-full h-36 p-3 text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-shadow"
            spellCheck="false"
          />
        </div>

        {/* Output grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((c) => (
            <div
              key={c.id}
              className={cn(
                'group relative flex flex-col gap-2 p-4 rounded-xl border bg-card transition-all',
                input
                  ? 'hover:border-sky-500/40 hover:shadow-md hover:-translate-y-0.5'
                  : 'opacity-60'
              )}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={cn('text-sm font-semibold', c.mono ? 'font-mono' : '')}>{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                </div>
                <button
                  onClick={() => handleCopy(c.output, c.label)}
                  disabled={!input}
                  className={cn(
                    'shrink-0 p-1.5 rounded-md transition-all',
                    input
                      ? 'text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 opacity-0 group-hover:opacity-100'
                      : 'opacity-0'
                  )}
                  title={`Copy ${c.label}`}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Output preview */}
              <div
                className={cn(
                  'min-h-[2.5rem] max-h-24 overflow-y-auto rounded-md px-3 py-2 text-sm break-all',
                  c.mono ? 'font-mono' : '',
                  input ? 'bg-muted/50 text-foreground' : 'bg-muted/20 text-muted-foreground/40'
                )}
              >
                {input ? c.output || <span className="text-muted-foreground/50 italic text-xs">No output</span> : <span className="text-xs italic">—</span>}
              </div>

              {/* Full-width copy button — visible on mobile / when hovering */}
              {input && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(c.output, c.label)}
                  className="w-full text-xs text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 sm:hidden"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy {c.label}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Related Tools */}
        <div className="border-t pt-12 mt-4">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/text-diff" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-green-500" />
                Text Diff
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Compare two blocks of text and highlight additions, deletions, and unchanged lines.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode strings using Base64 encoding.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />
                Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/jwt-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-teal-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-500" />
                JWT Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Build and sign JSON Web Tokens with a custom payload and secret.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />
                UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate UUID v4 values instantly, with bulk generation and validation.</p>
            </Link>
            <Link href="/cron-parser" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-yellow-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-yellow-500" />
                Cron Parser
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Parse cron expressions into plain English and see the next scheduled run times.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Smart word splitting:</span> Input is automatically split into words regardless of whether it uses spaces, <code className="font-mono text-xs">camelCase</code>, <code className="font-mono text-xs">snake_case</code>, or <code className="font-mono text-xs">kebab-case</code> — so all identifier-style formats convert correctly in both directions.
            </p>
            <p className="text-xs text-muted-foreground">
              All conversion happens locally in your browser. No text is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
