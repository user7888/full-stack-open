import React from 'react'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  
  return (
    <div>
      <h1><Header course={course} /></h1>
      <Content course={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <p>
        {props.course.name}
      </p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  console.log(props.course)
  return (
  <div>
      <Part tex={props.course[0].name} ex={props.course[0].exercises}/>
      <Part tex={props.course[1].name} ex={props.course[1].exercises}/>
      <Part tex={props.course[2].name} ex={props.course[2].exercises}/>
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
  return (
  <div>
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  </div>
  )
}
export default App
