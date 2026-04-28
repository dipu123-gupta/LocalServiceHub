import { spawn } from 'child_process';

const child = spawn('node', ['server.js'], {
  cwd: './backend',
});

let errorOutput = '';

child.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

child.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  console.log('--- ERROR OUTPUT ---');
  console.log(errorOutput);
  console.log('--- END ERROR OUTPUT ---');
});

// Kill the server after 10 seconds if it doesn't exit on its own
setTimeout(() => {
  console.log('Killing server process...');
  child.kill();
}, 10000);
