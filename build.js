const { execSync } = require('child_process');
const path = require('path');

// Change to client directory and build
process.chdir(path.join(__dirname, 'client'));
execSync('npx vite build --outDir ../dist/public', { stdio: 'inherit' });

// Change back to root and build server
process.chdir(__dirname);
execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });