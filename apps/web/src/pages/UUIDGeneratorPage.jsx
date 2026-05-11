'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Trash2, CheckCircle2, XCircle, ArrowRight, FileJson, Hash, ShieldCheck, Link2, Fingerprint, Search, Clipboard, Clock, FileCode, Zap, GitCompare, CaseSensitive, CalendarClock, Database, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function formatUUID(uuid, uppercase, hyphens) {
  let result = uuid;
  if (!hyphens) result = result.replace(/-/g, '');
  return uppercase ? result.toUpperCase() : result.toLowerCase();
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_NO_HYPHEN_REGEX = /^[0-9a-f]{32}$/i;

function validateUUID(value) {
  if (!value.trim()) return null;
  let normalized = value.trim();
  if (UUID_NO_HYPHEN_REGEX.test(normalized)) {
    normalized = `${normalized.slice(0,8)}-${normalized.slice(8,12)}-${normalized.slice(12,16)}-${normalized.slice(16,20)}-${normalized.slice(20)}`;
  }
  if (UUID_V4_REGEX.test(normalized)) return { valid: true, label: 'Valid UUID v4' };
  if (UUID_REGEX.test(normalized)) {
    const version = parseInt(normalized[14], 16);
    return { valid: true, label: `Valid UUID (v${version})` };
  }
  return { valid: false, label: 'Invalid UUID' };
}

const COUNTS = [1, 5, 10, 20, 50];

