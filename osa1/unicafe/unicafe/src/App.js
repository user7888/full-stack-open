import React, { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const header = 'give feedback'
  const statistics = 'statistics'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }

  return (
    <div>
      <h1><Header header={header} /></h1>
      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClick} text='neutral'/>
      <Button handleClick={handleBadClick} text='bad'/>
      <h1><Header header={statistics}/></h1>
      <Statistics good={good} bad={bad} neutral={neutral} all={all}/>
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Header = (props) => {
  return (
    <div>
      <p>
        {props.header}
      </p>
    </div>
  )
}

const Statistics = (props) => {
  const g = props.good * 1
  const n = props.neutral * 0
  const b = props.bad * -1
  const average = (g + n + b) / props.all
  const positive = (g / props.all) * 100

  if (props.all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <tr>
        <StatisticLine text='good' value={props.good}/>
      </tr>
      <tr>
        <StatisticLine text='neutral' value={props.neutral}/>
      </tr>
      <tr>
        <StatisticLine text='bad' value={props.bad}/>
      </tr>
      <tr>
        <StatisticLine text='all' value={props.all}/>
      </tr>
      <tr>
        <StatisticLine text='average' value={average}/>
      </tr>
      <tr>
        <StatisticLine text='positive' value={positive + ' %'}/>
      </tr>
      </tbody>
    </table>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <td>{props.text} </td>
      <td>{props.value} </td>
    </>
  )
}

export default App
