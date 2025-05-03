import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCountryByCode, getCountryBorders } from "../services/api";
import Loader from "../components/Loader";
import FavoriteButton from "../components/FavoriteButton";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "../context/HistoryContext";

const CountryDetail = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { addToHistory } = useHistory();

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(id);

        if (data && data.length > 0) {
          setCountry(data[0]);
          addToHistory(data[0]); // Add to recent searches history

          // Fetch border countries if available
          if (data[0].borders && data[0].borders.length > 0) {
            const borderData = await getCountryBorders(data[0].borders);
            setBorderCountries(borderData);
          }
        } else {
          setError("Country not found");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch country details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchCountryDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || "Country not found"}</p>
        <Link
          to="/"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Format population with commas
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get languages as an array
  const languages = country.languages ? Object.values(country.languages) : [];

  // Get currencies as an array
  const currencies = country.currencies
    ? Object.values(country.currencies).map(
        (currency) => `${currency.name} (${currency.symbol || ""})`
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition-colors"
        >
          &larr; Back
        </Link>
        {currentUser && <FavoriteButton country={country} />}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={country.flags.svg || "/placeholder.svg"}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">
              {country.name.common}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Official Name:</span>{" "}
                  {country.name.official}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Population:</span>{" "}
                  {formatPopulation(country.population)}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Region:</span>{" "}
                  {country.region}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Sub Region:</span>{" "}
                  {country.subregion || "N/A"}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Capital:</span>{" "}
                  {country.capital ? country.capital.join(", ") : "N/A"}
                </p>
              </div>
              <div>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Top Level Domain:</span>{" "}
                  {country.tld ? country.tld.join(", ") : "N/A"}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Currencies:</span>{" "}
                  {currencies.length ? currencies.join(", ") : "N/A"}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Languages:</span>{" "}
                  {languages.length ? languages.join(", ") : "N/A"}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Area:</span>{" "}
                  {country.area
                    ? `${formatPopulation(country.area)} km²`
                    : "N/A"}
                </p>
                <p className="mb-2 dark:text-gray-300">
                  <span className="font-semibold">Timezone:</span>{" "}
                  {country.timezones ? country.timezones.join(", ") : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {borderCountries.length > 0 && (
          <div className="p-6 border-t dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">
              Border Countries:
            </h2>
            <div className="flex flex-wrap gap-2">
              {borderCountries.map((border) => (
                <Link
                  key={border.cca3}
                  to={`/country/${border.cca3}`}
                  className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
                >
                  {border.name.common}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetail;
