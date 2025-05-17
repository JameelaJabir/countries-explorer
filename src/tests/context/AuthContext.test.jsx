"use client"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AuthProvider, useAuth } from "../../context/AuthContext"

// Test component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, login, logout, register } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "Authenticated" : "Not Authenticated"}</div>
      <button onClick={() => login({ email: "test@example.com", password: "password123" })}>Login</button>
      <button onClick={() => register({ email: "new@example.com", password: "newpassword123" })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe("AuthContext", () => {
  test("provides authentication state and functions", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Initially not authenticated
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Not Authenticated")

    // Login button should be available
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()

    // Register button should be available
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument()

    // Logout button should be available
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  test("login function updates authentication state", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Initially not authenticated
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Not Authenticated")

    // Click login button
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    // Should now be authenticated
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Authenticated")
    })
  })

  test("logout function updates authentication state", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Login first
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Authenticated")
    })

    // Click logout button
    fireEvent.click(screen.getByRole("button", { name: /logout/i }))

    // Should now be not authenticated
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Not Authenticated")
  })

  test("register function creates a new user and authenticates", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Initially not authenticated
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Not Authenticated")

    // Click register button
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    // Should now be authenticated
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("Authenticated")
    })
  })
})
