import { runAgent } from './run-agent.js';

const prompt = process.argv.slice(2).join(' ').trim();

if (!prompt) {
  console.log('Usage: npm run producer -- "Research topic and create a handoff memo"');
  console.log('');
  console.log('Example:');
  console.log(
    '  npm run producer -- "Research Mastra workspaces. Save working notes to /private/research-notes.md and a polished memo to /handoff/workspace-brief.md"',
  );
  process.exit(1);
}

runAgent('producer', prompt).catch(error => {
  console.error(error);
  process.exit(1);
});
