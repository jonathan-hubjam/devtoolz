'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Table2, Copy, Clipboard, Trash2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeftRight, FileJson, Hash, ShieldCheck, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap, GitCompare, CaseSensitive, CalendarClock, Database, Binary, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── CSV parser ────────────────────────────────────────────────────────────
function parseCSV(text, delimiter = ',') {
  const rows = [];
  let cur = [], field = '', inQuotes = false;
  let i = 0;

  const flushField = () => { cur.push(field); field = ''; };
  const flushRow  = () => {
    flushField();
    if (cur.length > 1 || (cur.length === 1 && cur[0] !== '')) rows.push(cur);
    cur = [];
  };

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (ch === '"') { inQuotes = false; i++; continue; }
      field += ch;
    } else {
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === delimiter) { flushField(); i++; continue; }
      if (ch === '\n') { flushRow(); i++; continue; }
      if (ch === '\r') { i++; continue; }
      field += ch;
    }
    i++;
  }
  if (field || cur.length) flushRow();
  return rows;
}

// ─── CSV field escaper ────────────────────────────────────────────────────
function escapeCSVField(val, delimiter) {
  const s = val === null || val === undefined ? '' : String(val);
  if (s.includes(delimiter) || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ─── Conversion functions ─────────────────────────────────────────────────
function doCSVtoJSON(csv, delimiter, firstRowHeaders, indent) {
  const rows = parseCSV(csv, delimiter);
  if (!rows.length) return { output: '[]', error: null };

  let data;
  if (firstRowHeaders) {
    const headers = rows[0];
    data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h.trim() || `col${idx}`] = row[idx] ?? ''; });
      return obj;
    });
  } else {
    data = rows;
  }

  return { output: JSON.stringify(data, null, indent === 'tab' ? '\t' : indent), error: null };
}

function doJSONtoCSV(json, delimiter, includeHeaders) {
  let data;
  try { data = JSON.parse(json); } catch (e) { return { output: '', error: `Invalid JSON: ${e.message}` }; }
  if (!Array.isArray(data)) return { output: '', error: 'JSON must be an array' };
  if (!data.length) return { output: '', error: null };

  const isObjects = typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0]);
  const isArrays  = Array.isArray(data[0]);

  if (!isObjects && !isArrays) return { output: '', error: 'JSON must be an array of objects or array of arrays' };

  const esc = (v) => escapeCSVField(v, delimiter);
  const rows = [];

  if (isObjects) {
    const headers = [...new Set(data.flatMap(Object.keys))];
    if (includeHeaders) rows.push(headers.map(esc).join(delimiter));
    for (const row of data) rows.push(headers.map((h) => esc(row[h])).join(delimiter));
  } else {
    for (const row of data) rows.push(row.map(esc).join(delimiter));
  }

  return { output: rows.join('\n'), error: null };
}

// ─── Options ───────────────────────────────────────────────────────────────
const DELIMITERS = [
  { label: 'Comma',     value: ',',  display: ',' },
  { label: 'Semicolon', value: ';',  display: ';' },
  { label: 'Tab',       value: '\t', display: '⇥' },
  { label: 'Pipe',      value: '|',  display: '|' },
];

const INDENT_OPTIONS = [
  { label: '2', value: 2 },
  { label: '4', value: 4 },
  { label: '⇥', value: 'tab' },
];

const EXAMPLES = {
  csv: `id,name,email,role,active
1,Alice Johnson,alice@example.com,admin,true
2,Bob Smith,bob@example.com,editor,true
3,Carol White,carol@example.com,viewer,false`,
  json: `[
  { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin" },
  { "id": 2, "name": "Bob Smith",     "email": "bob@example.com",   "role": "editor" },
  { "id": 3, "name": "Carol White",   "email": "carol@example.com", "role": "viewer" }
]`,
};

