const express = require('express');
const app = express();
const morgan = require('morgan')
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  const cors = require('cors')
  app.use(express.static('build'))
  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)
  morgan.token('cont', function (req, res) { return JSON.stringify(req.body) })
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :cont'))
  
let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
];
const genId = () => {
    c = Math.floor(Math.random() * 100000000)
    return c;
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
    }
    const check = persons.find(x => x.name === body.name)
    if (check) {
        return response.status(403).json({ 
            error: 'name must be unique' 
          })
    }
    const perso = {
      id: genId(),
      name: body.name,
      number: body.number,
    }
    persons = persons.concat(perso)
    response.json(perso)
    })

app.get('/', (req, res) => {
  res.send(persons);
});

app.get('/info', (req, res) => {
    const thing = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`

    res.send(thing);
  });
  

app.get('/api/persons', (req, res) => {
    res.send(persons);
  });

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(x => x.id === id);
  if (person) {
  response.json(person);
  }
  else {
    response.status(404).end() 
 }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)
    response.status(204).end()
  })

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
