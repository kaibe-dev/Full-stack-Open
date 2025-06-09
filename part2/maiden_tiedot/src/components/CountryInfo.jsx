const CountryInfo = ({ country }) => {
  console.log(country)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        Capital {country.capital}
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
    </div>
  )
}

export default CountryInfo