const UUIDGeneratorPage = () => {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState([]);
  const [validateInput, setValidateInput] = useState('');
  const { toast } = useToast();

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, () => generateUUID()));
  }, [count]);

  useEffect(() => { generate(); }, []);

  const displayUUIDs = uuids.map(u => formatUUID(u, uppercase, hyphens));

  const handleCopyOne = async (uuid) => {
    try {
      await navigator.clipboard.writeText(uuid);
      toast({ title: 'Copied', description: uuid });
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const handleCopyAll = async () => {
    if (!displayUUIDs.length) return;
    try {
      await navigator.clipboard.writeText(displayUUIDs.join('\n'));
      toast({
        title: 'Copied all',
        description: `${displayUUIDs.length} UUID${displayUUIDs.length > 1 ? 's' : ''} copied to clipboard.`,
      });
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const validation = validateUUID(validateInput);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">UUID Generator</h1>
          <p className="text-sm text-slate-400">Generate UUID v4 values instantly. Copy individually or in bulk, customize formatting, and validate existing UUIDs.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />UUID v4 format</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Bulk generation</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">

          {/* Generator — 2/3 width */}
          <div className="lg:col-span-2 space-y-4">

            {/* Controls */}
            <div className="bg-card border rounded-xl p-5 space-y-4">
              {/* Count */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground w-16 shrink-0">Count:</span>
                <div className="flex gap-1.5">
                  {COUNTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCount(c)}
                      className={cn(
                        "px-3 py-1 text-sm rounded border font-mono transition-colors",
                        count === c
                          ? "bg-violet-500/20 text-violet-400 border-violet-500/40"
                          : "border-border text-muted-foreground hover:border-violet-500/30 hover:text-foreground"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16 shrink-0">Case:</span>
                  <div className="flex">
                    <button
                      onClick={() => setUppercase(false)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-l border font-mono transition-colors",
                        !uppercase
                          ? "bg-violet-500/20 text-violet-400 border-violet-500/40"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      aa
                    </button>
                    <button
                      onClick={() => setUppercase(true)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-r border-t border-r border-b font-mono transition-colors",
                        uppercase
                          ? "bg-violet-500/20 text-violet-400 border-violet-500/40"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      AA
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground shrink-0">Hyphens:</span>
                  <div className="flex">
                    <button
                      onClick={() => setHyphens(true)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-l border font-mono transition-colors",
                        hyphens
                          ? "bg-violet-500/20 text-violet-400 border-violet-500/40"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      with
                    </button>
                    <button
                      onClick={() => setHyphens(false)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-r border-t border-r border-b font-mono transition-colors",
                        !hyphens
                          ? "bg-violet-500/20 text-violet-400 border-violet-500/40"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      without
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Button onClick={generate} className="bg-violet-600 hover:bg-violet-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>

            {/* Output list */}
            {displayUUIDs.length > 0 && (
              <div className="bg-card border rounded-xl overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
                  {displayUUIDs.map((uuid, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors group"
                    >
                      <span className="font-mono text-sm text-foreground select-all">{uuid}</span>
                      <button
                        onClick={() => handleCopyOne(uuid)}
                        className="ml-3 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                  <span className="text-xs text-muted-foreground">
                    {displayUUIDs.length} UUID{displayUUIDs.length > 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setUuids([])}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                    </Button>
                    <Button onClick={handleCopyAll} variant="outline" size="sm" className="h-7 px-3 text-xs">
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy all
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Validate — 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-5 space-y-3 sticky top-24">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-0.5">Validate a UUID</h2>
                  <p className="text-xs text-muted-foreground">Paste any UUID to check if it's valid.</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) setValidateInput(text.trim());
                      } catch {}
                    }}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setValidateInput('')}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Clear"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={validateInput}
                onChange={(e) => setValidateInput(e.target.value)}
                placeholder="Paste UUID here..."
                className="w-full h-20 p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-shadow"
                spellCheck="false"
              />
              {validation && (
                <div className={cn(
                  "flex items-center gap-2 text-sm px-3 py-2 rounded-lg font-medium",
                  validation.valid
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-destructive/10 text-destructive"
                )}>
                  {validation.valid
                    ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                    : <XCircle className="w-4 h-4 shrink-0" />
                  }
                  {validation.label}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Related Tools */}
        <div className="border-t pt-12 mt-4">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/jwt-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-teal-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-500" />
                JWT Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Build and sign JSON Web Tokens with a custom payload and secret.</p>
            </Link>
            <Link href="/text-diff" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-green-500" />
                Text Diff
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Compare two blocks of text and highlight additions, deletions, and unchanged lines.</p>
            </Link>
            <Link href="/case-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-sky-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <CaseSensitive className="w-5 h-5 text-sky-500" />
                Case Converter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert text to camelCase, snake_case, UPPERCASE, kebab-case, and more.</p>
            </Link>
            <Link href="/cron-parser" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-yellow-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-yellow-500" />
                Cron Parser
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Parse cron expressions into plain English and see the next scheduled run times.</p>
            </Link>
            <Link href="/sql-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-fuchsia-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Database className="w-5 h-5 text-fuchsia-500" />
                SQL Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format and minify SQL queries with dialect support for MySQL, PostgreSQL, SQLite, and more.</p>
            </Link>
            <Link href="/csv-json" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-emerald-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Table2 className="w-5 h-5 text-emerald-500" />
                CSV ↔ JSON
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert CSV to JSON or JSON to CSV with support for custom delimiters and quoted fields.</p>
            </Link>
              <Link
                href="/number-base-converter"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-pink-500/30 transition-all group/card"
              >
                <div className="w-8 h-8 rounded-md bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0">
                  <Binary className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover/card:text-pink-400 transition-colors">Number Base Converter</div>
                  <div className="text-xs text-slate-500">Decimal, hex, octal, binary</div>
                </div>
              </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-foreground">UUID v4:</span> Universally Unique Identifiers are 128-bit values used to uniquely identify resources. Version 4 uses random data, making collisions astronomically unlikely — roughly 1 in 5.3×10³⁶.
            </p>
            <p className="text-xs text-muted-foreground">
              Uses the browser's native <code className="font-mono">crypto.randomUUID()</code> API — all generation happens locally, nothing is sent to a server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UUIDGeneratorPage;
