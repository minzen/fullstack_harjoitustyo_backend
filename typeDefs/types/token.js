const { gql } = require('apollo-server')

const token = gql`
  "A Token entity bearing a JSON Web Token computed by the user data and a secret"
  type Token {
    value: String!
  }
`

module.exports = {
  token
}
