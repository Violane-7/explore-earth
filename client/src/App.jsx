import { useState, useEffect, useRef } from "react";
import Globe from "./components/Globe/Globe";
import Sidebar from "./components/UI/Sidebar";
import Tooltip from "./components/UI/Tooltip";
import "./App.css";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001";

function App() {
  const globeRef = useRef(null);
  const [countryCode, setCountryCode] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("countries");
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [errorTimeout, setErrorTimeout] = useState(null);

  // Clear error after 4 seconds
  useEffect(() => {
    if (error) {
      if (errorTimeout) clearTimeout(errorTimeout);
      const timeout = setTimeout(() => setError(null), 4000);
      setErrorTimeout(timeout);
    }
    return () => {
      if (errorTimeout) clearTimeout(errorTimeout);
    };
  }, [error]);

  const handleCountrySelect = async (code) => {
    if (!code) {
      setCountryCode(null);
      setCountryData(null);
      setError("🌊 Ocean! Try clicking on a country.");
      return;
    }

    if (code === countryCode) {
      return;
    }

    setCountryCode(code);
    setCountryData(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/countries/${code}`);
      if (!response.ok) {
        throw new Error("⚠️ Country details unavailable.");
      }

      const data = await response.json();
      setCountryData(data);
    } catch (fetchError) {
      setError(fetchError.message || "🔌 Connection error. Check your server.");
      setCountryCode(null);
    } finally {
      setLoading(false);
    }
  };

  const handleHover = (countryCode, position) => {
    setHoveredCountry(countryCode);
    setHoverPosition(position);
  };

  const handleHoverEnd = () => {
    setHoveredCountry(null);
  };

  const handleCountrySearch = async (countryName, coords) => {
    // Find country code from the country name
    const countryCodeMap = {
      "India": "IN",
      "United States": "US",
      "Japan": "JP",
      "France": "FR",
      "United Kingdom": "GB",
      "Germany": "DE",
      "Canada": "CA",
      "Australia": "AU",
      "Brazil": "BR",
      "Mexico": "MX",
      "Italy": "IT",
      "Spain": "ES",
      "South Korea": "KR",
      "Singapore": "SG",
      "UAE": "AE",
      "Egypt": "EG",
      "South Africa": "ZA",
      "Argentina": "AR",
      "Chile": "CL",
      "Thailand": "TH",
    };

    const code = countryCodeMap[countryName];
    if (code) {
      handleCountrySelect(code);
      if (coords && globeRef.current?.rotateToCountry) {
        globeRef.current.rotateToCountry(coords.lat, coords.lon);
      }
    }
  };

  // Get hover country name from code
  const getCountryNameFromCode = (code) => {
    const nameMap = {
      "IN": "🇮🇳 India", "US": "🇺🇸 USA", "JP": "🇯🇵 Japan", "FR": "🇫🇷 France",
      "GB": "🇬🇧 UK", "DE": "🇩🇪 Germany", "CA": "🇨🇦 Canada", "AU": "🇦🇺 Australia",
      "BR": "🇧🇷 Brazil", "MX": "🇲🇽 Mexico", "IT": "🇮🇹 Italy", "ES": "🇪🇸 Spain",
      "KR": "🇰🇷 South Korea", "SG": "🇸🇬 Singapore", "AE": "🇦🇪 UAE", "EG": "🇪🇬 Egypt",
      "ZA": "🇿🇦 South Africa", "AR": "🇦🇷 Argentina", "CL": "🇨🇱 Chile", "TH": "🇹🇭 Thailand"
    };
    return nameMap[code] || code;
  };

  return (
    <div className="app-shell">
      <Sidebar
        countryCode={countryCode}
        countryData={countryData}
        loading={loading}
        error={error}
        viewMode={viewMode}
        onCountrySearch={handleCountrySearch}
        onModeChange={setViewMode}
      />

      <main className="globe-frame">
        <Globe
          ref={globeRef}
          onCountrySelect={handleCountrySelect}
          onHover={handleHover}
          onHoverEnd={handleHoverEnd}
          highlightedCountry={countryCode}
          viewMode={viewMode}
        />
        <Tooltip
          countryName={hoveredCountry && !countryCode ? getCountryNameFromCode(hoveredCountry) : null}
          visible={hoveredCountry && !countryCode}
          position={hoverPosition}
        />
      </main>
    </div>
  );
}

export default App;

