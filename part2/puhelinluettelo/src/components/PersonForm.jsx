const PersonForm = ({ name, number, nameHandler, numberHandler, submit }) => {
  return (
    <form onSubmit={submit}>
      <div>
        name: <input value={name} onChange={nameHandler}/>
      </div>
      <div>
        number: <input value={number} onChange={numberHandler}/> 
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    )
}

export default PersonForm