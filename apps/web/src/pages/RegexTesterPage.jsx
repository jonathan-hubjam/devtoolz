'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, Search, ArrowRight, CheckCircle2, AlertCircle, FileJson, Hash, Clock, Link2, Fingerprint, FileCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const EXAMPLES = [
  {
    label: 'Email addresses',
    pattern: '[\\w.-]+@[\\w.-]+\\.\\w{2,}',
    flags: { g: true, i: true, m: false },
    testString: 'Contact us at hello@devtoolz.net or support@example.com for help.\nBilling: billing@company.org',
  },
  {
    label: 'Numbers only',
    pattern: '\\d+',
    flags: { g: true, i: false, m: false },
    testString: 'There are 42 apples, 7 oranges, and 100 bananas in 3 baskets worth $19.99.',
  },
  {
    label: 'Word extractor',
    pattern: '\\b\\w+\\b',
    flags: { g: true, i: false, m: false },
    testString: 'The quick brown fox jumps over the lazy dog.',
  },
];

const FLAG_DEFS = [
  { key: 'g', label: 'g', title: 'Global — find all matches' },
  { key: 'i', label: 'i', title: 'Case insensitive' },
  { key: 'm', label: 'm', title: 'Multiline — ^ and $ match line boundaries' },
];

const RegexTesterPage = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState('');
  const { toast } = useToast();

  const flagString = useMemo(
    () => Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join(''),
    [flags]
  );

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      // Always include 'g' for exec loop; merge with user flags
      const f = flags.g ? flagString : 'g' + flagString;
      return { regex: new RegExp(pattern, f), error: null };
    } catch (e) {
      return { regex: null, error: e.message };
    }
  }, [pattern, flagString, flags.g]);

  const matchCount = useMemo(() => {
    if (!regex || !testString || error) return 0;
    try {
      const r = new RegExp(pattern, flagString.includes('g') ? flagString : 'g' + flagString);
      return [...testString.matchAll(r)].length;
    } catch {
      return 0;
    }
  }, [regex, testString, error, pattern, flagString]);

  const highlighted = useMemo(() => {
    if (!testString) return null;
    if (!regex || error || !pattern) {
      return [<span key="0" className="whitespace-pre-wrap break-all">{testString}</span>];
    }
    const r = new RegExp(pattern, flagString.includes('g') ? flagString : 'g' + flagString);
    const parts = [];
    let lastIndex = 0;
    let key = 0;
    let match;
    r.lastIndex = 0;
    while ((match = r.exec(testString)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++} className="whitespace-pre-wrap">{testString.slice(lastIndex, match.index)}</span>);
      }
      parts.push(
        <mark key={key++} className="bg-orange-400/30 text-foreground rounded-sm px-0.5 not-italic font-medium">
          {match[0] || '\u200B'}
        </mark>
      );
      lastIndex = match.index + match[0].length;
      if (match[0].length === 0) r.lastIndex++;
    }
    if (lastIndex < testString.length) {
      parts.push(<span key={key++} className="whitespace-pre-wrap">{testString.slice(lastIndex)}</span>);
    }
    return parts;
  }, [testString, regex, error, pattern, flagString]);

  const handleCopyPattern = () => {
    if (!pattern) return;
    navigator.clipboard.writeText(pattern);
    toast({ title: 'Pattern copied to clipboard' });
  };

  const handleClear = () => {
    setPattern(''); setTestString(''); setFlags({ g: true, i: false, m: false });
    toast({ title: 'Cleared' });
  };

  const handleExample = (ex) => {
    setPattern(ex.pattern);
    setFlags(ex.flags);
    setTestString(ex.testString);
  };

  const toggleFlag = (key) => setFlags(f => ({ ...f, [key]: !f[key] }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
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
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-red-500/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-1/4 left-[10%] text-slate-600/20 font-mono text-xs select-none transform -rotate-12 tracking-widest">
            /[\w.-]+@[\w.-]+/gi
          </div>
          <div className="absolute bottom-1/3 right-[12%] text-slate-600/20 font-mono text-xs select-none transform rotate-6 tracking-widest">
            \b\w+\b
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
              Regex Tester
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Test regular expressions instantly with live match highlighting, flag controls, and instant error feedback — all in your browser.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm text-slate-300 font-medium">
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Real-time matching</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>g / i / m flag support</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Local processing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* Examples */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">Examples:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => handleExample(ex)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium border border-input bg-background text-muted-foreground hover:text-foreground hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Toolbar */}
          <motion.div variants={itemVariants} className="flex justify-end gap-2">
            <Button onClick={handleCopyPattern} variant="outline" className="gap-2" disabled={!pattern}>
              <Copy className="w-4 h-4" />
              Copy Pattern
            </Button>
            <Button onClick={handleClear} variant="outline" className="gap-2" disabled={!pattern && !testString}>
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </motion.div>

          {/* Main card */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg icon-warning">
                    <Search className="w-5 h-5" />
                  </div>
                  Regex Pattern
                </CardTitle>
                <CardDescription>Enter your pattern without slashes — flags are controlled below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Pattern input + flags */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-lg select-none">/</span>
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="[\w.-]+@[\w.-]+\.\w{2,}"
                      className={cn(
                        'w-full pl-7 pr-4 py-3 rounded-lg border-2 bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground',
                        error ? 'border-destructive' : 'border-input'
                      )}
                      spellCheck="false"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-lg select-none">/{flagString || ' '}</span>
                  </div>

                  {/* Flag toggles */}
                  <div className="flex items-center gap-1 shrink-0">
                    {FLAG_DEFS.map(({ key, label, title }) => (
                      <button
                        key={key}
                        onClick={() => toggleFlag(key)}
                        title={title}
                        className={cn(
                          'w-10 h-10 rounded-lg font-mono text-sm font-semibold border-2 transition-colors',
                          flags[key]
                            ? 'bg-orange-500/15 text-orange-500 border-orange-500/40'
                            : 'bg-background text-muted-foreground border-input hover:border-orange-500/30 hover:text-orange-400'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inline error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive font-medium">Invalid regex: {error}</p>
                  </motion.div>
                )}

                {/* Divider */}
                <div className="border-t" />

                {/* Test string */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Test String</label>
                  <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Paste or type the text you want to test your pattern against..."
                    className="w-full min-h-[140px] p-4 rounded-lg border-2 border-input bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                    spellCheck="false"
                  />
                </div>

                {/* Highlighted output */}
                {testString && (
                  <>
                    <div className="border-t" />
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Match Preview</label>
                      <div className="min-h-[80px] p-4 rounded-lg border-2 border-input bg-muted/20 font-mono text-sm leading-relaxed break-all">
                        {highlighted}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between pt-1">
                      {error ? (
                        <span className="text-sm text-destructive font-medium">Fix the pattern to see matches</span>
                      ) : !pattern ? (
                        <span className="text-sm text-muted-foreground">Enter a pattern above</span>
                      ) : matchCount === 0 ? (
                        <span className="text-sm text-muted-foreground">No matches found</span>
                      ) : (
                        <span className="text-sm font-semibold text-orange-500">
                          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                        </span>
                      )}
                      {flagString && (
                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                          flags: {flagString}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Related Tools */}
        <div className="border-t pt-12 mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode strings using Base64 encoding.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />
                Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert between JSON and YAML instantly with real-time validation.</p>
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
              <span className="font-semibold text-foreground">JavaScript RegExp:</span> This tester uses the browser's native <code className="font-mono">RegExp</code> engine — the same one used in Node.js and all modern browsers.
            </p>
            <p className="text-xs text-muted-foreground">
              All matching happens locally in your browser. No text or patterns are sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTesterPage;
