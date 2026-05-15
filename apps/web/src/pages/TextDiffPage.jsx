'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Copy, Trash2, CheckCircle2, ArrowRight, Clipboard, FileJson, Hash, ShieldCheck, Clock, Link2, Fingerprint, FileCode, Search, KeyRound, Zap, GitCompare, CaseSensitive, CalendarClock, Database, Table2, Binary, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ─── Inline useDebounce ────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Diff engine ──────────────────────────────────────────────────────────
const MAX_LINES = 3000;

function splitLines(text) {
  if (!text) return [];
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function normalizeForCompare(line, ignoreWS) {
  return ignoreWS ? line.trim().replace(/\s+/g, ' ') : line;
}

// ─── Character-level inline diff ──────────────────────────────────────────
// Returns { left: [{text, highlight}], right: [{text, highlight}] }
// or null if lines are too long / too dissimilar to be worth showing.
function charDiff(a, b) {
  if (a.length > 400 || b.length > 400) return null;
  const m = a.length, n = b.length;

  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Skip inline diff if lines share less than 20% similarity — the whole-line
  // colour is cleaner when lines are completely different.
  const lcsLen = dp[m][n];
  if (m + n > 0 && (2 * lcsLen) / (m + n) < 0.2) return null;

  const leftChars = [], rightChars = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      leftChars.push({ ch: a[i - 1], hl: false });
      rightChars.push({ ch: b[j - 1], hl: false });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rightChars.push({ ch: b[j - 1], hl: true });
      j--;
    } else {
      leftChars.push({ ch: a[i - 1], hl: true });
      i--;
    }
  }
  leftChars.reverse();
  rightChars.reverse();

  function toSpans(chars) {
    const spans = [];
    let cur = null;
    for (const { ch, hl } of chars) {
      if (!cur || cur.highlight !== hl) { cur = { text: ch, highlight: hl }; spans.push(cur); }
      else cur.text += ch;
    }
    return spans;
  }
  return { left: toSpans(leftChars), right: toSpans(rightChars) };
}

// Walk hunks, pair removed↔added within each change block, attach inlineSpans.
function annotateInlineDiff(hunks) {
  const result = hunks.map(h => ({ ...h }));
  let i = 0;
  while (i < result.length) {
    if (result[i].type === 'equal') { i++; continue; }
    const removed = [], added = [];
    while (i < result.length && result[i].type !== 'equal') {
      if (result[i].type === 'removed') removed.push(i);
      else added.push(i);
      i++;
    }
    const pairs = Math.min(removed.length, added.length);
    for (let k = 0; k < pairs; k++) {
      const ri = removed[k], ai = added[k];
      const diff = charDiff(result[ri].line ?? '', result[ai].line ?? '');
      if (diff) {
        result[ri].inlineSpans = diff.left;
        result[ai].inlineSpans = diff.right;
      }
    }
  }
  return result;
}

