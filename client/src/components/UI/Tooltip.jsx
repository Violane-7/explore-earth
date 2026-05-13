import "./Tooltip.css";
import { getCountryFlag, getCountryName } from "../../utils/countryMeta";

export default function Tooltip({ countryCode, position }) {
  if (!countryCode) return null;

  const flag = getCountryFlag(countryCode);
  const name = getCountryName(countryCode);

  const style = {
    position: "absolute",
    left: `${(position?.x || 0) + 16}px`,
    top: `${(position?.y || 0) - 48}px`,
  };

  return (
    <div className="tooltip-container" style={style}>
      <div className="tooltip-content">
        <span className="tooltip-flag">{flag}</span>
        <span className="tooltip-text">{name}</span>
      </div>
      <div className="tooltip-arrow"></div>
    </div>
  );
}
