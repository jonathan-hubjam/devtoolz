'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Clipboard, Trash2, FileCode, CheckCircle2, AlertCircle, Lock, Key, FileSignature, Clock, CalendarDays, ShieldCheck, Globe, Loader2, XCircle, Zap, ArrowRight, FileJson, Hash, Link2, Fingerprint, Search, KeyRound, GitCompare, CaseSensitive, CalendarClock, Database, Table2, Binary, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useJWTDecoder from '@/hooks/useJWTDecoder';
import { useToast } from '@/hooks/use-toast';
import JSONRenderer from '@/components/JSONRenderer.jsx';

const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleS0xMjMifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTUwMDAwMDAwLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLnBuZyJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const JWTDecoderPage = () => {
  const [token, setToken] = useState('');
  const { decoded, error, isValid, timestampMetadata, isExpired } = useJWTDecoder(token);
  const { toast } = useToast();

  const [isFetchingJwks, setIsFetchingJwks] = useState(false);
  const [jwksData, setJwksData] = useState(null);
  const [jwksError, setJwksError] = useState(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setToken(text);
      toast({
        title: 'Token pasted',
        description: 'JWT token has been pasted from clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Paste failed',
        description: 'Unable to read from clipboard. Please paste manually.',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    setToken('');
    setJwksData(null);
    setJwksError(null);
    toast({
      title: 'Cleared',
      description: 'Token input has been cleared.',
    });
  };

  const handleLoadSample = () => {
    setToken(SAMPLE_TOKEN);
    setJwksData(null);
    setJwksError(null);
    toast({
      title: 'Sample loaded',
      description: 'A sample JWT token has been loaded.',
    });
  };

  const handleCopySection = (section, content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: `${section} copied`,
      description: `The ${section.toLowerCase()} has been copied to clipboard.`,
    });
  };

  const headerObj = useMemo(() => {
    if (!decoded?.header) return null;
    try {
      return JSON.parse(decoded.header);
    } catch {
      return null;
    }
  }, [decoded?.header]);

  const payloadObj = useMemo(() => {
    if (!decoded?.payloadRaw && !decoded?.payload) return null;
    try {
      return typeof decoded.payloadRaw === 'object' 
        ? decoded.payloadRaw 
        : JSON.parse(decoded.payload);
    } catch {
      return null;
    }
  }, [decoded?.payload, decoded?.payloadRaw]);

  const kid = headerObj?.kid;
  const iss = payloadObj?.iss;
  const showVerificationHelper = Boolean(kid && iss);
  
  const jwksUrl = useMemo(() => {
    if (!iss) return '';
    const baseUrl = iss.endsWith('/') ? iss.slice(0, -1) : iss;
    return `${baseUrl}/.well-known/jwks.json`;
  }, [iss]);

  const handleFetchJwks = async () => {
    if (!jwksUrl) return;
    
    setIsFetchingJwks(true);
    setJwksError(null);
    setJwksData(null);
    
    try {
      const response = await fetch(jwksUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJwksData(data);
      toast({
        title: 'JWKS Fetched',
        description: 'Successfully retrieved public keys.',
      });
    } catch (err) {
      setJwksError(err.message || 'Failed to fetch JWKS. This might be due to CORS restrictions or an invalid URL.');
      toast({
        title: 'Fetch Failed',
        description: 'Could not retrieve JWKS.',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingJwks(false);
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">JWT Decoder</h1>
          <p className="text-sm text-slate-400">Decode and inspect JSON Web Tokens instantly. View headers, payload, and expiration without sending data anywhere.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Real-time decoding</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Instant validation</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Contextual link to Generator */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 border rounded-lg px-4 py-2.5 w-fit">
          <Zap className="w-4 h-4 text-teal-500 shrink-0" />
          <span>Need to create a token instead?</span>
          <Link href="/jwt-generator" className="text-teal-500 hover:text-teal-400 font-medium flex items-center gap-1">
            Generate a JWT <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg icon-primary">
                    <Key className="w-5 h-5" />
                  </div>
                  Token Input
                </CardTitle>
                <CardDescription>
                  Paste your JWT token below to decode and inspect its contents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your JWT token here... (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                    className="w-full min-h-[140px] p-4 rounded-lg border-2 border-input bg-background text-foreground font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                    spellCheck="false"
                  />
                  {token && (
                    <div className="absolute top-3 right-3">
                      {isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : error ? (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handlePaste}
                    variant="default"
                    className="gap-2"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste from Clipboard
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="gap-2"
                    disabled={!token}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleLoadSample}
                    variant="secondary"
                    className="gap-2"
                    disabled={token === SAMPLE_TOKEN}
                  >
                    <FileCode className="w-4 h-4" />
                    Load Sample Token
                  </Button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">Invalid Token</p>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {isValid && decoded.header && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg icon-primary">
                        <Lock className="w-4 h-4" />
                      </div>
                      Header
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopySection('Header', decoded.header)}
                      className="gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Algorithm and token type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto border">
                    <code className="text-foreground">{decoded.header}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg icon-success">
                        <FileCode className="w-4 h-4" />
                      </div>
                      Payload
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopySection('Payload', decoded.payload)}
                      className="gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Claims and user data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JSONRenderer payload={decoded.payloadRaw} />
                </CardContent>
              </Card>

              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 rounded-lg icon-secondary">
                        <FileSignature className="w-4 h-4" />
                      </div>
                      Signature
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopySection('Signature', decoded.signature)}
                      className="gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Verification signature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto border break-all">
                    <code className="text-foreground">{decoded.signature}</code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isValid && showVerificationHelper && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 rounded-lg icon-info">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        Verification Helper
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Fetch public keys from the issuer to verify the token signature
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col p-4 bg-muted/30 rounded-lg border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Issuer (iss)</span>
                      <code className="text-sm text-foreground break-all">{iss}</code>
                    </div>
                    <div className="flex flex-col p-4 bg-muted/30 rounded-lg border border-border/50">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Key ID (kid)</span>
                      <code className="text-sm text-foreground break-all">{kid}</code>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">JWKS URL</span>
                    <a 
                      href={jwksUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      {jwksUrl}
                    </a>
                    <div className="pt-2">
                      <Button 
                        onClick={handleFetchJwks} 
                        disabled={isFetchingJwks}
                        className="gap-2"
                      >
                        {isFetchingJwks ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                        {isFetchingJwks ? 'Fetching...' : 'Fetch Public Keys'}
                      </Button>
                    </div>
                  </div>

                  {jwksError && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-destructive">Fetch Failed</p>
                        <p className="text-sm text-destructive/80 mt-1">{jwksError}</p>
                      </div>
                    </div>
                  )}

                  {jwksData && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Retrieved Keys
                      </h4>
                      
                      {Array.isArray(jwksData.keys) ? (
                        <div className="grid grid-cols-1 gap-4">
                          {jwksData.keys.map((keyItem, idx) => {
                            const isMatch = keyItem.kid === kid;
                            return (
                              <div 
                                key={idx} 
                                className={`p-4 rounded-lg border-2 transition-colors ${
                                  isMatch 
                                    ? 'border-green-500 bg-green-500/5' 
                                    : 'border-border/50 bg-muted/30'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-mono font-bold text-sm bg-background px-2 py-1 rounded border">
                                    Key {idx + 1}
                                  </span>
                                  {isMatch && (
                                    <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Matches Token
                                    </Badge>
                                  )}
                                </div>
                                <pre className="text-xs font-mono bg-background p-3 rounded border overflow-x-auto">
                                  <code className="text-foreground">
                                    {JSON.stringify(keyItem, null, 2)}
                                  </code>
                                </pre>
                              </div>
                            );
                          })}
                          
                          {!jwksData.keys.some(k => k.kid === kid) && (
                            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-yellow-600">No Matching Key Found</p>
                                <p className="text-sm text-yellow-600/80 mt-1">
                                  The fetched JWKS does not contain a key with the ID <code>{kid}</code>.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <pre className="text-xs font-mono bg-muted/50 p-4 rounded-lg overflow-x-auto border">
                          <code className="text-foreground">
                            {JSON.stringify(jwksData, null, 2)}
                          </code>
                        </pre>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isValid && timestampMetadata.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 rounded-lg icon-warning">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        Timestamps & Expiration
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Human-readable dates and expiration status parsed from the payload
                      </CardDescription>
                    </div>
                    {timestampMetadata.some(m => m.claim === 'exp') && (
                      <Badge 
                        variant={isExpired ? "destructive" : "default"}
                        className={`gap-1.5 px-3 py-1 text-sm ${!isExpired ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                      >
                        <Clock className="w-4 h-4" />
                        {isExpired ? 'Token Expired' : 'Token Valid'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {timestampMetadata.map((meta, idx) => (
                      <div key={idx} className="flex flex-col p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono font-bold text-sm bg-background px-2 py-1 rounded border">{meta.claim}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Raw Value</span>
                            <code className="text-sm text-foreground">{meta.value}</code>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Formatted Date</span>
                            <span className="text-sm text-foreground font-medium">{meta.formattedDate}</span>
                          </div>
                          {meta.claim === 'exp' && (
                            <div className={`text-sm font-medium pt-2 border-t border-border/50 mt-2 ${meta.isExpired ? 'text-destructive' : 'text-emerald-500'}`}>
                              {meta.isExpired ? 'Expired' : `Expires in ${meta.timeRemaining}`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!token && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 bg-muted/30">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-3.5 rounded-2xl icon-primary shadow-sm border">
                          <Lock className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground">Secure & Private</h3>
                      <p className="text-sm text-slate-400">
                        All decoding happens in your browser. No data is sent to any server.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-3.5 rounded-2xl icon-success shadow-sm border">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground">Real-time Validation</h3>
                      <p className="text-sm text-slate-400">
                        Instant feedback on token structure and validity as you type.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="p-3.5 rounded-2xl icon-secondary shadow-sm border">
                          <FileCode className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground">Developer Friendly</h3>
                      <p className="text-sm text-slate-400">
                        Clean interface with copy buttons and formatted JSON output.
                      </p>
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
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter 
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly with syntax highlighting.</p>
            </Link>
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode strings or files using Base64 encoding.</p>
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
            <Link href="/csv-json" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-emerald-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Table2 className="w-5 h-5 text-emerald-500" />
                CSV ↔ JSON
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert CSV to JSON or JSON to CSV with support for custom delimiters and quoted fields.</p>
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

      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-foreground">What is a JWT?</span> JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
            </p>
            <p className="text-xs text-muted-foreground">
              This tool decodes the token structure but does not verify the signature. Always validate tokens server-side.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTDecoderPage;