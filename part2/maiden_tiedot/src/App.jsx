import { useState, useEffect } from "react"
import Countries from "./components/Countries"
import Filter from './components/Filter'
import countryService from './services/countries'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  


  useEffect(() => {
    countryService
      .getAllNames()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  },[])

  const handleFilterChange = (Event) => {
  setFilter(Event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )  

  const handleCountrySelection = (country) => {
    setFilter(country.name.common)
  }


  return (
    <div>
        <h1>Find Countries</h1>
        <Filter filter={filter} handler={handleFilterChange} />
        <br />
        <Countries 
          countries={filteredCountries}
          onCountrySelect={handleCountrySelection} 
        />
    </div>
  )
}

export default App