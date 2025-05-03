const BASE_URL = "https://restcountries.com/v3.1";

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

// Search countries by name
export const searchCountries = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/name/${name}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error("Failed to search countries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching countries:", error);
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${BASE_URL}/region/${region}`);
    if (!response.ok) {
      throw new Error("Failed to fetch countries by region");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching countries by region:", error);
    throw error;
  }
};

// Get country by code
export const getCountryByCode = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/alpha/${code}`);
    if (!response.ok) {
      throw new Error("Failed to fetch country details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching country details:", error);
    throw error;
  }
};

// Get multiple countries by codes (for border countries)
export const getCountryBorders = async (codes) => {
  if (!codes || codes.length === 0) return [];

  try {
    const codesString = codes.join(",");
    const response = await fetch(`${BASE_URL}/alpha?codes=${codesString}`);
    if (!response.ok) {
      throw new Error("Failed to fetch border countries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching border countries:", error);
    throw error;
  }
};
