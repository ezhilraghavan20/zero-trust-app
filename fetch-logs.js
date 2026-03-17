const https = require('https');

const TOKEN = 'c3d8f24c-5ee7-425d-8b86-82b5c3e7b8ff';
const PROJECT_ID = '8f86649b-e84e-4ea7-aedb-1148faedbd97';

function queryGraphQL(query, variables) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });

    const options = {
      hostname: 'backboard.railway.app',
      path: '/graphql/v2',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', error => reject(error));
    req.write(data);
    req.end();
  });
}

const DEPLOYMENTS_QUERY = `
  query($projectId: String!) {
    deployments(input: { projectId: $projectId }) {
      edges {
        node {
          id
          status
          createdAt
        }
      }
    }
  }
`;

function getLogs(deploymentId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'backboard.railway.app',
            path: `/v1/deployments/${deploymentId}/logs`, // Attempt REST logs endpoint if GraphQL isn't clear
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${TOKEN}`,
              'Content-Type': 'application/json'
            }
          };
          
          const req = https.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
          });
      
          req.on('error', error => reject(error));
          req.end();
    })
}


async function main() {
  try {
    const res = await queryGraphQL(DEPLOYMENTS_QUERY, { projectId: PROJECT_ID });
    const deployments = res?.data?.deployments?.edges || [];
    
    if (deployments.length === 0) {
        console.log("No deployments found.");
        return;
    }

    // Sort by createdAt descending
    deployments.sort((a, b) => new Date(b.node.createdAt) - new Date(a.node.createdAt));
    const latest = deployments[0].node;
    
    console.log(`Latest Deployment: ID=${latest.id}, Status=${latest.status}, CreatedAt=${latest.createdAt}`);

    // Try to query logs using GraphQL deploymentLogs
    const LOGS_QUERY = `
      query($deploymentId: String!) {
        deploymentLogs(deploymentId: $deploymentId) {
          message
          timestamp
        }
      }
    `;
    const logsRes = await queryGraphQL(LOGS_QUERY, { deploymentId: latest.id });
    
    if (logsRes.errors) {
        console.log("GraphQL logs failed, errors:", logsRes.errors);
    } else if (logsRes.data && logsRes.data.deploymentLogs) {
        const logs = logsRes.data.deploymentLogs;
        console.log(`\n--- Latest Logs (${logs.length} entries) ---`);
        for (const log of logs.slice(-20)) {
            console.log(`[${log.timestamp}] ${log.message}`);
        }
    } else {
        console.log("No logs payload in response:", JSON.stringify(logsRes));
    }

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
