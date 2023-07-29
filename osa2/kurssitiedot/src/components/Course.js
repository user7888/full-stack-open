import React from 'react'

const Course = (props) => {
    return (
      <>
        <h1><Header course={props.course} /></h1>
        <Content parts={props.parts} />
        <Total parts={props.parts} />
      </>
    )
  }
  
  const Header = (props) => {
    return (
      <div>
        <p>
          {props.course}
        </p>
      </div>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
        {props.parts.map(part =>
          <div key={part.id}>
            {part.name} {part.exercises}
          </div>)
        }
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.tex} {props.ex}
        </p>
      </div>
    )
  }
  
  const Total = (props) => {
    const total = props.parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
  
    return (
      <div>
        <p></p>
        <b>total of {total} exercises</b>
      </div>
    )
  }

export default Course