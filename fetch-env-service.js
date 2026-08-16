const https = require('https');

const TOKEN = 'c3d8f24c-5ee7-425d-8b86-82b5c3e7b8ff';
const PROJECT_ID = '8f86649b-e84e-4ea7-aedb-1148faedbd97';

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
      console.log(body.substring(0, 1500));
    });
  });

  const query = `
    query($projectId: String!) {
      environments(projectId: $projectId) {
        edges {
          node {
            id
            name
          }
        }
      }
      services(projectId: $projectId) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  req.write(JSON.stringify({
    query,
    variables: { projectId: PROJECT_ID }
  }));
  
  req.end();
}

fetchLogs();
