import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const SortControls = ({ sortConfig, onSortChange }) => {
  const { key, direction } = sortConfig;

  const getSortIcon = (sortKey) => {
    if (key !== sortKey)
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    return direction === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 text-blue-500" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 text-blue-500" />
    );
  };

  const handleSort = (sortKey) => {
    const newDirection =
      key === sortKey && direction === "asc" ? "desc" : "asc";
    onSortChange({ key: sortKey, direction: newDirection });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => handleSort("name")}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          key === "name"
            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        } hover:bg-gray-200 dark:hover:bg-gray-600`}
      >
        Name {getSortIcon("name")}
      </button>
      <button
        onClick={() => handleSort("population")}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          key === "population"
            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        } hover:bg-gray-200 dark:hover:bg-gray-600`}
      >
        Population {getSortIcon("population")}
      </button>
      <button
        onClick={() => handleSort("area")}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          key === "area"
            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        } hover:bg-gray-200 dark:hover:bg-gray-600`}
      >
        Area {getSortIcon("area")}
      </button>
    </div>
  );
};

export default SortControls;
