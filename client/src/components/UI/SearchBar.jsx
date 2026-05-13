import { useState, useEffect } from "react";
import "./SearchBar.css";
import { COUNTRY_LIST } from "../../utils/countryMeta";

export default function SearchBar({ onCountrySearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = COUNTRY_LIST.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
      setActiveIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (country) => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    if (onCountrySearch) {
      onCountrySearch(country.code, country.coords);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
      if (target) handleSelect(target);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search any country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
          onFocus={() => query && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          autoComplete="off"
        />
        {query && (
          <button
            className="search-clear"
            onMouseDown={(e) => { e.preventDefault(); setQuery(""); }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((country, i) => (
            <div
              key={country.code}
              className={`suggestion-item ${i === activeIndex ? "suggestion-active" : ""}`}
              onMouseDown={() => handleSelect(country)}
            >
              <span className="suggestion-flag">{country.flag}</span>
              <span className="suggestion-name">{country.name}</span>
              <span className="suggestion-code">{country.code}</span>
            </div>
          ))}
        </div>
      )}

      {query && showSuggestions && suggestions.length === 0 && (
        <div className="search-suggestions">
          <div className="suggestion-item suggestion-empty">
            <span>No countries found for "{query}"</span>
          </div>
        </div>
      )}
    </div>
  );
}
