const { gql } = require('apollo-server')

const mutation = gql`
  type Mutation {
    """
    Adds a Note for the logged in User (requires authentication).
    Parameters: title (String, mandatory), content (String, mandatory), keywords (array of Strings).
    Return value: Note
    """
    addNote(title: String!, content: String!, keywords: [String]): Note
    """
    Deletes a Note of a User by its ID (requires authentication). Parameters: ID (String, mandatory).
    Return value: ID of the deleted Note as String or null
    """
    deleteNote(id: ID!): String
    """
    Enables editing a Note of a User(requires authentication).
    Parameters: ID (String, mandatory), title (String, mandatory), content (String, mandatory), keywords (array of Strings).
    Return value: Note with the applied changes or null
    """
    editNote(
      id: ID!
      title: String!
      content: String!
      keywords: [String]
    ): Note
    # """
    # Enables adding a User to the database.
    # Parameters: email (String, mandatory), password (String, mandatory), givenname (String), surname (String).
    # Return value: Created user or null
    # """
    # addUser(
    #   email: String!
    #   password: String!
    #   givenname: String
    #   surname: String
    # ): User
    """
    Enables editing the current User (e.g. change email, password or name).
    Parameters: email (String), password (String), givenname (String), surname (String).
    Return value: Changed user or null
    """
    editUser(
      email: String
      password: String
      givenname: String
      surname: String
    ): User
    """
    Enables switching the password of the logged in user.
    Parameters: currentPassword (String, mandatory), newPassword (String, mandatory), newPassword2 (String, mandatory).
    Return value: Changed user or null
    """
    changePassword(
      currentPassword: String!
      newPassword: String!
      newPassword2: String!
    ): User
    """
    Enables the login of a User. Parameters: email (String, mandatory), password (String, mandatory).
    Return value: Token entity containing the access token value or null
    """
    login(email: String!, password: String!): Token
  }
`

module.exports = {
  mutation
}
