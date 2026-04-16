'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Clock, Calendar, ArrowRightLeft, ArrowRight, CheckCircle2, FileJson, Hash, ShieldCheck, Zap, Clipboard, Link2, Fingerprint, FileCode, Search, KeyRound, GitCompare, CaseSensitive, CalendarClock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const toMs = (val) => {
  const num = parseInt(val, 10);
  const digits = val.trim().replace('-', '').length;
  return digits >= 13 ? num : num * 1000;
};

const toDatetimeLocal = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

const formatUTC = (date) => date.toUTCString();

const formatLocal = (date) =>
  date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const getTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const UnixTimestampPage = () => {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const convertFromTimestamp = (val) => {
    setTimestamp(val);
    setError(null);

    if (!val.trim()) {
      setResult(null);
      setDateInput('');
      return;
    }

    if (!/^-?\d+$/.test(val.trim())) {
      setError('Please enter a valid numeric Unix timestamp.');
      setResult(null);
      return;
    }

    const ms = toMs(val);
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setError('Invalid timestamp.');
      setResult(null);
      return;
    }

    setResult({
      utc: formatUTC(date),
      local: formatLocal(date),
      timezone: getTimezone(),
      s: Math.floor(ms / 1000).toString(),
      ms: ms.toString(),
    });
    setDateInput(toDatetimeLocal(date));
  };

  const convertFromDate = (val) => {
    setDateInput(val);
    setError(null);

    if (!val) {
      setResult(null);
      setTimestamp('');
      return;
    }

    const date = new Date(val);

    if (isNaN(date.getTime())) {
      setError('Invalid date.');
      setResult(null);
      return;
    }

    const ms = date.getTime();
    const s = Math.floor(ms / 1000);

    setResult({
      utc: formatUTC(date),
      local: formatLocal(date),
      timezone: getTimezone(),
      s: s.toString(),
      ms: ms.toString(),
    });
    setTimestamp(s.toString());
  };

  const handleCurrentTimestamp = () => {
    const s = Math.floor(Date.now() / 1000).toString();
    convertFromTimestamp(s);
    toast({ title: 'Current timestamp loaded' });
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        convertFromTimestamp(text.trim());
        toast({ title: 'Pasted from clipboard' });
      }
    } catch {
      toast({ title: 'Clipboard access denied', description: 'Allow clipboard access in your browser and try again.', variant: 'destructive' });
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Unix Timestamp Converter</h1>
          <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back. Auto-detects seconds and milliseconds.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Auto-detects seconds & ms</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />UTC & local time</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
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
          {/* Current Timestamp Button */}
          <motion.div variants={itemVariants} className="flex justify-end gap-2">
            <Button onClick={handlePasteFromClipboard} variant="outline" className="gap-2">
              <Clipboard className="w-4 h-4" />
              Paste from Clipboard
            </Button>
            <Button onClick={handleCurrentTimestamp} variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Current Timestamp
            </Button>
          </motion.div>

          {/* Two input cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            {/* Desktop swap icon */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border-2 rounded-full items-center justify-center shadow-sm text-muted-foreground">
              <ArrowRightLeft className="w-4 h-4" />
            </div>

            {/* Unix Timestamp Input */}
            <Card className="border-2 shadow-lg h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg icon-warning">
                    <Clock className="w-5 h-5" />
                  </div>
                  Unix Timestamp
                </CardTitle>
                <CardDescription>
                  Enter a timestamp in seconds or milliseconds
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-4">
                <input
                  type="text"
                  inputMode="numeric"
                  value={timestamp}
                  onChange={(e) => convertFromTimestamp(e.target.value)}
                  placeholder="e.g. 1700000000"
                  className={cn(
                    'w-full flex-grow min-h-[80px] p-4 rounded-lg border-2 bg-background text-foreground font-mono text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground',
                    error ? 'border-destructive' : 'border-input'
                  )}
                  spellCheck="false"
                />
                {timestamp && result && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(timestamp, 'Timestamp')}
                    className="gap-1.5 self-start"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Human Date Input */}
            <Card className="border-2 shadow-lg h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg icon-success">
                    <Calendar className="w-5 h-5" />
                  </div>
                  Human-Readable Date
                </CardTitle>
                <CardDescription>
                  Pick a date and time to convert to a timestamp
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col gap-4">
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => convertFromDate(e.target.value)}
                  className="w-full p-4 rounded-lg border-2 border-input bg-background text-foreground font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {dateInput && result && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(dateInput, 'Date')}
                    className="gap-1.5 self-start"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Result Card */}
          {result && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 rounded-lg icon-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    Conversion Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* UTC */}
                    <div className="flex flex-col p-4 bg-muted/30 rounded-lg border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">UTC Time</span>
                      <code className="text-sm text-foreground break-all">{result.utc}</code>
                    </div>

                    {/* Local */}
                    <div className="flex flex-col p-4 bg-muted/30 rounded-lg border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Local Time <span className="normal-case font-normal text-muted-foreground/70">({result.timezone})</span>
                      </span>
                      <code className="text-sm text-foreground break-all">{result.local}</code>
                    </div>

                    {/* Seconds */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Unix (seconds)</span>
                        <code className="text-sm text-foreground">{result.s}</code>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleCopy(result.s, 'Unix seconds')} className="gap-1.5 shrink-0">
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </Button>
                    </div>

                    {/* Milliseconds */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Unix (milliseconds)</span>
                        <code className="text-sm text-foreground">{result.ms}</code>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleCopy(result.ms, 'Unix milliseconds')} className="gap-1.5 shrink-0">
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </Button>
                    </div>
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
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly.</p>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-foreground">What is a Unix timestamp?</span> A Unix timestamp is the number of seconds elapsed since January 1, 1970 00:00:00 UTC (the Unix epoch).
            </p>
            <p className="text-xs text-muted-foreground">
              Timestamps with 13 digits are in milliseconds. All conversions happen locally in your browser — no data is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnixTimestampPage;
