#!/usr/bin/env node
import * as process from 'node:process';

import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('dist', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

if (
  html.includes('rel="preload"') &&
  html.includes('onload="this.onload=null;this.rel=\'stylesheet\'"')
) {
  console.log('CSS links have already been modified. Skipping.');
  process.exit(0);
}

const cssLinkRegex = /<link\s+rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g;

html = html.replace(cssLinkRegex, (match, cssPath) => {
  // Extract any additional attributes like crossorigin
  const crossoriginAttr = match.includes('crossorigin') ? ' crossorigin' : '';

  return `<link rel="preload" href="${cssPath}" as="style"${crossoriginAttr} onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${cssPath}"${crossoriginAttr}></noscript>`;
});

fs.writeFileSync(indexPath, html);

console.log('CSS links have been modified to use deferred loading.');
