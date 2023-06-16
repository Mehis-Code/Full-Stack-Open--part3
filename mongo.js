///komentorivitoiminnallisuus

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Mehi:${password}@fullstack.js6blap.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema, 'persons')

if (process.argv.length == 3){
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    //console.log("done")
    mongoose.connection.close()
    process.exit(1)
  })
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(result => {
  console.log(`added ${person.name} ${person.number} to phonebook`)
  mongoose.connection.close()
})

