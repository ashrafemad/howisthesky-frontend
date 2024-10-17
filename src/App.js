import React, { useState } from 'react';
import './App.css';
import './WeatherEffects.css';
import WeatherData from './weatherData';
import ForecastData from './forecastData';

function App() {
  const parentStyle = {
    height: '100%',
    backgroundImage: 'url(' + require("./images/nature-sky-background-summer.jpg") + ')',
    backgroundSize: 'cover', // Cover the whole container
    backgroundRepeat: 'no-repeat',
  }
  const containerStyle = {
    width: '100%',
    paddingTop: '1rem',
    paddingBottom: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const titleContainerStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    width: '80%',
    height: '300px',
    position: 'relative',
    textAlign: 'center',
    overflow: 'hidden',
    zIndex: '10',
    backgroundImage: 'url(' + require("./images/weather.gif") + ')',
    backgroundSize: 'cover', // Cover the whole container
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center calc(50% + 2rem)',
  };

  const weatherTitleStyle = {
    fontFamily: 'Fjalla One, Arial',
    fontSize: '5rem',
    padding: '10px',
    color: '#fff',
    position: 'relative',
    zIndex: '20',
  };

  const selectStyle = {
    width: 'auto',
    textAlign: 'center',
  };

  const [selectedSource, setSelectedSource] = useState('');

  const handleSelectChange = (e) => {
    setSelectedSource(e.target.value);
  };

  // TODO: convert data sources to dynamic list (populated from an api) in case sources got bigger
  return (
    <div style={parentStyle}>
      <div style={containerStyle}>
        <div style={titleContainerStyle}>
          <h1 className="weather-title" style={weatherTitleStyle}>
            How is the sky<br />
          </h1>
        </div>
      </div>
      <div className="container" style={{ paddingLeft: '4rem' }}>

        <select
          className="form-select form-select-sm"
          aria-label="Select data source"
          value={selectedSource}
          onChange={handleSelectChange}
          style={selectStyle}>
          <option disabled>Data source</option>
          <option value="openweathermap">Open Weather Map</option>
          <option value="openmeteo">Open Meteo</option>
        </select>
      </div>
      <WeatherData source={selectedSource ? selectedSource : "openweathermap"} />
      <ForecastData source={selectedSource ? selectedSource : "openweathermap"} />
    </div>
  );
}

export default App;
