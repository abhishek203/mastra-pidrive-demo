import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { consumerAgent, producerAgent, workspace, workspacePath } from './mastra.js';

const agents = {
  producer: producerAgent,
  consumer: consumerAgent,
};

export async function ensureDemoDirs() {
  await fs.mkdir(path.join(workspacePath, 'private'), { recursive: true });
  await fs.mkdir(path.join(workspacePath, 'handoff'), { recursive: true });
  await fs.mkdir(path.join(workspacePath, 'shared'), { recursive: true });
}

export async function runAgent(agentName: keyof typeof agents, prompt: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY in environment. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  if (!prompt.trim()) {
    console.error(`Missing prompt for ${agentName} agent.`);
    process.exit(1);
  }

  await ensureDemoDirs();
  await workspace.init();

  console.log(`Workspace path: ${workspacePath}`);
  console.log(`Agent: ${agentName}`);
  console.log(`Prompt: ${prompt}\n`);

  const result = await agents[agentName].generate(prompt);

  console.log('Agent response:\n');
  console.log(result.text);
}
