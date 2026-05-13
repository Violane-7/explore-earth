import "./ModeToggle.css";

export default function ModeToggle({ currentMode, onModeChange }) {
  const modes = [
    { id: "countries", label: "Countries", icon: "🌍" },
    { id: "continents", label: "Continents", icon: "🗺️" },
    { id: "cities", label: "Cities", icon: "🏙️" },
  ];

  return (
    <div className="mode-toggle-container">
      <div className="mode-toggle-label">View Mode</div>
      <div className="mode-toggle-buttons">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-button ${currentMode === mode.id ? "active" : ""}`}
            onClick={() => onModeChange(mode.id)}
            title={mode.label}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
