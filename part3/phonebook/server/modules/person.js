const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return /^\d{2,3}-\d{1,}$/.test(value)
      },
      message: props => `${props.value} is not a valid number format!`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returedObject) => {
    returedObject.id = returedObject._id.toString()
    delete returedObject._id
    delete returedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)