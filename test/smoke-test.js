/*
Smoke test: verify the server builds, starts, and responds to requests.
This is a minimal test to ensure the demo is ready for live presentations.
*/

const http = require('http');
const { spawn } = require('child_process');

const PORT = 3006;
const STARTUP_TIMEOUT = 30000; // 30 seconds for server startup
const REQUEST_TIMEOUT = 5000;

function makeRequest() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/`, { timeout: REQUEST_TIMEOUT }, (res) => {
      if (res.statusCode === 200) {
        resolve({ statusCode: res.statusCode });
      } else {
        reject(new Error(`Unexpected status code: ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTest() {
  console.log('Starting smoke test...');
  console.log(`Launching server on port ${PORT}...`);

  const server = spawn('node', ['./server-build/index.js'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: PORT.toString() }
  });

  let serverOutput = '';
  let serverStarted = false;

  server.stdout.on('data', (data) => {
    const text = data.toString();
    serverOutput += text;
    process.stdout.write(text);
    
    if (text.includes('Server is listening')) {
      serverStarted = true;
    }
  });

  server.stderr.on('data', (data) => {
    const text = data.toString();
    serverOutput += text;
    process.stderr.write(text);
  });

  let exitCode = 0;
  
  try {
    // Wait for server to start
    const startTime = Date.now();
    while (!serverStarted && Date.now() - startTime < STARTUP_TIMEOUT) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!serverStarted) {
      throw new Error('Server did not start within timeout period');
    }

    console.log('Server started successfully. Testing homepage...');

    // Test homepage
    const response = await makeRequest();
    console.log(`✓ Homepage returned HTTP ${response.statusCode}`);

    console.log('✓ Smoke test passed!');

  } catch (error) {
    console.error('✗ Smoke test failed:', error.message);
    console.error('Server output:', serverOutput);
    exitCode = 1;
  } finally {
    server.kill();
    process.exit(exitCode);
  }
}

runTest();
