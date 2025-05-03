import { useHistory } from "../context/HistoryContext";
import { Link } from "react-router-dom";
import { Clock, X } from "lucide-react";

const RecentSearches = () => {
  const { recentSearches, removeFromHistory } = useHistory();

  if (recentSearches.length === 0) return null;

  return (
    <div className="absolute z-10 w-full max-w-md mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
      <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
        {recentSearches.map((country) => (
          <li
            key={country.cca3}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Link
              to={`/country/${country.cca3}`}
              className="flex items-center flex-1 overflow-hidden"
            >
              <Clock
                size={16}
                className="text-gray-400 dark:text-gray-500 mr-2 shrink-0"
              />
              <img
                src={country.flags.svg || "/placeholder.svg"}
                alt={`${country.name.common} flag`}
                className="w-6 h-4 mr-2 object-cover shrink-0"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {country.name.common}
              </span>
            </Link>
            <button
              onClick={() => removeFromHistory(country.cca3)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 ml-3"
              // title="Clear"
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
