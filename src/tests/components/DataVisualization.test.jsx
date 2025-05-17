import { render, screen } from "../utils/test-utils"
import DataVisualization from "../../components/DataVisualization"

const mockCountries = [
  {
    name: { common: "United States" },
    population: 329484123,
    region: "Americas",
  },
  {
    name: { common: "Germany" },
    population: 83240525,
    region: "Europe",
  },
  {
    name: { common: "Japan" },
    population: 125836021,
    region: "Asia",
  },
]

describe("DataVisualization Component", () => {
  test("renders visualization with country data", () => {
    render(<DataVisualization countries={mockCountries} />)

    // Check if the component renders
    expect(screen.getByText(/population distribution/i)).toBeInTheDocument()

    // Check if countries are represented in the visualization
    mockCountries.forEach((country) => {
      expect(screen.getByText(country.name.common)).toBeInTheDocument()
    })
  })

  test("renders empty state when no countries are provided", () => {
    render(<DataVisualization countries={[]} />)

    // Check if empty state message is displayed
    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  test("renders loading state when loading prop is true", () => {
    render(<DataVisualization countries={[]} loading={true} />)

    // Check if loading indicator is displayed
    expect(screen.getByText(/loading data/i)).toBeInTheDocument()
  })
})
