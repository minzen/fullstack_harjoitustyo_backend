const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false,
    minlength: 4
  },
  content: {
    type: String,
    required: true,
    unique: false,
    minlength: 5
  },
  keywords: {
    type: [{ type: String }]
  },
  // modified: {
  //   type: Date
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
module.exports = mongoose.model('Note', schema)
