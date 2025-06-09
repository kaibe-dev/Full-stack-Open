import { useState, useEffect } from "react"
import countryService from '../services/countries'

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getWeatherByCity(country.capital)
      .then(weatherData => {
        setWeather(weatherData)
      })
  }, [country.capital])
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        Capital {country.capital[0]}
        <br />
        Area {country.area}
      </div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>Weather in {country.capital[0]}</h2>

      {weather ? (
        <div>
          Temperature {weather.main.temp} Celsius
          <br />
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description}
            />
          <br />
          Wind {weather.wind.speed} m/s
        </div>
      ) : (
        <div>
          Fetching weather data...
        </div>
      )}
    </div>
  )
}

export default CountryInfo