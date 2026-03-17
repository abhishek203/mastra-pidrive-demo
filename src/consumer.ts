import { runAgent } from './run-agent.js';

const prompt = process.argv.slice(2).join(' ').trim();

if (!prompt) {
  console.log('Usage: npm run consumer -- "Read latest handoff file and create a follow-up summary"');
  console.log('');
  console.log('Example:');
  console.log(
    '  npm run consumer -- "Read the latest file in /handoff and create an executive summary at /private/consumer-summary.md"',
  );
  process.exit(1);
}

runAgent('consumer', prompt).catch(error => {
  console.error(error);
  process.exit(1);
});
