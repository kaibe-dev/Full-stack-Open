import axios from "axios"

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

const getAllNames = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(Response => Response.data)
}

export default { getAllNames }