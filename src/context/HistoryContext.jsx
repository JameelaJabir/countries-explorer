import { createContext, useContext, useState, useEffect } from "react";

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addToHistory = (country) => {
    if (!country) return;

    setRecentSearches((prevSearches) => {
      const filtered = prevSearches.filter(
        (item) => item.name.common !== country.name.common
      );
      return [country, ...filtered].slice(0, 10);
    });
  };

  const removeFromHistory = (cca3) => {
    const updated = recentSearches.filter((item) => item.cca3 !== cca3);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <HistoryContext.Provider
      value={{ recentSearches, addToHistory, removeFromHistory, clearHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
