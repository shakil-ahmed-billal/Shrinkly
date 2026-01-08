import { cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, 'generated');
const destDir = join(__dirname, 'dist', 'generated');

try {
  if (existsSync(sourceDir)) {
    cpSync(sourceDir, destDir, { recursive: true });
    console.log('✓ Copied generated Prisma files to dist/generated');
  } else {
    console.warn('⚠ Warning: generated folder not found');
  }
} catch (error) {
  console.error('Error copying generated files:', error.message);
  process.exit(1);
}

