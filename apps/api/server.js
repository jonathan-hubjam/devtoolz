import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Metadata mapping for routes
const metadataMap = {
  '/': {
    title: 'Free Developer Tools – JSON, Base64, JWT & More | DevToolz',
    description: 'Free online developer tools for formatting, encoding and debugging. Fast, secure, and privacy-friendly utilities that run in your browser.'
  },
  '/json-formatter': {
    title: 'JSON Formatter & Validator – Free Online Tool | DevToolz',
    description: 'Format, validate and beautify JSON instantly with this free online JSON formatter and validator from DevToolz.'
  },
  '/base64-encoder': {
    title: 'Base64 Encoder – Free Online Tool | DevToolz',
    description: 'Encode text to Base64 instantly with this free online Base64 encoder. Fast, simple and privacy-friendly from DevToolz.'
  },
  '/jwt-decoder': {
    title: 'JWT Decoder & Debugger – Inspect Tokens, JWKS & Expiration | DevToolz',
    description: 'Decode and inspect JWT tokens instantly. View payload, timestamps, JWKS keys, expiration status and issuer details. Free developer tool from DevToolz.'
  }
};

// Read the built React app HTML on startup
const htmlPath = path.join(__dirname, '../web/dist/index.html');
let baseHtml = '';

try {
  baseHtml = fs.readFileSync(htmlPath, 'utf-8');
  console.log('HTML file loaded successfully');
  logger.info('✓ Loaded React app from apps/web/dist/index.html');
} catch (error) {
  logger.error('✗ Failed to load React app HTML:', error.message);
  logger.warn('Make sure to build the React app: npm run build in apps/web');
}

// Serve static assets from apps/web/dist (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../web/dist')));

// Handle all other routes - inject metadata and serve HTML
app.get('*', (req, res) => {
  // Extract route path, strip query strings
  const pathname = req.url.split('?')[0];
  console.log(`Detected route: ${pathname}`);

  // Look up metadata, default to '/'
  const metadata = metadataMap[pathname] || metadataMap['/'];
  console.log(`Injecting metadata: ${metadata.title}`);

  // Replace <title>...</title> tag
  let html = baseHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${metadata.title}</title>`
  );

  // Replace <meta name="description" content="..."> tag
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*">/i,
    `<meta name="description" content="${metadata.description}">`
  );

  console.log('Metadata injection complete');

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`🚀 Server running on http://localhost:${port}`);
});

export default app;