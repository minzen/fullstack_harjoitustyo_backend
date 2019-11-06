const { ApolloServer, gql } = require('apollo-server')

let notes = [
  {
    id: '1234512345-1234-1234-1234-1234512345',
    title: 'testimuistiinpano',
    content: 'Testimuistiinpano',
    keywords: ['testi', 'muistiinpano', 'teksti'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512346',
    title: 'testilinkki',
    content: 'http://www.example.com',
    keywords: ['testi', 'linkki'],
    user: 123
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    givenname: String
    surname: String
    email: String
  }
  type Note {
    id: ID!
    title: String
    content: String!
    keywords: [String]
    user: Int
  }

  type Query {
    notesCount: Int!
    allNotes: [Note!]!
    findNote(id: String!): Note
  }
`

const resolvers = {
  Query: {
    notesCount: () => notes.length,
    allNotes: () => notes,
    findNote: (root, args) => notes.find(n => n.id === args.id)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
