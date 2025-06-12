import Part from './Part'

const Content = ({ parts }) => {
  console.log("Parts:", parts)
  return (
    <>
      {parts.map(part =>
          <Part name={part.name} count={part.exercises} />
      )}
    </>
  )
}

export default Content