// tests/services/api.test.js
import {
  fetchAllCountries,
  fetchCountryByName,
  fetchCountryByCode,
  fetchCountriesByRegion,
} from "../../services/api";
import { server, rest } from "msw";

describe("API Service", () => {
  test("fetchAllCountries returns all countries", async () => {
    const countries = await fetchAllCountries();

    // Check if countries array is returned
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);

    // Check if countries have the expected properties
    const country = countries[0];
    expect(country).toHaveProperty("name");
    expect(country).toHaveProperty("capital");
    expect(country).toHaveProperty("region");
    expect(country).toHaveProperty("population");
    expect(country).toHaveProperty("flags");
  });

  test("fetchCountryByName returns countries matching the name", async () => {
    const countries = await fetchCountryByName("United");

    // Check if countries array is returned
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);

    // Check if returned countries match the search term
    const countryNames = countries.map((country) => country.name.common);
    expect(countryNames).toContain("United States");
  });

  test("fetchCountryByCode returns the country with the matching code", async () => {
    const countries = await fetchCountryByCode("USA");

    // Check if countries array is returned
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBe(1);

    // Check if returned country matches the code
    expect(countries[0].cca3).toBe("USA");
    expect(countries[0].name.common).toBe("United States");
  });

  test("fetchCountriesByRegion returns countries in the specified region", async () => {
    const countries = await fetchCountriesByRegion("Europe");

    // Check if countries array is returned
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);

    // Check if all returned countries are in the specified region
    countries.forEach((country) => {
      expect(country.region).toBe("Europe");
    });
  });

  test("fetchCountryByName handles API errors", async () => {
    // Override the handler for this specific test to return an error
    server.use(
      rest.get("https://restcountries.com/v3.1/name/:name", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Server error" }));
      })
    );

    // Expect the function to throw an error
    await expect(fetchCountryByName("ErrorTest")).rejects.toThrow();
  });

  test("fetchCountryByName handles not found", async () => {
    // Override the handler for this specific test to return a 404
    server.use(
      rest.get("https://restcountries.com/v3.1/name/:name", (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ message: "Not found" }));
      })
    );

    // Expect the function to return an empty array
    const result = await fetchCountryByName("NonExistentCountry");
    expect(result).toEqual([]);
  });
});
