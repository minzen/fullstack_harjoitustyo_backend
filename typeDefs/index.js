const { query } = require('./query')
const { mutation } = require('./mutation')
const { user, note, token } = require('./types')
const typeDefs = [query, mutation, user, note, token]

module.exports = {
  typeDefs
}
