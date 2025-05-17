//tests/components/FilterDropdown.test.jsx
"use client";
import { render, screen, fireEvent } from "../utils/test-utils";
import FilterDropdown from "../../components/FilterDropdown";
import { jest } from "@jest/globals";

const mockOptions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const mockOnSelect = jest.fn();

describe("FilterDropdown Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dropdown with correct label", () => {
    render(
      <FilterDropdown
        label="Filter by Region"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    // Check if the label is displayed
    expect(screen.getByText("Filter by Region")).toBeInTheDocument();
  });

  test("shows options when dropdown is clicked", () => {
    render(
      <FilterDropdown
        label="Filter by Region"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    // Initially, options should not be visible
    mockOptions.forEach((option) => {
      expect(screen.queryByText(option)).not.toBeInTheDocument();
    });

    // Click the dropdown to open it
    fireEvent.click(screen.getByText("Filter by Region"));

    // Now options should be visible
    mockOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test("calls onSelect when an option is clicked", () => {
    render(
      <FilterDropdown
        label="Filter by Region"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("Filter by Region"));

    // Click on an option
    fireEvent.click(screen.getByText("Europe"));

    // Check if onSelect was called with the correct option
    expect(mockOnSelect).toHaveBeenCalledWith("Europe");
  });

  test("closes dropdown after selecting an option", () => {
    render(
      <FilterDropdown
        label="Filter by Region"
        options={mockOptions}
        onSelect={mockOnSelect}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("Filter by Region"));

    // Click on an option
    fireEvent.click(screen.getByText("Asia"));

    // Options should no longer be visible
    mockOptions.forEach((option) => {
      expect(screen.queryByText(option)).not.toBeInTheDocument();
    });
  });
});
