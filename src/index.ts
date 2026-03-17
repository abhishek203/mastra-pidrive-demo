import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { workspace, workspaceAgent, workspacePath } from './mastra.js';

async function ensureDemoDirs() {
  await fs.mkdir(path.join(workspacePath, 'docs'), { recursive: true });
  await fs.mkdir(path.join(workspacePath, 'artifacts'), { recursive: true });
}

async function main() {
  const prompt = process.argv.slice(2).join(' ').trim();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY in environment. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  if (!prompt) {
    console.log('Usage: npm run ask -- "Write a short note to /docs/hello.md"');
    console.log('');
    console.log('Example prompts:');
    console.log('  npm run ask -- "Write a short overview of Mastra workspaces and save it to /docs/workspace-overview.md"');
    console.log('  npm run ask -- "List the files in the workspace and summarize what already exists"');
    console.log('  npm run ask -- "Read /docs/workspace-overview.md and save a shorter version to /artifacts/summary.md"');
    process.exit(1);
  }

  await ensureDemoDirs();
  await workspace.init();

  console.log(`Workspace path: ${workspacePath}`);
  console.log(`Prompt: ${prompt}\n`);

  const result = await workspaceAgent.generate(prompt);

  console.log('Agent response:\n');
  console.log(result.text);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
