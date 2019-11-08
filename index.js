const { ApolloServer, gql } = require('apollo-server')
const uuid = require('uuid/v1')

let notes = [
  {
    id: '1234512345-1234-1234-1234-1234512345',
    title: 'testimuistiinpano',
    content:
      'Testimuistiinpano. Tässä on pituutta vähän enemmänkin ja halutaankin katsoa, mihin se johtaa. Lyheneekö tämä tarvittaessa vai joudutaanko hassuihin tilanteisiin, kun tekstit näyttävät oudoilta',
    keywords: ['testi', 'muistiinpano', 'teksti'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512346',
    title: 'testilinkki',
    content: 'http://www.example.com',
    keywords: ['testi', 'linkki'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512347',
    title: 'testimuistiinpano 2',
    content:
      'Testaillaan taas. Tuleeko mieleen, miten tänne saisi helpoiten kuvia näkyviin?',
    keywords: ['testi', 'teksti'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512348',
    title: 'testimuistiinpano 3',
    content: 'Mitäs nyt?',
    keywords: ['testi', 'teksti'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512349',
    title: 'testimuistiinpano 4',
    content: 'Hilipatti pippaa',
    keywords: ['testi', 'teksti', 'pippa'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512350',
    title: 'testimuistiinpano 5',
    content: 'Hilipatti pippaa2',
    keywords: ['testi', 'teksti', 'pippa2'],
    user: 123
  },
  {
    id: '1234512345-1234-1234-1234-1234512351',
    title: 'testimuistiinpano 6',
    content: 'Hilipatti pippaa3',
    keywords: ['testi', 'teksti', 'pippa3'],
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

  type Mutation {
    addNote(
      title: String!
      content: String!
      keywords: [String]
      user: Int
    ): Note
  }
`

const resolvers = {
  Query: {
    notesCount: () => notes.length,
    allNotes: () => {
      console.log('returning the notes', notes)
      return notes
    },
    findNote: (root, args) => notes.find(n => n.id === args.id)
  },
  Mutation: {
    addNote: (root, args) => {
      const note = {
        id: uuid(),
        title: args.title,
        content: args.content,
        keywords: args.keywords,
        user: 123
      }
      console.log('Note to be added', note)
      notes.push(note)
      console.log('notes after the addition', notes)
      return note
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
