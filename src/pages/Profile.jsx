import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CountryCard from "../components/CountryCard";

const Profile = () => {
  const { currentUser, favorites, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Welcome back,{" "}
              <span className="font-semibold">{currentUser.name}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Email: {currentUser.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Favorite Countries
        </h2>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favorites.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You haven't added any countries to your favorites yet.
            </p>
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Explore Countries
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
