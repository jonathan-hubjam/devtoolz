'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, FileJson, FileCode, AlertCircle, CheckCircle2, ArrowRightLeft, ArrowRight, ShieldCheck, Hash, Clock, Link2, Fingerprint, Clipboard, Search, KeyRound, Zap, GitCompare, CaseSensitive, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import yaml from 'js-yaml';

const JSONYAMLConverterPage = () => {
  const [jsonText, setJsonText] = useState('');
  const [yamlText, setYamlText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [yamlError, setYamlError] = useState('');
  const { toast } = useToast();

  const handleJsonChange = (val) => {
    setJsonText(val);
    setJsonError('');
    if (!val.trim()) { setYamlText(''); return; }
    try {
      const parsed = JSON.parse(val);
      setYamlText(yaml.dump(parsed, { indent: 2 }));
      setYamlError('');
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const handleYamlChange = (val) => {
    setYamlText(val);
    setYamlError('');
    if (!val.trim()) { setJsonText(''); return; }
    try {
      const parsed = yaml.load(val);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (e) {
      setYamlError(e.message);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return;
      // Detect JSON vs YAML: JSON starts with { or [
      const trimmed = text.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        handleJsonChange(trimmed);
        toast({ title: 'Pasted as JSON' });
      } else {
        handleYamlChange(trimmed);
        toast({ title: 'Pasted as YAML' });
      }
    } catch {
      toast({ title: 'Clipboard access denied', description: 'Allow clipboard access in your browser and try again.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    setJsonText(''); setYamlText('');
    setJsonError(''); setYamlError('');
    toast({ title: 'Cleared' });
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
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
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">JSON ↔ YAML Converter</h1>
          <p className="text-sm text-slate-400">Convert between JSON and YAML instantly. Edit either side and the other updates in real time with syntax validation.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Two-way sync</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Instant validation</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

          {/* Toolbar */}
          <motion.div variants={itemVariants} className="flex justify-end gap-2">
            <Button onClick={handlePaste} variant="outline" className="gap-2">
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard
            </Button>
            <Button onClick={handleClear} variant="outline" className="gap-2" disabled={!jsonText && !yamlText}>
              <Trash2 className="w-4 h-4" />
              Clear Both
            </Button>
          </motion.div>

          {/* Two panels */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {/* Swap icon */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border-2 rounded-full items-center justify-center shadow-sm text-muted-foreground">
              <ArrowRightLeft className="w-4 h-4" />
            </div>

            {/* JSON panel */}
            <Card className={`border-2 shadow-lg h-full flex flex-col transition-colors ${jsonError ? 'border-destructive/50' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 rounded-lg icon-secondary">
                      <FileJson className="w-5 h-5" />
                    </div>
                    JSON
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => handleCopy(jsonText, 'JSON')} disabled={!jsonText || !!jsonError} className="gap-1.5">
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                </div>
                <CardDescription>Paste or type JSON — converts to YAML instantly</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col space-y-4">
                <div className="relative flex-grow flex flex-col">
                  <textarea
                    value={jsonText}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder={`{\n  "name": "devtoolz",\n  "type": "developer tool"\n}`}
                    className={`w-full flex-grow min-h-[300px] p-4 rounded-lg border-2 bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                      jsonError ? 'border-destructive focus:ring-destructive focus:border-transparent' : 'border-input focus:ring-primary focus:border-transparent'
                    }`}
                    spellCheck="false"
                  />
                  {jsonText && !jsonError && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </div>
                {jsonError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">JSON Error</p>
                      <p className="text-sm text-destructive/80 mt-1">{jsonError}</p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* YAML panel */}
            <Card className={`border-2 shadow-lg h-full flex flex-col transition-colors ${yamlError ? 'border-destructive/50' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 rounded-lg icon-primary">
                      <FileCode className="w-5 h-5" />
                    </div>
                    YAML
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => handleCopy(yamlText, 'YAML')} disabled={!yamlText || !!yamlError} className="gap-1.5">
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                </div>
                <CardDescription>Paste or type YAML — converts to JSON instantly</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col space-y-4">
                <div className="relative flex-grow flex flex-col">
                  <textarea
                    value={yamlText}
                    onChange={(e) => handleYamlChange(e.target.value)}
                    placeholder={`name: devtoolz\ntype: developer tool`}
                    className={`w-full flex-grow min-h-[300px] p-4 rounded-lg border-2 bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground ${
                      yamlError ? 'border-destructive focus:ring-destructive focus:border-transparent' : 'border-input focus:ring-primary focus:border-transparent'
                    }`}
                    spellCheck="false"
                  />
                  {yamlText && !yamlError && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </div>
                {yamlError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">YAML Error</p>
                      <p className="text-sm text-destructive/80 mt-1">{yamlError}</p>
                    </div>
                  </motion.div>
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
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly.</p>
            </Link>
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode strings using Base64 encoding.</p>
            </Link>
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Decode and inspect JSON Web Tokens securely in your browser.</p>
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
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back instantly.</p>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-foreground">JSON vs YAML:</span> JSON is ideal for APIs and data exchange. YAML is preferred for configuration files (Docker, Kubernetes, GitHub Actions) due to its human-readable syntax.
            </p>
            <p className="text-xs text-muted-foreground">
              Uses <code className="font-mono">js-yaml</code> for parsing and serialization — all conversions happen locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONYAMLConverterPage;
