const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const client = require("prom-client");
const redis = require("redis");
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

// Create Redis client and connect
const redisClient = redis.createClient();
redisClient
  .connect()
  .catch((err) => console.error("Redis connection error:", err));

// Middleware to clean up timestamps older than 10 minutes
const cleanOldTimestamps = async () => {
  const now = Date.now();
  const timestamps = await redisClient.lRange("timestamps", 0, -1);
  const filteredTimestamps = timestamps
    .map(Number)
    .filter((timestamp) => now - timestamp < 10 * 60 * 1000);

  // Clear the list and add filtered timestamps back
  await redisClient.del("timestamps");
  for (const timestamp of filteredTimestamps) {
    await redisClient.rPush("timestamps", String(timestamp));
  }
};

// Endpoint to get the current server time
app.get("/current-time", async (req, res) => {
  const currentTime = Date.now();
  await redisClient.rPush("timestamps", String(currentTime)); // Ensure it's a string
  logger.info("GET /current-time - Current server time retrieved");
  res.json({ currentTime: new Date(currentTime).toISOString() });
});

// Endpoint to get the counter of requests in the last 10 minutes
app.get("/request-count", async (req, res) => {
  await cleanOldTimestamps();
  const timestamps = await redisClient.lRange("timestamps", 0, -1);
  logger.info("GET /request-count - Request count retrieved");
  res.json({ requestCount: timestamps.length });
});

// Create a Registry to register the metrics
const register = new client.Registry();

// Counter for tracking the number of requests
const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Histogram for response time
const responseTimeHistogram = new client.Histogram({
  name: "http_response_time_seconds",
  help: "Response time in seconds",
  labelNames: ["method", "route", "status"],
});

// Register the metrics with the Registry
register.registerMetric(requestCounter);
register.registerMetric(responseTimeHistogram);

// Collect default metrics (like memory usage, etc.)
client.collectDefaultMetrics({ register });

// Middleware for collecting metrics for each request
app.use((req, res, next) => {
  const end = responseTimeHistogram.startTimer();
  res.on("finish", () => {
    requestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// Expose metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

module.exports = { app, cleanOldTimestamps };
