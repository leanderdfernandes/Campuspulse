/**
 * CampusPulse — Build Script
 * Reads campuspulse.html, injects environment variables, outputs public/index.html
 *
 * Required env vars (set in Vercel dashboard or .env for local):
 *   GA4_ID          — Google Analytics 4 Measurement ID
 *   HOTJAR_ID       — Hotjar Site ID
 *   META_PIXEL_ID   — Meta Pixel ID
 */

const fs   = require('fs');
const path = require('path');

require('dotenv').config();   // loads .env in local dev; no-op on Vercel

const GA4_ID        = process.env.GA4_ID        || '';
const HOTJAR_ID     = process.env.HOTJAR_ID      || '';
const META_PIXEL_ID = process.env.META_PIXEL_ID  || '';

if (!GA4_ID || !HOTJAR_ID || !META_PIXEL_ID) {
  const missing = ['GA4_ID', 'HOTJAR_ID', 'META_PIXEL_ID'].filter(k => !process.env[k]);
  console.warn('⚠  Missing env vars: ' + missing.join(', ') + ' — analytics will be inactive.');
}

const src = path.join(__dirname, 'campuspulse.html');
if (!fs.existsSync(src)) {
  console.error('✗  campuspulse.html not found');
  process.exit(1);
}

let html = fs.readFileSync(src, 'utf8');

html = html
  .replace(/\{\{GA4_ID\}\}/g,        GA4_ID)
  .replace(/\{\{HOTJAR_ID\}\}/g,      HOTJAR_ID)
  .replace(/\{\{META_PIXEL_ID\}\}/g,  META_PIXEL_ID);

const outDir = path.join(__dirname, 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('✓  Built public/index.html (' + Buffer.byteLength(html) + ' bytes)');
