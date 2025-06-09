const Filter = ({ filter, handler }) => {
  return(
    <div>
      filter countries with <input value={filter} onChange={handler} />
    </div>
  )
}

export default Filter