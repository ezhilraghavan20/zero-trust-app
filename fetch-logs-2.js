const https = require('https');

const TOKEN = 'c3d8f24c-5ee7-425d-8b86-82b5c3e7b8ff';
const DEPLOYMENT_ID = '05abbc13-c6bf-4a5b-abcc-2353e8d2cae5';

function fetchLogs() {
  const options = {
    hostname: 'backboard.railway.app',
    path: '/graphql/v2',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.errors) {
          console.error("GraphQL Errors:", JSON.stringify(data.errors, null, 2));
          return;
        }
        
        const logs = data.data.deploymentLogs;
        if (!logs || logs.length === 0) {
          console.log("No logs found for this deployment.");
        } else {
          console.log(`Found ${logs.length} log entries. Last 30 lines:`);
          const lastLogs = logs.slice(-30);
          lastLogs.forEach(log => {
            console.log(`[${log.timestamp}] ${log.message}`);
          });
        }
      } catch (e) {
        console.error("Error parsing response:", e);
        console.log("Raw response:", body.substring(0, 500));
      }
    });
  });

  const query = `
    query($deploymentId: String!) {
      deploymentLogs(deploymentId: $deploymentId) {
        message
        timestamp
        severity
      }
    }
  `;

  req.write(JSON.stringify({
    query,
    variables: { deploymentId: DEPLOYMENT_ID }
  }));
  
  req.end();
}

fetchLogs();
