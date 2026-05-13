import "./Sidebar.css";
import SearchBar from "./SearchBar";
import ModeToggle from "./ModeToggle";
import { getCountryFlag } from "../../utils/countryMeta";

// ── Continent data ──────────────────────────────────────────────────────────
const CONTINENTS = [
  {
    name: "Asia",
    emoji: "🌏",
    color: "#f97316",
    coords: { lat: 34, lon: 100 },
    countries: ["India", "China", "Japan", "South Korea", "Thailand", "Singapore", "Vietnam", "Malaysia"],
    fact: "Largest continent — home to 4.7 billion people",
  },
  {
    name: "Europe",
    emoji: "🏛️",
    color: "#3b82f6",
    coords: { lat: 54, lon: 15 },
    countries: ["France", "Germany", "Italy", "Spain", "UK", "Poland", "Netherlands", "Sweden"],
    fact: "Cultural & political hub — birthplace of democracy",
  },
  {
    name: "North America",
    emoji: "🗽",
    color: "#10b981",
    coords: { lat: 45, lon: -100 },
    countries: ["USA", "Canada", "Mexico", "Cuba", "Jamaica", "Panama"],
    fact: "World's leading economic powerhouse",
  },
  {
    name: "South America",
    emoji: "🌿",
    color: "#22c55e",
    coords: { lat: -15, lon: -60 },
    countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru", "Venezuela"],
    fact: "Home to Amazon rainforest — Earth's lungs",
  },
  {
    name: "Africa",
    emoji: "🌍",
    color: "#eab308",
    coords: { lat: 5, lon: 25 },
    countries: ["Nigeria", "Egypt", "South Africa", "Kenya", "Ethiopia", "Morocco"],
    fact: "Most biodiverse continent, cradle of humanity",
  },
  {
    name: "Oceania",
    emoji: "🦘",
    color: "#06b6d4",
    coords: { lat: -25, lon: 135 },
    countries: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
    fact: "Island paradise with unique endemic wildlife",
  },
];

// ── City data ───────────────────────────────────────────────────────────────
const CITIES = [
  { name: "Tokyo", country: "Japan", code: "JP", emoji: "🗼", coords: { lat: 35.6762, lon: 139.6503 }, vibe: "Neon & Tradition" },
  { name: "New York", country: "USA", code: "US", emoji: "🗽", coords: { lat: 40.7128, lon: -74.006 }, vibe: "The City That Never Sleeps" },
  { name: "Paris", country: "France", code: "FR", emoji: "🥐", coords: { lat: 48.8566, lon: 2.3522 }, vibe: "City of Light & Love" },
  { name: "Dubai", country: "UAE", code: "AE", emoji: "🏙️", coords: { lat: 25.2048, lon: 55.2708 }, vibe: "Desert Futurism" },
  { name: "Sydney", country: "Australia", code: "AU", emoji: "🦭", coords: { lat: -33.8688, lon: 151.2093 }, vibe: "Harbour City Bliss" },
  { name: "Rio de Janeiro", country: "Brazil", code: "BR", emoji: "🎭", coords: { lat: -22.9068, lon: -43.1729 }, vibe: "Carnival & Samba" },
  { name: "London", country: "UK", code: "GB", emoji: "🎡", coords: { lat: 51.5074, lon: -0.1278 }, vibe: "Royal Heritage" },
  { name: "Singapore", country: "Singapore", code: "SG", emoji: "🌴", coords: { lat: 1.3521, lon: 103.8198 }, vibe: "Garden City of the Future" },
  { name: "Cairo", country: "Egypt", code: "EG", emoji: "🏺", coords: { lat: 30.0444, lon: 31.2357 }, vibe: "Ancient Civilization" },
  { name: "Barcelona", country: "Spain", code: "ES", emoji: "🎨", coords: { lat: 41.3851, lon: 2.1734 }, vibe: "Art & Architecture" },
];

