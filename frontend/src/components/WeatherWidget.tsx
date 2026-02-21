import React, { useEffect, useState } from "react";
import "./WeatherWidget.css";

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CITY = "Belgrade";

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=en`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load weather data");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="weather-widget">Loading weather...</div>;
  if (error) return <div className="weather-widget">Error: {error}</div>;
  if (!weather) return null;

  return (
    <div className="weather-widget">
      <h4>Weather in {weather.name}</h4>
      <div className="weather-main">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
        <div>
          <span className="weather-temp">{Math.round(weather.main.temp)}°C</span>
          <span className="weather-desc">{weather.weather[0].description}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
