#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting Vercel build process...');

try {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }

  // Build the frontend using the Vercel-specific vite config
  console.log('Building frontend...');
  execSync('npx vite build --config vite.vercel.config.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Build the backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}