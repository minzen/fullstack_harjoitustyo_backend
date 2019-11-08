const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  passwordHash: {
    type: String,
    required: true
  },
  givenname: String,
  surname: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})
module.exports = mongoose.model('User', schema)
