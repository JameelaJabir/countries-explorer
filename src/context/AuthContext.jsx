import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));

      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
    setLoading(false);
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("recentSearches", JSON.stringify([]));

    // Load favorites for this user
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const register = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setFavorites([]);
    localStorage.setItem("favorites", JSON.stringify([]));
    localStorage.setItem("recentSearches", JSON.stringify([]));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    setFavorites([]);
    localStorage.setItem("favorites", JSON.stringify([]));
    localStorage.setItem("recentSearches", JSON.stringify([]));
  };

  const toggleFavorite = (country) => {
    if (!currentUser) return;

    setFavorites((prevFavorites) => {
      // Check if country is already in favorites
      const isAlreadyFavorite = prevFavorites.some(
        (fav) => fav.cca3 === country.cca3
      );

      if (isAlreadyFavorite) {
        // Remove from favorites
        return prevFavorites.filter((fav) => fav.cca3 !== country.cca3);
      } else {
        // Add to favorites
        return [...prevFavorites, country];
      }
    });
  };

  const isFavorite = (countryCode) => {
    return favorites.some((country) => country.cca3 === countryCode);
  };

  const value = {
    currentUser,
    favorites,
    login,
    register,
    logout,
    toggleFavorite,
    isFavorite,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
