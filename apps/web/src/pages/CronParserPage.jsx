'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalendarClock, Copy, Clipboard, Trash2, CheckCircle2, ArrowRight, AlertCircle, FileJson, Hash, ShieldCheck, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap, GitCompare, CaseSensitive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────
const MONTH_ALIASES = { JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12 };
const DOW_ALIASES   = { SUN:0,MON:1,TUE:2,WED:3,THU:4,FRI:5,SAT:6 };
const MONTH_NAMES   = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_NAMES     = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const ORDINALS      = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st'];

const MACROS = {
  '@yearly':   '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly':  '0 0 1 * *',
  '@weekly':   '0 0 * * 0',
  '@daily':    '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly':   '0 * * * *',
};

const PRESETS = [
  { label: 'Every minute',   expr: '* * * * *' },
  { label: 'Every 15 min',   expr: '*/15 * * * *' },
  { label: 'Every hour',     expr: '0 * * * *' },
  { label: 'Weekdays 9am',   expr: '0 9 * * 1-5' },
  { label: 'Daily midnight', expr: '0 0 * * *' },
  { label: '1st of month',   expr: '0 0 1 * *' },
  { label: 'Mon & Thu 6pm',  expr: '0 18 * * 1,4' },
  { label: 'Every Jan 1st',  expr: '0 0 1 1 *' },
];

const FIELD_DEFS = [
  { name: 'Minute',  min: 0,  max: 59,  unit: 'minute'  },
  { name: 'Hour',    min: 0,  max: 23,  unit: 'hour'    },
  { name: 'Day',     min: 1,  max: 31,  unit: 'day'     },
  { name: 'Month',   min: 1,  max: 12,  unit: 'month'   },
  { name: 'Weekday', min: 0,  max: 6,   unit: 'weekday' },
];

// ─── Parsing ──────────────────────────────────────────────────────────────
function resolveAliases(token, aliases) {
  return token.toUpperCase().replace(/[A-Z]+/g, (m) => aliases[m] !== undefined ? String(aliases[m]) : m);
}

// Returns a sorted array of matching integers, or null if expr is '*'
function expandField(expr, min, max, aliases = {}) {
  if (expr === '*') return null;
  const values = new Set();
  for (const part of expr.split(',')) {
    const p = resolveAliases(part, aliases);
    if (p.includes('/')) {
      const [range, stepStr] = p.split('/');
      const step = parseInt(stepStr);
      if (isNaN(step) || step <= 0) throw new Error(`Invalid step: /${stepStr}`);
      const [lo, hi] = range === '*' ? [min, max] : range.split('-').map(Number);
      const end = hi !== undefined ? hi : lo;
      for (let i = (range === '*' ? min : lo); i <= end; i += step) values.add(i);
    } else if (p.includes('-')) {
      const [lo, hi] = p.split('-').map(Number);
      if (isNaN(lo) || isNaN(hi)) throw new Error(`Invalid range: ${part}`);
      for (let i = lo; i <= hi; i++) values.add(i);
    } else {
      const n = parseInt(p);
      if (isNaN(n)) throw new Error(`Invalid value: ${part}`);
      values.add(n);
    }
  }
  const arr = [...values].sort((a, b) => a - b);
  // Range check
  for (const v of arr) {
    if (v < min || v > max) throw new Error(`Value ${v} out of range [${min}-${max}]`);
  }
  return arr;
}

function parseCron(raw) {
  const input = (MACROS[raw.trim().toLowerCase()] ?? raw).trim();
  const parts = input.split(/\s+/);
  if (parts.length !== 5) throw new Error('Expected 5 fields: minute hour day month weekday');

  const [minE, hrE, domE, monE, dowE] = parts;
  return {
    parts,
    minute:  expandField(minE,  0,  59),
    hour:    expandField(hrE,   0,  23),
    dom:     expandField(domE,  1,  31),
    month:   expandField(monE,  1,  12, MONTH_ALIASES),
    dow:     expandField(dowE,  0,  6,  DOW_ALIASES),
  };
}

