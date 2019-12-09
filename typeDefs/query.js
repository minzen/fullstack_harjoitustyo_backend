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
    """
    Returns all the notes containing a keyword or part of it by the current user.
    Parameters: Keyword as String
    Return value: an Array of Notes (may be empty)
    """
    notesByKeyword(keyword: String): [Note]
    """
    This method is used for verification of the token sent to the user in an Email after the registration. The user is supposed to
    click the link on the Email and if the token is OK, the user account is activated.
    This double opt-in should prevent most of the inappropriate registration attempts, as it requires an access to the user's email as well.
    Parameters: token (String, mandatory)
    Return value: Changed user or null
    """
    verifyAccount(token: String!): User
  }
`

module.exports = {
  query
}
