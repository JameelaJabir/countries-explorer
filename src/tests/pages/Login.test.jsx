//tests/pages/Login.test.jsx
"use client";
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import { jest } from "@jest/globals";

// Mock the useAuth hook
jest.mock("../../context/AuthContext", () => {
  const originalModule = jest.requireActual("../../context/AuthContext");

  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    // Mock the useAuth hook
    const mockLogin = jest.fn().mockImplementation(() => Promise.resolve());
    const { useAuth } = require("../../context/AuthContext");
    useAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });

    // Mock the useNavigate hook
    const mockNavigate = jest.fn();
    const { useNavigate } = require("react-router-dom");
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if form elements are rendered
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });

  test("validates form inputs", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Submit form without filling inputs
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Fill in email with invalid format
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });

    // Check if email format validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  test("calls login function with form data on submit", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check if login function was called with correct data
    const { useAuth } = require("../../context/AuthContext");
    await waitFor(() => {
      expect(useAuth().login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("navigates to home page after successful login", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check if navigation occurred
    const { useNavigate } = require("react-router-dom");
    await waitFor(() => {
      expect(useNavigate()).toHaveBeenCalledWith("/");
    });
  });

  test("displays error message when login fails", async () => {
    // Mock login to reject with an error
    const mockLogin = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));
    const { useAuth } = require("../../context/AuthContext");
    useAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("redirects to home if already authenticated", () => {
    // Mock authenticated state
    const { useAuth } = require("../../context/AuthContext");
    useAuth.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Check if navigation occurred
    const { useNavigate } = require("react-router-dom");
    expect(useNavigate()).toHaveBeenCalledWith("/");
  });
});
