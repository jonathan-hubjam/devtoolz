'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Palette, Copy, Check, ClipboardPaste, Shuffle,
  Binary, Hash, Link2, FileJson, CaseSensitive, Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ── Color math ────────────────────────────────────────────────────────────────

function clamp255(v) { return Math.max(0, Math.min(255, Math.round(v))); }

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  if (h.length === 3)
    return { r: parseInt(h[0]+h[0],16), g: parseInt(h[1]+h[1],16), b: parseInt(h[2]+h[2],16), a: 1 };
  if (h.length === 6)
    return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: 1 };
  if (h.length === 8)
    return {
      r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16),
      b: parseInt(h.slice(4,6),16), a: +(parseInt(h.slice(6,8),16)/255).toFixed(3),
    };
  return null;
}

function toHex({ r, g, b }) {
  return '#' + [r,g,b].map(v => clamp255(v).toString(16).padStart(2,'0')).join('').toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn);
  const l = (max+min)/2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l*100) };
  const d = max - min;
  const s = l > 0.5 ? d/(2-max-min) : d/(max+min);
  let h;
  switch (max) {
    case rn: h = (gn-bn)/d + (gn < bn ? 6 : 0); break;
    case gn: h = (bn-rn)/d + 2; break;
    default:  h = (rn-gn)/d + 4;
  }
  return { h: Math.round(h*60), s: Math.round(s*100), l: Math.round(l*100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1-l);
  const f = n => { const k = (n+h/30)%12; return l - a*Math.max(-1, Math.min(k-3, 9-k, 1)); };
  return { r: clamp255(f(0)*255), g: clamp255(f(8)*255), b: clamp255(f(4)*255) };
}

function rgbToHsv({ r, g, b }) {
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn), d = max-min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn: h = (gn-bn)/d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn-rn)/d + 2; break;
      default:  h = (rn-gn)/d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h*360), s: Math.round((max===0?0:d/max)*100), v: Math.round(max*100) };
}

function hsvToRgb(h, s, v) {
  s /= 100; v /= 100;
  const i = Math.floor(h/60)%6, f = h/60-Math.floor(h/60);
  const p = v*(1-s), q = v*(1-f*s), t = v*(1-(1-f)*s);
  const tab = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];
  const [rn,gn,bn] = tab[i] ?? tab[0];
  return { r: clamp255(rn*255), g: clamp255(gn*255), b: clamp255(bn*255) };
}

function rgbToCmyk({ r, g, b }) {
  const rn = r/255, gn = g/255, bn = b/255;
  const k = 1 - Math.max(rn,gn,bn);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round((1-rn-k)/(1-k)*100),
    m: Math.round((1-gn-k)/(1-k)*100),
    y: Math.round((1-bn-k)/(1-k)*100),
    k: Math.round(k*100),
  };
}

function cmykToRgb(c, m, y, k) {
  c /= 100; m /= 100; y /= 100; k /= 100;
  return {
    r: clamp255((1-c)*(1-k)*255),
    g: clamp255((1-m)*(1-k)*255),
    b: clamp255((1-y)*(1-k)*255),
  };
}

function parseColor(input) {
  const s = input.trim();
  if (!s) return null;

  if (s.startsWith('#')) return hexToRgb(s);

  const m = str => s.match(str);

  // rgb / rgba
  const rgb = m(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a: rgb[4]!==undefined ? +rgb[4] : 1 };

  // hsl / hsla
  const hsl = m(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (hsl) return { ...hslToRgb(+hsl[1],+hsl[2],+hsl[3]), a: hsl[4]!==undefined ? +hsl[4] : 1 };

  // hsv / hsb
  const hsv = m(/^hs[vb]\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)$/i);
  if (hsv) return { ...hsvToRgb(+hsv[1],+hsv[2],+hsv[3]), a: 1 };

  // cmyk
  const cmyk = m(/^cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)$/i);
  if (cmyk) return { ...cmykToRgb(+cmyk[1],+cmyk[2],+cmyk[3],+cmyk[4]), a: 1 };

  // bare r, g, b
  const bare = m(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
  if (bare) return { r: +bare[1], g: +bare[2], b: +bare[3], a: 1 };

  return null;
}

