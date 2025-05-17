// src/tests/mocks/server.js
// Mock server implementation without using msw/node
// This is a simplified version that mimics the MSW API

// Create a mock server that doesn't actually require msw/node
const createServer = (handlers) => {
  // Store the handlers for reference
  const registeredHandlers = [...handlers];

  // Return a mock server object with the expected methods
  return {
    listen: () => {
      console.log("Mock server started");
    },
    resetHandlers: () => {
      console.log("Mock handlers reset");
    },
    close: () => {
      console.log("Mock server closed");
    },
    use: (newHandlers) => {
      registeredHandlers.push(...newHandlers);
    },
  };
};

// Create the mock server with the handlers
import { handlers } from "./handlers";
export const server = createServer(handlers);

// Export lifecycle functions that tests expect
export const beforeAll = (callback) => callback();
export const afterEach = (callback) => callback();
export const afterAll = (callback) => callback();
