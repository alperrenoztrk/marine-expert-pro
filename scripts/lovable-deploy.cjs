#!/usr/bin/env node
const https = require('https');

const hook = process.env.LOVABLE_DEPLOY_HOOK;
if (!hook) {
  console.log('[lovable-deploy] LOVABLE_DEPLOY_HOOK not set, skipping remote deploy trigger.');
  process.exit(0);
}

function post(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST' }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    const res = await post(hook);
    console.log(`[lovable-deploy] Triggered. Status: ${res.status}`);
  } catch (err) {
    console.error('[lovable-deploy] Failed:', err.message);
    process.exit(1);
  }
})();