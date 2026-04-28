import { pathToFileURL } from 'url';
import fs from 'fs';

async function run() {
  try {
    const serverUrl = pathToFileURL('./backend/server.js').href;
    console.log(`Starting server from ${serverUrl}...`);
    await import(serverUrl);
  } catch (err) {
    fs.writeFileSync('error_full.log', err.stack || err.message);
    process.exit(1);
  }
}

run();
