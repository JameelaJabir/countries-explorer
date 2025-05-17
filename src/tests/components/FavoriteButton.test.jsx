//tests/components/FavoriteButton.test.jsx
"use client";
import { render, screen, fireEvent } from "../utils/test-utils";
import FavoriteButton from "../../components/FavoriteButton";
import { jest } from "@jest/globals";

const mockOnClick = jest.fn();

describe("FavoriteButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders in unfavorited state correctly", () => {
    render(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);

    // Check if the button has the correct text
    expect(
      screen.getByRole("button", { name: /add to favorites/i })
    ).toBeInTheDocument();
  });

  test("renders in favorited state correctly", () => {
    render(<FavoriteButton isFavorite={true} onClick={mockOnClick} />);

    // Check if the button has the correct text
    expect(
      screen.getByRole("button", { name: /remove from favorites/i })
    ).toBeInTheDocument();
  });

  test("calls onClick when button is clicked", () => {
    render(<FavoriteButton isFavorite={false} onClick={mockOnClick} />);

    // Click the button
    fireEvent.click(screen.getByRole("button", { name: /add to favorites/i }));

    // Check if onClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("has different styles based on favorite state", () => {
    const { rerender } = render(
      <FavoriteButton isFavorite={false} onClick={mockOnClick} />
    );

    // Get the button in unfavorited state
    const unfavoritedButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });

    // Re-render with favorited state
    rerender(<FavoriteButton isFavorite={true} onClick={mockOnClick} />);

    // Get the button in favorited state
    const favoritedButton = screen.getByRole("button", {
      name: /remove from favorites/i,
    });

    // Check if the buttons have different classes or styles
    expect(unfavoritedButton.className).not.toEqual(favoritedButton.className);
  });
});
