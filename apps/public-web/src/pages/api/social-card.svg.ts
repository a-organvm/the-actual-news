import type { NextApiRequest, NextApiResponse } from "next";

function text(value: unknown, fallback: string) {
  const raw = Array.isArray(value) ? value[0] : value;
  return String(raw || fallback).slice(0, 120);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapWords(value: string, maxChars: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const title = text(req.query.title, "Records Watch");
  const kicker = text(req.query.kicker, "Town crier ledger");
  const state = text(req.query.state, "verified");
  const lines = wrapWords(title, 28);

  const titleLines = lines
    .map((line, index) => `<text x="92" y="${250 + index * 86}" class="headline">${escapeXml(line)}</text>`)
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(
    title
  )}">
  <defs>
    <pattern id="paper" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#f7f7f2"/>
      <path d="M0 0H8" stroke="#d2d2cc" stroke-width="1" opacity="0.68"/>
      <path d="M0 8L8 0" stroke="#111111" stroke-width="0.6" opacity="0.12"/>
    </pattern>
    <style>
      .small { font: 800 30px Arial, sans-serif; letter-spacing: 0; text-transform: uppercase; fill: #2e2e2e; }
      .headline { font: 900 78px Georgia, serif; letter-spacing: 0; fill: #111111; }
      .label { font: 900 28px Arial, sans-serif; letter-spacing: 0; text-transform: uppercase; fill: #f7f7f2; }
      .body { font: 700 30px Arial, sans-serif; fill: #4d4d4d; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="url(#paper)"/>
  <rect x="44" y="42" width="1112" height="546" fill="none" stroke="#1f1f1f" stroke-width="5"/>
  <rect x="66" y="64" width="1068" height="502" fill="none" stroke="#1f1f1f" stroke-width="2"/>
  <text x="92" y="126" class="small">${escapeXml(kicker)}</text>
  <text x="600" y="126" text-anchor="middle" style="font: 900 58px Georgia, serif; text-transform: uppercase; fill: #111111;">Records Watch</text>
  <rect x="914" y="88" width="170" height="52" fill="#111111"/>
  <text x="999" y="124" text-anchor="middle" class="label">${escapeXml(state)}</text>
  <line x1="92" y1="166" x2="1108" y2="166" stroke="#1f1f1f" stroke-width="4"/>
  ${titleLines}
  <line x1="92" y1="512" x2="1108" y2="512" stroke="#1f1f1f" stroke-width="2"/>
  <text x="92" y="558" class="body">Read all about it. Receipts travel with the headline.</text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.status(200).send(svg);
}
