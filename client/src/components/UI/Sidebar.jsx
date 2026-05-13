import { useState } from "react";
import "./Sidebar.css";
import SearchBar from "./SearchBar";
import ModeToggle from "./ModeToggle";

export default function Sidebar({ countryCode, countryData, loading, error, viewMode, onCountrySearch, onModeChange }) {
  const showEmptyState = !countryCode && !loading && !error && viewMode === "countries";
  const showModeIntro = !countryCode && !loading && !error && viewMode !== "countries";
  const selectedName = countryData?.name || "Unknown Country";
  const continents = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
  const cityHighlights = [
    "Tokyo, Japan",
    "New York, USA",
    "Paris, France",
    "Rio de Janeiro, Brazil",
    "Sydney, Australia"
  ];

  return (
    <aside className="sidebar-panel">
      <ModeToggle currentMode={viewMode} onModeChange={onModeChange} />
      <SearchBar onCountrySearch={onCountrySearch} />
      
      <div className="sidebar-card">
        <div className="sidebar-header">
          <div>
            <p className="sidebar-eyebrow">Country discovery</p>
            <h1>{countryCode ? selectedName : "Click a country on the globe"}</h1>
          </div>
          <div className="sidebar-chip">{countryCode ?? "🌍"}</div>
        </div>

        {showEmptyState && (
          <div style={{ textAlign: "center", paddingTop: "16px" }}>
            <div className="empty-state-icon">🌐</div>
            <p className="sidebar-copy">
              Explore the globe by clicking on any country. Country details will appear here instantly.
            </p>
          </div>
        )}

        {showModeIntro && viewMode === "continents" && (
          <div className="mode-intro-card">
            <h2>🗺️ Explore continents</h2>
            <p>Browse major world regions and discover which countries are waiting for your next adventure.</p>
            <div className="tag-grid">
              {continents.map((continent) => (
                <span className="tag" key={continent}>{continent}</span>
              ))}
            </div>
          </div>
        )}

        {showModeIntro && viewMode === "cities" && (
          <div className="mode-intro-card">
            <h2>🏙️ Curated city escapes</h2>
            <p>Discover iconic cities, from lantern-lit nights to coastal skylines.</p>
            <div className="tag-grid">
              {cityHighlights.map((city) => (
                <span className="tag" key={city}>{city}</span>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center" }}>
            <div className="loading-spinner"></div>
            <p className="sidebar-copy">Loading country details…</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <strong>⚠️ Unable to load</strong>
            <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem" }}>{error}</p>
          </div>
        )}

        {countryData && !loading && !error ? (
          <div className="sidebar-details">
            <section className="detail-block">
              <h2>📍 Overview</h2>
              <p>{countryData.summary}</p>
            </section>

            {countryData.continent && (
              <section className="detail-block">
                <h2>🌎 Continent</h2>
                <p>{countryData.continent}</p>
              </section>
            )}

            <section className="detail-block">
              <h2>🎭 Culture</h2>
              <p>{countryData.culture}</p>
            </section>

            <section className="detail-block">
              <h2>🍽️ Local Flavors</h2>
              <div className="tag-grid">
                {countryData.food && countryData.food.length > 0 ? (
                  countryData.food.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))
                ) : (
                  <span className="tag">No food details available</span>
                )}
              </div>
            </section>

            <section className="detail-block">
              <h2>✨ Must-See Places</h2>
              <div className="tag-grid">
                {countryData.places && countryData.places.length > 0 ? (
                  countryData.places.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))
                ) : (
                  <span className="tag">No places listed yet</span>
                )}
              </div>
            </section>

            <section className="detail-block detail-strong">
              <h2>🌡️ Climate</h2>
              <p>{countryData.temperature}</p>
            </section>

            {countryData.language && (
              <section className="detail-block">
                <h2>💬 Languages</h2>
                <p>{countryData.language}</p>
              </section>
            )}

            {countryData.currency && (
              <section className="detail-block">
                <h2>💰 Currency</h2>
                <p>{countryData.currency}</p>
              </section>
            )}

            {countryData.timezone && (
              <section className="detail-block">
                <h2>⏰ Timezone</h2>
                <p>{countryData.timezone}</p>
              </section>
            )}
          </div>
        ) : null}
      </div>

      <div className="sidebar-footer">
        <p>
          💡 Tip: Rotate the globe with your mouse, then click to reveal country metadata. Use the search to jump to any location.
        </p>
      </div>
    </aside>
  );
}
