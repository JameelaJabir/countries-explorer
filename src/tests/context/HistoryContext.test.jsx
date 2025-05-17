"use client"
import { render, screen, fireEvent } from "@testing-library/react"
import { HistoryProvider, useHistory } from "../../context/HistoryContext"

// Test component that uses the history context
const TestComponent = () => {
  const { searchHistory, addToHistory, clearHistory } = useHistory()

  return (
    <div>
      <div data-testid="history-count">{searchHistory.length}</div>
      <ul>
        {searchHistory.map((item, index) => (
          <li key={index} data-testid="history-item">
            {item}
          </li>
        ))}
      </ul>
      <button onClick={() => addToHistory("United States")}>Add US</button>
      <button onClick={() => addToHistory("Germany")}>Add Germany</button>
      <button onClick={clearHistory}>Clear History</button>
    </div>
  )
}

describe("HistoryContext", () => {
  test("provides search history state and functions", () => {
    render(
      <HistoryProvider>
        <TestComponent />
      </HistoryProvider>,
    )

    // Initially empty history
    expect(screen.getByTestId("history-count")).toHaveTextContent("0")

    // Add to history buttons should be available
    expect(screen.getByRole("button", { name: /add us/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add germany/i })).toBeInTheDocument()

    // Clear history button should be available
    expect(screen.getByRole("button", { name: /clear history/i })).toBeInTheDocument()
  })

  test("addToHistory function adds items to history", () => {
    render(
      <HistoryProvider>
        <TestComponent />
      </HistoryProvider>,
    )

    // Initially empty history
    expect(screen.getByTestId("history-count")).toHaveTextContent("0")

    // Add United States to history
    fireEvent.click(screen.getByRole("button", { name: /add us/i }))

    // History should now have 1 item
    expect(screen.getByTestId("history-count")).toHaveTextContent("1")
    expect(screen.getByTestId("history-item")).toHaveTextContent("United States")

    // Add Germany to history
    fireEvent.click(screen.getByRole("button", { name: /add germany/i }))

    // History should now have 2 items
    expect(screen.getByTestId("history-count")).toHaveTextContent("2")
    expect(screen.getAllByTestId("history-item")[1]).toHaveTextContent("Germany")
  })

  test("clearHistory function removes all items from history", () => {
    render(
      <HistoryProvider>
        <TestComponent />
      </HistoryProvider>,
    )

    // Add items to history
    fireEvent.click(screen.getByRole("button", { name: /add us/i }))
    fireEvent.click(screen.getByRole("button", { name: /add germany/i }))

    // History should have 2 items
    expect(screen.getByTestId("history-count")).toHaveTextContent("2")

    // Clear history
    fireEvent.click(screen.getByRole("button", { name: /clear history/i }))

    // History should now be empty
    expect(screen.getByTestId("history-count")).toHaveTextContent("0")
    expect(screen.queryByTestId("history-item")).not.toBeInTheDocument()
  })

  test("does not add duplicate items to history", () => {
    render(
      <HistoryProvider>
        <TestComponent />
      </HistoryProvider>,
    )

    // Add United States to history twice
    fireEvent.click(screen.getByRole("button", { name: /add us/i }))
    fireEvent.click(screen.getByRole("button", { name: /add us/i }))

    // History should still have only 1 item
    expect(screen.getByTestId("history-count")).toHaveTextContent("1")
    expect(screen.getAllByTestId("history-item").length).toBe(1)
  })
})
