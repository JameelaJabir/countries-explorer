//tests/components/SearchBar.test.jsx
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import SearchBar from "../../components/SearchBar";
import { jest } from "@jest/globals";

const mockOnSearch = jest.fn();

describe("SearchBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input correctly", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Check if search input is rendered
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    expect(searchInput).toBeInTheDocument();
  });

  test("calls onSearch when form is submitted", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: "Germany" } });

    // Submit the form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // Check if onSearch was called with the correct value
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("Germany");
    });
  });

  test("calls onSearch when input value changes (debounced)", async () => {
    jest.useFakeTimers();

    render(<SearchBar onSearch={mockOnSearch} />);

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: "Japan" } });

    // Fast-forward timers to trigger the debounced function
    jest.advanceTimersByTime(500);

    // Check if onSearch was called with the correct value
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("Japan");
    });

    jest.useRealTimers();
  });

  test("does not call onSearch for empty search term", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Find the search input and type in it, then clear it
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: "Germany" } });
    fireEvent.change(searchInput, { target: { value: "" } });

    // Submit the form
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    // Check that onSearch was not called with an empty string
    expect(mockOnSearch).not.toHaveBeenCalledWith("");
  });
});
