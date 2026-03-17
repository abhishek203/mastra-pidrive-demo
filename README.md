# mastra-pidrive-demo

A minimal demo showing how to use a **pidrive-mounted folder** as a **Mastra workspace** today.

This demo uses:
- `pidrive mount` to expose storage as a local folder
- Mastra `LocalFilesystem` for file tools
- Mastra `LocalSandbox` for shell commands in the same workspace

## What this proves

- A Mastra agent can read and write files in a pidrive-backed workspace
- Files are real files on disk in the mounted pidrive folder
- Files persist across app restarts
- This can evolve into a native `PidriveFilesystem` later

## Why this matters

Mastra workspaces are powerful, but many agents need storage that is:
- persistent across runs
- shareable across agents or users
- easier to reason about than raw object storage

This demo shows the simplest working path: **mount pidrive, then point Mastra at that path**.

## Prerequisites

1. Install pidrive
2. Log in
3. Mount your drive
4. Have an OpenAI API key

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

```bash
npm run ask -- "Write a short overview of Mastra workspaces and save it to /docs/workspace-overview.md"
```

Other useful prompts:

```bash
npm run ask -- "List the files in the workspace and summarize what already exists"
npm run ask -- "Read /docs/workspace-overview.md and save a shorter version to /artifacts/summary.md"
```

Inspect the mounted workspace:

```bash
npm run check
```

Or directly:

```bash
ls ~/drive/my/mastra-demo/docs
cat ~/drive/my/mastra-demo/docs/workspace-overview.md
```

## Demo flow

1. Run a prompt that saves a file into `/docs`
2. Verify the file appears in the mounted pidrive folder
3. Stop the app
4. Run a second prompt asking what files already exist
5. Verify the agent reads the previous file from the workspace

This demonstrates persistence beyond one app run.

## Suggested live demo prompts

### 1. Write a file

```bash
npm run ask -- "Write a short overview of Mastra workspaces and save it to /docs/workspace-overview.md"
```

### 2. Show the real file exists

```bash
npm run check
cat ~/drive/my/mastra-demo/docs/workspace-overview.md
```

### 3. Restart and read existing files

```bash
npm run ask -- "What files already exist in the workspace? Read them and summarize them."
```

### 4. Create a polished artifact

```bash
npm run ask -- "Read /docs/workspace-overview.md and save a shorter executive summary to /artifacts/summary.md"
```

## Notes

- This demo **does require pidrive CLI + mount**.
- That is acceptable for a proof-of-concept.
- A native Mastra integration could later remove the CLI requirement by implementing a direct `PidriveFilesystem` over WebDAV/API.

## Proposed next step

If this pattern is useful, the next step would be a package such as:

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
