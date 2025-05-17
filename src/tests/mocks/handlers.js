// src/tests/mocks/handlers.js
import { http, HttpResponse } from "msw";

// Define your API mocks here
export const handlers = [
  // Example handler for countries API
  http.get("https://restcountries.com/v3.1/all", () => {
    return HttpResponse.json([
      {
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
      },
      {
        name: {
          common: "Germany",
          official: "Federal Republic of Germany",
        },
        cca3: "DEU",
        capital: ["Berlin"],
        region: "Europe",
        population: 83240525,
        flags: {
          png: "https://flagcdn.com/w320/de.png",
        },
        languages: {
          deu: "German",
        },
      },
    ]);
  }),

  // Add handlers for authentication endpoints
  http.post("/api/auth/login", () => {
    return HttpResponse.json({
      token: "mock-jwt-token",
      user: { id: "123", email: "test@example.com" },
    });
  }),

  http.post("/api/auth/register", () => {
    return HttpResponse.json({
      token: "mock-jwt-token",
      user: { id: "456", email: "new@example.com" },
    });
  }),

  // Add more handlers as needed for your tests
];
