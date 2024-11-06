const express = require("express");
const app = express();

// Initialize a counter object to track request timestamps
let requestTimestamps = [];

// Middleware to clean up timestamps older than 10 minutes
const cleanOldTimestamps = () => {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter(
    (timestamp) => now - timestamp < 10 * 60 * 1000
  );
};

// Endpoint to get the current server time
app.get("/current-time", (req, res) => {
  requestTimestamps.push(Date.now());
  res.json({ currentTime: new Date().toISOString() });
});

// Endpoint to get the counter of requests in the last 10 minutes
app.get("/request-count", (req, res) => {
  cleanOldTimestamps();
  res.json({ requestCount: requestTimestamps.length });
});

module.exports = { app, requestTimestamps, cleanOldTimestamps };
