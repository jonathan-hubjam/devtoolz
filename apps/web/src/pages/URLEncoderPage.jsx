'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, Link2, AlertCircle, CheckCircle2, ArrowRightLeft, ArrowRight, ShieldCheck, FileJson, Hash, Clock, Clipboard, Fingerprint, FileCode, Search, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const URLEncoderPage = () => {
  const [rawText, setRawText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleRawChange = (e) => {
    const val = e.target.value;
    setRawText(val);
    setError('');
    if (!val) { setEncodedText(''); return; }
    setEncodedText(encodeURIComponent(val));
  };

  const handleEncodedChange = (e) => {
    const val = e.target.value;
    setEncodedText(val);
    setError('');
    if (!val) { setRawText(''); return; }
    try {
      setRawText(decodeURIComponent(val));
    } catch {
      setError('Invalid URL-encoded string. Check for malformed percent sequences.');
    }
  };

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', description: `${type} has been copied successfully.` });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        handleRawChange({ target: { value: text.trim() } });
        toast({ title: 'Pasted from clipboard' });
      }
    } catch {
      toast({ title: 'Clipboard access denied', description: 'Allow clipboard access in your browser and try again.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    setRawText('');
    setEncodedText('');
    setError('');
    toast({ title: 'Cleared', description: 'Input fields have been cleared.' });
  };

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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0B1120] border-b border-slate-800/50 pt-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-sky-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-1/4 left-[10%] text-slate-600/20 font-mono text-xs select-none transform -rotate-12 tracking-widest">
            https%3A%2F%2Fexample.com
          </div>
          <div className="absolute bottom-1/3 right-[15%] text-slate-600/20 font-mono text-xs select-none transform rotate-6 tracking-widest">
            hello%20world%21
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
              URL Encoder & Decoder
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Encode and decode URLs instantly. Convert special characters to percent-encoded format or decode encoded URLs back to readable text.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm text-slate-300 font-medium">
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Two-way sync</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>RFC 3986 compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>No data stored</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="flex justify-end gap-2">
            <Button onClick={handlePaste} variant="outline" className="gap-2">
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard
            </Button>
            <Button onClick={handleClear} variant="outline" className="gap-2" disabled={!rawText && !encodedText}>
              <Trash2 className="w-4 h-4" />
              Clear Both
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {/* Swap icon */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border-2 rounded-full items-center justify-center shadow-sm text-muted-foreground">
              <ArrowRightLeft className="w-4 h-4" />
            </div>

            {/* Raw Text Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-lg h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-2 rounded-lg icon-primary">
                        <Link2 className="w-5 h-5" />
                      </div>
                      Raw Text
                    </CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(rawText, 'Raw text')} disabled={!rawText} className="gap-1.5">
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>Type or paste your URL or text to encode</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <textarea
                    value={rawText}
                    onChange={handleRawChange}
                    placeholder="e.g. https://example.com/search?q=hello world&lang=en"
                    className="w-full flex-grow min-h-[300px] p-4 rounded-lg border-2 border-input bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                    spellCheck="false"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Encoded Card */}
            <motion.div variants={itemVariants}>
              <Card className={`border-2 shadow-lg h-full flex flex-col transition-colors ${error ? 'border-destructive/50' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-2 rounded-lg icon-success">
                        <Link2 className="w-5 h-5" />
                      </div>
                      Encoded URL
                    </CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(encodedText, 'Encoded URL')} disabled={!encodedText || !!error} className="gap-1.5">
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>Type or paste an encoded URL to decode it</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col space-y-4">
                  <div className="relative flex-grow flex flex-col">
                    <textarea
                      value={encodedText}
                      onChange={handleEncodedChange}
                      placeholder="e.g. https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                      className={`w-full flex-grow min-h-[300px] p-4 rounded-lg border-2 bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                        error
                          ? 'border-destructive focus:ring-destructive focus:border-transparent'
                          : 'border-input focus:ring-primary focus:border-transparent'
                      }`}
                      spellCheck="false"
                    />
                    {encodedText && !error && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    )}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-destructive">Decoding Error</p>
                        <p className="text-sm text-destructive/80 mt-1">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">What is URL encoding?</span> URL encoding (percent-encoding) replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits, ensuring URLs are transmitted correctly over the internet.
            </p>
            <p className="text-xs text-muted-foreground">
              Uses <code className="font-mono">encodeURIComponent</code> / <code className="font-mono">decodeURIComponent</code> — all conversions happen locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLEncoderPage;
