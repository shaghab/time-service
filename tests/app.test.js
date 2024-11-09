const request = require("supertest");
const { app, cleanOldTimestamps } = require("../app");
const redis = require("redis");

let redisClient;

beforeAll(async () => {
  // Create and connect the Redis client for testing
  redisClient = redis.createClient();
  await redisClient.connect();
});

afterAll(async () => {
  // Close the Redis client after tests
  await redisClient.quit();
});

describe("GET /current-time", () => {
  beforeEach(async () => {
    // Clear the 'timestamps' list in Redis before each test
    await redisClient.del("timestamps");
  });

  it("should return the current server time", async () => {
    const response = await request(app).get("/current-time");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentTime");
    expect(new Date(response.body.currentTime).toString()).not.toBe(
      "Invalid Date"
    );
  });

  it("should add a timestamp to Redis", async () => {
    await request(app).get("/current-time");
    const timestamps = await redisClient.lRange("timestamps", 0, -1);
    expect(timestamps.length).toBe(1);
  });
});

describe("GET /request-count", () => {
  beforeEach(async () => {
    // Clear the 'timestamps' list in Redis before each test
    await redisClient.del("timestamps");
  });

  it("should return the count of requests in the last 10 minutes", async () => {
    await redisClient.rPush("timestamps", String(Date.now()));
    const response = await request(app).get("/request-count");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ requestCount: 1 });
  });

  it("should only count requests from the last 10 minutes", async () => {
    //const tenMinutesAgo = String(Date.now() - 10 * 60 * 1000);
    const nineMinutesAgo = String(Date.now() - 9 * 60 * 1000); // Safely within the 10-minute window
    const elevenMinutesAgo = String(Date.now() - 11 * 60 * 1000);

    await redisClient.rPush("timestamps", nineMinutesAgo); // Should be counted
    await redisClient.rPush("timestamps", elevenMinutesAgo); // Should be filtered out

    console.log(
      "Timestamps before cleaning:",
      await redisClient.lRange("timestamps", 0, -1)
    );

    await cleanOldTimestamps(); // Ensure old timestamps are removed

    console.log(
      "Timestamps after cleaning:",
      await redisClient.lRange("timestamps", 0, -1)
    );

    const response = await request(app).get("/request-count");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ requestCount: 1 });
  });
});

describe("GET /metrics", () => {
  it("should return metrics in Prometheus format", async () => {
    const response = await request(app).get("/metrics");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/plain");
    expect(response.text).toMatch(
      /# HELP http_requests_total Total number of HTTP requests/
    );
    expect(response.text).toMatch(/# TYPE http_requests_total counter/);
  });
});
