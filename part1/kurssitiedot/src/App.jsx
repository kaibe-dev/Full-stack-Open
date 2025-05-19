const Header = (props) => {
  return <h1>{props.course.name}</h1>
}

const Content = (props) => {
  return (
    <div>
      <Part values = {props.course.parts[0]} />
      <Part values = {props.course.parts[1]} />
      <Part values = {props.course.parts[2]} />
    </div>
  )

}

const Part = (props) => {
  return <p> {props.values.name} {props.values.exercises} </p>
  
}

const Total = (props) => {
  const count_e1 = props.course.parts[0].exercises
  const count_e2 = props.course.parts[1].exercises
  const count_e3 = props.course.parts[2].exercises
  return <p>Number of exercises {count_e1 + count_e2 + count_e3}</p>
}

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
      <Header course = {course} />
      <Content course = {course} />
      <Total course = {course} />
    </div>
  )
}

export default App