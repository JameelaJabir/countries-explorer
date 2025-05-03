import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../pages/Home";
import * as api from "../services/api";

// Mock the API calls
jest.mock("../services/api");

const mockCountries = [
  {
    name: { common: "Test Country", official: "Test Country Official" },
    cca3: "TST",
    flags: { svg: "test-flag.svg" },
    population: 1000000,
    region: "Test Region",
    capital: ["Test Capital"],
  },
];

test("renders loading state and then countries", async () => {
  api.getAllCountries.mockResolvedValue(mockCountries);

  render(
    <AuthProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </AuthProvider>
  );

  // Check loading state
  expect(screen.getByRole("status")).toBeInTheDocument();

  // Wait for countries to load
  await waitFor(() => {
    expect(screen.getByText("Test Country")).toBeInTheDocument();
  });

  // Check if country details are displayed
  expect(screen.getByText("Test Region")).toBeInTheDocument();
  expect(screen.getByText("1,000,000")).toBeInTheDocument();
  expect(screen.getByText("Test Capital")).toBeInTheDocument();
});
