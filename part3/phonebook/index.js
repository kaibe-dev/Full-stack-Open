const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())

morgan.token('content', (req, res) =>{
    if (req.method === 'POST' && req.body.name && req.body.number ) {
        return `{"name": ${req.body.name}, "number": ${req.body.number}"}`
    }
    return ''
})
app.use(morgan((tokens, req, res) => {
    return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res)
    ].join(' ')
}))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toTimeString()}</p>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'Required fields missing'
        })
    }

    if (persons.find(existingPerson => existingPerson.name === person.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }
    
    person.id = String(Math.floor(Math.random() * 400))
    persons = persons.concat(person)
    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})