const { gql } = require('apollo-server')

const note = gql`
  "A Note entity containing a title, content and possibly a set of keywords that are used to search for and categorize the notes."
  type Note {
    """
    id: an Identifier of a Note
    """
    id: ID!
    """
    title: the title of a Note
    """
    title: String
    """
    content: the content of a Note as String
    """
    content: String!
    """
    keywords: an array of Strings containing the relevant keywords used for categorising Notes
    """
    keywords: [String]
    # """
    # modified: timestamp of the latest modification of a Note (using the custom scalar type Date)
    # """
    # modified: Date
    """
    user: Reference to the User that has created the Note
    """
    user: User
  }
`

module.exports = {
  note
}
