require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const morgan = require('morgan')
const Person = require('./models/person')
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

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
  
let persons = [];

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  }).catch(error => {
    console.log(error);
    response.status(500).send({ error: 'Error retrieving persons from the database.' });
  });
});

app.post('/api/persons', (request, response) => {
      const body = request.body
      if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' });
      }
    
      const person = new Person({
        name: body.name,
        number: body.number,
      });
      person.save()
      .then(savedPerson => {
        response.json(savedPerson);
      })
      .catch(error => {
        console.log(error);
        response.status(500).send({ error: 'Error saving person to the database.' });
      });
    })


app.get('/', (req, res) => {
  res.send(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).send({ error: 'Error retrieving person from the database.' });
    });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(pers => pers.id !== id)

  response.status(204).end()
  })

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})