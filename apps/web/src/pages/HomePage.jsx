'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, ShieldCheck, Zap, Lock, CheckCircle2, FileJson, Hash, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:min-h-[45vh] py-8 md:py-12 flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507146815454-9faa99d579aa" 
            alt="Abstract digital network background" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-background" />
        </div>

        <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-5 border border-blue-500/20">
            <Zap className="w-4 h-4" />
            <span>Fast, secure, and runs in your browser</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-4xl mx-auto mb-4" style={{ letterSpacing: '-0.02em' }}>
            Free Developer Tools for Debugging, Formatting, and Encoding
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            DevToolz is a curated collection of free, open-source developer utilities designed to handle your most common daily tasks without tracking or storing your data.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="h-11 px-8 text-base font-medium w-full sm:w-auto bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]">
              <a href="#available-tools">
                Start Using Tools
              </a>
            </Button>
            <Button asChild size="lg" className="h-11 px-8 text-base font-medium w-full sm:w-auto transition-all hover:scale-[1.02] active:scale-[0.98] bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/json-formatter">
                Try JSON Formatter
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 border-b bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3.5 bg-background rounded-2xl shadow-sm border icon-primary">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">Secure & Private</h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Everything runs locally in your browser. We never send your sensitive tokens or data to our servers.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3.5 bg-background rounded-2xl shadow-sm border icon-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">Real-time Validation</h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Built with modern web technologies to ensure instant feedback and zero loading states.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3.5 bg-background rounded-2xl shadow-sm border icon-secondary">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">Developer Friendly</h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Clean interfaces, keyboard shortcuts, and formatted outputs designed specifically for engineers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="available-tools" className="pt-10 pb-16 md:pt-16 md:pb-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Available Tools</h2>
            <p className="text-base text-muted-foreground max-w-2xl">
              Select a tool below to get started. We're constantly adding new utilities to help streamline your development workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-blue-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl icon-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">JWT Decoder</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Decode JSON Web Tokens instantly in a clean, readable format. Inspect headers, payloads, and verify expiration timestamps.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    Real-time base64 decoding
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    Human-readable timestamps
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    Formatted JSON output
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/jwt-decoder">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-green-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl icon-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Hash className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Base64 Encoder</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Encode and decode text to and from Base64 format with real-time two-way conversion and UTF-8 support.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    Two-way real-time conversion
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    Full UTF-8 character support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    Copy and clear utilities
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/base64-encoder">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-purple-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl icon-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileJson className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">JSON Formatter</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Format, validate, and minify JSON data instantly. Catch syntax errors with real-time validation.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                    Real-time formatting & minifying
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                    Instant syntax validation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                    Side-by-side comparison
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/json-formatter">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>


            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-amber-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Unix Timestamp</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Convert Unix timestamps to human-readable dates and back. Auto-detects seconds vs milliseconds with UTC and local time display.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    Auto-detects seconds & milliseconds
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    UTC and local time display
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    Current timestamp button
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/unix-timestamp">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-cyan-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Link2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">URL Encoder</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Encode and decode URLs with percent-encoding instantly. Two-way real-time conversion with RFC 3986 compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                    Two-way real-time encoding
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                    RFC 3986 compliant
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                    Error detection for malformed URLs
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/url-encoder">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-rose-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Hash Generator</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly. All four algorithms shown simultaneously with copy buttons.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                    4 algorithms at once
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                    Uppercase / lowercase toggle
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                    Hashes empty string on load
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/hash-generator">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-indigo-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileCode className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">JSON ↔ YAML</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Convert between JSON and YAML instantly. Edit either side and the other updates in real time with syntax validation.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                    Two-way real-time conversion
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                    Instant syntax validation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                    Smart clipboard paste detection
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/json-yaml-converter">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>


            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-orange-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Regex Tester</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Test and debug JavaScript regular expressions with live match highlighting. Supports g, i, and m flags.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                    Live match highlighting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                    g, i, m flag toggles
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                    Match count summary
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/regex-tester">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>


            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-teal-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">JWT Generator</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Build and sign JSON Web Tokens with a custom header, payload, and HMAC secret. Supports HS256, HS384, and HS512.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                    HS256 / HS384 / HS512
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                    Custom header & payload
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
                    Live generation in browser
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/jwt-generator">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-violet-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <KeyRound className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">UUID Generator</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Generate UUID v4 values instantly. Copy individually or in bulk, customize formatting, and validate existing UUIDs.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                    UUID v4 format
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                    Bulk generation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                    Validate existing UUIDs
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/uuid-generator">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>


            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 border-border/60 hover:border-green-500/30 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GitCompare className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Text Diff</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Compare two blocks of text line by line. Highlights additions, deletions, and unchanged lines. Supports unified and split view.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    Unified &amp; split view
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    LCS diff algorithm
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    Ignore whitespace option
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4 mt-auto border-t border-border/40">
                <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                  <Link href="/text-diff">
                    Open Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;