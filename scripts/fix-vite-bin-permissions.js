const fs = require('fs');
const path = require('path');

function ensureExecutable(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return;
    }

    const currentMode = fs.statSync(filePath).mode;
    fs.chmodSync(filePath, currentMode | 0o111);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Could not adjust permissions for ${filePath}:`, error.message);
    }
  }
}

const viteBin = path.join(__dirname, '..', 'node_modules', '.bin', 'vite');
const viteJs = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');

if (process.platform !== 'win32') {
  ensureExecutable(viteBin);
  ensureExecutable(viteJs);
}
