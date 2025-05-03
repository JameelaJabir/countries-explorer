import { useState, useEffect } from "react";
import { getAllCountries } from "../services/api";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import Loader from "../components/Loader";
import RecentSearches from "../components/RecentSearches";
import SortControls from "../components/SortControls";
import DataVisualization from "../components/DataVisualization";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [showCharts, setShowCharts] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        setLoading(false);
        console.error(err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    let result = countries;

    if (searchTerm) {
      result = result.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      result = result.filter((country) => country.region === selectedRegion);
    }

    result = [...result].sort((a, b) => {
      const valueA = a[sortConfig.key] || 0;
      const valueB = b[sortConfig.key] || 0;

      if (sortConfig.key === "name") {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();
        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    });

    setFilteredCountries(result);
  }, [countries, searchTerm, selectedRegion, sortConfig]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (region) => {
    setSelectedRegion(region);
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const toggleCharts = () => {
    setShowCharts(!showCharts);
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          Explore Countries
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover information about countries around the world
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative">
        <div
          className="relative w-full md:w-1/2"
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
        >
          <SearchBar
            onSearch={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
          />
          {isSearchFocused && <RecentSearches />}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <FilterDropdown onRegionChange={handleFilterChange} />
          <button
            onClick={toggleCharts}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showCharts ? "Hide Charts" : "Show Charts"}
          </button>
        </div>
      </div>

      {showCharts && <DataVisualization />}

      <SortControls sortConfig={sortConfig} onSortChange={handleSortChange} />

      {filteredCountries.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No countries found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
