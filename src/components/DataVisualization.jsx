import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllCountries } from "../services/api";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

const DataVisualization = () => {
  const [activeTab, setActiveTab] = useState("population");
  const [populationData, setPopulationData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const countries = await getAllCountries();

        // Process data for top 10 most populous countries
        const populationData = countries
          .sort((a, b) => b.population - a.population)
          .slice(0, 10)
          .map((country) => ({
            name: country.name.common,
            population: country.population,
            flag: country.flags.svg,
          }));

        // Process data for countries by region
        const regionMap = countries.reduce((acc, country) => {
          const region = country.region || "Unknown";
          if (!acc[region]) {
            acc[region] = { count: 0, totalPopulation: 0 };
          }
          acc[region].count += 1;
          acc[region].totalPopulation += country.population || 0;
          return acc;
        }, {});

        const regionData = Object.entries(regionMap).map(([name, data]) => ({
          name,
          count: data.count,
          population: data.totalPopulation,
        }));

        setPopulationData(populationData);
        setRegionData(regionData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data for visualization");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:text-white">
        Loading charts...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const formatPopulation = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        Data Visualization
      </h2>

      <div className="flex border-b mb-4 dark:border-gray-700">
        <button
          className={`px-4 py-2 ${
            activeTab === "population"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("population")}
        >
          Top 10 Population
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "regionPopulation"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("regionPopulation")}
        >
          Population by Region
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "regionCount"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("regionCount")}
        >
          Countries per Region
        </button>
      </div>

      <div className="h-80">
        {activeTab === "population" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={populationData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatPopulation} />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [
                  `${formatPopulation(value)}`,
                  "Population",
                ]}
                labelFormatter={(label) => `Country: ${label}`}
              />
              <Legend />
              <Bar dataKey="population" fill="#8884d8" name="Population" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "regionPopulation" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatPopulation} />
              <Tooltip
                formatter={(value) => [
                  `${formatPopulation(value)}`,
                  "Population",
                ]}
              />
              <Legend />
              <Bar dataKey="population" fill="#82ca9d" name="Population" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === "regionCount" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, count, percent }) =>
                  `${name}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {regionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} countries`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DataVisualization;
