'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Trash2, AlignLeft, Minimize2, AlertCircle, CheckCircle2, ArrowRight, Clipboard, FileJson, FileCode, ShieldCheck, Hash, Clock, Link2, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const JSONFormatterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('format'); // 'format' or 'minify'
  const { toast } = useToast();

  // Real-time validation and auto-formatting
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setError(null);
      
      // Auto-format based on current mode
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      setError(err.message);
      // We intentionally don't clear the output here so the user doesn't 
      // lose their formatted view while actively typing/fixing a small typo.
    }
  }, [input, mode]);

  const handleFormat = () => {
    setMode('format');
    if (!input.trim()) return;
    
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Invalid JSON",
        description: "Cannot format invalid JSON. Please fix the errors first.",
        variant: "destructive",
      });
    }
  };

  const handleMinify = () => {
    setMode('minify');
    if (!input.trim()) return;
    
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Invalid JSON",
        description: "Cannot minify invalid JSON. Please fix the errors first.",
        variant: "destructive",
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast({
          title: "Clipboard empty",
          description: "There is no text in your clipboard to paste.",
          variant: "destructive",
        });
        return;
      }
      setInput(text);
      toast({
        title: "Pasted successfully",
        description: "Content pasted from clipboard and auto-formatted.",
      });
    } catch (err) {
      toast({
        title: "Paste failed",
        description: "Clipboard is empty or inaccessible. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    toast({
      title: "Cleared",
      description: "Input and output have been cleared.",
    });
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "Copied to clipboard",
        description: "The JSON output has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section matching JWT Decoder */}
      <div className="relative overflow-hidden bg-[#0B1120] border-b border-slate-800/50 pt-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-[20%] left-[40%] w-[20%] h-[40%] bg-cyan-500/5 rounded-full blur-[80px] mix-blend-screen" />
          
          <div className="absolute top-1/4 right-[15%] text-slate-600/20 font-mono text-[10px] select-none transform rotate-6 tracking-widest">
            {`{"format": "json", "valid": true}`}
          </div>
          <div className="absolute bottom-1/3 left-[15%] text-slate-600/20 font-mono text-[10px] select-none transform -rotate-3 tracking-widest">
            {`[\n  "beautify",\n  "minify"\n]`}
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
              JSON Formatter & Validator
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600">
                Format, validate, and beautify JSON instantly with this free online JSON formatter. Paste your JSON to make it readable, fix errors, and structure your data for easier debugging and development.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm text-slate-300 font-medium">
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Real-time formatting</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Instant validation</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/60 backdrop-blur-sm shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>No data stored</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          {/* Input Section */}
          <div className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between h-8 mb-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="p-1.5 rounded-md icon-primary">
                  <FileJson className="w-4 h-4" />
                </div>
                Input JSON
              </label>
              <div className="flex items-center gap-2">
                {error ? (
                  <span className="flex items-center text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-md transition-all">
                    <AlertCircle className="w-3 h-3 mr-1" /> Invalid
                  </span>
                ) : input.trim() ? (
                  <span className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md transition-all">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Valid JSON
                  </span>
                ) : null}
              </div>
            </div>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"example": "Paste your JSON here..."}'
              className={cn(
                "flex-1 w-full p-4 font-mono text-sm bg-muted/30 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow",
                error ? "border-destructive focus:ring-destructive/50" : "border-border"
              )}
              spellCheck="false"
            />
            
            <div className="mt-0">
              <div className="mb-2">
                {error && (
                  <div className="text-sm text-destructive flex items-center animate-in fade-in slide-in-from-top-1 py-1">
                    <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                    <span className="truncate">{error}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap lg:flex-nowrap gap-3">
                <Button 
                  onClick={handlePaste} 
                  variant="default" 
                  className="flex-1 lg:flex-none whitespace-nowrap"
                >
                  <Clipboard className="w-4 h-4 mr-2" /> Paste from Clipboard
                </Button>
                <Button 
                  onClick={handleFormat} 
                  variant={mode === 'format' ? 'secondary' : 'outline'} 
                  disabled={!input.trim()} 
                  className="flex-1 lg:flex-none whitespace-nowrap"
                >
                  <AlignLeft className="w-4 h-4 mr-2" /> Format
                </Button>
                <Button 
                  onClick={handleMinify} 
                  variant={mode === 'minify' ? 'secondary' : 'outline'} 
                  disabled={!input.trim()} 
                  className="flex-1 lg:flex-none whitespace-nowrap"
                >
                  <Minimize2 className="w-4 h-4 mr-2" /> Minify
                </Button>
                <Button 
                  onClick={handleClear} 
                  variant="ghost" 
                  disabled={!input.trim() && !output} 
                  className="flex-1 lg:flex-none whitespace-nowrap text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between h-8 mb-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="p-1.5 rounded-md icon-success">
                  <FileCode className="w-4 h-4" />
                </div>
                Output <span className="text-muted-foreground font-normal ml-1">({mode === 'format' ? 'Formatted' : 'Minified'})</span>
              </label>
            </div>
            
            <textarea
              value={output}
              readOnly
              placeholder="Formatted or minified JSON will appear here instantly..."
              className={cn(
                "flex-1 w-full p-4 font-mono text-sm bg-muted/50 border rounded-lg resize-none focus:outline-none transition-colors",
                error ? "border-destructive/30 text-muted-foreground" : "border-border text-foreground"
              )}
              spellCheck="false"
            />
            
            <div className="mt-0">
              <div className="mb-2"></div>
              
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={handleCopy} 
                  variant="default" 
                  disabled={!output}
                  className="px-8 whitespace-nowrap"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Related Tools */}
        <div className="border-t pt-12">
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
            <Link href="/base64-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-500" />
                Base64 Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode strings or files using Base64 encoding.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert Unix timestamps to human-readable dates and back instantly.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatterPage;