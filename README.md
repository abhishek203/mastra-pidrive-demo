# mastra-pidrive-demo

A minimal demo showing **Mastra + pidrive** as a persistent file handoff workflow.

**Mastra has workspace and multi-agent building blocks; pidrive adds persistent file-based handoff.**

This demo uses:
- `pidrive mount` to expose storage as a local folder
- Mastra `LocalFilesystem` for file tools
- Mastra `LocalSandbox` for shell commands in the same workspace
- two agents sharing one pidrive-backed workspace

## What this demo proves

- two Mastra agents can collaborate through a shared workspace
- the workspace is backed by a real pidrive-mounted folder
- handoff artifacts are real files you can inspect directly
- files persist across app restarts

## Workspace layout

Inside the pidrive-backed workspace, the demo uses:

- `/private` — working notes, drafts, and intermediate files
- `/handoff` — files intentionally prepared for another agent or downstream step
- `/shared` — reserved for future/manual sharing flows

`/handoff` is just a workflow convention in this demo: one agent writes a file there, another agent reads it.

## Why this matters

This demo is not trying to replace Mastra's existing workspace primitives.
It shows a simple way to make agent artifacts:
- durable
- visible as real files
- easy to inspect between steps

## Prerequisites

1. Install pidrive
2. Log in
3. Mount your drive
4. Have an Anthropic API key

Example:

```bash
pidrive login --email you@example.com
pidrive mount
```

On macOS, pidrive typically mounts at `~/drive/`.
On Linux, it is typically `/drive/`.

## Setup

```bash
cd mastra-pidrive-demo
npm install
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=your_key_here
MODEL=claude-3-5-sonnet-latest
PIDRIVE_PATH=~/drive/my/mastra-demo
```

## Run

### 1. Producer creates a handoff file

```bash
npm run producer -- "Research Mastra workspaces. Save working notes to /private/research-notes.md and a polished memo to /handoff/workspace-brief.md"
```

### 2. Inspect the real files in pidrive

```bash
npm run check
cat ~/drive/my/mastra-demo/handoff/workspace-brief.md
```

### 3. Consumer reads the handoff file and creates follow-up output

```bash
npm run consumer -- "Read the latest file in /handoff and create an executive summary at /private/consumer-summary.md"
```

### 4. Inspect the consumer output

```bash
cat ~/drive/my/mastra-demo/private/consumer-summary.md
```

## Suggested live demo flow

1. Run the producer command
2. Show the generated handoff file in the mounted pidrive folder
3. Run the consumer command
4. Show the consumer's follow-up file
5. Re-run later to demonstrate persistence across runs

## Shell command angle

Because the workspace also uses `LocalSandbox`, the agents can inspect and operate on files in the same pidrive-backed workspace using shell commands when needed.

## Why not just S3 mounts?

Mastra already supports cloud filesystems and mounts.
This demo is showing a workflow shape: a persistent file handoff layer for agent outputs.

The point is not a new mount primitive.
The point is that the resulting artifacts are durable, inspectable, and easy to pass between steps as real files.

## Notes

- This demo **does require pidrive CLI + mount**.
- That is fine for a proof-of-concept.
- A native Mastra integration could later remove the CLI requirement by implementing a direct `PidriveFilesystem` over WebDAV/API.

## Possible next step

If this pattern is useful, a future package could look like:

- `@mastra/pidrive`

with a native provider:

```ts
new Workspace({
  filesystem: new PidriveFilesystem({
    serverUrl: 'https://pidrive.ressl.ai',
    email: process.env.PIDRIVE_EMAIL!,
    apiKey: process.env.PIDRIVE_API_KEY!,
    root: '/my',
  }),
})
```

That would remove the local mount requirement and make pidrive a first-class Mastra workspace backend.
