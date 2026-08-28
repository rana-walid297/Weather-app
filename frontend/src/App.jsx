
import { useState } from "react";
import "./App.css";

const CITIES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "London",
  "Paris",
  "Berlin",
  "Rome",
  "Madrid",
  "New York",
  "Los Angeles",
  "Chicago",
  "Toronto",
  "Dubai",
  "Abu Dhabi",
  "Doha",
  "Riyadh",
  "Istanbul",
  "Tokyo",
  "Seoul",
  "Singapore",
  "Sydney",
  "Melbourne",
  "Mumbai",
  "Delhi",
  "Bangkok",
  "Amsterdam",
  "Vienna",
  "Athens",
  "Lisbon",
  "Barcelona"
];

const COMPASS_POINTS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW"
];

function degToCompass(deg) {
  return COMPASS_POINTS[Math.round(deg / 22.5) % 16];
}

function unixToTime(timestamp) {
  if (!timestamp) return "—";

  return new Date(timestamp * 1000).toLocaleTimeString([], {
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
      <div className="weather-symbol sun-symbol">
        ☀
      </div>
    );
  }

  if (
    condition === "Rain" ||
    condition === "Drizzle"
  ) {
    return (
      <div className="weather-symbol rain-symbol">
        🌧
      </div>
    );
  }

  if (condition === "Thunderstorm") {
    return (
      <div className="weather-symbol storm-symbol">
        ⛈
      </div>
    );
  }

  if (condition === "Snow") {
    return (
      <div className="weather-symbol snow-symbol">
        ❄
      </div>
    );
  }

  if (
    condition === "Mist" ||
    condition === "Fog" ||
    condition === "Haze"
  ) {
    return (
      <div className="weather-symbol">
        ≋
      </div>
    );
  }

  return (
    <div className="weather-symbol cloud-symbol">
      ☁
    </div>
  );
}

