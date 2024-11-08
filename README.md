# Time Counter Service

A simple Node.js web service that provides:
1. The current server time.
2. A counter of requests made to the server in the last 10 minutes.

## Features

- **GET /current-time**: Returns the current server time in ISO format.
- **GET /request-count**: Returns the count of requests in the last 10 minutes.

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

## Usage

1. **Start the server**:
   ```bash
   npm start
   ```

   The server will be running at `http://localhost:3000`.

2. **Endpoints**:
   - **GET /current-time**: Fetches the current server time.
   - **GET /request-count**: Fetches the number of requests made in the last 10 minutes.

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

## Project Structure

- **app.js**: Contains the Express app setup and main routes.
- **server.js**: Starts the Express server.
- **tests/app.test.js**: Unit tests for the endpoints.
- **.gitignore**: Specifies files and folders to ignore in the repo.

## Code Generation

This code was generated using ChatGPT. The original prompt can be found at:
[https://chatgpt.com/c/672aeb13-4f54-8004-b72b-0a925c59b807](https://chatgpt.com/c/672aeb13-4f54-8004-b72b-0a925c59b807)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributions

Contributions are welcome! Feel free to open issues and submit pull requests.
```

---

This `README.md` provides an overview of the project, installation instructions, usage examples, test running instructions, and licensing information. Replace `your-username` with your GitHub username in the clone URL.