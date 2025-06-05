const Persons = ({ filteredPersons }) => {
  return (
    <div>
      {filteredPersons.map((person) =>
      <div>
        {person.name} {person.number}
      </div>
      )}
    </div>
  )
}

export default Persons