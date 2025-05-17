// src/tests/utils/test-utils.jsx
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext"; // Adjust path if needed

// Create a custom render function that includes providers
const customRender = (ui, options) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>,
    options
  );
};

// Re-export everything from testing-library
export * from "@testing-library/react";

// Override the render method
export { customRender as render };
