import http from 'http';

// Configuration
const TARGET_URL = 'http://localhost:3000/api/buddy-chat'; // Adjust port if your server runs elsewhere
const CONCURRENT_REQUESTS = 25; // Number of simultaneous learners hitting the engine
const TEST_PAYLOADS = [
  { message: "Papa ne bill pay kiya" }, // Should trigger "Stop & Wait" (awaitingEnglishRetry: true, nextQuestion: "")
  { message: "My brother buy phone." }, // Should trigger Fact Preservation (No brands added)
  { message: "yesterday I go market" }  // Tests fast translation mapping
];

function sendRequest(requestId, payload) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const start = Date.now();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 6000, // Slightly above your 5000ms circuit breaker threshold to observe degradation
    };

    const req = http.request(TARGET_URL, options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        try {
          const json = JSON.parse(body);
          
          // Verify critical logic rules hold under stress
          const isStopAndWaitValid = !payload.message.includes('bill') || (json.awaitingEnglishRetry === true && json.nextQuestion === "");
          const isFactPreserved = !payload.message.includes('phone') || (!body.toLowerCase().includes('iphone') && !body.toLowerCase().includes('samsung'));
          
          console.log(`[Req ${requestId}] Success | Status: ${res.statusCode} | Time: ${duration}ms | Provider: ${json.providerUsed || 'unknown'}`);
          console.log(`       -> Rules Intact: Stop&Wait=${isStopAndWaitValid}, FactPreservation=${isFactPreserved}`);
          resolve({ success: true, duration, provider: json.providerUsed });
        } catch (e) {
          console.log(`[Req ${requestId}] Failed to parse JSON response. Raw status: ${res.statusCode}`);
          resolve({ success: false, duration });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`[Req ${requestId}] Error: ${e.message} (${Date.now() - start}ms)`);
      resolve({ success: false, error: e.message });
    });

    req.on('timeout', () => {
      console.log(`[Req ${requestId}] HANG PROTECTION TRIGGERED: Request timed out at client layer.`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function runStressTest() {
  console.log(`🚀 Starting Concurrency Stress Test: Sending ${CONCURRENT_REQUESTS} simultaneous requests...`);
  
  const promises = [];
  for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
    // Cycle through payloads randomly to simulate actual learner behavior
    const payload = TEST_PAYLOADS[i % TEST_PAYLOADS.length];
    promises.push(sendRequest(i, payload));
  }

  const results = await Promise.all(promises);
  
  // Calculate Metrics
  const successful = results.filter(r => r.success);
  const totalTime = results.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const avgTime = successful.length ? (totalTime / successful.length).toFixed(2) : 0;
  
  // Track provider distribution to check circuit breaking
  const providers = results.reduce((acc, curr) => {
    if (curr.provider) acc[curr.provider] = (acc[curr.provider] || 0) + 1;
    return acc;
  }, {});

  console.log(`\n📊 --- TEST SUMMARY ---`);
  console.log(`✅ Successful Deliveries: ${successful.length} / ${CONCURRENT_REQUESTS}`);
  console.log(`⏱️ Average Processing Time: ${avgTime}ms`);
  console.log(`🛡️ Provider Fallback Mix:`, providers);
}

runStressTest();
