import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--card)",
        cursor: "pointer"
      }}
      title="Toggle dark mode"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
