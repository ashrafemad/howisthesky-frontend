import React, { useState, useEffect } from 'react';

function WeatherData({ source }){
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coords, setCoords] = useState(null); // State to hold coordinates

    useEffect(() => {
        // Get user's location
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCoords({ latitude, longitude });
                    },
                    (error) => {
                        setError('Unable to retrieve location. Please enable location services.');
                        setLoading(false);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    useEffect(() => {
        // Fetch weather data when coordinates are available
        if (source && coords) {
            const fetchWeatherData = async () => {
                const timezoneOffset = -1 * (new Date()).getTimezoneOffset();
                const API_URL = `/weather/${source}/?lat=${coords.latitude}&lng=${coords.longitude}&timezone=${timezoneOffset}`;

                try {
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    setWeather(data);
                } catch (err) {
                    console.log(err)
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchWeatherData();
        }
    }, [source, coords]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {weather}</p>;
    }

    return (
        <div className='container'>
            <div className="weather-data">
                <div className="weather-info">
                    {weather.icon ? <img src={weather.icon} alt="Weather data" className="weather-image" />: null}
                    <div className="weather-details">
                    {weather.city ? <h2>It's {weather.condition_text} Now at {weather.city}</h2> : <h2>It's {weather.condition_text} Now</h2>}
                        <p className="temperature">Temperature: {weather.current_temp} °C</p>
                        <p className="humidity">Humidity: {weather.humidity} %</p>
                    </div>
                    <small>{weather.source}</small>
                </div>
            </div>
        </div>
    );
};

export default WeatherData;