const { gql } = require('apollo-server')

const user = gql`
  "A User entity with the possibility to create, edit and delete own notes."
  type User {
    """
    id: an identifier of the User
    """
    id: ID!
    """
    email: each User has an email address that is unique and can be used to identify the user
    """
    email: String!
    """
    passwordHash: a computed hash value of the password provided by a User is stored to the document database.
    """
    passwordHash: String!
    """
    givenname: the first name of a User
    """
    givenname: String
    """
    surname: the family name of a User
    """
    surname: String
    """
    authToken: a token that is used to verify the user (after the registration there is a check, before the account is activated)
    """
    authToken: String
    """
    isActivated: indicates whether the user account has been activated. Only an active user is able to log in and use the system with the account.
    """
    isActivated: Boolean!
  }
`

module.exports = {
  user
}
