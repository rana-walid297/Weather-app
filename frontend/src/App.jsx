
import { useState } from "react";
import "./App.css";

const COMPASS_POINTS = [
  "N", "NNE", "NE", "ENE",
  "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW",
  "W", "WNW", "NW", "NNW"
];

function degToCompass(deg) {
  return COMPASS_POINTS[Math.round(deg / 22.5) % 16];
}

function unixToTime(ts) {
  if (!ts) return "—";

  const date = new Date(ts * 1000);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function metersToKm(meters) {
  if (!meters) return "—";
  return (meters / 1000).toFixed(1);
}

function WeatherIcon({ condition }) {
  if (condition === "Clear") {
    return (
      <svg className="weather-icon" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="12" fill="#C9A24B" />

        <g
          stroke="#C9A24B"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="32" y1="4" x2="32" y2="12" />
          <line x1="32" y1="52" x2="32" y2="60" />
          <line x1="4" y1="32" x2="12" y2="32" />
          <line x1="52" y1="32" x2="60" y2="32" />

          <line x1="12" y1="12" x2="17.5" y2="17.5" />
          <line x1="46.5" y1="46.5" x2="52" y2="52" />

          <line x1="52" y1="12" x2="46.5" y2="17.5" />
          <line x1="17.5" y1="46.5" x2="12" y2="52" />
        </g>
      </svg>
    );
  }

  if (condition === "Rain") {
    return (
      <svg className="weather-icon" viewBox="0 0 64 64">
        <ellipse
          cx="30"
          cy="26"
          rx="16"
          ry="10"
          fill="#74B7C4"
        />

        <g
          stroke="#74B7C4"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="20" y1="42" x2="17" y2="52" />
          <line x1="32" y1="42" x2="29" y2="52" />
          <line x1="44" y1="42" x2="41" y2="52" />
        </g>
      </svg>
    );
  }

  if (condition === "Drizzle") {
    return (
      <svg className="weather-icon" viewBox="0 0 64 64">
        <ellipse
          cx="30"
          cy="26"
          rx="15"
          ry="9"
          fill="#8FA3B8"
        />

        <g
          stroke="#74B7C4"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="22" y1="40" x2="20" y2="47" />
          <line x1="32" y1="40" x2="30" y2="47" />
          <line x1="42" y1="40" x2="40" y2="47" />
        </g>
      </svg>
    );
  }

  if (condition === "Thunderstorm") {
    return (
      <svg className="weather-icon" viewBox="0 0 64 64">
        <ellipse
          cx="30"
          cy="24"
          rx="16"
          ry="9"
          fill="#536278"
        />

        <polygon
          points="30,34 24,48 30,48 26,60 40,42 32,42 36,34"
          fill="#C9A24B"
        />
      </svg>
    );
  }

  if (condition === "Snow") {
    return (
      <svg className="weather-icon" viewBox="0 0 64 64">
        <ellipse
          cx="30"
          cy="24"
          rx="15"
          ry="9"
          fill="#8FA3B8"
        />

        <g
          stroke="#EDE6D6"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="20" y1="42" x2="20" y2="52" />
          <line x1="15.5" y1="47" x2="24.5" y2="47" />

          <line x1="40" y1="42" x2="40" y2="52" />
          <line x1="35.5" y1="47" x2="44.5" y2="47" />
        </g>
      </svg>
    );
  }

  if (
    condition === "Mist" ||
    condition === "Fog" ||
    condition === "Haze"
  ) {
    return (
      <svg className="weather-icon" viewBox="0 0 64 64">
        <g
          stroke="#8FA3B8"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line x1="10" y1="24" x2="54" y2="24" />
          <line x1="16" y1="34" x2="48" y2="34" />
          <line x1="10" y1="44" x2="54" y2="44" />
        </g>
      </svg>
    );
  }

  // Clouds and any unknown condition
  return (
    <svg className="weather-icon" viewBox="0 0 64 64">
      <ellipse
        cx="26"
        cy="38"
        rx="16"
        ry="11"
        fill="#74B7C4"
      />
      <ellipse
        cx="40"
        cy="32"
        rx="13"
        ry="10"
        fill="#8FA3B8"
      />
    </svg>
  );
}

function Gauge({ value, fraction, unit, colorClass = "" }) {
  const circumference = 2 * Math.PI * 36;

  const safeFraction = Math.max(
    0,
    Math.min(1, fraction)
  );

  const offset =
    circumference - safeFraction * circumference;

  return (
    <>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle
          cx="44"
          cy="44"
          r="36"
          className="ring-bg"
          strokeWidth="7"
        />

        <circle
          cx="44"
          cy="44"
          r="36"
          className={`ring-fg ${colorClass}`}
          strokeWidth="7"
          transform="rotate(-90 44 44)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="gauge-readout">
        {value} <small>{unit}</small>
      </div>
    </>
  );
}

function SunArc({ sunrise, sunset }) {
  const now = Date.now() / 1000;

  const fraction =
    sunrise && sunset
      ? Math.max(
          0,
          Math.min(1, (now - sunrise) / (sunset - sunrise))
        )
      : 0.5;

  const cx = 130;
  const cy = 130;
  const r = 100;

  const angle = Math.PI * (1 - fraction);

  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  return (
    <svg
      className="sun-arc"
      viewBox="0 0 260 150"
    >
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${
          cx + r
        } ${cy}`}
        fill="none"
        stroke="#2A3F58"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />

      <line
        x1={cx - r - 8}
        y1={cy}
        x2={cx + r + 8}
        y2={cy}
        stroke="#2A3F58"
        strokeWidth="1"
      />

      <circle
        cx={sunX}
        cy={sunY}
        r="7"
        fill="#C9A24B"
      />

      <circle
        cx={cx - r}
        cy={cy}
        r="3"
        fill="#74B7C4"
      />

      <circle
        cx={cx + r}
        cy={cy}
        r="3"
        fill="#D9784F"
      />
    </svg>
  );
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(
          trimmedCity
        )}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch weather.");
      }

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(
        "Could not fetch weather. Check the city name and make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getWeather();
    }
  };

  const pressureFraction = weather
    ? (weather.pressure - 980) / (1050 - 980)
    : 0;

  const visibilityFraction = weather
    ? weather.visibility / 10000
    : 0;

  return (
    <div className="station">
      {/* HEADER */}
      <div className="masthead">
        <div>
          <div className="masthead-label">
            Field Station Readout
          </div>

          <h1>
            {weather ? weather.city : "Weather Station"}

            {weather && (
              <span>{weather.country}</span>
            )}
          </h1>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(event) =>
              setCity(event.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={getWeather}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* HERO */}
      <div className="hero">
        {/* TEMPERATURE PANEL */}
        <div className="panel">
          <div className="panel-title">
            Temperature
          </div>

          <div className="reading">
            <div>
              <div className="temp-big">
                {weather
                  ? Math.round(weather.temperature)
                  : "—"}

                <sup>°C</sup>
              </div>
            </div>

            {weather && (
              <WeatherIcon
                condition={weather.condition}
              />
            )}
          </div>

          <div className="condition-row">
            <div className="condition">
              {weather
                ? weather.condition
                : "—"}
            </div>

            <div className="description">
              {weather
                ? weather.description
                : "Search for a city to begin"}
            </div>
          </div>

          <div className="sub-readings">
            <div>
              <span className="sub-label">
                Feels Like
              </span>

              <span className="sub-value">
                {weather
                  ? `${Math.round(
                      weather.feelsLike
                    )}°`
                  : "—"}
              </span>
            </div>

            <div>
              <span className="sub-label">
                Humidity
              </span>

              <span className="sub-value">
                {weather
                  ? `${weather.humidity}%`
                  : "—"}
              </span>
            </div>
          </div>

          <div className="range-bar">
            <div className="range-labels">
              <span>
                MIN{" "}
                {weather
                  ? `${Math.round(
                      weather.minTemperature
                    )}°`
                  : "—"}
              </span>

              <span>
                MAX{" "}
                {weather
                  ? `${Math.round(
                      weather.maxTemperature
                    )}°`
                  : "—"}
              </span>
            </div>

            <div className="range-track">
              {weather && (
                <div className="range-fill" />
              )}
            </div>
          </div>
        </div>

        {/* SUN PANEL */}
        <div className="panel sun-panel">
          <div className="panel-title">
            Day Arc
          </div>

          <SunArc
            sunrise={weather?.sunrise}
            sunset={weather?.sunset}
          />

          <div className="sun-times">
            <div>
              <span className="sub-label">
                Sunrise
              </span>

              <span className="sub-value">
                {weather
                  ? unixToTime(weather.sunrise)
                  : "—"}
              </span>
            </div>

            <div>
              <span className="sub-label">
                Sunset
              </span>

              <span className="sub-value">
                {weather
                  ? unixToTime(weather.sunset)
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GAUGES */}
      <div className="gauges">
        {/* WIND */}
        <div className="panel gauge-panel">
          <div className="gauge-name">
            Wind
          </div>

          <div className="compass-wrap">
            <svg viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="42"
                className="ring-bg"
                strokeWidth="1"
              />

              <text
                x="48"
                y="12"
                textAnchor="middle"
                className="compass-text"
              >
                N
              </text>

              <text
                x="48"
                y="90"
                textAnchor="middle"
                className="compass-text"
              >
                S
              </text>

              <text
                x="8"
                y="51"
                textAnchor="middle"
                className="compass-text"
              >
                W
              </text>

              <text
                x="88"
                y="51"
                textAnchor="middle"
                className="compass-text"
              >
                E
              </text>

              <g
                className="needle"
                style={{
                  transform: `rotate(${
                    weather?.windDirection || 0
                  }deg)`
                }}
              >
                <line
                  x1="48"
                  y1="48"
                  x2="48"
                  y2="16"
                  stroke="#D9784F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <line
                  x1="48"
                  y1="48"
                  x2="48"
                  y2="72"
                  stroke="#536278"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="48"
                  cy="48"
                  r="3.5"
                  fill="#C9A24B"
                />
              </g>
            </svg>
          </div>

          <div className="compass-dir">
            {weather
              ? degToCompass(
                  weather.windDirection
                )
              : "—"}
          </div>

          <div className="gauge-readout">
            {weather
              ? weather.windSpeed
              : "—"}{" "}
            <small>m/s</small>
          </div>
        </div>

        {/* HUMIDITY */}
        <div className="panel gauge-panel">
          <div className="gauge-name">
            Humidity
          </div>

          <Gauge
            value={weather ? weather.humidity : "—"}
            fraction={
              weather
                ? weather.humidity / 100
                : 0
            }
            unit="%"
          />
        </div>

        {/* PRESSURE */}
        <div className="panel gauge-panel">
          <div className="gauge-name">
            Pressure
          </div>

          <Gauge
            value={weather ? weather.pressure : "—"}
            fraction={pressureFraction}
            unit="hPa"
            colorClass="brass-ring"
          />
        </div>

        {/* CLOUDINESS */}
        <div className="panel gauge-panel">
          <div className="gauge-name">
            Cloudiness
          </div>

          <Gauge
            value={
              weather ? weather.cloudiness : "—"
            }
            fraction={
              weather
                ? weather.cloudiness / 100
                : 0
            }
            unit="%"
          />
        </div>

        {/* VISIBILITY */}
        <div className="panel gauge-panel">
          <div className="gauge-name">
            Visibility
          </div>

          <Gauge
            value={
              weather
                ? metersToKm(weather.visibility)
                : "—"
            }
            fraction={visibilityFraction}
            unit="km"
            colorClass="coral-ring"
          />
        </div>
      </div>

      <footer>
        Instrument readout · updates on fetch · not
        for navigation use
      </footer>
    </div>
  );
}

export default App;
