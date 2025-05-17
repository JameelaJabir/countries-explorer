"use client"
import { render, screen, fireEvent, waitFor } from "../utils/test-utils"
import { MemoryRouter } from "react-router-dom"
import Profile from "../../pages/Profile"
import jest from "jest" // Import jest to declare it

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

describe("Profile Page", () => {
  beforeEach(() => {
    // Mock the useAuth hook
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockReturnValue({
      user: {
        name: "Test User",
        email: "test@example.com",
        favorites: [
          {
            name: { common: "Germany" },
            cca3: "DEU",
            capital: ["Berlin"],
            region: "Europe",
            population: 83240525,
            flags: { png: "https://flagcdn.com/w320/de.png" },
          },
          {
            name: { common: "Japan" },
            cca3: "JPN",
            capital: ["Tokyo"],
            region: "Asia",
            population: 125836021,
            flags: { png: "https://flagcdn.com/w320/jp.png" },
          },
        ],
      },
      isAuthenticated: true,
      updateUser: jest.fn(),
    })

    // Mock the useNavigate hook
    const mockNavigate = jest.fn()
    const { useNavigate } = require("react-router-dom")
    useNavigate.mockReturnValue(mockNavigate)
  })

  test("renders profile information", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )

    // Check if profile information is displayed
    expect(screen.getByText(/test user/i)).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
  })

  test("renders favorite countries", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )

    // Check if favorite countries are displayed
    expect(screen.getByText(/germany/i)).toBeInTheDocument()
    expect(screen.getByText(/japan/i)).toBeInTheDocument()

    // Check if country details are displayed
    expect(screen.getByText(/berlin/i)).toBeInTheDocument()
    expect(screen.getByText(/tokyo/i)).toBeInTheDocument()
    expect(screen.getByText(/europe/i)).toBeInTheDocument()
    expect(screen.getByText(/asia/i)).toBeInTheDocument()
  })

  test("redirects to login if not authenticated", () => {
    // Mock unauthenticated state
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    })

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )

    // Check if navigation occurred
    const { useNavigate } = require("react-router-dom")
    expect(useNavigate()).toHaveBeenCalledWith("/login")
  })

  test("removes country from favorites when remove button is clicked", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )

    // Find and click the remove button for Germany
    const removeButtons = screen.getAllByRole("button", { name: /remove from favorites/i })
    fireEvent.click(removeButtons[0])

    // Check if updateUser was called with updated favorites
    const { useAuth } = require("../../context/AuthContext")
    await waitFor(() => {
      expect(useAuth().updateUser).toHaveBeenCalledWith({
        ...useAuth().user,
        favorites: [
          {
            name: { common: "Japan" },
            cca3: "JPN",
            capital: ["Tokyo"],
            region: "Asia",
            population: 125836021,
            flags: { png: "https://flagcdn.com/w320/jp.png" },
          },
        ],
      })
    })
  })

  test("displays message when no favorites exist", () => {
    // Mock user with no favorites
    const { useAuth } = require("../../context/AuthContext")
    useAuth.mockReturnValue({
      user: {
        name: "Test User",
        email: "test@example.com",
        favorites: [],
      },
      isAuthenticated: true,
      updateUser: jest.fn(),
    })

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )

    // Check if no favorites message is displayed
    expect(screen.getByText(/you haven't added any favorite countries yet/i)).toBeInTheDocument()
  })
})
