const https = require('https');
const TOKEN = 'c3d8f24c-5ee7-425d-8b86-82b5c3e7b8ff';
const PROJECT_ID = '8f86649b-e84e-4ea7-aedb-1148faedbd97';

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
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const q = `
    query($projectId: String!) {
      project(id: $projectId) {
        environments { edges { node { id name } } }
        services { edges { node { id name } } }
      }
    }
  `;
  const res = await fetchQuery(q, { projectId: PROJECT_ID });
  if (res.errors) return console.error(res.errors);
  
  const envId = res.data.project.environments.edges[0]?.node?.id;
  const envName = res.data.project.environments.edges[0]?.node?.name;
  const svcId = res.data.project.services.edges[0]?.node?.id;
  const svcName = res.data.project.services.edges[0]?.node?.name;
  
  console.log(`ENV_ID=${envId} (${envName})`);
  console.log(`SVC_ID=${svcId} (${svcName})`);
}
main();