// ─── Main component ────────────────────────────────────────────────────────
export default function CSVJSONPage() {
  const [mode, setMode]               = useState('csv-to-json');
  const [input, setInput]             = useState('');
  const [delimiter, setDelimiter]     = useState(',');
  const [firstRowHeaders, setHeaders] = useState(true);
  const [includeHeaders, setIncHdr]   = useState(true);
  const [indent, setIndent]           = useState(2);
  const { toast } = useToast();

  const isCsvMode = mode === 'csv-to-json';

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null };
    return isCsvMode
      ? doCSVtoJSON(input, delimiter, firstRowHeaders, indent)
      : doJSONtoCSV(input, delimiter, includeHeaders);
  }, [input, mode, delimiter, firstRowHeaders, includeHeaders, indent, isCsvMode]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) { toast({ title: 'Clipboard empty', variant: 'destructive' }); return; }
      setInput(text);
      toast({ title: 'Pasted' });
    } catch {
      toast({ title: 'Paste failed', description: 'Clipboard inaccessible.', variant: 'destructive' });
    }
  };

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    toast({ title: 'Copied', description: 'Output copied to clipboard.' });
  };

  const handleClear = () => { setInput(''); toast({ title: 'Cleared' }); };

  const handleExample = () => {
    setInput(isCsvMode ? EXAMPLES.csv : EXAMPLES.json);
  };

  const switchMode = () => {
    const next = isCsvMode ? 'json-to-csv' : 'csv-to-json';
    setMode(next);
    // Move output to input if there's a valid result
    if (result.output && !result.error) setInput(result.output);
    else setInput('');
  };

  const isValid = input.trim() && !result.error && result.output;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">CSV ↔ JSON Converter</h1>
          <p className="text-sm text-slate-400">
            Convert CSV to JSON or JSON to CSV instantly. Handles quoted fields, custom delimiters, and nested headers.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Two-way conversion</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Custom delimiter</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Direction toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            {[
              { id: 'csv-to-json', label: 'CSV → JSON' },
              { id: 'json-to-csv', label: 'JSON → CSV' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setInput(''); }}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  mode === m.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Delimiter */}
          <div className="flex rounded-lg border overflow-hidden">
            {DELIMITERS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDelimiter(d.value)}
                title={d.label}
                className={cn(
                  'px-2.5 py-1.5 text-xs font-mono font-medium transition-colors',
                  delimiter === d.value
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {d.display}
              </button>
            ))}
          </div>

          {/* CSV→JSON options */}
          {isCsvMode && (
            <>
              <button
                onClick={() => setHeaders((v) => !v)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  firstRowHeaders
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                    : 'text-muted-foreground border-border hover:text-foreground'
                )}
              >
                First row as headers
              </button>
              <div className="flex rounded-lg border overflow-hidden">
                {INDENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIndent(opt.value)}
                    className={cn(
                      'px-2.5 py-1.5 text-xs font-medium transition-colors',
                      indent === opt.value
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* JSON→CSV options */}
          {!isCsvMode && (
            <button
              onClick={() => setIncHdr((v) => !v)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                includeHeaders
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                  : 'text-muted-foreground border-border hover:text-foreground'
              )}
            >
              Include headers
            </button>
          )}

          {/* Swap + copy */}
          <button
            onClick={switchMode}
            title="Swap direction and move output to input"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground border border-border hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
          </button>

          <Button onClick={handleCopy} variant="outline" size="sm" disabled={!isValid} className="ml-auto">
            <Copy className="w-4 h-4 mr-1.5" /> Copy
          </Button>
        </div>

        {/* Example / quick load */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Quick load:</span>
          <button
            onClick={handleExample}
            className="px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
          >
            {isCsvMode ? 'Sample CSV' : 'Sample JSON'}
          </button>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                {isCsvMode ? 'CSV Input' : 'JSON Input'}
              </label>
              <div className="flex items-center gap-3">
                <button onClick={handlePaste} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors">
                  <Clipboard className="w-3.5 h-3.5" /> Paste
                </button>
                <button onClick={handleClear} disabled={!input} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 disabled:pointer-events-none">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isCsvMode ? 'Paste CSV here…' : 'Paste JSON array here…'}
              spellCheck="false"
              className="w-full h-96 p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {isCsvMode ? 'JSON Output' : 'CSV Output'}
                {isValid && <span className="flex items-center gap-1 text-xs font-normal text-emerald-500"><CheckCircle2 className="w-3.5 h-3.5" />Ready</span>}
                {result.error && <span className="flex items-center gap-1 text-xs font-normal text-destructive"><AlertCircle className="w-3.5 h-3.5" />Error</span>}
              </label>
            </div>
            <textarea
              value={result.error || result.output}
              readOnly
              spellCheck="false"
              placeholder={isCsvMode ? 'JSON will appear here…' : 'CSV will appear here…'}
              className={cn(
                'w-full h-96 p-3 font-mono text-sm bg-muted/30 border rounded-lg resize-none focus:outline-none transition-shadow',
                result.error ? 'border-destructive/50 text-destructive' : 'border-border'
              )}
            />
          </div>
        </div>

        
        {/* SEO Content */}
        <div className="mt-12 space-y-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white mb-2">What is a CSV ↔ JSON Converter?</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                A CSV ↔ JSON converter transforms data between two ubiquitous formats. CSV (Comma-Separated Values)
                is a plain-text tabular format widely used for spreadsheets, database exports, and data pipelines.
                JSON (JavaScript Object Notation) is the standard format for web APIs and application data. Being
                able to convert between them is essential for moving data between spreadsheet tools, databases,
                REST APIs, and data processing scripts without writing custom parsing code.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Common Use Cases</h3>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                <li>Convert a database export (CSV) into JSON to load into a REST API or NoSQL database</li>
                <li>Transform an API response (JSON array) into CSV for import into Excel or Google Sheets</li>
                <li>Prepare test fixtures from spreadsheet data for a backend application</li>
                <li>Convert analytics data exports between reporting tools</li>
                <li>Feed data from CSV files into a JavaScript application without a server-side parser</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">How It Works</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                CSV to JSON: the first row is treated as the header and used as JSON object keys. Each subsequent row
                is zipped with the headers to produce an object; all rows become an array. Quoted fields, commas
                within quotes, and escaped quotes are handled per RFC 4180. JSON to CSV: the keys of the first
                object define the header row; each array element is serialised as a CSV row in the same key order.
                All processing runs locally in your browser.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">What happens with nested JSON objects?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">CSV is a flat format — it cannot represent nested structures directly. Nested objects are typically serialised as a JSON string in a single CSV cell, or flattened into dot-notation column names (e.g. <code className="text-slate-300">address.city</code>). This tool serialises nested values as strings.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">My CSV uses semicolons, not commas — will it work?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Semicolon-separated files are common in European locales where commas are used as decimal separators. Select the correct delimiter in the options to handle semicolon, tab (TSV), or pipe-separated files.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">Are all values treated as strings?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">By default, yes — CSV has no type information. The converter can optionally infer types (treating <code className="text-slate-300">123</code> as a number and <code className="text-slate-300">true</code>/<code className="text-slate-300">false</code> as booleans) when converting to JSON.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

{/* Related Tools */}
        <div className="border-t pt-12 mt-4">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/sql-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-fuchsia-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Database className="w-5 h-5 text-fuchsia-500" />SQL Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format and minify SQL with dialect support for MySQL, PostgreSQL, and more.</p>
            </Link>
            <Link href="/text-diff" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-green-500" />Text Diff
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Compare two blocks of text and highlight what changed.</p>
            </Link>
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode strings using Base64 encoding.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/case-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-sky-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <CaseSensitive className="w-5 h-5 text-sky-500" />Case Converter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert text to camelCase, snake_case, UPPERCASE, and more.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
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
              <Link
                href="/color-converter"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-violet-500/30 transition-all group/card"
              >
                <div className="w-8 h-8 rounded-md bg-violet-500/10 text-violet-500 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover/card:text-violet-400 transition-colors">Color Converter</div>
                  <div className="text-xs text-slate-500">HEX, RGB, HSL, CMYK</div>
                </div>
              </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">RFC 4180 compliant:</span> The CSV parser correctly handles quoted fields, embedded commas, escaped double-quotes (<code className="font-mono text-xs">""</code>), and all common line endings. The Swap button moves the current output into the input and flips direction.
            </p>
            <p className="text-xs text-muted-foreground">All conversion happens locally in your browser. No data is sent anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
