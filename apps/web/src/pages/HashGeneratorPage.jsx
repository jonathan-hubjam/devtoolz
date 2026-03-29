'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, Fingerprint, ArrowRight, ShieldCheck, FileJson, Hash, Clock, Link2, CheckCircle2, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Compact MD5 implementation (RFC 1321)
function md5(str) {
  const safeAdd = (x, y) => { const l = (x & 0xffff) + (y & 0xffff); return ((x >> 16) + (y >> 16) + (l >> 16)) << 16 | (l & 0xffff); };
  const rol = (n, c) => (n << c) | (n >>> (32 - c));
  const cmn = (q, a, b, x, s, t) => safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  const ff = (a, b, c, d, x, s, t) => cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a, b, c, d, x, s, t) => cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a, b, c, d, x, s, t) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a, b, c, d, x, s, t) => cmn(c ^ (b | ~d), a, b, x, s, t);

  const utf8 = unescape(encodeURIComponent(str));
  const x = [];
  for (let i = 0; i < utf8.length * 8; i += 8) x[i >> 5] |= (utf8.charCodeAt(i / 8) & 0xff) << (i % 32);
  const len = utf8.length * 8;
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d];
    a=ff(a,b,c,d,x[i],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);
    a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);
    a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
    a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329);
    a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i],20,-373897302);
    a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);
    a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);
    a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);
    a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);
    a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);
    a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);
    a=hh(a,b,c,d,x[i+9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+2],23,-995338651);
    a=ii(a,b,c,d,x[i],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
    a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);
    a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);
    a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
  }
  return [a, b, c, d].map(n => Array.from({length: 4}, (_, j) => ((n >> (j * 8)) & 0xff).toString(16).padStart(2, '0')).join('')).join('');
}

async function computeHashes(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const shaAlgos = ['SHA-1', 'SHA-256', 'SHA-512'];
  const results = { MD5: md5(text) };
  for (const algo of shaAlgos) {
    const buf = await crypto.subtle.digest(algo, data);
    results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return results;
}

const ALGO_META = [
  { key: 'MD5',     label: 'MD5',     bits: 128, badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { key: 'SHA-1',   label: 'SHA-1',   bits: 160, badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { key: 'SHA-256', label: 'SHA-256', bits: 256, badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { key: 'SHA-512', label: 'SHA-512', bits: 512, badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
];

const HashGeneratorPage = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState(null);
  const [uppercase, setUppercase] = useState(false);
  const { toast } = useToast();

  const runHashes = useCallback(async (text) => {
    if (!text) { setHashes(null); return; }
    const result = await computeHashes(text);
    setHashes(result);
  }, []);

  useEffect(() => { runHashes(input); }, [input, runHashes]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) { setInput(text.trim()); toast({ title: 'Pasted from clipboard' }); }
    } catch {
      toast({ title: 'Clipboard access denied', description: 'Allow clipboard access in your browser and try again.', variant: 'destructive' });
    }
  };

  const handleClear = () => { setInput(''); setHashes(null); toast({ title: 'Cleared' }); };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  const fmt = (hash) => uppercase ? hash.toUpperCase() : hash;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0B1120] border-b border-slate-800/50 pt-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-rose-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-1/4 left-[10%] text-slate-600/20 font-mono text-[10px] select-none transform -rotate-12 tracking-widest">
            5f4dcc3b5aa765d61d8327deb882cf99
          </div>
          <div className="absolute bottom-1/3 right-[12%] text-slate-600/20 font-mono text-[10px] select-none transform rotate-6 tracking-widest">
            a665a45920422f9d417e4867efdc4fb8
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight">
              Hash Generator
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly. All hashing happens locally in your browser — nothing is sent anywhere.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm text-slate-300 font-medium">
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>5 algorithms at once</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>Real-time generation</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>No data stored</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* Toolbar */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Output:</span>
              <button
                onClick={() => setUppercase(false)}
                className={cn('px-3 py-1.5 rounded-md text-sm font-mono font-medium transition-colors border', !uppercase ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-input hover:text-foreground')}
              >
                lowercase
              </button>
              <button
                onClick={() => setUppercase(true)}
                className={cn('px-3 py-1.5 rounded-md text-sm font-mono font-medium transition-colors border', uppercase ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-input hover:text-foreground')}
              >
                UPPERCASE
              </button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePaste} variant="outline" className="gap-2">
                <Clipboard className="w-4 h-4" />
                Paste from Clipboard
              </Button>
              <Button onClick={handleClear} variant="outline" className="gap-2" disabled={!input}>
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </motion.div>

          {/* Input */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg icon-primary">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  Input Text
                </CardTitle>
                <CardDescription>Type or paste the text you want to hash</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter any text to generate hashes instantly..."
                  className="w-full min-h-[140px] p-4 rounded-lg border-2 border-input bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                  spellCheck="false"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          {hashes && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 rounded-lg icon-success">
                      <Hash className="w-5 h-5" />
                    </div>
                    Hash Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ALGO_META.map(({ key, label, bits, badge }) => (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 group">
                        <div className="flex items-center gap-2 shrink-0 w-28">
                          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border font-mono', badge)}>
                            {label}
                          </span>
                          <span className="text-xs text-muted-foreground/60">{bits}b</span>
                        </div>
                        <code className="flex-1 text-xs font-mono text-foreground break-all leading-relaxed">
                          {fmt(hashes[key])}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(fmt(hashes[key]), label)}
                          className="gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Related Tools */}
        <div className="border-t pt-12 mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode strings using Base64 encoding.</p>
            </Link>
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">About these algorithms:</span> SHA-256 and SHA-512 are recommended for security use. MD5 and SHA-1 are considered cryptographically broken and should only be used for checksums or legacy compatibility.
            </p>
            <p className="text-xs text-muted-foreground">
              SHA hashes use the browser's native Web Crypto API. MD5 runs via a pure JavaScript implementation. Nothing leaves your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashGeneratorPage;
