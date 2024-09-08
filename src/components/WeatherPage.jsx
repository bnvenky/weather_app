/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const { cityName } = useParams();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=81ad307871902a968c6b1947fed2f86a`
        );
        setWeatherData(response.data);
      } catch (err) {
        setError('Failed to fetch weather data');
        setNotFound(true);
      }
    };
    fetchWeather();
  }, [cityName]);

  const getWeatherImage = (main) => {
    const weatherImages = {
      Clouds: 'https://res.cloudinary.com/dhik9tnvf/image/upload/v1725724007/cloud_i3vdxq.png',
      Clear: 'https://res.cloudinary.com/dhik9tnvf/image/upload/v1725724007/clear_cfhskq.png',
      Rain: 'https://res.cloudinary.com/dhik9tnvf/image/upload/v1725724007/rain_g7yfpf.png',
      Mist: 'https://res.cloudinary.com/dhik9tnvf/image/upload/v1725724007/mist_t83gs4.png',
      Snow: 'https://res.cloudinary.com/dhik9tnvf/image/upload/v1725724007/snow_c13cs7.png',
    };
    return weatherImages[main] || weatherImages['Clouds'];
  };

  const getBackgroundClass = (main) => {
    const backgroundClasses = {
      clear: 'bg-blue-300',
      rain: 'bg-gray-700',
      clouds: 'bg-gray-400',
    };
    return backgroundClasses[main.toLowerCase()] || 'bg-gray-200';
  };

  if (error) return <p>{error}</p>;

  return (
    <div className={`flex justify-center items-center min-h-screen ${weatherData && getBackgroundClass(weatherData.weather[0].main)} p-4`}>
      <div className="bg-slate-200 rounded-lg p-6 w-96">
        <center className="text-xl font-bold">Weather in {cityName}</center>

        {/* Not Found */}
        {notFound && (
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-lg text-gray-600 mb-2">Sorry, Location not found!</h1>
            <img src="https://res.cloudinary.com/dhik9tnvf/image/upload/v1725724007/404_rr6ovr.png" alt="404 Error" className="w-3/4" />
          </div>
        )}

        {/* Weather Details */}
        {weatherData && !notFound && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <img src={getWeatherImage(weatherData.weather[0].main)} alt="Weather" className="w-2/3 mx-auto mt-4" />
            <div className="mt-4">
              <p className="text-4xl font-bold">
                {Math.round(weatherData.main.temp - 273.15)} <sup>°C</sup>
              </p>
              <p className="text-xl font-semibold capitalize">{weatherData.weather[0].description}</p>
            </div>
            <div className="flex justify-between mt-6">
              <div className="flex items-center">
                <i className="fas fa-tint text-3xl"></i>
                <div className="ml-2">
                  <span className="text-xl font-bold">{weatherData.main.humidity}%</span>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="flex items-center">
                <i className="fas fa-wind text-3xl"></i>
                <div className="ml-2">
                  <span className="text-xl font-bold">{weatherData.wind.speed} Km/H</span>
                  <p>Wind Speed</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;

