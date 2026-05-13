import { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({ message, type = "info", onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type} ${visible ? "toast-enter" : "toast-exit"}`}>
      <span className="toast-icon">
        {type === "ocean" ? "🌊" : type === "error" ? "⚠️" : "ℹ️"}
      </span>
      <span className="toast-text">{message}</span>
    </div>
  );
}
