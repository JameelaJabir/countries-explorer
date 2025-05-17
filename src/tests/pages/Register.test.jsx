"use client"
import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { MemoryRouter } from "react-router-dom"
import Register from "../../pages/Register"
import jest from "jest"

// Mock the useAuth hook
jest.mock("../../context/AuthContext", () => {
  const originalModule = jest.requireActual("../../context/AuthContext")

  return {
    ...originalModule,
    useAuth: jest.fn(),
  }
})

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}))

describe("Register Page", () => {
  beforeEach(() => {
    // Mock the useAuth hook
    const mockRegister = jest.fn().mockImplementation(() => Promise.resolve())
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockReturnValue({
      register: mockRegister,
      isAuthenticated: false,
    })

    // Mock the useNavigate hook
    const mockNavigate = jest.fn()
    const { useNavigate } = require("react-router-dom")
    useNavigate.mockReturnValue(mockNavigate)
  })

  test("renders register form", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    // Check if form elements are rendered
    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()
  })

  test("validates form inputs", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    // Submit form without filling inputs
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })

    // Fill in email with invalid format
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid-email" } })

    // Check if email format validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })

    // Fill in passwords that don't match
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password456" } })

    // Check if password match validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  test("calls register function with form data on submit", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    // Fill in form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test User" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } })

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    // Check if register function was called with correct data
    const { useAuth } = require("../../context/AuthContext")
    await waitFor(() => {
      expect(useAuth().register).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
    })
  })

  test("navigates to home page after successful registration", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    // Fill in form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test User" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } })

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    // Check if navigation occurred
    const { useNavigate } = require("react-router-dom")
    await waitFor(() => {
      expect(useNavigate()).toHaveBeenCalledWith("/")
    })
  })

  test("displays error message when registration fails", async () => {
    // Mock register to reject with an error
    const mockRegister = jest.fn().mockRejectedValue(new Error("Email already in use"))
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockReturnValue({
      register: mockRegister,
      isAuthenticated: false,
    })

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    // Fill in form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test User" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } })

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
    })
  })

  test("redirects to home if already authenticated", () => {
    // Mock authenticated state
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockReturnValue({
      register: jest.fn(),
      isAuthenticated: true,
    })

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    // Check if navigation occurred
    const { useNavigate } = require("react-router-dom")
    expect(useNavigate()).toHaveBeenCalledWith("/")
  })
})
