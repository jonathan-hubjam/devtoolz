'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, AlignLeft, Minimize2, AlertCircle, CheckCircle2, ArrowRight, Clipboard, FileJson, FileCode, ShieldCheck, Hash, Clock, Link2, Fingerprint, Search, KeyRound, Zap, GitCompare, CaseSensitive, CalendarClock, Database, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function parseJsonError(err, text) {
  const msg = err.message;

  // Chrome: "Unexpected token 'x', ..."xyz"..." at position 5"
  const posMatch = msg.match(/at position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1]);
    const before = text.slice(0, pos);
    const lines = before.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    return `Unexpected token at line ${line}, column ${col}`;
  }

  // Firefox: "at line X column Y of the JSON data"
  const lineColMatch = msg.match(/line (\d+) column (\d+)/);
  if (lineColMatch) {
    return `Unexpected token at line ${lineColMatch[1]}, column ${lineColMatch[2]}`;
  }

  // Clean up common patterns
  if (/unexpected end/i.test(msg)) return 'Unexpected end of input — check for unclosed brackets or braces';
  if (/unexpected token/i.test(msg)) return 'Unexpected token — check for missing quotes, commas, or colons';

  return msg.replace(/^JSON\.parse:\s*/i, '').replace(/\s+of the JSON data\.?$/i, '');
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((k) => [k, sortKeysDeep(value[k])])
    );
  }
  return value;
}

const INDENT_OPTIONS = [
  { label: '2', value: 2 },
  { label: '4', value: 4 },
  { label: '⇥', value: '\t' },
];

const JSONFormatterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('format'); // 'format' | 'minify'
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [sizeInfo, setSizeInfo] = useState(null); // { from, to }
  const { toast } = useToast();

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      setSizeInfo(null);
      return;
    }

    try {
      let parsed = JSON.parse(input);
      setError(null);

      if (mode === 'format') {
        if (sortKeys) parsed = sortKeysDeep(parsed);
        setOutput(JSON.stringify(parsed, null, indent));
        setSizeInfo(null);
      } else {
        const minified = JSON.stringify(parsed);
        setOutput(minified);
        setSizeInfo({
          from: new Blob([input]).size,
          to: new Blob([minified]).size,
        });
      }
    } catch (err) {
      setError(parseJsonError(err, input));
    }
  }, [input, mode, indent, sortKeys]);

  const handleFormat = () => {
    setMode('format');
    if (!input.trim()) return;
    try {
      JSON.parse(input);
    } catch (err) {
      toast({ title: 'Invalid JSON', description: 'Fix the errors before formatting.', variant: 'destructive' });
    }
  };

  const handleMinify = () => {
    setMode('minify');
    if (!input.trim()) return;
    try {
      JSON.parse(input);
    } catch (err) {
      toast({ title: 'Invalid JSON', description: 'Fix the errors before minifying.', variant: 'destructive' });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast({ title: 'Clipboard empty', description: 'There is no text in your clipboard to paste.', variant: 'destructive' });
        return;
      }
      setInput(text);
      toast({ title: 'Pasted successfully', description: 'Content pasted from clipboard and auto-formatted.' });
    } catch {
      toast({ title: 'Paste failed', description: 'Clipboard is empty or inaccessible.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setSizeInfo(null);
    toast({ title: 'Cleared', description: 'Input and output have been cleared.' });
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied to clipboard', description: 'The JSON output has been copied to your clipboard.' });
    } catch {
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">JSON Formatter & Validator</h1>
          <p className="text-sm text-slate-400">Format, validate, and beautify JSON instantly. Paste raw JSON to make it readable, fix errors, and minify for production.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Real-time formatting</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Instant validation</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

          {/* Input */}
          <div className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between h-8 mb-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="p-1.5 rounded-md icon-primary">
                  <FileJson className="w-4 h-4" />
                </div>
                Input JSON
              </label>
              <div className="flex items-center gap-2">
                {error ? (
                  <span className="flex items-center text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-md">
                    <AlertCircle className="w-3 h-3 mr-1" /> Invalid
                  </span>
                ) : input.trim() ? (
                  <span className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Valid JSON
                  </span>
                ) : null}
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"example": "Paste your JSON here..."}'
              className={cn(
                "flex-1 w-full p-4 font-mono text-sm bg-muted/30 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow",
                error ? "border-destructive focus:ring-destructive/50" : "border-border"
              )}
              spellCheck="false"
            />

            <div className="mt-2 space-y-2">
              {error && (
                <div className="text-sm text-destructive flex items-center animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Primary actions */}
              <div className="flex flex-wrap lg:flex-nowrap gap-2">
                <Button onClick={handlePaste} variant="default" className="flex-1 lg:flex-none whitespace-nowrap">
                  <Clipboard className="w-4 h-4 mr-2" /> Paste
                </Button>
                <Button onClick={handleFormat} variant={mode === 'format' ? 'secondary' : 'outline'} disabled={!input.trim()} className="flex-1 lg:flex-none whitespace-nowrap">
                  <AlignLeft className="w-4 h-4 mr-2" /> Format
                </Button>
                <Button onClick={handleMinify} variant={mode === 'minify' ? 'secondary' : 'outline'} disabled={!input.trim()} className="flex-1 lg:flex-none whitespace-nowrap">
                  <Minimize2 className="w-4 h-4 mr-2" /> Minify
                </Button>
                <Button onClick={handleClear} variant="ghost" disabled={!input.trim() && !output} className="flex-1 lg:flex-none whitespace-nowrap text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2" /> Clear
                </Button>
              </div>

              {/* Secondary options — indent + sort keys */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Indent:</span>
                  {INDENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => { setIndent(opt.value); if (mode !== 'format') setMode('format'); }}
                      className={cn(
                        "px-2 py-0.5 text-xs rounded border font-mono transition-colors",
                        indent === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sortKeys}
                    onChange={(e) => setSortKeys(e.target.checked)}
                    className="rounded border-border accent-primary w-3.5 h-3.5"
                  />
                  <span className="text-xs text-muted-foreground">Sort keys</span>
                </label>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between h-8 mb-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="p-1.5 rounded-md icon-success">
                  <FileCode className="w-4 h-4" />
                </div>
                Output
                <span className="text-muted-foreground font-normal">
                  ({mode === 'format' ? 'Formatted' : 'Minified'})
                </span>
              </label>
              {sizeInfo && (
                <span className="text-xs text-muted-foreground font-mono">
                  {formatBytes(sizeInfo.from)} → {formatBytes(sizeInfo.to)}
                </span>
              )}
            </div>

            <textarea
              value={output}
              readOnly
              placeholder="Formatted or minified JSON will appear here instantly..."
              className={cn(
                "flex-1 w-full p-4 font-mono text-sm bg-muted/50 border rounded-lg resize-none focus:outline-none transition-colors",
                error ? "border-destructive/30 text-muted-foreground" : "border-border text-foreground"
              )}
              style={{ tabSize: indent === '\t' ? 8 : undefined }}
              spellCheck="false"
            />

            <div className="mt-2">
              <div className="flex justify-center">
                <Button onClick={handleCopy} variant="default" disabled={!output} className="px-8 whitespace-nowrap">
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Related Tools */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="text-sm text-slate-400">Encode and decode strings or files using Base64 encoding.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />
                Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />
                UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate UUID v4 values instantly, with bulk generation and validation.</p>
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
              <span className="font-semibold text-foreground">JSON formatting:</span> JSON (JavaScript Object Notation) is a lightweight data-interchange format. Formatting adds indentation for readability; minifying removes it to reduce file size.
            </p>
            <p className="text-xs text-muted-foreground">
              Uses the browser's native <code className="font-mono">JSON.parse</code> and <code className="font-mono">JSON.stringify</code> — all processing happens locally, nothing is sent to a server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatterPage;
