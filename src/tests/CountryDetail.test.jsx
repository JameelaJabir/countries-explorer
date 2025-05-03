import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import App from "../App";

// Mock the loading state to avoid waiting
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: jest.fn((initial) => [false, jest.fn()]),
  };
});

test("renders the app with navbar", () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );

  const navElement = screen.getByText(/Countries Explorer/i);
  expect(navElement).toBeInTheDocument();
});
