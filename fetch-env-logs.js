const https = require('https');

const TOKEN = 'c3d8f24c-5ee7-425d-8b86-82b5c3e7b8ff';
const ENVIRONMENT_ID = 'c8e0e2d4-c4ef-4358-99d8-c7feef3961da';

function fetchQuery(query, variables) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const options = {
      hostname: 'backboard.railway.app',
      path: '/graphql/v2',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ error: "Failed to parse JSON", body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const q = `
    query($environmentId: String!) {
      environmentLogs(environmentId: $environmentId) {
        message
        timestamp
        severity
      }
    }
  `;
  
  console.log("Fetching environment logs...");
  const res = await fetchQuery(q, { environmentId: ENVIRONMENT_ID });
  if (res.errors) {
    console.error("Errors:", res.errors);
    return;
  }
  
  const logs = res.data.environmentLogs || [];
  console.log(`Found ${logs.length} log lines.`);
  logs.slice(-40).forEach(l => {
    console.log(`[${l.timestamp}] [${l.severity || 'INFO'}] ${l.message}`);
  });
}

main();
