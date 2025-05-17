// tests/pages/CountryDetail.test.jsx
import { render, screen, waitFor, fireEvent } from "../utils/test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CountryDetail from "../../pages/CountryDetail";
import * as api from "../../services/api";
import { jest } from "@jest/globals";

// Mock the API service
jest.mock("../../services/api");

// Mock the useParams hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("CountryDetail Page", () => {
  beforeEach(() => {
    // Mock the API response
    api.fetchCountryByCode.mockResolvedValue([
      {
        name: { common: "United States", official: "United States of America" },
        cca3: "USA",
        capital: ["Washington, D.C."],
        region: "Americas",
        subregion: "North America",
        population: 329484123,
        flags: {
          png: "https://flagcdn.com/w320/us.png",
          svg: "https://flagcdn.com/us.svg",
        },
        languages: { eng: "English" },
        borders: ["CAN", "MEX"],
        currencies: { USD: { name: "United States dollar", symbol: "$" } },
        area: 9372610,
        timezones: [
          "UTC-12:00",
          "UTC-11:00",
          "UTC-10:00",
          "UTC-09:00",
          "UTC-08:00",
          "UTC-07:00",
          "UTC-06:00",
          "UTC-05:00",
          "UTC-04:00",
        ],
      },
    ]);

    // Mock the useParams hook to return a country code
    const { useParams } = require("react-router-dom");
    useParams.mockReturnValue({ code: "USA" });
  });

  test("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if loading indicator is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders country details after loading", async () => {
    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for country details to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if country details are displayed
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("United States of America")).toBeInTheDocument();
    expect(screen.getByText("Washington, D.C.")).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("329,484,123")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();

    // Check if flag image is displayed
    const flagImage = screen.getByAltText("United States flag");
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute("src", "https://flagcdn.com/us.svg");
  });

  test("displays error message when API call fails", async () => {
    // Mock API to throw an error
    api.fetchCountryByCode.mockRejectedValue(
      new Error("Failed to fetch country")
    );

    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(/error loading country details/i)
      ).toBeInTheDocument();
    });
  });

  test("displays not found message when country does not exist", async () => {
    // Mock API to return empty array
    api.fetchCountryByCode.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/country/XYZ"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for not found message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/country not found/i)).toBeInTheDocument();
    });
  });

  test("back button navigates to home page", async () => {
    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for country details to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Click the back button
    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    // Check if navigation to home page occurred
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
