import ReactDOM from 'react-dom'
import App from './App'
import axios from 'axios'

axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      const data = response.data
      console.log('data retrieved', data)
})

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)

