import React, { useState, useEffect } from 'react';


function parseToUTC(dateStr) {
    // Check if the date string includes a timezone (like +00:00)
    if (!dateStr.includes('Z') && !/([+-]\d{2}:\d{2})$/.test(dateStr)) {
        // If no timezone is provided, assume UTC and append 'Z' to the string
        dateStr += 'Z';
    }
    return new Date(dateStr);
}

function ForecastData({source}) {
    const [forecast, setforecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coords, setCoords] = useState(null);

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
            const fetchforecastData = async () => {
                const timezoneOffset = -1 * (new Date()).getTimezoneOffset();
                const API_URL = `/forecast/${source}/?lat=${coords.latitude}&lng=${coords.longitude}&timezone=${timezoneOffset}`;
                try {
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    setforecast(data);
                } catch (err) {
                    console.log(err)
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchforecastData();
        }
    }, [source, coords]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {forecast}</p>;
    }

    return (
        <div className='container'>
            <h2 className='question-heading'> Planning for something today? </h2>
            <div className="weather-list-section">
                {
                    Object.values(forecast.prediction_data).map(value => (
                        value.map((forecastObj, index) => (
                            <div className="weather-row" key={index}>
                                <div className="weather-row-date">
                                    <h4 className="weather-row-data">{new Date(parseToUTC(forecastObj.date)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</h4>
                                </div>
                                {forecastObj.icon ? <img
                                    src={forecastObj.icon}
                                    alt="Forecast for today"
                                    className="weather-row-image"
                                /> : null}
                                <div className="weather-row-details">
                                    <p className="weather-row-temperature">Temperature: {forecastObj.current_temp} °C</p>
                                    <p className="weather-row-description">Weather: {forecastObj.condition_text}</p>
                                    <p className="weather-row-humidity">Humidity: {forecastObj.humidity} %</p>
                                </div>
                            </div>
                        )
                        )
                    ))
                }
            </div>
        </div>
    );
};

export default ForecastData;