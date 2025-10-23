#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const usage = `Usage: node generateEnvFromServiceAccount.js <path-to-service-account.json> [--out <output-file>]

This script reads a Firebase service account JSON file and produces a .env file
with FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY properly escaped.
`;

if (process.argv.length < 3) {
  console.error(usage);
  process.exit(1);
}

const inputPath = process.argv[2];
let outFile = '.env';
const outIndex = process.argv.indexOf('--out');
if (outIndex >= 0 && process.argv[outIndex + 1]) outFile = process.argv[outIndex + 1];

try {
  const raw = fs.readFileSync(inputPath, 'utf8');
  const json = JSON.parse(raw);
  const projectId = json.project_id || json.projectId;
  const clientEmail = json.client_email || json.clientEmail;
  let privateKey = json.private_key || json.privateKey || '';

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing required fields in service account JSON. Expected project_id, client_email, private_key.');
    process.exit(2);
  }

  // Escape newlines as \n and wrap in double quotes to preserve them in .env
  privateKey = privateKey.replace(/\r\n/g, '\n').replace(/\n/g, '\\n');
  // Wrap the private key in double quotes to preserve backslashes
  const envContent = `FIREBASE_PROJECT_ID=${projectId}\nFIREBASE_CLIENT_EMAIL=${clientEmail}\nFIREBASE_PRIVATE_KEY="${privateKey}"\nPORT=4000\nAPI_BASE_URL=http://localhost:4000/api\n`;

  const outPath = path.resolve(process.cwd(), outFile);
  fs.writeFileSync(outPath, envContent, { encoding: 'utf8', flag: 'w' });
  console.log(`Wrote environment to ${outPath}`);
} catch (err) {
  console.error('Failed to generate .env from service account:', err.message || err);
  process.exit(3);
}
