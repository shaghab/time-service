const express = require('express');
const app = express();
const port = 3000;

// Initialize a counter object to track request timestamps
let requestTimestamps = [];

// Middleware to clean up timestamps older than 10 minutes
const cleanOldTimestamps = () => {
  const now = Date.now();
  // Keep only timestamps from the last 10 minutes
  requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < 10 * 60 * 1000);
};

// Endpoint to get the current server time
app.get('/current-time', (req, res) => {
  // Add the current timestamp to the counter list
  requestTimestamps.push(Date.now());
  
  // Return the current server time
  res.json({ currentTime: new Date().toISOString() });
});

// Endpoint to get the counter of requests in the last 10 minutes
app.get('/request-count', (req, res) => {
  // Clean up old timestamps
  cleanOldTimestamps();

  // Return the count of recent requests
  res.json({ requestCount: requestTimestamps.length });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
