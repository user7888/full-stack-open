import React, { useState } from 'react'

const App = () => {
  const header = 'Anecdote of the day'
  const header2 = 'Anecdote with the most votes'
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(7).fill(0))
  const [votes, setVotes] = useState(0)

  const handleClick = () => {
    setSelected(Math.floor(Math.random() * 7))
  }

  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setVotes(votes + 1)
    setPoints(copy)
  }

  const findMax = (list) => {
    var max = list[0]
    var maxIndex = 0
    for (var i = 1; i < list.length; i++) {
      if (list[i] > max) {
          maxIndex = i
          max = list[i]
      }
    }
    return maxIndex
  }

// empty line ...
  return (
    <>
    <h1><Header header={header} /></h1>
    <div>
      <Button handleClick={handleVote} text='vote'/>
      <Button handleClick={handleClick} text='next anecdote'/>
    </div>
    <div>
      {anecdotes[selected]}
    <p></p>
    </div>
    <div>
      has {points[selected]} votes
    </div>
    <h1><Header header={header2} /></h1>
    <div>
      <DisplayBestAnecdote votes={votes} function={findMax} points={points} anecdotes={anecdotes}/>
    </div>
    </>
  )
}

const Header = (props) => {
  return (
    <div>
      <p>
        {props.header}
      </p>
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

// props.votes oli kokoajan 0, joten "No votes yet." tulostui päivityksestä huolimatta.
const DisplayBestAnecdote = (props) => {
  if (props.votes === 0) {
    return (
      <div>
        No votes yet.
      </div>
    )
  }
  const mostVotes = props.function(props.points)
  return (
    <div>
      {props.anecdotes[mostVotes]}
    </div>
  )
}

export default App
