import { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './CitiesTable.css'; // Create a CSS file to manage styles

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // For sorting
  const navigate = useNavigate();

  // Fetch cities when searchQuery or offset changes
  useEffect(() => {
    fetchCities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, searchQuery]);

  // Fetch cities based on search input
  const fetchCities = async () => {
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchQuery}&start=${offset}&rows=50`
      );
      if (response.data.records.length === 0) setHasMore(false);
      setCities((prev) => (offset === 0 ? response.data.records : [...prev, ...response.data.records]));
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Handle search input changes for autocomplete
  const handleSearchChange = (inputValue) => {
    setSearchQuery(inputValue);
    setOffset(0); // Reset offset to fetch new search results
  };

  // Handle selection from autocomplete
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      navigate(`/weather/${selectedOption.value}`); // Navigate to the selected city's weather page
    }
  };

  // Handle sorting logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sorting function
  const sortedCities = [...cities].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a.fields[sortConfig.key] || '';
    const bVal = b.fields[sortConfig.key] || '';
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle city click (left click)
  const handleCityClick = (city) => {
    navigate(`/weather/${city.fields.name}`);
  };

  // Handle right-click for opening in new tab
  const handleCityRightClick = (event, city) => {
    event.preventDefault(); // Prevent default right-click behavior
    window.open(`/weather/${city.fields.name}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="cities-container" // Apply the CSS class
    >
      <div className="content-wrapper">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Weather Forecast</h1>
        <h1 className="text-2xl font-bold mb-4 text-white">Cities</h1>

        {/* Autocomplete search input */}
        <Select
          onInputChange={handleSearchChange}
          onChange={handleSelectChange} // Handle selecting from the dropdown
          options={cities.map((city) => ({
            label: city.fields.name,
            value: city.fields.name,
          }))}
          placeholder="Search for cities..."
          className="mb-4"
        />

        {/* Infinite scroll for loading more data */}
        <InfiniteScroll
          dataLength={cities.length}
          next={() => setOffset(offset + 50)}
          hasMore={hasMore}
          loader={<center><h4 className='text-white'>Loading...</h4></center>}
          className="overflow-auto"
        >
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th
                  className="border px-4 py-2 cursor-pointer text-white"
                  onClick={() => handleSort('name')}
                >
                  City {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer text-white"
                  onClick={() => handleSort('country')}
                >
                  Country {sortConfig.key === 'country' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer text-white"
                  onClick={() => handleSort('timezone')}
                >
                  Timezone {sortConfig.key === 'timezone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCities.map((city, index) => (
                <tr
                  key={`${city.recordid}-${index}`}
                  onClick={() => handleCityClick(city)}
                  onContextMenu={(event) => handleCityRightClick(event, city)} // Right-click action
                  className="cursor-pointer hover:bg-slate-50 text-white hover:text-black"
                >
                  <td className="border px-4 py-2">{city.fields.name}</td>
                  <td className="border px-4 py-2">{city.fields.cou_name_en}</td>
                  <td className="border px-4 py-2">{city.fields.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </motion.div>
  );
};

export default CitiesTable;
