import path from 'node:path';
import os from 'node:os';

import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { Workspace, LocalFilesystem, LocalSandbox } from '@mastra/core/workspace';

function expandHome(input: string): string {
  if (input.startsWith('~/')) {
    return path.join(os.homedir(), input.slice(2));
  }
  return input;
}

export const workspacePath = path.resolve(
  expandHome(process.env.PIDRIVE_PATH || path.join(os.homedir(), 'drive/my/mastra-demo')),
);

export const workspace = new Workspace({
  id: 'pidrive-demo-workspace',
  name: 'Pidrive Demo Workspace',
  filesystem: new LocalFilesystem({
    basePath: workspacePath,
  }),
  sandbox: new LocalSandbox({
    workingDirectory: workspacePath,
  }),
  bm25: true,
  autoIndexPaths: ['/private', '/handoff', '/shared'],
});

const model = anthropic(process.env.MODEL || 'claude-3-5-sonnet-latest');

export const producerAgent = new Agent({
  id: 'producer-agent',
  name: 'Producer Agent',
  instructions: `You are a producer agent working inside a persistent pidrive-backed Mastra workspace.

Rules:
- Use /private for scratch notes, research, and intermediate drafts.
- Use /handoff for files intentionally prepared for another agent or downstream step.
- When asked to produce something, create both working notes in /private and a polished handoff artifact in /handoff when appropriate.
- Inspect the workspace with tools before assuming files exist.
- Mention the exact file paths you created or updated in your final answer.`,
  model,
  workspace,
});

export const consumerAgent = new Agent({
  id: 'consumer-agent',
  name: 'Consumer Agent',
  instructions: `You are a consumer agent working inside a persistent pidrive-backed Mastra workspace.

Rules:
- Read incoming files from /handoff.
- Create your own follow-up notes or summaries in /private unless the user asks for another handoff artifact.
- Inspect the workspace with tools before deciding what to read.
- Mention the exact file paths you read and wrote in your final answer.`,
  model,
  workspace,
});

export const mastra = new Mastra({
  agents: {
    producerAgent,
    consumerAgent,
  },
  workspace,
});
