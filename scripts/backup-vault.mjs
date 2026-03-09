import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VAULT_PATH = join(SCRIPT_DIR, '..');
const CONFIG_PATH = join(SCRIPT_DIR, 'backup.config.json');
const EXCLUDE_DIRS = new Set(['node_modules', '.trash', '.runtime', '.git']);
const LOG_FILE = join(VAULT_PATH, 'Vault (Archive)', 'Sovereign Ecosystem Backup Log.md');

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

if (!existsSync(CONFIG_PATH)) {
  fail('Missing scripts/backup.config.json. Copy scripts/backup.config.example.json and set BACKUP_PATH first.');
}

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const BACKUP_PATH = typeof config.BACKUP_PATH === 'string' ? config.BACKUP_PATH.trim() : '';

if (!BACKUP_PATH || BACKUP_PATH === 'CHANGE_ME') {
  fail('BACKUP_PATH is not configured in scripts/backup.config.json.');
}

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isoTimestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function copyDir(source, destination, stats) {
  const entries = readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;

    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);

    if (entry.isDirectory()) {
      mkdirSync(destinationPath, { recursive: true });
      copyDir(sourcePath, destinationPath, stats);
      continue;
    }

    if (entry.isFile()) {
      copyFileSync(sourcePath, destinationPath);
      stats.files += 1;
      stats.bytes += statSync(sourcePath).size;
    }
  }
}

function appendLogEntry({ date, timestamp, destination, files, totalSize, durationSeconds }) {
  const header = [
    '# Sovereign Ecosystem Backup Log',
    '',
    'Purpose: Record of Sovereign Ecosystem backup runs.',
    'Protocol: [[Council Chamber/Protocols/Archival/Backup Protocol]]',
    'Skill: [[Council Chamber/Skills/Weekly Backup/SKILL]]',
    '',
  ].join('\n');

  const entry = [
    `## ${date}`,
    '',
    `- **Timestamp:** ${timestamp}`,
    `- **Destination:** ${destination}`,
    `- **Files copied:** ${files}`,
    `- **Total size:** ${totalSize}`,
    `- **Duration:** ${durationSeconds}s`,
    '',
  ].join('\n');

  if (!existsSync(LOG_FILE)) {
    mkdirSync(dirname(LOG_FILE), { recursive: true });
    writeFileSync(LOG_FILE, header, 'utf8');
  }

  const current = readFileSync(LOG_FILE, 'utf8');
  writeFileSync(LOG_FILE, current + entry, 'utf8');
}

const date = isoDate();
const timestamp = isoTimestamp();
const destination = join(BACKUP_PATH, date);
const stats = { files: 0, bytes: 0 };
const start = Date.now();

mkdirSync(destination, { recursive: true });
copyDir(VAULT_PATH, destination, stats);

const durationSeconds = (Date.now() - start) / 1000;
const totalSize = formatBytes(stats.bytes);

appendLogEntry({
  date,
  timestamp,
  destination,
  files: stats.files,
  totalSize,
  durationSeconds: durationSeconds.toFixed(1),
});

console.log('Sovereign Ecosystem Backup');
console.log('--------------------------');
console.log(`Source: ${VAULT_PATH}`);
console.log(`Destination: ${destination}`);
console.log(`Files copied: ${stats.files}`);
console.log(`Total size: ${totalSize}`);
console.log(`Duration: ${durationSeconds.toFixed(1)}s`);
console.log('Log written: Vault (Archive)/Sovereign Ecosystem Backup Log.md');