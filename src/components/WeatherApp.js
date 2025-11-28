import {useEffect, useState} from 'react';
import React from 'react';
import '../css/App.css';
import { getWeatherIcon } from '../utils/weatherIcon';


export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=43.7064&longitude=-79.3986&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max,weather_code&current=precipitation,rain,showers,snowfall,is_day,surface_pressure,wind_direction_10m,wind_speed_10m,temperature_2m,weather_code&timezone=America%2FNew_York`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather({city: 'Toronto', current: data.current, daily: data.daily});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !weather) {
    return <div>Error: {error}</div>;
  }

  const {current, daily, city} = weather;

  const todayDate = new Date(daily.time[0]);
  const dayName = todayDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = todayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric'});
  const uvIndex = daily.uv_index_max[0];
  const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date (daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const currentTemp = Math.round(current.temperature_2m);
  const dailyHigh = Math.round(daily.temperature_2m_max[0]);
  const dailyLow = Math.round(daily.temperature_2m_min[0]);
  // const humidity = current.relative_humidity_2m;
  const humidity = 15; // placeholder as humidity call does not work
  const windSpeed = current.wind_speed_10m;
  const airPressure = current.surface_pressure;
  const weatherCode = current.weather_code;


  return (
    <div className="App">
      <div className="weather-card">
        {/* LEFT UI */}
        <div className="weather-main">
          <div>
            <div className="day-text">{dayName}</div>
            <div className="date-text">{dateString}</div>
          </div>

          <div className="weather-icon">
            <img
              src={getWeatherIcon(weatherCode)}
              alt="Weather"
              className="big-weather-icon"
            />
          </div>

          <div className="bottom-left">
            <div className="temp-text">
              {currentTemp}
              <span className="degree">°C</span>
            </div>
            <div className="city-text">{city}</div>
          </div>
        </div>

        {/* RIGHT UI */}
        <div className="weather-details">
          <div className="stats-row">
            <div className="stats-labels">
              <span>Humidity</span>
              <span>Wind Speed</span>
              <span>Air Pressure</span>
              <span>Daily High</span>
              <span>Daily Low</span>
              <span>UV Index</span>
            </div>
            <div className="stats-values">
              <span>{humidity}%</span>
              <span>{Math.round(windSpeed)} km/h</span>
              <span>{Math.round(airPressure)} mb</span>
              <span>{dailyHigh}°C</span>
              <span>{dailyLow}°C</span>
              <span>{Math.round(uvIndex)}</span>
            </div>
          </div>

          <div className="suntimes-row">
            <span>Sunrise {sunrise}</span>
            <span>Sunset {sunset}</span>
          </div>

          <div className="forecast-box">
            {daily.time.slice(0, 7).map((dateStr, index) => {
              const day = new Date(dateStr);
              const dayShort = day.toLocaleDateString("en-US", {weekday: "short", });
              const minTemp = Math.round(daily.temperature_2m_min[index]);
              const code = daily.weather_code[index];

              return (
                <div key={dateStr} className="forecast-item">
                  <span>{dayShort}</span>
                  <img
                    src={getWeatherIcon(code)}
                    alt="Weather Icon"
                    className="forecast-icon-img"
                  />
                  <span className="forecast-temp">{minTemp}°C</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );


}