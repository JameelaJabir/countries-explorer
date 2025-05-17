import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import { MemoryRouter } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { jest } from "@jest/globals"

// Mock the useAuth hook
jest.mock("../../context/AuthContext", () => {
  const originalModule = jest.requireActual("../../context/AuthContext")

  return {
    ...originalModule,
    useAuth: jest.fn(),
  }
})

describe("Navbar Component", () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockImplementation(() => ({
      isAuthenticated: false,
      logout: jest.fn(),
    }))
  })

  test("renders logo and navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    // Check if logo is displayed
    expect(screen.getByText(/countries explorer/i)).toBeInTheDocument()

    // Check if Home link is displayed
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument()
  })

  test("shows login and register links when user is not authenticated", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    // Check if Login link is displayed
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument()

    // Check if Register link is displayed
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument()

    // Profile link should not be displayed
    expect(screen.queryByRole("link", { name: /profile/i })).not.toBeInTheDocument()

    // Logout button should not be displayed
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument()
  })

  test("shows profile link and logout button when user is authenticated", () => {
    // Mock the useAuth hook to return authenticated state
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      logout: jest.fn(),
    }))

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    // Check if Profile link is displayed
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument()

    // Check if Logout button is displayed
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()

    // Login and Register links should not be displayed
    expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /register/i })).not.toBeInTheDocument()
  })

  test("calls logout function when logout button is clicked", () => {
    // Mock the useAuth hook to return authenticated state and a mock logout function
    const mockLogout = jest.fn()
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      logout: mockLogout,
    }))

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    // Click the logout button
    fireEvent.click(screen.getByRole("button", { name: /logout/i }))

    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})
