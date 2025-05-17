//tests/components/CountryCard.test.jsx
import { render, screen, fireEvent } from "../utils/test-utils";
import CountryCard from "../../components/CountryCard";
import { jest } from "@jest/globals";

const mockCountry = {
  name: {
    common: "United States",
    official: "United States of America",
  },
  cca3: "USA",
  capital: ["Washington, D.C."],
  region: "Americas",
  population: 329484123,
  flags: {
    png: "https://flagcdn.com/w320/us.png",
  },
  languages: {
    eng: "English",
  },
};

const mockOnFavoriteToggle = jest.fn();

describe("CountryCard Component", () => {
  test("renders country information correctly", () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    // Check if country name is displayed
    expect(screen.getByText("United States")).toBeInTheDocument();

    // Check if capital is displayed
    expect(screen.getByText(/Washington, D.C./i)).toBeInTheDocument();

    // Check if region is displayed
    expect(screen.getByText(/Americas/i)).toBeInTheDocument();

    // Check if population is displayed (formatted)
    expect(screen.getByText(/329,484,123/i)).toBeInTheDocument();

    // Check if flag image is displayed
    const flagImage = screen.getByAltText("United States flag");
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute("src", "https://flagcdn.com/w320/us.png");
  });

  test("calls onFavoriteToggle when favorite button is clicked", () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    // Find and click the favorite button
    const favoriteButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });
    fireEvent.click(favoriteButton);

    // Check if onFavoriteToggle was called with the correct country
    expect(mockOnFavoriteToggle).toHaveBeenCalledWith(mockCountry);
  });

  test("displays correct favorite button state when country is favorited", () => {
    render(
      <CountryCard
        country={mockCountry}
        isFavorite={true}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    // Check if the favorite button shows the correct state
    const favoriteButton = screen.getByRole("button", {
      name: /remove from favorites/i,
    });
    expect(favoriteButton).toBeInTheDocument();
  });
});
