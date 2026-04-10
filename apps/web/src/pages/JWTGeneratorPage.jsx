'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Trash2, CheckCircle2, AlertCircle, ArrowRight, FileJson, Hash, Clock, Link2, Fingerprint, Search, KeyRound, FileCode, ShieldCheck, Zap, GitCompare, CaseSensitive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Base64URL encode
function base64url(data) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const ALGO_MAP = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

async function signJWT(headerObj, payloadObj, secret, algorithm) {
  const headerB64 = base64url(JSON.stringify(headerObj));
  const payloadB64 = base64url(JSON.stringify(payloadObj));
  const message = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: ALGO_MAP[algorithm] },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return `${message}.${base64url(new Uint8Array(sig))}`;
}

const DEFAULT_HEADER = `{\n  "alg": "HS256",\n  "typ": "JWT"\n}`;
const DEFAULT_PAYLOAD = `{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": ${Math.floor(Date.now() / 1000)}\n}`;
const DEFAULT_SECRET = 'your-256-bit-secret';

const ALGORITHMS = ['HS256', 'HS384', 'HS512'];

const CLAIM_PRESETS = [
  { label: 'iat', help: 'Issued at (now)', value: () => Math.floor(Date.now() / 1000) },
  { label: 'exp', help: 'Expires in 1 hour', value: () => Math.floor(Date.now() / 1000) + 3600 },
  { label: 'nbf', help: 'Not before (now)', value: () => Math.floor(Date.now() / 1000) },
];

