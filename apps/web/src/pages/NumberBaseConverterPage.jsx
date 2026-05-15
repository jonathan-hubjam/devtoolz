'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Binary, Copy, CheckCircle2, ArrowRight, FileJson, Hash, ShieldCheck, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap, GitCompare, CaseSensitive, CalendarClock, Database, Table2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── Helpers ───────────────────────────────────────────────────────────────
function parseToBigInt(str, base) {
  const clean = str.trim().replace(/\s+/g, '');
  if (!clean) return null;
  try {
    const prefix = base === 16 ? '0x' : base === 8 ? '0o' : base === 2 ? '0b' : '';
    const n = BigInt(prefix + clean);
    return n >= 0n ? n : null;
  } catch {
    return null;
  }
}

function groupBinary(bin) {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
  return padded.match(/.{1,4}/g).join(' ');
}

function formatFor(n, base) {
  if (n === null) return '';
  const s = n.toString(base).toUpperCase();
  return base === 2 ? groupBinary(s.toLowerCase()) : s;
}

// ─── Config ────────────────────────────────────────────────────────────────
const BASES = [
  { id: 'dec', label: 'Decimal',       base: 10, placeholder: '255',      hint: 'Base 10 — digits 0–9' },
  { id: 'hex', label: 'Hexadecimal',   base: 16, placeholder: 'FF',       hint: 'Base 16 — digits 0–9 and A–F' },
  { id: 'oct', label: 'Octal',         base: 8,  placeholder: '377',      hint: 'Base 8 — digits 0–7' },
  { id: 'bin', label: 'Binary',        base: 2,  placeholder: '1111 1111', hint: 'Base 2 — digits 0 and 1' },
];

const BIT_WIDTHS = [
  { bits: 8,  max: 255n },
  { bits: 16, max: 65535n },
  { bits: 32, max: 4294967295n },
  { bits: 64, max: 18446744073709551615n },
];

const EXAMPLES = [
  { label: '255',          dec: '255' },
  { label: '65535',        dec: '65535' },
  { label: '0xFF (256)',   dec: '4294967295' },
  { label: '42',           dec: '42' },
];

