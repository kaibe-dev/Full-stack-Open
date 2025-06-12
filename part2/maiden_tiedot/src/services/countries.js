import axios from "axios"

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"
const api_key = import.meta.env.VITE_SOME_KEY
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5"

const getAllNames = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(Response => Response.data)
}

const getWeatherByCity = (city) => {
  const request = axios.get(
    `${weatherBaseUrl}/weather?q=${city}&appid=${api_key}&units=metric`
  )
  return request.then(response => response.data)  
}

export default { getAllNames, getWeatherByCity }