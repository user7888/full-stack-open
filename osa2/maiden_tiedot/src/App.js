import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countryData, setCountryData] = useState([])
  const [newSearch, setSearch] = useState('')
  const [temperature, setTemperature] = useState(0)
  const [wind, setWind] = useState(0)
  const [windDirection, setWindDirection] = useState('')
  const [img, setImg] = useState('')
  const apiKey = process.env.REACT_APP_API_KEY

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountryData(response.data)
      })
  }, [])
  console.log('render', countryData.length, 'countries')

  const getWeatherData = (city) => {
    console.log('capital is...', city)
    console.log('weather effect')
    axios
      .get(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`)
      .then(response => {
        console.log('promise fulfilled, weather')
        console.log('response is.. ', response)
        setWind(response['data']['current']['wind_speed'])
        setWindDirection(response['data']['current']['wind_dir'])
        setImg(response['data']['current']['weather_icons'][0])
        setTemperature(response['data']['current']['temperature'])
      })
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const button = (event, name) => {
    event.preventDefault()
    setSearch(name)
  }

  return (
    <div>
      <h1>Country data</h1>
        <Filter newSearch={newSearch}
                handleChange={handleSearchChange}/>
      <div>
        <DisplayCountries 
                          newSearch={newSearch}
                          countryData={countryData}
                          button={button}
                          getWeatherData={getWeatherData}
                          temperature={temperature}
                          wind={wind}
                          windDirection={windDirection}
                          img={img}/>
      </div>
    </div>
  )
}

const Button = (props) => {
  return (
      <button type="submit">show</button>
  )
}

const Country = (props) => {
  return (
    <div>
      <form onSubmit={event => props.button(event, props.name)}>
        {props.name} <Button/>
      </form>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div> filter countries: <input
            value={props.newSearch}
            onChange={props.handleChange}/>
    </div>
  )
}

const Languages = (props) => {
  return (
    <li> {props.language} </li>
  )
}

const DisplayCountries = (props) => {
  let countries = props.countryData.filter(country => 
    country.name['common'].toLowerCase().includes(props.newSearch.toLowerCase()))
  console.log(countries.lenght)
  console.log('New search=', props.newSearch)
  console.log('New Search lenght=', props.newSearch.length)

  if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name['common']}</h1>
          <p> capital {countries[0].capital} </p>
          <p> population {countries[0].population}</p>
        <h3> Languages </h3>
        <ul>
          {Object.entries(countries[0].languages).map( ([key, value]) =>
            <div key={value}>
            <Languages language={value}/>
            </div>)}
        </ul>
        <img src={countries[0].flags['png']}/>
        <h3>Weather in {countries[0].capital}</h3>
        {props.getWeatherData(countries[0].capital)}
         <div>
           <strong>temperature:</strong> {props.temperature} Celsius <br></br>
           <img src={props.img}/> <br></br>
           <strong>wind:</strong> {props.wind} mph direction {props.windDirection}
         </div>
      </div>
    )
  }
  if (props.newSearch.length === 0) {
    return (
      <div>
        Too many matches, specify an other filter
      </div>
    )
  }
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, specify an other filter
      </div>
    )
  }
  return (
    <div>
      {countries.map(country =>
      <div key={country.name['common']}>
        <Country name={country.name['common']}
                button={props.button}/>
      </div>)
    }
    </div>
  )
}

export default App