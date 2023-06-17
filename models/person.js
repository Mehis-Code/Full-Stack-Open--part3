//////////
const mongoose = require('mongoose')
///////////
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('connecting to', url)

mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')})
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d{7,}$/.test(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema)