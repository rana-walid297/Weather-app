
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(cors());

const PORT = 5000;
app.get("/api/weather", async (req, res) => {
    const { city, lat, lon } = req.query;

    try {
        let url;

        if (lat && lon) {
            // Search by coordinates
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        } else if (city) {
            // Search by city
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        } else {
            return res.status(400).json({
                error: "Please provide a city or coordinates."
            });
        }

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Weather data could not be found."
            });
        }

        const data = await response.json();

        res.json({
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            minTemperature: data.main.temp_min,
            maxTemperature: data.main.temp_max,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg,
            cloudiness: data.clouds.all,
            visibility: data.visibility,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong."
        });
    }
});

/*app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: "metric"
                }
            }
        );

        const weatherData = {
    city: response.data.name,
    country: response.data.sys.country,

    temperature: response.data.main.temp,
    feelsLike: response.data.main.feels_like,
    minTemperature: response.data.main.temp_min,
    maxTemperature: response.data.main.temp_max,

    condition: response.data.weather[0].main,
    description: response.data.weather[0].description,
    icon: response.data.weather[0].icon,

    humidity: response.data.main.humidity,
    pressure: response.data.main.pressure,

    windSpeed: response.data.wind.speed,
    windDirection: response.data.wind.deg,

    cloudiness: response.data.clouds.all,
    visibility: response.data.visibility,

    sunrise: response.data.sys.sunrise,
    sunset: response.data.sys.sunset
};

        res.json(weatherData);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch weather data"
        });
    }
});*/

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});