// ─── Next run times ───────────────────────────────────────────────────────
function getNextRuns(parsed, count = 8) {
  const { minute, hour, dom, month, dow } = parsed;
  const runs = [];
  const now = new Date();
  // Start from next minute
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
  const d = new Date(start);
  const limit = start.getTime() + 366 * 24 * 60 * 60 * 1000;
  let iter = 0;
  const MAX = 700000;

  while (runs.length < count && d.getTime() < limit && iter < MAX) {
    iter++;
    const mo  = d.getMonth() + 1;
    const day = d.getDate();
    const hr  = d.getHours();
    const min = d.getMinutes();
    const wd  = d.getDay();

    // Standard cron: if both dom and dow are restricted, either can match (OR semantics)
    const domMatch = dom === null || dom.includes(day);
    const dowMatch = dow === null || dow.includes(wd);
    const dayMatch = (dom === null && dow === null)
      ? true
      : (dom !== null && dow !== null)
        ? (domMatch || dowMatch)
        : (domMatch && dowMatch);

    if (
      (month === null || month.includes(mo)) &&
      dayMatch &&
      (hour   === null || hour.includes(hr)) &&
      (minute === null || minute.includes(min))
    ) {
      runs.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return runs;
}

// ─── Human-readable description ───────────────────────────────────────────
function listOf(arr, labels) {
  if (!arr) return null;
  const named = arr.map(n => labels ? labels[n] : String(n));
  if (named.length === 1) return named[0];
  if (named.length === 2) return `${named[0]} and ${named[1]}`;
  return named.slice(0, -1).join(', ') + ', and ' + named.slice(-1);
}

function describeTime(minE, hrE, minute, hour) {
  if (minE === '*' && hrE === '*') return 'every minute';
  if (minE.startsWith('*/') && hrE === '*') return `every ${minE.slice(2)} minutes`;
  if (minE === '0' && hrE === '*') return 'every hour, on the hour';
  if (hrE === '*') return `at minute :${String(minute?.[0] ?? minE).padStart(2, '0')} of every hour`;
  if (hrE.startsWith('*/')) {
    const step = hrE.slice(2);
    const minStr = minE === '0' ? 'on the hour' : `at :${String(minute?.[0] ?? 0).padStart(2, '0')}`;
    return `every ${step} hours, ${minStr}`;
  }
  // Specific time(s)
  if (hour && minute) {
    const times = hour.map(h =>
      minute.map(m => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`).join(', ')
    ).join(', ');
    return `at ${times}`;
  }
  return `at hour ${hrE}, minute ${minE}`;
}

function buildDescription(parsed) {
  const { parts, minute, hour, dom, month, dow } = parsed;
  const [minE, hrE, domE, monE, dowE] = parts;

  const timePart = describeTime(minE, hrE, minute, hour);

  const dayParts = [];
  if (dom !== null && dow !== null) {
    dayParts.push(`on day ${listOf(dom) ?? domE} of the month or ${listOf(dow, DOW_NAMES) ?? dowE}`);
  } else if (dom !== null) {
    const dayList = dom.length <= 4 ? dom.map(d => ORDINALS[d]).join(', ') : domE;
    dayParts.push(`on the ${dayList} of the month`);
  } else if (dow !== null) {
    const dowList = listOf(dow, DOW_NAMES) ?? dowE;
    dayParts.push(`on ${dowList}`);
  }

  if (month !== null) {
    dayParts.push(`in ${listOf(month, MONTH_NAMES) ?? monE}`);
  }

  const suffix = dayParts.length ? ', ' + dayParts.join(', ') : '';
  return timePart.charAt(0).toUpperCase() + timePart.slice(1) + suffix + '.';
}

// ─── Per-field plain-English label ────────────────────────────────────────
function fieldLabel(expr, def) {
  if (expr === '*') return `Every ${def.unit}`;
  if (expr.startsWith('*/')) return `Every ${expr.slice(2)} ${def.unit}s`;
  try {
    const aliases = def.name === 'Month' ? MONTH_ALIASES : def.name === 'Weekday' ? DOW_ALIASES : {};
    const vals = expandField(expr, def.min, def.max, aliases);
    if (!vals) return `Every ${def.unit}`;
    const labels = def.name === 'Month' ? MONTH_NAMES : def.name === 'Weekday' ? DOW_NAMES : null;
    if (vals.length === 1) {
      const v = vals[0];
      if (def.name === 'Hour') return `${String(v).padStart(2,'0')}:00`;
      if (def.name === 'Minute') return `:${String(v).padStart(2,'0')}`;
      return labels ? labels[v] : def.name === 'Day' ? ORDINALS[v] : String(v);
    }
    // Check if it's a contiguous range
    const isRange = vals.every((v, i) => i === 0 || v === vals[i-1] + 1);
    const named = v => labels ? labels[v] : def.name === 'Day' ? ORDINALS[v] : String(v);
    if (isRange && vals.length > 2) return `${named(vals[0])} – ${named(vals[vals.length-1])}`;
    if (vals.length <= 5) return vals.map(named).join(', ');
    return `${vals.length} specific ${def.unit}s`;
  } catch {
    return expr;
  }
}

// ─── Main component ────────────────────────────────────────────────────────
export default function CronParserPage() {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const { toast } = useToast();

  const result = useMemo(() => {
    const raw = expr.trim();
    if (!raw) return null;
    try {
      const parsed = parseCron(raw);
      const description = buildDescription(parsed);
      const nextRuns = getNextRuns(parsed, 8);
      return { parsed, description, nextRuns, error: null };
    } catch (e) {
      return { parsed: null, description: null, nextRuns: [], error: e.message };
    }
  }, [expr]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(expr);
    toast({ title: 'Copied', description: 'Expression copied to clipboard.' });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) { toast({ title: 'Clipboard empty', variant: 'destructive' }); return; }
      setExpr(text.trim());
      toast({ title: 'Pasted' });
    } catch {
      toast({ title: 'Paste failed', description: 'Clipboard inaccessible.', variant: 'destructive' });
    }
  };

  const handleClear = () => {
    setExpr('');
    toast({ title: 'Cleared' });
  };

  const fmt = (d) =>
    d.toLocaleString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Cron Expression Parser</h1>
          <p className="text-sm text-slate-400">
            Parse and understand cron expressions. See a plain-English description and the next scheduled run times.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Human-readable description</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Next 8 run times</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Supports @yearly, @daily etc.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.expr}
              onClick={() => setExpr(p.expr)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                expr === p.expr
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                  : 'text-muted-foreground border-border hover:border-yellow-500/30 hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Expression input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Expression</label>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5" /> Paste
              </button>
              <button
                onClick={handleClear}
                disabled={!expr}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="e.g. 0 9 * * 1-5  or  @daily"
                spellCheck="false"
                className={cn(
                  'w-full h-12 px-4 font-mono text-base bg-muted/30 border rounded-lg focus:outline-none focus:ring-2 transition-shadow',
                  result?.error
                    ? 'border-destructive/50 focus:ring-destructive/30'
                    : 'border-border focus:ring-yellow-500/30'
                )}
              />
              {result?.error && (
                <div className="absolute left-0 top-full mt-1 flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {result.error}
                </div>
              )}
            </div>
            <Button onClick={handleCopy} variant="outline" size="icon" className="h-12 w-12 shrink-0" disabled={!expr}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Field breakdown */}
        {result?.parsed && (
          <div className="grid grid-cols-5 gap-2 mt-6">
            {FIELD_DEFS.map((def, i) => (
              <div key={def.name} className="flex flex-col items-center gap-1 p-3 rounded-xl border bg-card text-center">
                <span className="text-xs text-muted-foreground font-medium">{def.name}</span>
                <span className="font-mono text-sm font-bold text-yellow-400">{result.parsed.parts[i]}</span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {fieldLabel(result.parsed.parts[i], def)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Description + next runs */}
        {result?.parsed && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Description */}
            <div className="p-5 rounded-xl border bg-card space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plain English</p>
              <p className="text-lg font-semibold leading-snug text-foreground">
                {result.description}
              </p>
              {/* Macro hint */}
              {Object.entries(MACROS).find(([, v]) => v === result.parsed.parts.join(' ')) && (
                <p className="text-xs text-yellow-400 font-mono">
                  Alias: {Object.entries(MACROS).find(([, v]) => v === result.parsed.parts.join(' '))[0]}
                </p>
              )}
            </div>

            {/* Next runs */}
            <div className="p-5 rounded-xl border bg-card space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next 8 runs</p>
              {result.nextRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No runs found in the next year.</p>
              ) : (
                <ol className="space-y-1.5">
                  {result.nextRuns.map((d, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-yellow-500/15 text-yellow-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-mono text-foreground">{fmt(d)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}

        {/* Related Tools */}
        <div className="border-t pt-12 mt-4">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
            <Link href="/jwt-decoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                JWT Decoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Decode and inspect JSON Web Tokens securely in your browser.</p>
            </Link>
            <Link href="/jwt-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-teal-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-500" />
                JWT Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Build and sign JSON Web Tokens with a custom payload and secret.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/json-formatter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-500" />
                JSON Formatter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Format, validate, and minify JSON data instantly.</p>
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
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />
                UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-slate-400">Generate UUID v4 values instantly, with bulk generation and validation.</p>
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Cron syntax:</span> A standard cron expression has 5 fields —{' '}
              <code className="font-mono text-xs">minute hour day month weekday</code>. Each field accepts{' '}
              <code className="font-mono text-xs">*</code> (any),{' '}
              <code className="font-mono text-xs">*/n</code> (every n),{' '}
              <code className="font-mono text-xs">n-m</code> (range), and{' '}
              <code className="font-mono text-xs">a,b,c</code> (list) syntax.
            </p>
            <p className="text-xs text-muted-foreground">
              Supports <code className="font-mono">@yearly</code>, <code className="font-mono">@monthly</code>, <code className="font-mono">@weekly</code>, <code className="font-mono">@daily</code>, and <code className="font-mono">@hourly</code> macros. Month and weekday names (JAN–DEC, SUN–SAT) are also accepted. All processing happens locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
