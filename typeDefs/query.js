const { gql } = require('apollo-server')

const query = gql`
  type Query {
    """
    Returns the user currently logged in or null, if there is no logged in user
    """
    me: User
    """
    Returns the number of all notes in the database
    """
    notesCount: Int!
    """
    Returns the number of all users in the database
    """
    usersCount: Int!
    """
    Returns all the notes of a user
    """
    allNotes: [Note!]
    """
    Returns a Note by its id (if belonging to the user) or null, if not available
    """
    findNoteById(id: String!): Note
    """
    Enables resetting the test DB to the initial state to ensure the same conditions for each test
    Return value: Boolean true if the operation was successful, otherwise false
    """
    resetTestDb: Boolean
    """
    Returns all the keywords that have been used on the notes by the current user.
    This is useful to provide for the search so that there are ready alternatives from which the user may choose from.
    Return value: an Array of Strings (may be empty)
    """
    allKeywordsInNotesOfUser: [String]
  }
`

module.exports = {
  query
}
