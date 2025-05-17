import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const HistoryContext = createContext();
export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false); // ✅

  // Load from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    setIsInitialized(true); // ✅ Mark ready AFTER loading
  }, []);

  // Save to localStorage when recentSearches changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }, [recentSearches, isInitialized]);

  const addToHistory = useCallback(
    (country) => {
      if (!country || !isInitialized) return;

      setRecentSearches((prevSearches) => {
        const filtered = prevSearches.filter(
          (item) => item.name.common !== country.name.common
        );
        return [country, ...filtered].slice(0, 10);
      });
    },
    [isInitialized]
  );

  const removeFromHistory = useCallback((cca3) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.cca3 !== cca3);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        recentSearches,
        addToHistory,
        removeFromHistory,
        clearHistory,
        isInitialized, // optionally expose if needed
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
