const Total = ({ parts }) => {
  const total = parts.reduce((acc, part) => {
    console.log(acc, part.exercises)
    return acc + part.exercises
  }, 0)
  return <b>total of {total} exercises</b>
}

export default Total