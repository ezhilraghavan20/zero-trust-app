const https = require('https');

const TOKEN = 'c3d8f24c-5ee7-425d-8b86-82b5c3e7b8ff';
const PROJECT_ID = '8f86649b-e84e-4ea7-aedb-1148faedbd97';
const DEPLOYMENT_ID = '05abbc13-c6bf-4a5b-abcc-2353e8d2cae5';

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
  // First get the environment and service IDs for this project
  const envQuery = `
    query($projectId: String!) {
      environments(projectId: $projectId) {
        edges { node { id name } }
      }
      services(projectId: $projectId) {
        edges { node { id name } }
      }
    }
  `;
  
  console.log("Fetching environments and services...");
  const envData = await fetchQuery(envQuery, { projectId: PROJECT_ID });
  
  if (envData.errors) {
    console.error("Failed to fetch envs:", envData.errors);
    return;
  }
  
  const envId = envData.data.environments.edges[0]?.node?.id;
  const serviceId = envData.data.services.edges[0]?.node?.id;
  
  console.log(`Found Env: ${envId}, Service: ${serviceId}`);
  
  if (!envId || !serviceId) {
    console.error("Could not find environment or service ID.");
    return;
  }

  // Now query the deployment logs using env and service filter just in case
  const logQuery = `
    query($deploymentId: String!, $filter: String) {
      deploymentLogs(deploymentId: $deploymentId, filter: $filter) {
        message
        timestamp
        severity
      }
    }
  `;
  
  console.log(`Fetching logs for deployment ${DEPLOYMENT_ID}...`);
  const logData = await fetchQuery(logQuery, { deploymentId: DEPLOYMENT_ID, filter: "" });
  
  if (logData.errors) {
    console.error("Failed to fetch logs:", JSON.stringify(logData.errors, null, 2));
    
    // Try streaming logs fallback pattern
    console.log("GraphQL logs failed. Please note the deployment might be too old or the ID might require mapping.");
  } else {
    const logs = logData.data.deploymentLogs || [];
    console.log(`Found ${logs.length} log lines.`);
    logs.slice(-40).forEach(l => {
      console.log(`[${l.timestamp}] ${l.message}`);
    });
  }
}

main();