export default function JWTGeneratorPage() {
  const [algorithm, setAlgorithm] = useState('HS256');
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER);
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState(DEFAULT_SECRET);
  const [secretB64, setSecretB64] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const generate = useCallback(async () => {
    setError(null);
    try {
      const headerObj = JSON.parse(headerText);
      headerObj.alg = algorithm;
      headerObj.typ = 'JWT';
      const payloadObj = JSON.parse(payloadText);

      let secretBytes;
      if (secretB64) {
        const bin = atob(secret.replace(/-/g, '+').replace(/_/g, '/'));
        secretBytes = Uint8Array.from(bin, c => c.charCodeAt(0));
      } else {
        secretBytes = new TextEncoder().encode(secret);
      }

      const headerB64 = base64url(JSON.stringify(headerObj));
      const payloadB64 = base64url(JSON.stringify(payloadObj));
      const message = `${headerB64}.${payloadB64}`;

      const key = await crypto.subtle.importKey(
        'raw',
        secretBytes,
        { name: 'HMAC', hash: ALGO_MAP[algorithm] },
        false,
        ['sign']
      );
      const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
      setToken(`${message}.${base64url(new Uint8Array(sig))}`);
    } catch (e) {
      setError(e.message?.includes('JSON') ? 'Invalid JSON in header or payload' : e.message);
      setToken('');
    }
  }, [algorithm, headerText, payloadText, secret, secretB64]);

  useEffect(() => { generate(); }, [generate]);

  const handleAlgoChange = (alg) => {
    setAlgorithm(alg);
    try {
      const h = JSON.parse(headerText);
      h.alg = alg;
      setHeaderText(JSON.stringify(h, null, 2));
    } catch {}
  };

  const addClaim = (claim) => {
    try {
      const obj = JSON.parse(payloadText);
      obj[claim.label] = claim.value();
      setPayloadText(JSON.stringify(obj, null, 2));
    } catch {}
  };

  const handleCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    toast({ title: 'Copied', description: 'JWT copied to clipboard.' });
  };

  const handleClear = () => {
    setHeaderText(DEFAULT_HEADER);
    setPayloadText(DEFAULT_PAYLOAD);
    setSecret(DEFAULT_SECRET);
    setAlgorithm('HS256');
    setSecretB64(false);
    toast({ title: 'Reset', description: 'All fields reset to defaults.' });
  };

  // Split token for display
  const parts = token ? token.split('.') : [];
  const partColors = ['text-rose-400', 'text-violet-400', 'text-cyan-400'];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">JWT Generator</h1>
          <p className="text-sm text-slate-400">Build and sign JSON Web Tokens with a custom header, payload, and secret. All signing happens locally — nothing leaves your browser.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />HS256 / HS384 / HS512</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Live generation</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Contextual link to Decoder */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 border rounded-lg px-4 py-2.5 w-fit">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Have a token already?</span>
          <Link href="/jwt-decoder" className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1">
            Decode it instead <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Inputs */}
          <div className="space-y-4">

            {/* Algorithm */}
            <div className="bg-card border rounded-xl p-4 space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <div className="flex gap-2">
                {ALGORITHMS.map((alg) => (
                  <button
                    key={alg}
                    onClick={() => handleAlgoChange(alg)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg border font-mono transition-colors',
                      algorithm === alg
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'border-border text-muted-foreground hover:border-blue-500/30 hover:text-foreground'
                    )}
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="bg-card border rounded-xl p-4 space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                Header
              </label>
              <textarea
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="w-full h-28 p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                spellCheck="false"
              />
            </div>

            {/* Payload */}
            <div className="bg-card border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shrink-0" />
                  Payload
                </label>
                <div className="flex gap-1.5">
                  {CLAIM_PRESETS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => addClaim(c)}
                      title={c.help}
                      className="px-2 py-0.5 text-xs rounded border border-border text-muted-foreground hover:border-violet-500/40 hover:text-foreground font-mono transition-colors"
                    >
                      +{c.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="w-full h-40 p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                spellCheck="false"
              />
            </div>

            {/* Secret */}
            <div className="bg-card border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                  Secret
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={secretB64}
                    onChange={(e) => setSecretB64(e.target.checked)}
                    className="rounded border-border accent-blue-500 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-muted-foreground">Base64 encoded</span>
                </label>
              </div>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="your-256-bit-secret"
                className="w-full p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                spellCheck="false"
              />
              <p className="text-xs text-muted-foreground">Keep your secret private. Never expose it in client-side code or version control.</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={generate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <Zap className="w-4 h-4 mr-2" /> Generate
              </Button>
              <Button onClick={handleClear} variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: Output */}
          <div className="space-y-4">
            <div className="bg-card border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Generated Token</label>
                {token && (
                  <Button onClick={handleCopy} variant="outline" size="sm" className="h-7 px-3 text-xs">
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                  </Button>
                )}
              </div>

              {error ? (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : token ? (
                <>
                  {/* Coloured breakdown */}
                  <div className="font-mono text-sm break-all leading-relaxed p-3 bg-muted/30 border rounded-lg">
                    {parts.map((part, i) => (
                      <span key={i}>
                        <span className={partColors[i]}>{part}</span>
                        {i < parts.length - 1 && <span className="text-muted-foreground">.</span>}
                      </span>
                    ))}
                  </div>

                  {/* Part labels */}
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" />Header</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400" />Payload</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />Signature</span>
                  </div>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
                  Fill in the fields above to generate a token
                </div>
              )}
            </div>

            {/* Decoded preview */}
            {token && !error && (
              <div className="bg-card border rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Decoded preview</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-rose-400 font-medium mb-1">Header</p>
                    <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 overflow-x-auto">
                      {(() => { try { return JSON.stringify(JSON.parse(headerText), null, 2); } catch { return headerText; } })()}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs text-violet-400 font-medium mb-1">Payload</p>
                    <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 overflow-x-auto">
                      {(() => { try { return JSON.stringify(JSON.parse(payloadText), null, 2); } catch { return payloadText; } })()}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t pt-12 mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode strings using Base64 encoding.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />
                Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />
                UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Generate UUID v4 values instantly, with bulk generation and validation.</p>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">How JWT signing works:</span> A JWT is assembled from a Base64URL-encoded header and payload, joined by a dot. The HMAC algorithm then signs this string using your secret key, producing the signature — the third segment. Tampering with the header or payload invalidates the signature.
            </p>
            <p className="text-xs text-muted-foreground">
              Signing uses the browser's native <code className="font-mono">crypto.subtle</code> Web Crypto API. Your secret and payload never leave your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