function Gauge({
  value,
  unit,
  fraction,
  color
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const safeFraction = Math.max(
    0,
    Math.min(1, fraction || 0)
  );

  const offset =
    circumference -
    safeFraction * circumference;

  return (
    <div className="gauge">
      <svg viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="gauge-background"
        />

        <circle
          cx="48"
          cy="48"
          r={radius}
          className="gauge-progress"
          style={{
            stroke: color,
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>

      <div className="gauge-center">
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </div>
  );
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // Search for a city
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
        throw new Error(
          "Weather could not be found."
        );
      }

      const data = await response.json();

      setWeather(data);
    } catch (error) {
      setWeather(null);

      setError(
        "We couldn't find that city. Please check the spelling and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Get weather for user's location
  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Your browser does not support location."
      );

      return;
    }

    setCity("");
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {
          latitude,
          longitude
        } = position.coords;

        try {
          const response = await fetch(
            `http://localhost:5000/api/weather?lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error(
              "Could not get weather."
            );
          }

          const data = await response.json();

          setWeather(data);

          // Put detected city in search box
          setCity(data.city);
        } catch (error) {
          setWeather(null);

          setError(
            "Could not get weather for your location."
          );
        } finally {
          setLoading(false);
        }
      },

      () => {
        setLoading(false);

        setError(
          "Location permission was denied. Please allow location access."
        );
      }
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getWeather();
    }
  };

  const pressureFraction = weather
    ? (weather.pressure - 980) / 70
    : 0;

  const visibilityFraction = weather
    ? Math.min(weather.visibility / 10000, 1)
    : 0;

  return (
    <main className="app">
      <div className="weather-container">

        {/* HEADER */}

        <header className="top-bar">

          <div className="brand">

            <div className="brand-icon">
              ☼
            </div>

            <div>
              <h1>Weatherly</h1>

              <p>
                Simple weather, wherever you are.
              </p>
            </div>

          </div>

          <div className="search-area">

            <div className="search-box">

              <span className="search-icon">
                ⌕
              </span>

              <input
                list="city-list"
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                onKeyDown={handleKeyDown}
              />

              <datalist id="city-list">
                {CITIES.map((cityName) => (
                  <option
                    key={cityName}
                    value={cityName}
                  />
                ))}
              </datalist>

              <button
                onClick={getWeather}
                disabled={loading}
              >
                {loading
                  ? "..."
                  : "Search"}
              </button>

            </div>

            <button
              className="location-button"
              onClick={getMyLocation}
              disabled={loading}
            >
              {loading
                ? "Finding you..."
                : "📍 Use my location"}
            </button>

          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* MAIN WEATHER */}

        <section className="weather-main">

          <div className="location">

            <span className="location-pin">
              ●
            </span>

            {weather ? (
              <>
                <strong>
                  {weather.city}
                </strong>

                <span>
                  {weather.country}
                </span>
              </>
            ) : (
              <span>
                Search for a city
              </span>
            )}

          </div>


          <div className="temperature-section">

            {weather && (
              <WeatherIcon
                condition={weather.condition}
              />
            )}

            <div className="temperature">

              {weather
                ? Math.round(
                    weather.temperature
                  )
                : "—"}

              <span>
                °C
              </span>

            </div>


            <div className="condition">

              {weather
                ? weather.condition
                : "Your weather awaits"}

            </div>


            <p className="description">

              {weather
                ? weather.description
                : "Enter a city above to see the current conditions."}

            </p>


            {weather && (
              <div className="feels-like">

                Feels like{" "}

                <strong>
                  {Math.round(
                    weather.feelsLike
                  )}
                  °
                </strong>

              </div>
            )}

          </div>


          {/* TEMPERATURE RANGE */}

          {weather && (
            <div className="temperature-range">

              <span>
                {Math.round(
                  weather.minTemperature
                )}°
              </span>

              <div className="temperature-line">
                <div />
              </div>

              <span>
                {Math.round(
                  weather.maxTemperature
                )}°
              </span>

            </div>
          )}

        </section>


        {/* WEATHER DETAILS */}

        <section className="details-section">

          <div className="section-heading">
            <span>
              Today's conditions
            </span>
          </div>


          <div className="detail-grid">

            {/* HUMIDITY */}

            <div className="detail-card">

              <div className="card-label">
                Humidity
              </div>

              <Gauge
                value={
                  weather
                    ? weather.humidity
                    : "—"
                }
                unit="%"
                fraction={
                  weather
                    ? weather.humidity / 100
                    : 0
                }
                color="#5B9FA8"
              />

              <p>
                {weather
                  ? weather.humidity < 40
                    ? "Dry"
                    : weather.humidity < 70
                    ? "Comfortable"
                    : "Humid"
                  : "—"}
              </p>

            </div>


            {/* WIND */}

            <div className="detail-card">

              <div className="card-label">
                Wind
              </div>

              <div className="wind-display">

                <div
                  className="wind-arrow"
                  style={{
                    transform: `rotate(${
                      weather?.windDirection || 0
                    }deg)`
                  }}
                >
                  ↑
                </div>

                <div>

                  <strong>
                    {weather
                      ? weather.windSpeed
                      : "—"}
                  </strong>

                  <span>
                    m/s
                  </span>

                </div>

              </div>

              <p>
                {weather
                  ? degToCompass(
                      weather.windDirection
                    )
                  : "—"}
              </p>

            </div>


            {/* PRESSURE */}

            <div className="detail-card">

              <div className="card-label">
                Pressure
              </div>

              <Gauge
                value={
                  weather
                    ? weather.pressure
                    : "—"
                }
                unit="hPa"
                fraction={
                  pressureFraction
                }
                color="#D5A653"
              />

              <p>
                Atmospheric pressure
              </p>

            </div>


            {/* CLOUDINESS */}

            <div className="detail-card">

              <div className="card-label">
                Cloudiness
              </div>

              <Gauge
                value={
                  weather
                    ? weather.cloudiness
                    : "—"
                }
                unit="%"
                fraction={
                  weather
                    ? weather.cloudiness / 100
                    : 0
                }
                color="#7DA9C4"
              />

              <p>
                {weather
                  ? weather.cloudiness < 20
                    ? "Mostly clear"
                    : weather.cloudiness < 60
                    ? "Partly cloudy"
                    : "Cloudy"
                  : "—"}
              </p>

            </div>


            {/* VISIBILITY */}

            <div className="detail-card">

              <div className="card-label">
                Visibility
              </div>

              <Gauge
                value={
                  weather
                    ? metersToKm(
                        weather.visibility
                      )
                    : "—"
                }
                unit="km"
                fraction={
                  visibilityFraction
                }
                color="#D98268"
              />

              <p>
                Distance you can see
              </p>

            </div>

          </div>

        </section>


        {/* SUNRISE / SUNSET */}

        {weather && (
          <section className="sun-section">

            <div className="sun-card">

              <div>

                <span className="sun-label">
                  SUNRISE
                </span>

                <strong>
                  {unixToTime(
                    weather.sunrise
                  )}
                </strong>

              </div>


              <div className="sun-line">

                <span className="sun-circle">
                  ☀
                </span>

              </div>


              <div className="sun-right">

                <span className="sun-label">
                  SUNSET
                </span>

                <strong>
                  {unixToTime(
                    weather.sunset
                  )}
                </strong>

              </div>

            </div>

          </section>
        )}


        <footer>
          Weather data provided by OpenWeather
        </footer>

      </div>
    </main>
  );
}

export default App;