function randomRgb() {
  return { r: Math.random()*256|0, g: Math.random()*256|0, b: Math.random()*256|0, a: 1 };
}

// ── Config ────────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { label: 'Crimson',  hex: '#DC143C' },
  { label: 'Sky Blue', hex: '#87CEEB' },
  { label: 'Gold',     hex: '#FFD700' },
  { label: 'Forest',   hex: '#228B22' },
  { label: 'Coral',    hex: '#FF6B6B' },
  { label: 'Indigo',   hex: '#6366F1' },
  { label: 'Amber',    hex: '#F59E0B' },
  { label: 'Teal',     hex: '#14B8A6' },
];

const RELATED = [
  { href: '/number-base-converter', label: 'Number Base Converter', sub: 'Hex ↔ decimal',    Icon: Binary,        cls: 'bg-pink-500/10 text-pink-400' },
  { href: '/hash-generator',        label: 'Hash Generator',        sub: 'MD5, SHA-256',      Icon: Hash,          cls: 'bg-rose-500/10 text-rose-400' },
  { href: '/base64-encoder',        label: 'Base64 Encoder',        sub: 'Encode & decode',   Icon: FileJson,      cls: 'bg-green-500/10 text-green-400' },
  { href: '/url-encoder',           label: 'URL Encoder',           sub: 'Percent-encoding',  Icon: Link2,         cls: 'bg-cyan-500/10 text-cyan-400' },
  { href: '/sql-formatter',         label: 'SQL Formatter',         sub: '7 SQL dialects',    Icon: Database,      cls: 'bg-fuchsia-500/10 text-fuchsia-400' },
  { href: '/case-converter',        label: 'Case Converter',        sub: '10 case formats',   Icon: CaseSensitive, cls: 'bg-sky-500/10 text-sky-400' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ColorConverterPage() {
  const { toast } = useToast();
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241, a: 1 });
  const [inputText, setInputText] = useState('#6366F1');
  const [parseError, setParseError] = useState(null);
  const [copied, setCopied] = useState(null);
  const pickerRef = useRef(null);

  function applyParsed(color, display) {
    setRgb({ a: 1, ...color });
    setInputText(display);
    setParseError(null);
  }

  function handleInput(e) {
    const val = e.target.value;
    setInputText(val);
    const parsed = parseColor(val);
    if (parsed) { setRgb({ a: 1, ...parsed }); setParseError(null); }
    else if (val.trim()) setParseError('Unrecognised format');
    else setParseError(null);
  }

  function handlePicker(e) {
    const parsed = hexToRgb(e.target.value);
    if (parsed) applyParsed({ ...parsed, a: rgb.a }, e.target.value.toUpperCase());
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseColor(text.trim());
      if (parsed) { applyParsed(parsed, text.trim()); }
      else { setInputText(text.trim()); setParseError('Unrecognised format'); }
    } catch { toast({ description: 'Clipboard access denied', variant: 'destructive' }); }
  }

  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
      toast({ description: 'Copied to clipboard' });
    } catch { toast({ description: 'Copy failed', variant: 'destructive' }); }
  }

  function shuffle() {
    const c = randomRgb();
    applyParsed(c, toHex(c));
  }

  // Derived
  const hex   = toHex(rgb);
  const hsl   = rgbToHsl(rgb);
  const hsv   = rgbToHsv(rgb);
  const cmyk  = rgbToCmyk(rgb);
  const hasA  = rgb.a < 0.999;
  const aHex  = hasA ? Math.round(rgb.a * 255).toString(16).padStart(2,'0').toUpperCase() : null;

  const formats = [
    { key: 'hex',  label: 'HEX',  value: hex },
    ...(hasA ? [{ key: 'hexa', label: 'HEX+A', value: hex + aHex }] : []),
    { key: 'rgb',  label: 'RGB',  value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    ...(hasA ? [{ key: 'rgba', label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` }] : []),
    { key: 'hsl',  label: 'HSL',  value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    ...(hasA ? [{ key: 'hsla', label: 'HSLA', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${rgb.a})` }] : []),
    { key: 'hsv',  label: 'HSV',  value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { key: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  const swatchStyle = { backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})` };
  const luminance = 0.299*rgb.r + 0.587*rgb.g + 0.114*rgb.b;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100">
      {/* Page header */}
      <div className="border-b border-slate-800/50 bg-[#0B1120] py-5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Palette className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-tight">Color Converter</h1>
              <p className="text-sm text-slate-400">Convert between HEX, RGB, HSL, HSV, and CMYK</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Swatch + input */}
        <div className="rounded-xl overflow-hidden border border-slate-700/50">
          {/* Colour swatch */}
          <div
            className="h-28 w-full flex items-end px-4 pb-3 transition-colors duration-150"
            style={swatchStyle}
          >
            <span
              className={cn(
                'text-xs font-mono px-2 py-0.5 rounded backdrop-blur-sm',
                luminance > 128 ? 'bg-black/30 text-white/80' : 'bg-white/30 text-black/80'
              )}
            >
              {hex}
            </span>
          </div>

          {/* Input row */}
          <div className="bg-slate-800/60 px-4 py-3 flex gap-2 items-center">
            {/* Native colour picker */}
            <div className="relative flex-shrink-0">
              <input
                type="color"
                ref={pickerRef}
                value={hex.slice(0,7).toLowerCase()}
                onChange={handlePicker}
                className="sr-only"
                id="colPicker"
              />
              <label
                htmlFor="colPicker"
                title="Open colour picker"
                className="w-9 h-9 rounded-lg border-2 border-slate-600 hover:border-violet-500 cursor-pointer block transition-colors overflow-hidden"
                style={{ backgroundColor: `rgb(${rgb.r},${rgb.g},${rgb.b})` }}
              />
            </div>

            {/* Text field */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={handleInput}
                placeholder="#RRGGBB · rgb(r,g,b) · hsl(h,s%,l%) · hsv(h,s%,v%) · cmyk(…)"
                spellCheck={false}
                className={cn(
                  'w-full bg-slate-900/50 border rounded-lg px-3 py-2 text-sm font-mono text-slate-200',
                  'placeholder:text-slate-600 focus:outline-none focus:ring-1',
                  parseError
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-slate-700 focus:border-violet-500/50 focus:ring-violet-500/20'
                )}
              />
              {parseError && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-400">{parseError}</p>
              )}
            </div>

            <Button variant="ghost" size="icon" onClick={paste} className="text-blue-500 hover:text-blue-400 flex-shrink-0" title="Paste">
              <ClipboardPaste className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={shuffle} className="text-slate-400 hover:text-violet-400 flex-shrink-0" title="Random colour">
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Format outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formats.map(({ key, label, value }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <div className="text-xs text-slate-500 font-medium mb-0.5">{label}</div>
                <div className="text-sm font-mono text-slate-200 truncate">{value}</div>
              </div>
              <button
                onClick={() => copy(value, key)}
                className="flex-shrink-0 text-slate-500 hover:text-violet-400 transition-colors"
                title={`Copy ${label}`}
              >
                {copied === key
                  ? <Check className="w-4 h-4 text-green-400" />
                  : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        {/* Quick colours */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-300 mb-3">Quick Colours</h2>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(({ label, hex: h }) => {
              const eg = hexToRgb(h);
              return (
                <button
                  key={h}
                  onClick={() => applyParsed({ ...eg, a: 1 }, h)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-violet-500/40 transition-all text-sm text-slate-300"
                >
                  <span className="w-4 h-4 rounded-sm flex-shrink-0 border border-white/10" style={{ backgroundColor: h }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Related tools */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-300 mb-3">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {RELATED.map(({ href, label, sub, Icon, cls }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-violet-500/30 transition-all group/card"
              >
                <div className={cn('w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0', cls)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover/card:text-violet-400 transition-colors">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
