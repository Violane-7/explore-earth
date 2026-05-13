import { useState, useEffect } from "react";
import "./SearchBar.css";

const COUNTRIES = [
  "India", "United States", "Japan", "France", "United Kingdom", "Germany",
  "Canada", "Australia", "Brazil", "Mexico", "Italy", "Spain", "South Korea",
  "Singapore", "UAE", "Egypt", "South Africa", "Argentina", "Chile", "Thailand"
];

const COUNTRY_COORDS = {
  "India": { lat: 20.5937, lon: 78.9629 },
  "United States": { lat: 37.0902, lon: -95.7129 },
  "Japan": { lat: 36.2048, lon: 138.2529 },
  "France": { lat: 46.2276, lon: 2.2137 },
  "United Kingdom": { lat: 55.3781, lon: -3.436 },
  "Germany": { lat: 51.1657, lon: 10.4515 },
  "Canada": { lat: 56.1304, lon: -106.3468 },
  "Australia": { lat: -25.2744, lon: 133.7751 },
  "Brazil": { lat: -14.235, lon: -51.9253 },
  "Mexico": { lat: 23.6345, lon: -102.5528 },
  "Italy": { lat: 41.8719, lon: 12.5674 },
  "Spain": { lat: 40.463667, lon: -3.74922 },
  "South Korea": { lat: 35.9078, lon: 127.7669 },
  "Singapore": { lat: 1.3521, lon: 103.8198 },
  "UAE": { lat: 23.4241, lon: 53.8478 },
  "Egypt": { lat: 26.8206, lon: 30.8025 },
  "South Africa": { lat: -30.5595, lon: 22.9375 },
  "Argentina": { lat: -38.4161, lon: -63.6167 },
  "Chile": { lat: -35.6751, lon: -71.543 },
  "Thailand": { lat: 15.8700, lon: 100.9925 },
};

export default function SearchBar({ onCountrySearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = COUNTRIES.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (country) => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);

    if (onCountrySearch && COUNTRY_COORDS[country]) {
      onCountrySearch(country, COUNTRY_COORDS[country]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search countries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
          onFocus={() => query && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <span className="search-icon">🔍</span>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((country) => (
            <div
              key={country}
              className="suggestion-item"
              onClick={() => handleSelect(country)}
            >
              🌍 {country}
            </div>
          ))}
        </div>
      )}

      {query && showSuggestions && suggestions.length === 0 && (
        <div className="search-suggestions">
          <div className="suggestion-item" style={{ color: "rgba(255,255,255,0.5)" }}>
            No countries found
          </div>
        </div>
      )}
    </div>
  );
}
