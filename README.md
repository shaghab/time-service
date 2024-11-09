# Time Counter Service

A simple Node.js web service that provides:

1. The current server time.
2. A counter of requests made to the server in the last 10 minutes.

## Features

- **GET /current-time**: Returns the current server time in ISO format and stores the timestamp in Redis.
- **GET /request-count**: Returns the count of requests made in the last 10 minutes by filtering timestamps stored in Redis.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/time-counter-service.git
   cd time-counter-service
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Ensure Redis is installed and running**:
   - If you don't have Redis installed, refer to [Redis installation guide](https://redis.io/download) or use Docker:
     ```bash
     docker run --name redis -p 6379:6379 -d redis
     ```

## Usage

1. **Start the server**:

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:3000`.

2. **Endpoints**:
   - **GET /current-time**: Fetches the current server time and logs it to Redis.
   - **GET /request-count**: Fetches the number of requests made in the last 10 minutes by querying Redis.

### Example Requests

- **Get Current Time**:

  ```bash
  curl http://localhost:3000/current-time
  ```

- **Get Request Count**:
  ```bash
  curl http://localhost:3000/request-count
  ```

## Running Tests

To run the tests, use:

```bash
npm test
```

Ensure that Redis is running before running the tests, as they depend on Redis for data storage.

## Project Structure

- **app.js**: Contains the Express app setup, routes, and Redis integration logic.
- **server.js**: Starts the Express server.
- **tests/app.test.js**: Unit tests for the endpoints, configured to use a Redis client.
- **.gitignore**: Specifies files and folders to ignore in the repo.

## Code Generation

This code was generated and refactored using ChatGPT. The original prompt can be found at:
[https://chatgpt.com/c/672aeb13-4f54-8004-b72b-0a925c59b807](https://chatgpt.com/c/672aeb13-4f54-8004-b72b-0a925c59b807)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributions

Contributions are welcome! Feel free to open issues and submit pull requests.

```

### Changes Made:
- **Added Redis Requirements**: Mentioned that Redis is used for storing timestamps and that it must be installed and running.
- **Updated Endpoint Descriptions**: Clarified that Redis is used for data storage in the endpoints.
- **Test Instructions**: Noted that Redis needs to be running when running the tests.
```

```

```
