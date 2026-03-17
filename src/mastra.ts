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
  autoIndexPaths: ['/docs', '/artifacts'],
});

export const workspaceAgent = new Agent({
  id: 'pidrive-workspace-agent',
  name: 'Pidrive Workspace Agent',
  instructions: `You are a helpful assistant working inside a persistent pidrive-backed Mastra workspace.

Rules:
- Save important outputs as files in the workspace.
- Use /docs for notes, research, and working drafts.
- Use /artifacts for polished outputs and final deliverables.
- When asked what already exists, inspect the workspace using tools instead of guessing.
- Prefer creating or updating files over only replying in chat.
- Mention the exact file path you wrote or read in your final answer.`,
  model: anthropic(process.env.MODEL || 'claude-3-5-sonnet-latest'),
  workspace,
});

export const mastra = new Mastra({
  agents: {
    workspaceAgent,
  },
  workspace,
});
