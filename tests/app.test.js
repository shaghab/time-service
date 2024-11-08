const request = require("supertest");
const { app, requestTimestamps, cleanOldTimestamps } = require("../app");

describe("GET /current-time", () => {
  beforeEach(() => {
    // Clear timestamps by emptying the array
    while (requestTimestamps.length) requestTimestamps.pop();
  });

  it("should return the current server time", async () => {
    const response = await request(app).get("/current-time");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentTime");
    expect(new Date(response.body.currentTime).toString()).not.toBe(
      "Invalid Date"
    );
  });

  it("should add a timestamp to requestTimestamps", async () => {
    await request(app).get("/current-time");
    expect(requestTimestamps.length).toBe(1);
  });
});

describe("GET /request-count", () => {
  beforeEach(() => {
    // Clear timestamps by emptying the array
    while (requestTimestamps.length) requestTimestamps.pop();
  });

  it("should return the count of requests in the last 10 minutes", async () => {
    requestTimestamps.push(Date.now());
    const response = await request(app).get("/request-count");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ requestCount: 1 });
  });

  it("should only count requests from the last 10 minutes", async () => {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const elevenMinutesAgo = Date.now() - 11 * 60 * 1000;

    requestTimestamps.push(tenMinutesAgo); // Should be counted
    requestTimestamps.push(elevenMinutesAgo); // Should be filtered out

    cleanOldTimestamps();
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
