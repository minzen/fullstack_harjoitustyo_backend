const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
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
  email: {
    type: String,
    required: true,
    minlength: 4
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})
module.exports = mongoose.model('User', schema)
