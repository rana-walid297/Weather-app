import { useState } from "react";

function App() {
    const [weather, setWeather] = useState(null);

    const getWeather = async () => {
        const response = await fetch(
            "http://localhost:5000/api/weather?city=Cairo"
        );

        const data = await response.json();

        setWeather(data);
    };

    return (
        <div>
            <h1>Weather App</h1>

            <button onClick={getWeather}>
                Get Cairo Weather
            </button>

            {weather && (
                <div>
                    <h2>{weather.city}</h2>
                    <p>{weather.temperature}°C</p>
                    <p>{weather.description}</p>
                    <p>Humidity: {weather.humidity}%</p>
                </div>
            )}
        </div>
    );
}

export default App;