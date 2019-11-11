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
const Token = require('./models/token')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
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
    me: User
    notesCount: Int!
    usersCount: Int!
    allNotes: [Note!]!
    findNoteById(id: String!): Note
    allUsers: [User!]!
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
      password: String!
      givenname: String
      surname: String
    ): User
    login(email: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    notesCount: () => Note.collection.countDocuments(),
    usersCount: () => User.collection.countDocuments(),
    allNotes: () => {
      return Note.find({})
    },
    findNoteById: (root, args) => Note.findById({ _id: args.id }),
    allUsers: () => {
      return User.find({})
    }
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
    // The method takes care of creating new users
    addUser: async (root, args) => {
      console.log('addUser', args)
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const user = new User({
        id: uuid(),
        email: args.email,
        passwordHash: passwordHash,
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
    },
    login: async (root, args) => {
      console.log('login', args)
      const typedEmail = args.email
      const typedPwd = args.password

      const user = await User.findOne({ email: typedEmail })
      console.log('user', user)
      if (!user) {
        console.log('invalid username or password')
        return null
      }

      const passwordOk = await bcrypt.compare(typedPwd, user.passwordHash)
      console.log('passwordOk', passwordOk)
      if (!passwordOk) {
        console.log('Invalid username or password')
        return null
      }
      const userForToken = {
        email: user.email,
        id: user._id
      }
      console.log('userForToken', userForToken)
      const token = await jwt.sign(userForToken, process.env.JWT_SECRET)

      console.log('token', token)
      return new Token({ value: token })
    }
  }
}

/*
const context = async ({req}) => {
  // Get the token from the request
  const token = req.headers.authorization || ''

  const user = await User.findOne({ email: })
}
*/

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
