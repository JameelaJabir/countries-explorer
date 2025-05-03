import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useAuth } from "../context/AuthContext";

const CountryCard = ({ country }) => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/country/${country.cca3}`}>
        <div className="h-40 overflow-hidden">
          <img
            src={country.flags.svg || "/placeholder.svg"}
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <Link to={`/country/${country.cca3}`}>
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white hover:text-blue-500 transition-colors duration-200">
              {country.name.common}
            </h2>
          </Link>
          {currentUser && <FavoriteButton country={country} />}
        </div>

        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Population:</span>{" "}
            {country.population.toLocaleString()}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Region:</span> {country.region}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Capital:</span>{" "}
            {country.capital ? country.capital[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