function computeDiff(originalText, modifiedText, ignoreWS) {
  const aLines = splitLines(originalText);
  const bLines = splitLines(modifiedText);

  if (aLines.length === 0 && bLines.length === 0) {
    return { hunks: [], stats: { added: 0, removed: 0, unchanged: 0 }, error: null };
  }

  if (aLines.length > MAX_LINES || bLines.length > MAX_LINES) {
    return { hunks: [], stats: { added: 0, removed: 0, unchanged: 0 }, error: `Input too large — max ${MAX_LINES} lines per side.` };
  }

  const m = aLines.length;
  const n = bLines.length;

  // LCS DP table with Int32Array rows for performance
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    const aKey = normalizeForCompare(aLines[i - 1], ignoreWS);
    for (let j = 1; j <= n; j++) {
      const bKey = normalizeForCompare(bLines[j - 1], ignoreWS);
      dp[i][j] = aKey === bKey
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  const hunks = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 &&
      normalizeForCompare(aLines[i - 1], ignoreWS) === normalizeForCompare(bLines[j - 1], ignoreWS)) {
      hunks.push({ type: 'equal', lineA: aLines[i - 1], lineB: bLines[j - 1], numA: i, numB: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      hunks.push({ type: 'added', line: bLines[j - 1], numB: j });
      j--;
    } else {
      hunks.push({ type: 'removed', line: aLines[i - 1], numA: i });
      i--;
    }
  }
  hunks.reverse();

  const stats = hunks.reduce(
    (acc, h) => { acc[h.type === 'equal' ? 'unchanged' : h.type === 'added' ? 'added' : 'removed']++; return acc; },
    { added: 0, removed: 0, unchanged: 0 }
  );

  return { hunks, stats, error: null };
}

function groupForSplit(hunks) {
  const rows = [];
  let i = 0;
  while (i < hunks.length) {
    if (hunks[i].type === 'equal') {
      rows.push({ kind: 'equal', hunk: hunks[i] });
      i++;
    } else {
      const removed = [], added = [];
      while (i < hunks.length && hunks[i].type !== 'equal') {
        if (hunks[i].type === 'removed') removed.push(hunks[i]);
        else added.push(hunks[i]);
        i++;
      }
      const len = Math.max(removed.length, added.length);
      for (let k = 0; k < len; k++) {
        rows.push({ kind: 'change', left: removed[k] ?? null, right: added[k] ?? null });
      }
    }
  }
  return rows;
}

function toDiffText(hunks) {
  return hunks.map(h => {
    const prefix = h.type === 'added' ? '+' : h.type === 'removed' ? '-' : ' ';
    return prefix + (h.line ?? h.lineA);
  }).join('\n');
}

// ─── Row components ────────────────────────────────────────────────────────
function InlineSpans({ spans, isRemoved }) {
  return spans.map((s, i) =>
    s.highlight
      ? <mark key={i} className={cn('rounded-sm', isRemoved ? 'bg-red-500/50' : 'bg-green-500/50')}>{s.text}</mark>
      : <span key={i}>{s.text}</span>
  );
}

function UnifiedRow({ hunk }) {
  const isAdded = hunk.type === 'added';
  const isRemoved = hunk.type === 'removed';
  return (
    <div className={cn(
      'flex font-mono text-xs leading-6 min-w-0',
      isAdded && 'bg-green-500/10 border-l-2 border-green-500',
      isRemoved && 'bg-red-500/10 border-l-2 border-red-500',
    )}>
      <span className="w-9 shrink-0 text-right pr-2 text-muted-foreground select-none tabular-nums">{hunk.numA ?? ''}</span>
      <span className="w-9 shrink-0 text-right pr-2 text-muted-foreground select-none tabular-nums">{hunk.numB ?? ''}</span>
      <span className={cn('w-4 shrink-0 text-center select-none font-bold',
        isAdded ? 'text-green-500' : isRemoved ? 'text-red-400' : 'text-muted-foreground'
      )}>{isAdded ? '+' : isRemoved ? '-' : ' '}</span>
      <span className="flex-1 whitespace-pre-wrap break-all pr-2">
        {hunk.inlineSpans
          ? <InlineSpans spans={hunk.inlineSpans} isRemoved={isRemoved} />
          : (hunk.line ?? hunk.lineA)}
      </span>
    </div>
  );
}

function SplitCell({ hunk, side }) {
  if (!hunk) return <div className="flex-1 bg-muted/20 font-mono text-xs leading-6 min-h-6" />;
  const isAdded = hunk.type === 'added';
  const isRemoved = hunk.type === 'removed';
  const isEqual = hunk.type === 'equal';
  const bg = isAdded ? 'bg-green-500/10' : isRemoved ? 'bg-red-500/10' : '';
  const border = isAdded ? 'border-l-2 border-green-500' : isRemoved ? 'border-l-2 border-red-500' : '';
  const num = side === 'left' ? (hunk.numA ?? '') : (hunk.numB ?? '');
  const text = isEqual ? (side === 'left' ? hunk.lineA : hunk.lineB) : hunk.line;
  return (
    <div className={cn('flex flex-1 font-mono text-xs leading-6 min-w-0', bg, border)}>
      <span className="w-9 shrink-0 text-right pr-2 text-muted-foreground select-none tabular-nums">{num}</span>
      <span className="flex-1 whitespace-pre-wrap break-all pr-2">
        {hunk.inlineSpans
          ? <InlineSpans spans={hunk.inlineSpans} isRemoved={isRemoved} />
          : (text ?? '')}
      </span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function TextDiffPage() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [viewMode, setViewMode] = useState('unified');
  const [ignoreWS, setIgnoreWS] = useState(false);
  const { toast } = useToast();

  const debouncedOriginal = useDebounce(original, 200);
  const debouncedModified = useDebounce(modified, 200);

  const { hunks, stats, error } = useMemo(
    () => computeDiff(debouncedOriginal, debouncedModified, ignoreWS),
    [debouncedOriginal, debouncedModified, ignoreWS]
  );

  const annotatedHunks = useMemo(() => annotateInlineDiff(hunks), [hunks]);
  const splitRows = useMemo(() => viewMode === 'split' ? groupForSplit(annotatedHunks) : [], [annotatedHunks, viewMode]);
  const hasContent = original || modified;

  const handlePaste = async (target) => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) { toast({ title: 'Clipboard empty', variant: 'destructive' }); return; }
      if (target === 'original') setOriginal(text); else setModified(text);
      toast({ title: 'Pasted', description: `Content pasted into ${target} panel.` });
    } catch {
      toast({ title: 'Paste failed', description: 'Clipboard inaccessible.', variant: 'destructive' });
    }
  };

  const handleCopyDiff = async () => {
    if (!hunks.length) return;
    await navigator.clipboard.writeText(toDiffText(hunks));
    toast({ title: 'Diff copied', description: 'Unified diff copied to clipboard.' });
  };

  const handleClear = () => {
    setOriginal(''); setModified('');
    toast({ title: 'Cleared' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">Text Diff Tool</h1>
          <p className="text-sm text-slate-400">Paste two blocks of text to compare them line by line. Highlights additions, deletions, and unchanged lines instantly.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Unified & split view</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />Ignore whitespace</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />No data stored</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            {['unified', 'split'].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors capitalize',
                  viewMode === m
                    ? 'bg-green-500/20 text-green-500'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Ignore whitespace */}
          <button
            onClick={() => setIgnoreWS(v => !v)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
              ignoreWS
                ? 'bg-green-500/15 text-green-500 border-green-500/40'
                : 'text-muted-foreground border-border hover:border-green-500/30 hover:text-foreground'
            )}
          >
            Ignore whitespace
          </button>

          <div className="ml-auto flex gap-2">
            <Button onClick={handleCopyDiff} variant="outline" size="sm" disabled={!hunks.length}>
              <Copy className="w-4 h-4 mr-1.5" /> Copy diff
            </Button>
            <Button onClick={handleClear} variant="ghost" size="sm" disabled={!hasContent}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-1.5" /> Clear
            </Button>
          </div>
        </div>

        {/* Input panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { label: 'Original', value: original, setter: setOriginal, key: 'original' },
            { label: 'Modified', value: modified, setter: setModified, key: 'modified' },
          ].map(({ label, value, setter, key }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>
                <button
                  onClick={() => handlePaste(key)}
                  className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Clipboard className="w-3.5 h-3.5" /> Paste
                </button>
              </div>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={`Paste ${label.toLowerCase()} text here...`}
                className="w-full h-52 p-3 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-shadow"
                spellCheck="false"
              />
            </div>
          ))}
        </div>

        {/* Diff output */}
        {hasContent && (
          <div className="space-y-3">
            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-5 px-4 py-2.5 rounded-lg bg-muted/40 border text-sm">
              <span className="font-medium text-green-500">+{stats.added} added</span>
              <span className="font-medium text-red-400">-{stats.removed} removed</span>
              <span className="text-muted-foreground">{stats.unchanged} unchanged</span>
              {error && <span className="text-destructive ml-auto text-xs">{error}</span>}
            </div>

            {error ? null : hunks.length === 0 && !error ? (
              <div className="flex items-center justify-center h-20 rounded-lg border bg-muted/20 text-sm text-muted-foreground">
                {original || modified ? 'Files are identical' : ''}
              </div>
            ) : viewMode === 'unified' ? (
              <div className="rounded-lg border overflow-auto max-h-[600px] bg-card">
                {annotatedHunks.map((hunk, i) => <UnifiedRow key={i} hunk={hunk} />)}
              </div>
            ) : (
              <div className="rounded-lg border overflow-auto max-h-[600px] bg-card">
                <div className="flex text-xs text-muted-foreground border-b px-2 py-1 bg-muted/30">
                  <div className="flex-1 font-medium pl-9">Original</div>
                  <div className="w-px bg-border mx-2" />
                  <div className="flex-1 font-medium pl-9">Modified</div>
                </div>
                {splitRows.map((row, i) => (
                  <div key={i} className="flex min-w-0 border-b border-border/40 last:border-0">
                    {row.kind === 'equal' ? (
                      <>
                        <SplitCell hunk={row.hunk} side="left" />
                        <div className="w-px bg-border/60 shrink-0" />
                        <SplitCell hunk={row.hunk} side="right" />
                      </>
                    ) : (
                      <>
                        <SplitCell hunk={row.left} side="left" />
                        <div className="w-px bg-border/60 shrink-0" />
                        <SplitCell hunk={row.right} side="right" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        
        {/* SEO Content */}
        <div className="mt-12 space-y-6">
          <div className="bg-muted/50 border border-border rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground mb-2">What is a Text Diff Tool?</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                A text diff tool compares two pieces of text and highlights the differences — additions, deletions,
                and unchanged lines — using colour-coded output similar to the <code className="bg-muted text-foreground/90 px-1 py-0.5 rounded font-mono text-xs">git diff</code>
                or Unix <code className="bg-muted text-foreground/90 px-1 py-0.5 rounded font-mono text-xs">diff</code> commands. It is an essential tool for reviewing
                changes in configuration files, code snippets, API responses, or any text where you need to quickly
                understand what changed between two versions without reading both in full.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground/80 mb-2">Common Use Cases</h3>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                <li>Compare two versions of a config file to find what changed after a deployment</li>
                <li>Spot differences between two API responses for the same endpoint</li>
                <li>Review a colleague's code changes before a formal code review</li>
                <li>Compare translated or edited documents to see what was added or removed</li>
                <li>Verify that a find-and-replace operation produced the expected changes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground/80 mb-2">How It Works</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The diff algorithm (an implementation of the Myers diff algorithm or similar LCS-based approach)
                computes the longest common subsequence of lines between the two inputs and classifies each line as
                unchanged, added (green), or removed (red). Line-level diffing is the default; word-level or
                character-level diffing can highlight more granular changes within a line. All comparison happens
                in your browser — text is never sent to a server.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground/80 mb-2">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">What is the difference between unified and side-by-side diff?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Unified diff shows both versions interleaved in a single column with + and - markers — compact and good for terminals. Side-by-side diff shows the two versions in parallel columns — easier to read for longer files or prose comparisons.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Does whitespace matter in the comparison?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">By default, trailing whitespace and line-ending differences (CRLF vs LF) are included in the diff. Most tools offer an "ignore whitespace" option that skips purely cosmetic whitespace changes so you can focus on meaningful content differences.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">How large a file can I diff in the browser?</p>
                  <p className="text-sm text-slate-400 leading-relaxed">Browser-based diff tools handle files up to a few hundred kilobytes comfortably. For very large files (megabytes), the diff algorithm can become slow due to the quadratic nature of LCS computation. Use command-line tools like <code className="bg-muted text-foreground/90 px-1 py-0.5 rounded font-mono text-xs">diff</code> or <code className="bg-muted text-foreground/90 px-1 py-0.5 rounded font-mono text-xs">git diff</code> for large files.</p>
                </div>
              </div>
            </div>
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
              <p className="text-sm text-muted-foreground">Format, validate, and minify JSON data instantly.</p>
            </Link>
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
            <Link href="/jwt-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-teal-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-500" />
                JWT Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Build and sign JSON Web Tokens with a custom payload and secret.</p>
            </Link>
            <Link href="/regex-tester" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-orange-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Regex Tester
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Test and debug regular expressions with live match highlighting.</p>
            </Link>
            <Link href="/json-yaml-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-indigo-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-500" />
                JSON ↔ YAML
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert between JSON and YAML instantly with real-time validation.</p>
            </Link>
            <Link href="/hash-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-rose-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-500" />
                Hash Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.</p>
            </Link>
            <Link href="/url-encoder" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-cyan-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-500" />
                URL Encoder
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Encode and decode URLs with percent-encoding instantly.</p>
            </Link>
            <Link href="/unix-timestamp" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-amber-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Unix Timestamp
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert Unix timestamps to human-readable dates and back instantly.</p>
            </Link>
            <Link href="/uuid-generator" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-500" />
                UUID Generator
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Generate UUID v4 values instantly, with bulk generation and validation.</p>
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
            <Link href="/number-base-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-pink-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Binary className="w-5 h-5 text-pink-500" />
                Number Base Converter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert between decimal, hexadecimal, octal, and binary number bases.</p>
            </Link>
            <Link href="/color-converter" className="group block p-6 bg-card border rounded-xl hover:shadow-md transition-all hover:-translate-y-1 hover:border-violet-500/30">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-500" />
                Color Converter
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">Convert colours between HEX, RGB, HSL, HSV, and CMYK formats.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">How it works:</span> This tool uses a Longest Common Subsequence (LCS) algorithm to find the minimal set of changes between two texts — the same technique used by Git and most code review tools to produce line diffs.
            </p>
            <p className="text-xs text-muted-foreground">
              All comparison happens locally in your browser. Neither panel's content is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
