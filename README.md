# mastra-pidrive-demo

A demo showing **Mastra + pidrive** for agent workspaces with built-in sharing.

## How pidrive compares to Mastra workspaces

Mastra workspaces give agents:
- file read/write tools
- shell command execution
- search and indexing

Pidrive gives agents the same, plus:
- **public sharing** — `pidrive share --link` creates a URL anyone can access
- **direct sharing** — `pidrive share --to agent@example.com` shares with a specific user or agent
- **cross-machine access** — same files available from any machine via mount
- **activity tracking** — see who accessed or modified files

### In short

| Capability | Mastra + S3/Local | Mastra + Pidrive |
|------------|-------------------|------------------|
| Read/write files | ✓ | ✓ |
| Shell commands | ✓ | ✓ |
| Search/index | ✓ | ✓ |
| Public share link | manual work | `pidrive share --link` |
| Share with specific user | manual work | `pidrive share --to email` |
| Revoke access | manual work | `pidrive revoke` |
| Activity log | build it yourself | `pidrive activity` |

Pidrive adds a **sharing and distribution layer** on top.

## What this demo shows

1. A Mastra agent creates a report in a pidrive-backed workspace
2. The report is a real file you can inspect
3. You can publish it instantly with `pidrive share --link`
4. Anyone with the URL can view it — no auth, no setup

## Prerequisites

1. Install pidrive CLI
2. Log in and mount

```bash
pidrive login --email you@example.com
pidrive mount
```

3. Have an Anthropic API key

## Setup

```bash
cd mastra-pidrive-demo
npm install
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=your_key_here
MODEL=your_model_here
PIDRIVE_PATH=~/drive/my/mastra-demo
```

## Demo flow

### 1. Agent creates a report

```bash
npm run producer -- "Research the benefits of AI agents for business automation. Save a polished report to /handoff/ai-agents-report.md"
```

### 2. Inspect the file locally

```bash
npm run check
cat ~/drive/my/mastra-demo/handoff/ai-agents-report.md
```

### 3. Publish it with a public link

```bash
pidrive share ~/drive/my/mastra-demo/handoff/ai-agents-report.md --link
```

Output:
```
https://pidrive.ressl.ai/s/abc123
```

### 4. Open that URL in a browser

Anyone with the link can now view the agent's output.

## Other sharing options

### Share with a specific user or agent

```bash
pidrive share ~/drive/my/mastra-demo/handoff/ai-agents-report.md --to other-agent@example.com
```

The recipient sees it in their `/shared` folder after mounting.

### Revoke access

```bash
pidrive shared
pidrive revoke <share-id>
```

### See activity

```bash
pidrive activity
```

## Why this matters

Mastra agents can already write files to S3 or local storage.

But if you want to:
- publish an artifact publicly
- share it with a specific person or agent
- revoke access later
- see who accessed it

...you have to build all that yourself.

Pidrive gives you those features out of the box.

## Workspace layout

The demo uses:

- `/private` — working notes, drafts
- `/handoff` — polished outputs ready to share
- `/shared` — incoming files from others (read-only)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run producer -- "..."` | Run the producer agent |
| `npm run consumer -- "..."` | Run the consumer agent |
| `npm run check` | List files in the workspace |

## Notes

- This demo requires pidrive CLI + mount
- A native `PidriveFilesystem` for Mastra could remove the CLI requirement later

## Possible next step

A future `@mastra/pidrive` package could expose:

```ts
new Workspace({
  filesystem: new PidriveFilesystem({
    serverUrl: 'https://pidrive.ressl.ai',
    email: process.env.PIDRIVE_EMAIL!,
    apiKey: process.env.PIDRIVE_API_KEY!,
  }),
})
```

And potentially:

```ts
// Agent-initiated sharing
await workspace.share('/handoff/report.md', { link: true });
await workspace.share('/handoff/report.md', { to: 'other@example.com' });
```

That would make sharing a first-class workspace operation inside Mastra.
