import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { workspacePath } from './mastra.js';

async function walk(dir: string, prefix = ''): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = path.join(prefix, entry.name);
    console.log(rel + (entry.isDirectory() ? '/' : ''));
    if (entry.isDirectory()) {
      await walk(path.join(dir, entry.name), rel);
    }
  }
}

async function main() {
  console.log(`Workspace path: ${workspacePath}`);
  try {
    await fs.access(workspacePath);
  } catch {
    console.error('Workspace path does not exist. Did you mount pidrive and set PIDRIVE_PATH correctly?');
    process.exit(1);
  }

  console.log('Expected demo folders: private/, handoff/, shared/\n');
  await walk(workspacePath);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
