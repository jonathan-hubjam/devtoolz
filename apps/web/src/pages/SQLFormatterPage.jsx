'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { format as sqlFormat } from 'sql-formatter';
import { Copy, Clipboard, Trash2, CheckCircle2, AlertCircle, ArrowRight, Database, FileJson, Hash, ShieldCheck, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap, GitCompare, CaseSensitive, CalendarClock, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── Minifier ─────────────────────────────────────────────────────────────
function minifySQL(sql) {
  return sql
    .replace(/--[^\n]*/g, '')           // strip single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')   // strip block comments
    .replace(/\s+/g, ' ')               // collapse whitespace
    .trim();
}

// ─── Config options ────────────────────────────────────────────────────────
const DIALECTS = [
  { value: 'sql',          label: 'SQL' },
  { value: 'mysql',        label: 'MySQL' },
  { value: 'postgresql',   label: 'PostgreSQL' },
  { value: 'sqlite',       label: 'SQLite' },
  { value: 'transactsql',  label: 'T-SQL' },
  { value: 'plsql',        label: 'PL/SQL' },
  { value: 'bigquery',     label: 'BigQuery' },
];

const INDENT_OPTIONS = [
  { label: '2', value: 2 },
  { label: '4', value: 4 },
  { label: '⇥', value: 'tab' },
];

const KEYWORD_OPTIONS = [
  { label: 'UPPER', value: 'upper' },
  { label: 'lower', value: 'lower' },
  { label: 'Preserve', value: 'preserve' },
];

const EXAMPLES = [
  {
    label: 'SELECT',
    sql: `select u.id,u.name,u.email,o.total,o.created_at from users u inner join orders o on u.id=o.user_id where u.active=1 and o.total>100 order by o.created_at desc limit 20`,
  },
  {
    label: 'CREATE TABLE',
    sql: `create table products(id int not null auto_increment,name varchar(255) not null,price decimal(10,2) not null default 0.00,category_id int,stock int not null default 0,created_at timestamp default current_timestamp,primary key(id),foreign key(category_id) references categories(id) on delete set null)engine=innodb default charset=utf8mb4`,
  },
  {
    label: 'WITH CTE',
    sql: `with monthly_sales as(select date_trunc('month',order_date) as month,sum(amount) as total,count(*) as orders from orders where order_date>=current_date-interval '12 months' group by 1),ranked as(select month,total,orders,rank() over(order by total desc) as rnk from monthly_sales) select month,total,orders from ranked where rnk<=3 order by month`,
  },
];

// ─── Main component ────────────────────────────────────────────────────────
export default function SQLFormatterPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('format'); // 'format' | 'minify'
  const [dialect, setDialect] = useState('sql');
  const [keywordCase, setKeywordCase] = useState('upper');
  const [indent, setIndent] = useState(2);
  const { toast } = useToast();

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', error: null };
    if (mode === 'minify') {
      return { output: minifySQL(input), error: null };
    }
    try {
      const output = sqlFormat(input, {
        language: dialect,
        tabWidth: indent === 'tab' ? 2 : indent,
        useTabs: indent === 'tab',
        keywordCase,
      });
      return { output, error: null };
    } catch (e) {
      return { output: '', error: e.message };
    }
  }, [input, mode, dialect, keywordCase, indent]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) { toast({ title: 'Clipboard empty', variant: 'destructive' }); return; }
      setInput(text);
      toast({ title: 'Pasted', description: 'SQL pasted from clipboard.' });
    } catch {
      toast({ title: 'Paste failed', description: 'Clipboard inaccessible.', variant: 'destructive' });
    }
  };

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    toast({ title: 'Copied', description: 'Formatted SQL copied to clipboard.' });
  };

  const handleClear = () => {
    setInput('');
    toast({ title: 'Cleared' });
  };

  const handleExample = (sql) => {
    setInput(sql);
    setMode('format');
  };

  const isValid = input.trim() && !result.error;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">SQL Formatter</h1>
          <p className="text-sm text-slate-400">
            Format and minify SQL queries instantly. Supports MySQL, PostgreSQL, SQLite, T-SQL and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />7 dialects</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Format &amp; minify</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Format / Minify */}
          <div className="flex rounded-lg border overflow-hidden">
            {['format', 'minify'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors capitalize',
                  mode === m
                    ? 'bg-fuchsia-500/20 text-fuchsia-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Dialect */}
          {mode === 'format' && (
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value)}
              className="h-8 px-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-shadow text-foreground"
            >
              {DIALECTS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          )}

          {/* Keyword case */}
          {mode === 'format' && (
            <div className="flex rounded-lg border overflow-hidden">
              {KEYWORD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setKeywordCase(opt.value)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-mono font-medium transition-colors',
                    keywordCase === opt.value
                      ? 'bg-fuchsia-500/20 text-fuchsia-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Indent */}
          {mode === 'format' && (
            <div className="flex rounded-lg border overflow-hidden">
              {INDENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setIndent(opt.value)}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-medium transition-colors',
                    indent === opt.value
                      ? 'bg-fuchsia-500/20 text-fuchsia-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Copy output */}
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            disabled={!isValid}
            className="ml-auto"
          >
            <Copy className="w-4 h-4 mr-1.5" />
            Copy
          </Button>
        </div>

        {/* Example presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Examples:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex.sql)}
              className="px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground hover:border-fuchsia-500/40 hover:text-fuchsia-400 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">Input</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Clipboard className="w-3.5 h-3.5" /> Paste
                </button>
                <button
                  onClick={handleClear}
                  disabled={!input}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your SQL here…"
              spellCheck="false"
              className="w-full h-96 p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-shadow"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Output
                {isValid && (
                  <span className="flex items-center gap-1 text-xs font-normal text-green-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                  </span>
                )}
                {result.error && (
                  <span className="flex items-center gap-1 text-xs font-normal text-destructive">
                    <AlertCircle className="w-3.5 h-3.5" /> Error
                  </span>
                )}
              </label>
              {mode === 'minify' && isValid && (
                <span className="text-xs text-muted-foreground">
                  {input.length.toLocaleString()} → {result.output.length.toLocaleString()} chars
                </span>
              )}
            </div>
            <textarea
              value={result.error ? result.error : result.output}
              readOnly
              spellCheck="false"
              placeholder="Formatted SQL will appear here…"
              className={cn(
                'w-full h-96 p-3 font-mono text-sm bg-muted/30 border rounded-lg resize-none focus:outline-none transition-shadow',
                result.error ? 'border-destructive/50 text-destructive' : 'border-border'
              )}
            />
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t pt-12 mt-4">
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
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/text-diff" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-green-500" />
                Text Diff
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Compare two blocks of text and highlight additions, deletions, and unchanged lines.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />
                Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
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
            <Link href="/case-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-sky-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <CaseSensitive className="w-5 h-5 text-sky-500" />
                Case Converter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert text to camelCase, snake_case, UPPERCASE, kebab-case, and more.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/cron-parser" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-yellow-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-yellow-500" />
                Cron Parser
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Parse cron expressions into plain English and preview next scheduled runs.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />
                UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate UUID v4 values instantly, with bulk generation and validation.</p>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Powered by sql-formatter:</span> Formatting uses the open-source <code className="font-mono text-xs">sql-formatter</code> library with dialect-aware rules for MySQL, PostgreSQL, SQLite, T-SQL, PL/SQL, and BigQuery.
            </p>
            <p className="text-xs text-muted-foreground">
              All formatting runs locally in your browser. No SQL is sent to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
