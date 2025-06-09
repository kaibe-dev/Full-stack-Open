import CountryInfo from "./CountryInfo"

const Countries = ({ countries, onCountrySelect }) => {
  

  if (countries.length > 10) {
    return <div>Too many matches, be more specific</div>
  } 
  else if (countries.length === 1) {
    return <CountryInfo country={countries[0]} /> 
  } 
  else {
    return (
      <div>
        {countries.map((country) =>
        <div key={country.name.common}> 
          {country.name.common} 
          <button onClick={() => onCountrySelect(country)}>Show</button>
        </div>
        )}  
      </div>
    )
  }
}

export default Countries