// ─── Main component ────────────────────────────────────────────────────────
export default function NumberBaseConverterPage() {
  const [activeBase, setActiveBase] = useState(10);
  const [rawInput, setRawInput]     = useState('');
  const { toast } = useToast();

  const parsed = useMemo(() => parseToBigInt(rawInput, activeBase), [rawInput, activeBase]);
  const isInvalid = rawInput.trim() !== '' && parsed === null;

  const values = useMemo(() => {
    if (parsed === null) return {};
    return Object.fromEntries(BASES.map(({ base }) => [base, formatFor(parsed, base)]));
  }, [parsed]);

  const asciiChar = useMemo(() => {
    if (parsed === null) return null;
    if (parsed >= 32n && parsed <= 126n) return String.fromCharCode(Number(parsed));
    return null;
  }, [parsed]);

  const handleChange = (base, val) => {
    setActiveBase(base);
    setRawInput(val);
  };

  const handleCopy = async (text, label) => {
    if (!text) return;
    await navigator.clipboard.writeText(text.replace(/\s/g, ''));
    toast({ title: 'Copied', description: `${label} value copied.` });
  };

  const loadExample = (dec) => {
    setActiveBase(10);
    setRawInput(dec);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Number Base Converter</h1>
          <p className="text-sm text-slate-400">
            Convert numbers between decimal, hexadecimal, octal, and binary instantly. Type in any base to update all others.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Decimal, hex, octal, binary</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />BigInt precision</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

        {/* Examples */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Examples:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => loadExample(ex.dec)}
              className="px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground hover:border-pink-500/40 hover:text-pink-400 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Base panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BASES.map(({ id, label, base, placeholder, hint }) => {
            const isActive = activeBase === base;
            const displayVal = isActive ? rawInput : (values[base] ?? '');
            return (
              <div
                key={id}
                className={cn(
                  'rounded-xl border p-4 transition-all',
                  isActive
                    ? 'border-pink-500/50 bg-pink-500/5 shadow-sm'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">base {base}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(displayVal, label)}
                    disabled={!displayVal}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10 transition-colors disabled:opacity-30"
                    title={`Copy ${label}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  value={displayVal}
                  onChange={(e) => handleChange(base, e.target.value)}
                  onFocus={() => { if (!isActive) { setActiveBase(base); setRawInput(values[base] ?? ''); } }}
                  placeholder={placeholder}
                  spellCheck="false"
                  className={cn(
                    'w-full font-mono text-lg bg-transparent border-0 outline-none focus:ring-0 p-0',
                    isInvalid && isActive ? 'text-destructive' : 'text-foreground',
                    'placeholder:text-muted-foreground/30'
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>
                {isInvalid && isActive && (
                  <p className="text-xs text-destructive mt-1">Invalid {label.toLowerCase()} number</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Info strip */}
        {parsed !== null && (
          <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
            {/* Bit width fits */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Fits in</p>
              <div className="flex flex-wrap gap-2">
                {BIT_WIDTHS.map(({ bits, max }) => {
                  const fits = parsed <= max;
                  return (
                    <span
                      key={bits}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-mono font-medium border',
                        fits
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/30'
                          : 'text-muted-foreground/40 border-border/40'
                      )}
                    >
                      {bits}-bit {fits ? '✓' : '✗'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* ASCII character */}
            {asciiChar && (
              <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground">ASCII character:</span>
                <span className="font-mono text-lg font-bold text-pink-400">
                  {asciiChar === ' ' ? <span className="text-muted-foreground text-sm">(space)</span> : asciiChar}
                </span>
                <span className="text-xs text-muted-foreground">
                  {asciiChar === ' ' ? '' : `U+${parsed.toString(16).toUpperCase().padStart(4, '0')}`}
                </span>
              </div>
            )}
          </div>
        )}

        
        {/* SEO Content */}
        <div className="mt-12 space-y-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white mb-2">What is a Number Base Converter?</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                A number base converter translates integers between different positional numeral systems — most
                commonly binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Each base
                uses a different set of digits: binary uses 0 and 1; octal uses 0–7; decimal uses 0–9; hexadecimal
                uses 0–9 and A–F. Understanding base conversion is fundamental to computer science, low-level
                programming, networking, and digital electronics.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Common Use Cases</h3>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                <li>Convert hex colour codes to decimal RGB values (or vice versa) for CSS and design work</li>
                <li>Decode binary or hexadecimal values from network packet captures and protocol documentation</li>
                <li>Calculate IP subnet masks and CIDR ranges in binary</li>
                <li>Read and write binary flags and bitmasks in embedded systems or OS code</li>
                <li>Understand assembly language operands that are expressed in hex or binary</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">How It Works</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Conversion is a two-step process: first parse the input string in the source base to get an integer
                value, then format that integer in the target base. This tool uses JavaScript's <code className="text-slate-300">BigInt</code>
                for arbitrary-precision arithmetic, so it handles numbers larger than 2⁵³ − 1 (the limit of
                JavaScript's regular <code className="text-slate-300">Number</code> type) without losing precision —
                essential for 64-bit values common in networking and cryptography.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">Why is hexadecimal used so often in programming?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Hexadecimal is a compact representation of binary — one hex digit maps exactly to four bits (a nibble). This makes hex ideal for representing memory addresses, byte values, colour codes, and bitmasks. Reading <code className="text-slate-300">0xFF</code> is much easier than reading <code className="text-slate-300">11111111</code>.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">How do I convert a negative number to binary?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Negative integers in computers are most commonly represented in two's complement. To convert: invert all bits of the positive value and add 1. The result's most significant bit is 1 for negative numbers. The bit width (8, 16, 32, 64) matters for the result.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 mb-1">Can I convert between any two bases, or only the common ones?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Mathematically, conversion works between any bases 2–36 (using digits 0–9 and letters A–Z). This tool supports bases 2 through 36. Less common bases like base 3 (ternary) and base 60 (sexagesimal, used for time) are valid inputs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

{/* Related Tools */}
        <div className="border-t pt-12 mt-4">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate UUID v4 values instantly, with bulk generation and validation.</p>
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
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/sql-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-fuchsia-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Database className="w-5 h-5 text-fuchsia-500" />SQL Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format and minify SQL with dialect support for MySQL, PostgreSQL, and more.</p>
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
              <span className="font-semibold text-foreground">BigInt precision:</span> Conversion uses JavaScript's native <code className="font-mono text-xs">BigInt</code> type, so there's no loss of precision for integers beyond 64-bit. Binary output is grouped into nibbles (4-bit blocks) for readability.
            </p>
            <p className="text-xs text-muted-foreground">Only non-negative integers are supported. All conversion happens locally in your browser.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
