import { useState, useRef, useCallback } from "react";
import Globe from "./components/Globe/Globe";
import Sidebar from "./components/UI/Sidebar";
import Tooltip from "./components/UI/Tooltip";
import Toast from "./components/UI/Toast";
import { getCountryName } from "./utils/countryMeta";
import "./App.css";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001";

function App() {
  const globeRef = useRef(null);
  const [countryCode, setCountryCode] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);        // { message, type, id }
  const [viewMode, setViewMode] = useState("countries");
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleCountrySelect = useCallback(async (code) => {
    if (!code) {
      showToast("You clicked the ocean — try a country!", "ocean");
      return;
    }

    if (code === countryCode) return;

    setCountryCode(code);
    setCountryData(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/countries/${code}`);
      if (!response.ok) throw new Error("not_found");
      const data = await response.json();
      setCountryData(data);
    } catch (_err) {
      showToast(`No data available for ${getCountryName(code)} yet`, "error");
      setCountryCode(null);
    } finally {
      setLoading(false);
    }
  }, [countryCode, showToast]);

  const handleHover = useCallback((code, position) => {
    setHoveredCountry(code);
    setHoverPosition(position);
  }, []);

  const handleHoverEnd = useCallback(() => setHoveredCountry(null), []);

  const handleCountrySearch = useCallback(async (code, coords) => {
    await handleCountrySelect(code);
    if (coords && globeRef.current?.rotateToCountry) {
      globeRef.current.rotateToCountry(coords.lat, coords.lon);
    }
  }, [handleCountrySelect]);

  const handleClose = useCallback(() => {
    setCountryCode(null);
    setCountryData(null);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        countryCode={countryCode}
        countryData={countryData}
        loading={loading}
        viewMode={viewMode}
        onCountrySearch={handleCountrySearch}
        onModeChange={setViewMode}
        onClose={handleClose}
        globeRef={globeRef}
      />

      <main className="globe-frame">
        {/* Branding Header */}
        <header className="globe-header">
          <div className="globe-header-brand">
            <span className="globe-header-icon">🌍</span>
            <span className="globe-header-title">Explore Earth</span>
            <span className="globe-header-sub">3D Interactive Globe</span>
          </div>
        </header>

        <Globe
          ref={globeRef}
          onCountrySelect={handleCountrySelect}
          onHover={handleHover}
          onHoverEnd={handleHoverEnd}
          highlightedCountry={countryCode}
          viewMode={viewMode}
        />

        {/* Hover Tooltip — only shows when no country is selected */}
        {hoveredCountry && !countryCode && (
          <Tooltip
            countryCode={hoveredCountry}
            position={hoverPosition}
          />
        )}

        {/* Bottom hint */}
        {!countryCode && (
          <p className="globe-hint">
            ✦ Click any country to explore &nbsp;·&nbsp; Drag to rotate &nbsp;·&nbsp; Scroll to zoom
          </p>
        )}
      </main>

      {/* Toast — keyed by id so each new toast is a fresh mount */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
