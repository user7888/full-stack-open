import React, { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/persons'
// name ja number -kenttien nollaus tilanteessa
// jossa jo olemassa olevan henkilön numero päivitetään.

// Delete-napin painamiseen liittyvät errorit?


// osa2 muistiinpanon tärkeyden muutos: Button tekstin yhteyteen esimerkki.
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

// hakee datan palvelimelta.
// Axios vaihdetaan phonebookServiceen..
  useEffect(() => {
    phonebookService
      .getAll()
        .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])
/*    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')
*/
  const addNumber = (event, id) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const numberObject = {
      name: newName,
      number : newNumber
    }
    if (isInArray(numberObject, id)) {
      console.log('Nimi löytyi listasta..')
      // !!!!!!!!!! mahd. ongelma .put:in kanssa
      return
    }
// paikallinen päivitys.
//    setPersons(persons.concat(numberObject))
//    setNewName('')
//
// päivitys palvelimelle.
// "promise-chains"
    phonebookService
      .create(numberObject)
        .then(returnedNote => {
        setPersons(persons.concat(returnedNote))
        setNewName('')
        setNewNumber('')
        })
        setSuccessMessage(`${numberObject.name} was added to phonebook`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 4000)

  }
  /*
    axios
    .post('http://localhost:3001/persons', numberObject)
    .then(response => {
      console.log('vastaus palvelimelta..', response)
  // paikallinen päivitys palvelimen lähettämän vastauksen
  // perusteella.
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
    })
  }
  */
  
  const buttonFunctionality = (event, id) => {
    console.log('a button was pressed..')
    event.preventDefault()
    let foundPerson = persons.find(person => person.id === id)
    let result = window.confirm(`Delete ${foundPerson.name} ?`);
    if (result) {
      setPersons(persons.filter(person => person.id !== id))
      axios
        .delete(`/api/persons/${id}`)
        .then(response => {
          setSuccessMessage(`${foundPerson.name} was deleted from phonebook`)
          setTimeout(() => {
          setSuccessMessage(null)
        }, 4000)
        })
        .catch(error => {
          console.log('fail')
          setErrorMessage(`information of ${foundPerson.name} has already been removed
          from the server`)
          setTimeout(() => {
            setErrorMessage(null)
        }, 4000)
        })
    }
  }
  const handleNameChange = (event) => {
    console.log('Event-olion kenttä', event.target.value)
    setNewName(event.target.value)
  }
  // Kun event tapahtuu, muutetaan tilaa.
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }
  const updateNumber = (id, element) => {
    let url = `/api/persons/${id}`
    // laita tähän id tulostus
    axios
      .put(url, element)
      .then(response => {
        setPersons(persons.map(person => person.id !== id ? person : response.data))
        setSuccessMessage(`${element.name}'s phone number was updated`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 4000)
      })
      .catch(error => {
        console.log('fail')
        setErrorMessage(`information of ${element.name} has already been removed from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 4000)
      })
   }

  
  // haun listalta tietyllä attribuutilla voi tehdä
  // myös .some metodilla. (ilman boolean-muunnosta?)

  const isInArray = (element, id) => {
    console.log(element.name)
    const nameFound = Boolean(persons.find(person => person.name === element.name))
  // link name of an element to an id of an element...
    const foundObject = persons.find(person => person.name === element.name)
    console.log('löytyi...', foundObject)
    if (nameFound) {
      let result = window.confirm(`${element.name} is already added to phone book, replace the old number with a new one?`)
      if (result) {
        updateNumber(foundObject.id, element)
        return true
      }
      return true
    }
    return false
  }
  const displayNumbers = (newSearch) => {
    console.log('Hakusana: ', newSearch)
    if (newSearch.length === 0) {
      return persons
    }
    return persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={successMessage} />
        <Error message={errorMessage} />
        <Filter newSearch={newSearch} handleChange={handleSearchChange}/>
      <h2>add a new</h2>
        <AddNewNumber addNumber={addNumber}
                        newName={newName}
                        handleNameChange={handleNameChange}
                        handleNumberChange={handleNumberChange}
                        newNumber={newNumber}/>
      <h2>Numbers</h2>
        <DisplayPhonebook displayNumbers={displayNumbers}
                          newSearch={newSearch}
                          buttonFunctionality={buttonFunctionality}/>
    </div>
  )
}

const Button = (props) => {
  return (
      <button type="submit">delete</button>
  )
}

// button merkkijonon yhteyteen.
const Numbers = (props) => {
  return (
    <form onSubmit={event => props.buttonFunctionality(event, props.id)}>
        {props.name} {props.number} <Button/>
    </form>
  )
}

const Filter = (props) => {
  return (
    <div> filter numbers: <input
            value={props.newSearch}
            onChange={props.handleChange}/>
    </div>
  )
}

const AddNewNumber = (props) => {
  return (
    <form onSubmit={props.addNumber}>
        <div> name: <input 
            value={props.newName}
            onChange={props.handleNameChange}/>
        </div>
        <div>
           number: <input
            value={props.newNumber}
            onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

// id used as key
const DisplayPhonebook = (props) => {
  return (
    <div>
    {props.displayNumbers(props.newSearch).map(person =>
      <div key={person.id}>
        <Numbers name={person.name} number={person.number} id={person.id} buttonFunctionality={props.buttonFunctionality}/>
      </div>)
    }
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App
