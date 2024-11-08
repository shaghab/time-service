const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const app = express();

// Set up Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

// Use Morgan for HTTP request logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

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
  logger.info("GET /current-time - Current server time retrieved");
  res.json({ currentTime: new Date().toISOString() });
});

// Endpoint to get the counter of requests in the last 10 minutes
app.get("/request-count", (req, res) => {
  cleanOldTimestamps();
  logger.info("GET /request-count - Request count retrieved");
  res.json({ requestCount: requestTimestamps.length });
});

module.exports = { app, requestTimestamps, cleanOldTimestamps };
