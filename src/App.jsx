import React, { useState, useEffect } from "react";
import { searchDestinations } from "./api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Initialize Itinerary safely
  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem("my_trip");
      if (saved && saved !== "undefined") return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  // Search Logic
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const data = await searchDestinations(query);
        if (active) setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setResults([]);
      }
    };
    const timer = setTimeout(fetchData, 400); // Debounce search
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("my_trip", JSON.stringify(itinerary));
  }, [itinerary]);

  const add = (p) => {
    if (!itinerary.find((i) => i.id === p.id)) {
      setItinerary([...itinerary, { ...p, start: "", end: "" }]);
    }
  };

  const remove = (id) => setItinerary(itinerary.filter((i) => i.id !== id));

  const updateDate = (id, field, val) => {
    setItinerary(
      itinerary.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    );
  };

  return (
    <div className="container">
      <header>
        <h1>
          Explore <span style={{ color: "var(--primary)" }}>Destinations</span>
        </h1>
        <input
          className="search-input"
          placeholder="Where to next?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <div className="main-content">
        <main className="results-area">
          <div className="grid">
            {results.map((dest) => (
              <div key={dest.id} className="card">
                <img
                  src={dest.image}
                  alt={dest.city}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop";
                  }}
                />{" "}
                <div className="card-info">
                  <h3>{dest.city}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {dest.desc}
                  </p>
                  <button
                    disabled={itinerary.some((i) => i.id === dest.id)}
                    onClick={() => add(dest)}
                  >
                    {itinerary.some((i) => i.id === dest.id)
                      ? "✓ Added"
                      : "Add to Trip"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="itinerary-area">
          <h2 style={{ marginTop: 0 }}>My Itinerary</h2>
          {itinerary.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No stops planned yet.</p>
          ) : (
            itinerary.map((item) => (
              <div key={item.id} className="trip-item">
                <h4 style={{ margin: "0 0 8px 0" }}>{item.city}</h4>
                <div className="date-row">
                  <input
                    type="date"
                    className="date-input"
                    value={item.start}
                    onChange={(e) =>
                      updateDate(item.id, "start", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="date-input"
                    value={item.end}
                    onChange={(e) => updateDate(item.id, "end", e.target.value)}
                  />
                </div>
                <button className="btn-remove" onClick={() => remove(item.id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}
