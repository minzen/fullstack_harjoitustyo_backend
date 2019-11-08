const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
  PubSub
} = require('apollo-server')
require('dotenv').config()
const uuid = require('uuid/v1')
const User = require('./models/user')
const Note = require('./models/note')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
// const jwt = require('jsonwebtoken')
// const JWT_SECRET = process.env.JWT_SECRET
// const pubsub = new PubSub()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to ', MONGODB_URI)
// Create a DB connection
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('connected to MongoDB'))
  .catch(e => {
    console.log('error when connecting to MongoDB', e.message)
  })

let notes = []
let users = []

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    passwordHash: String!
    givenname: String
    surname: String
  }
  type Note {
    id: ID!
    title: String
    content: String!
    keywords: [String]
    user: Int
  }
  type Token {
    value: String!
  }
  type Query {
    notesCount: Int!
    usersCount: Int!
    allNotes: [Note!]!
    findNoteById(id: String!): Note
  }
  type Mutation {
    addNote(
      title: String!
      content: String!
      keywords: [String]
      user: Int
    ): Note
    addUser(
      email: String!
      passwordHash: String!
      givenname: String
      surname: String
    ): User
    login(email: String!, passwordHash: String!): Token
  }
`

const resolvers = {
  Query: {
    notesCount: () => Note.collection.countDocuments(),
    usersCount: () => User.collection.countDocuments(),
    allNotes: () => {
      return Note.find({})
    },
    findNoteById: (root, args) => Note.findById({ _id: args.id })
    // TODO: Add queries for: getNotesByUser, getNotesByUserAndKeyword etc.
  },
  Mutation: {
    // TODO: Add user, change user operations
    // TODO: tests
    // TODO: Add operations for changing and deleting existing notes
    addNote: async (root, args) => {
      const note = new Note({
        id: uuid(),
        title: args.title,
        content: args.content,
        keywords: args.keywords
        // TODO: user: ...
      })
      try {
        await note.save()
      } catch (e) {
        console.log('Error when saving the note', e)
      }
      console.log(`Note ${note} saved.`)
      return note
    },

    addUser: async (root, args) => {
      console.log('addUser', args)
      const user = new User({
        id: uuid(),
        email: args.email,
        passwordHash: args.passwordHash,
        givenname: args.givenname,
        surname: args.surname
      })

      try {
        await user.save()
      } catch (e) {
        console.log('Error when saving the user', e)
      }
      console.log(`User ${user} created and saved.`)

      return user
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