export default function Sidebar({ countryCode, countryData, loading, viewMode, onCountrySearch, onModeChange, onClose, globeRef }) {
  const flag = countryCode ? getCountryFlag(countryCode) : null;

  const handleContinentClick = (continent) => {
    if (globeRef?.current?.rotateToCountry) {
      globeRef.current.rotateToCountry(continent.coords.lat, continent.coords.lon);
    }
  };

  const handleCityClick = (city) => {
    // Switch to countries mode so the data panel shows after click
    onModeChange?.("countries");
    onCountrySearch?.(city.code, city.coords);
  };

  const hasData = countryData && !loading;

  return (
    <aside className="sidebar-panel">
      {/* Mode Toggle */}
      <ModeToggle currentMode={viewMode} onModeChange={onModeChange} />

      {/* Search */}
      <SearchBar onCountrySearch={onCountrySearch} />

      {/* ── COUNTRIES MODE ── */}
      {viewMode === "countries" && (
        <div className="sidebar-card">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-header-text">
              <p className="sidebar-eyebrow">Country Discovery</p>
              <h1 className="sidebar-title">
                {countryCode
                  ? countryData?.name || "Loading..."
                  : "Click a country"}
              </h1>
            </div>
            <div className="sidebar-hero-flag">
              {flag ?? "🌐"}
            </div>
          </div>

          {/* Close button */}
          {countryCode && !loading && (
            <button className="sidebar-close-btn" onClick={onClose} title="Deselect country">
              ✕ Clear selection
            </button>
          )}

          {/* Empty state */}
          {!countryCode && !loading && (
            <div className="empty-state">
              <div className="empty-state-orb">🌏</div>
              <p className="empty-state-text">
                Rotate the globe and click any country to discover its culture, food, and must-see places.
              </p>
              <div className="empty-state-hints">
                <span className="hint-pill">🖱️ Click to explore</span>
                <span className="hint-pill">🔄 Drag to rotate</span>
                <span className="hint-pill">🔍 Search by name</span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading details…</p>
            </div>
          )}

          {/* Country Data */}
          {hasData && (
            <div className="sidebar-details">
              {/* Stat Pills */}
              <div className="stat-pills">
                {countryData.continent && (
                  <div className="stat-pill">
                    <span className="stat-icon">🌎</span>
                    <span>{countryData.continent}</span>
                  </div>
                )}
                {countryData.language && (
                  <div className="stat-pill">
                    <span className="stat-icon">💬</span>
                    <span>{countryData.language}</span>
                  </div>
                )}
                {countryData.currency && (
                  <div className="stat-pill">
                    <span className="stat-icon">💰</span>
                    <span>{countryData.currency}</span>
                  </div>
                )}
                {countryData.timezone && (
                  <div className="stat-pill">
                    <span className="stat-icon">⏰</span>
                    <span>{countryData.timezone}</span>
                  </div>
                )}
              </div>

              {/* Overview */}
              <section className="detail-block">
                <h2 className="detail-heading"><span>📍</span> Overview</h2>
                <p className="detail-text">{countryData.summary}</p>
              </section>

              {/* Culture */}
              <section className="detail-block">
                <h2 className="detail-heading"><span>🎭</span> Culture</h2>
                <p className="detail-text">{countryData.culture}</p>
              </section>

              {/* Food */}
              {countryData.food?.length > 0 && (
                <section className="detail-block">
                  <h2 className="detail-heading"><span>🍽️</span> Local Flavors</h2>
                  <div className="tag-grid">
                    {countryData.food.map((item) => (
                      <span className="tag tag-food" key={item}>{item}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Places */}
              {countryData.places?.length > 0 && (
                <section className="detail-block">
                  <h2 className="detail-heading"><span>✨</span> Must-See Places</h2>
                  <div className="tag-grid">
                    {countryData.places.map((item) => (
                      <span className="tag tag-place" key={item}>{item}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Climate */}
              <section className="detail-block detail-climate">
                <h2 className="detail-heading"><span>🌡️</span> Climate</h2>
                <p className="detail-text">{countryData.temperature}</p>
              </section>
            </div>
          )}
        </div>
      )}

      {/* ── CONTINENTS MODE ── */}
      {viewMode === "continents" && (
        <div className="sidebar-card">
          <div className="sidebar-header">
            <div className="sidebar-header-text">
              <p className="sidebar-eyebrow">World Regions</p>
              <h1 className="sidebar-title">Continents</h1>
            </div>
            <div className="sidebar-hero-flag">🗺️</div>
          </div>
          <p className="mode-description">
            Click a continent to fly there on the globe and explore the regions and countries within.
          </p>
          <div className="continent-grid">
            {CONTINENTS.map((c) => (
              <button
                key={c.name}
                className="continent-card"
                style={{ "--accent": c.color }}
                onClick={() => handleContinentClick(c)}
              >
                <div className="continent-emoji">{c.emoji}</div>
                <div className="continent-info">
                  <div className="continent-name">{c.name}</div>
                  <div className="continent-fact">{c.fact}</div>
                </div>
                <div className="continent-countries">
                  {c.countries.slice(0, 4).map((cn) => (
                    <span key={cn} className="continent-country-tag">{cn}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CITIES MODE ── */}
      {viewMode === "cities" && (
        <div className="sidebar-card">
          <div className="sidebar-header">
            <div className="sidebar-header-text">
              <p className="sidebar-eyebrow">City Escapes</p>
              <h1 className="sidebar-title">Curated Cities</h1>
            </div>
            <div className="sidebar-hero-flag">🏙️</div>
          </div>
          <p className="mode-description">
            Click any city to fly the globe there and load the country's full details in the sidebar.
          </p>
          <div className="cities-list">
            {CITIES.map((city) => (
              <button
                key={city.name}
                className="city-card"
                onClick={() => handleCityClick(city)}
              >
                <div className="city-emoji">{city.emoji}</div>
                <div className="city-info">
                  <div className="city-name">{city.name}</div>
                  <div className="city-meta">{city.country} · {city.vibe}</div>
                </div>
                <span className="city-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="sidebar-footer">
        <p>🌐 Explore Earth · Interactive 3D Globe</p>
      </div>
    </aside>
  );
}
