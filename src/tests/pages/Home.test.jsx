//tests/pages/Home.test.jsx
import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import Home from "../../pages/Home";
import * as api from "../../services/api";
import { jest } from "@jest/globals";

// Mock the API service
jest.mock("../../services/api");

describe("Home Page", () => {
  beforeEach(() => {
    // Mock the API responses
    api.fetchAllCountries.mockResolvedValue([
      {
        name: { common: "United States", official: "United States of America" },
        cca3: "USA",
        capital: ["Washington, D.C."],
        region: "Americas",
        population: 329484123,
        flags: { png: "https://flagcdn.com/w320/us.png" },
        languages: { eng: "English" },
      },
      {
        name: { common: "Germany", official: "Federal Republic of Germany" },
        cca3: "DEU",
        capital: ["Berlin"],
        region: "Europe",
        population: 83240525,
        flags: { png: "https://flagcdn.com/w320/de.png" },
        languages: { deu: "German" },
      },
    ]);

    api.fetchCountryByName.mockImplementation((name) => {
      const countries = [
        {
          name: {
            common: "United States",
            official: "United States of America",
          },
          cca3: "USA",
          capital: ["Washington, D.C."],
          region: "Americas",
          population: 329484123,
          flags: { png: "https://flagcdn.com/w320/us.png" },
          languages: { eng: "English" },
        },
        {
          name: { common: "Germany", official: "Federal Republic of Germany" },
          cca3: "DEU",
          capital: ["Berlin"],
          region: "Europe",
          population: 83240525,
          flags: { png: "https://flagcdn.com/w320/de.png" },
          languages: { deu: "German" },
        },
      ];

      return Promise.resolve(
        countries.filter((country) =>
          country.name.common.toLowerCase().includes(name.toLowerCase())
        )
      );
    });

    api.fetchCountriesByRegion.mockImplementation((region) => {
      const countries = [
        {
          name: {
            common: "United States",
            official: "United States of America",
          },
          cca3: "USA",
          capital: ["Washington, D.C."],
          region: "Americas",
          population: 329484123,
          flags: { png: "https://flagcdn.com/w320/us.png" },
          languages: { eng: "English" },
        },
        {
          name: { common: "Germany", official: "Federal Republic of Germany" },
          cca3: "DEU",
          capital: ["Berlin"],
          region: "Europe",
          population: 83240525,
          flags: { png: "https://flagcdn.com/w320/de.png" },
          languages: { deu: "German" },
        },
      ];

      return Promise.resolve(
        countries.filter((country) => country.region === region)
      );
    });
  });

  test("renders loading state initially", () => {
    render(<Home />);

    // Check if loading indicator is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders countries after loading", async () => {
    render(<Home />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if countries are displayed
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });

  test("filters countries when search is performed", async () => {
    render(<Home />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: "United" } });

    // Submit the search
    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm);

    // Wait for search results
    await waitFor(() => {
      expect(api.fetchCountryByName).toHaveBeenCalledWith("United");
    });

    // United States should be displayed, but not Germany
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.queryByText("Germany")).not.toBeInTheDocument();
  });

  test("filters countries when region filter is applied", async () => {
    render(<Home />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find and click the region filter dropdown
    const regionFilter = screen.getByText(/filter by region/i);
    fireEvent.click(regionFilter);

    // Select Europe from the dropdown
    fireEvent.click(screen.getByText("Europe"));

    // Wait for filtered results
    await waitFor(() => {
      expect(api.fetchCountriesByRegion).toHaveBeenCalledWith("Europe");
    });

    // Germany should be displayed, but not United States
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.queryByText("United States")).not.toBeInTheDocument();
  });

  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    api.fetchAllCountries.mockRejectedValue(
      new Error("Failed to fetch countries")
    );

    render(<Home />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading countries/i)).toBeInTheDocument();
    });
  });

  test("displays no results message when search returns empty", async () => {
    // Mock search to return empty array
    api.fetchCountryByName.mockResolvedValue([]);

    render(<Home />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Search for a non-existent country
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    fireEvent.change(searchInput, { target: { value: "NonExistentCountry" } });

    // Submit the search
    const searchForm = searchInput.closest("form");
    fireEvent.submit(searchForm);

    // Wait for no results message
    await waitFor(() => {
      expect(screen.getByText(/no countries found/i)).toBeInTheDocument();
    });
  });
});
