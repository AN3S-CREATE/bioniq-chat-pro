import esbuild from 'esbuild';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const isDev = process.argv.includes('--watch') || process.argv.includes('dev') || process.env.NODE_ENV === 'development';

async function compileCss() {
  console.log('Compiling CSS with Tailwind...');
  try {
    execSync('npx tailwindcss -i ./src/index.css -o ./dist/index.css --minify', { stdio: 'inherit' });
    console.log('CSS compiled successfully.');
  } catch (error) {
    console.error('Error compiling CSS with Tailwind:', error);
  }
}

async function run() {
  // Ensure dist directory exists
  await fs.mkdir('dist', { recursive: true });

  // Compile CSS
  await compileCss();

  // Esbuild configuration
  const config = {
    entryPoints: ['src/main.tsx'],
    bundle: true,
    outfile: 'dist/main.js',
    minify: !isDev,
    sourcemap: isDev,
    format: 'esm',
    target: ['es2020'],
    loader: {
      '.png': 'dataurl',
      '.svg': 'dataurl',
    },
    define: {
      // Inject env variable as a build-time constant; falls back to empty string
      // so TypeScript's typeof guard in FullScreenWhatsApp.tsx handles it safely.
      '__AGENT_ID__': JSON.stringify(process.env.VITE_AGENT_ID || ''),
    },
    external: [
      '@taskade/genesis-client',
      '@taskade/parade-shared',
      '@taskade/parade-template-utils'
    ],
  };

  if (isDev) {
    console.log('Starting development build (watch mode)...');
    const ctx = await esbuild.context(config);
    await ctx.watch();
    
    try {
      console.log('Watching CSS with Tailwind...');
      const { spawn } = await import('child_process');
      const tailwindProcess = spawn('npx', ['tailwindcss', '-i', './src/index.css', '-o', './dist/index.css', '--watch']);
      tailwindProcess.stdout.on('data', (data) => console.log(`[Tailwind] ${data.toString().trim()}`));
      tailwindProcess.stderr.on('data', (data) => console.error(`[Tailwind Error] ${data.toString().trim()}`));
    } catch (err) {
      console.error('Failed to start Tailwind watch process:', err);
    }
  } else {
    console.log('Starting production build...');
    try {
      await esbuild.build(config);
      console.log('JS Bundle completed successfully.');
    } catch (error) {
      console.error('JS Bundle failed:', error);
      process.exit(1);
    }
  }
}

run().catch((err) => {
  console.error('Build script failed:', err);
  process.exit(1);
});
