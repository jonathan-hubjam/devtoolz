'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, FileText, Hash, AlertCircle, CheckCircle2, ArrowRightLeft, ArrowRight, ShieldCheck, FileJson, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Base64EncoderPage = () => {
  const [plainText, setPlainText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePlainChange = (e) => {
    const val = e.target.value;
    setPlainText(val);
    setError('');
    
    if (!val) {
      setBase64Text('');
      return;
    }

    try {
      // Handle unicode characters properly
      const encoded = btoa(unescape(encodeURIComponent(val)));
      setBase64Text(encoded);
    } catch (err) {
      setError('Failed to encode text. Contains unsupported characters.');
    }
  };

  const handleBase64Change = (e) => {
    const val = e.target.value;
    setBase64Text(val);
    setError('');
    
    if (!val) {
      setPlainText('');
      return;
    }

    try {
      // Handle unicode characters properly
      const decoded = decodeURIComponent(escape(atob(val)));
      setPlainText(decoded);
    } catch (err) {
      setError('Invalid Base64 string.');
    }
  };

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${type} has been copied successfully.`,
    });
  };

  const handleClear = () => {
    setPlainText('');
    setBase64Text('');
    setError('');
    toast({
      title: 'Cleared',
      description: 'Input fields have been cleared.',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Base64 Encoder & Decoder</h1>
          <p className="text-sm text-slate-400">Encode text to Base64 or decode Base64 strings instantly. Two-way real-time conversion with full UTF-8 support.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Two-way sync</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />UTF-8 support</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Client-side only</span>
          </div>
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
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleClear}
              variant="outline"
              className="gap-2"
              disabled={!plainText && !base64Text}
            >
              <Trash2 className="w-4 h-4" />
              Clear Both
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {/* Desktop Swap Icon Indicator */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border-2 rounded-full items-center justify-center shadow-sm text-muted-foreground">
              <ArrowRightLeft className="w-4 h-4" />
            </div>

            {/* Plain Text Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-lg h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-2 rounded-lg icon-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      Plain Text
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(plainText, 'Plain text')}
                      disabled={!plainText}
                      className="gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>
                    Type or paste plain text here to encode it
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <textarea
                    value={plainText}
                    onChange={handlePlainChange}
                    placeholder="Enter plain text here..."
                    className="w-full flex-grow min-h-[300px] p-4 rounded-lg border-2 border-input bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                    spellCheck="false"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Base64 Card */}
            <motion.div variants={itemVariants}>
              <Card className={`border-2 shadow-lg h-full flex flex-col transition-colors ${error ? 'border-destructive/50' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-2 rounded-lg icon-success">
                        <Hash className="w-5 h-5" />
                      </div>
                      Base64 String
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(base64Text, 'Base64 string')}
                      disabled={!base64Text || !!error}
                      className="gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>
                    Type or paste Base64 here to decode it
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col space-y-4">
                  <div className="relative flex-grow flex flex-col">
                    <textarea
                      value={base64Text}
                      onChange={handleBase64Change}
                      placeholder="Enter Base64 string here..."
                      className={`w-full flex-grow min-h-[300px] p-4 rounded-lg border-2 bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                        error 
                          ? 'border-destructive focus:ring-destructive focus:border-transparent' 
                          : 'border-input focus:ring-primary focus:border-transparent'
                      }`}
                      spellCheck="false"
                    />
                    {base64Text && !error && (
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
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder 
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly with syntax highlighting.</p>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-foreground">What is Base64?</span> Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format.
            </p>
            <p className="text-xs text-muted-foreground">
              It is commonly used to encode data that needs to be stored and transferred over media that are designed to deal with text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64EncoderPage;