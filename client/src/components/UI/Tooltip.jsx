import "./Tooltip.css";

export default function Tooltip({ countryName, visible, position }) {
  if (!visible || !countryName) return null;

  const style = {
    position: "absolute",
    left: `${position?.x || 0}px`,
    top: `${position?.y || 0}px`,
  };

  return (
    <div className="tooltip-container" style={style}>
      <div className="tooltip-content">
        <span className="tooltip-flag">🌍</span>
        <span className="tooltip-text">{countryName}</span>
      </div>
      <div className="tooltip-arrow"></div>
    </div>
  );
}
