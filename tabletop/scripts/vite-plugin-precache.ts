/**
 * Build step for offline install: writes dist/sw.js, which precaches every file of the build,
 * and dist/manifest.webmanifest. The app name comes from brand.json, the one place it is set.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';

export interface PrecacheOptions {
  readonly name: string;
  readonly description: string;
  readonly background: string;
  readonly theme: string;
  readonly publicDir: string;
  readonly templatePath: string;
}

function listFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else out.push(full);
    }
  };
  walk(dir);
  return out;
}

export function precache(options: PrecacheOptions): Plugin {
  return {
    name: 'tabletop-precache',
    // Run after Vite has added index.html to the bundle, so it is precached too.
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replaceAll('__APP_NAME__', options.name).replaceAll('__APP_DESCRIPTION__', options.description);
    },
    generateBundle(_out, bundle) {
      const manifest = {
        name: options.name,
        short_name: options.name,
        description: options.description,
        start_url: './',
        scope: './',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: options.background,
        theme_color: options.theme,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      };
      const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
      this.emitFile({ type: 'asset', fileName: 'manifest.webmanifest', source: manifestJson });

      const hash = createHash('sha256');
      const files = new Set<string>(['manifest.webmanifest']);
      hash.update(manifestJson);
      for (const [fileName, item] of Object.entries(bundle)) {
        if (fileName.endsWith('.map')) continue;
        files.add(fileName);
        hash.update(fileName);
        hash.update(item.type === 'chunk' ? item.code : typeof item.source === 'string' ? item.source : Buffer.from(item.source));
      }
      for (const full of listFiles(options.publicDir)) {
        const fileName = relative(options.publicDir, full).split('\\').join('/');
        if (fileName.startsWith('.') || fileName.endsWith('.gitkeep')) continue;
        files.add(fileName);
        hash.update(fileName);
        hash.update(readFileSync(full));
      }
      if (!files.has('index.html')) this.error('index.html is missing from the bundle, so the app could not start offline');
      const template = readFileSync(options.templatePath, 'utf8');
      hash.update(template);
      const version = hash.digest('hex').slice(0, 16);
      const assets = ['./', ...[...files].sort().map((f) => `./${f}`)];
      const source = template
        .replace("'__VERSION__'", JSON.stringify(version))
        .replace('__ASSETS__', JSON.stringify(assets, null, 2));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}
