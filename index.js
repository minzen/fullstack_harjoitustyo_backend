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
const NOT_AUTHENTICATED = 'not authenticated'

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
    user: User
  }
  type Token {
    value: String!
  }
  type Query {
    me: User
    notesCount: Int!
    usersCount: Int!
    allNotes: [Note!]
    findNoteById(id: String!): Note
  }
  type Mutation {
    addNote(title: String!, content: String!, keywords: [String]): Note
    deleteNote(id: ID!): String
    editNote(
      id: ID!
      title: String!
      content: String!
      keywords: [String]
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
    me: (root, args, context) => context.currentUser,
    notesCount: () => Note.collection.countDocuments(),
    usersCount: () => User.collection.countDocuments(),
    allNotes: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        return null
      }
      return await Note.find({ user: currentUser }).populate('user')
    },
    findNoteById: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      return await Note.findById({ _id: args.id, user: currentUser }).populate(
        'user'
      )
    }

    // TODO: Add queries for: getNotesByUserAndKeyword etc.
  },
  Mutation: {
    // TODO: change user operation
    // TODO: tests
    // TODO: Add operations for changing existing notes
    addNote: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      const note = new Note({
        id: uuid(),
        title: args.title,
        content: args.content,
        keywords: args.keywords,
        user: currentUser
      }).populate('user')

      try {
        await note.save()
      } catch (e) {
        console.log('Error when saving the note', e)
      }
      console.log(`Note ${note} saved.`)
      return note
    },
    deleteNote: async (root, args, context) => {
      console.log('deleteNote', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      const idOfNoteToDelete = args.id

      const note = await Note.findById(idOfNoteToDelete)
      if (note) {
        if (note.user !== currentUser) {
          console.log(
            `cannot delete the note ${idOfNoteToDelete} as it is not owned by the user`
          )
          return null
        }
      }

      try {
        const deleted = await Note.findByIdAndDelete(idOfNoteToDelete)
        console.log('deleted', deleted)
        if (deleted) {
          console.log(`note with the id ${idOfNoteToDelete} deleted`)
          return idOfNoteToDelete
        } else {
          console.log('not deleted')
        }
      } catch (e) {
        console.log('error when deleting an item', idOfNoteToDelete)
      }
      return null
    },
    editNote: async (root, args, context) => {
      console.log('editNote', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }

      const idOfNoteToBeEdited = args.id
      return Note.findOneAndUpdate(
        { _id: idOfNoteToBeEdited, user: currentUser },
        { title: args.title, content: args.content, keywords: args.keywords }
      ).populate('user')
    },
    // The method takes care of creating new users
    addUser: async (root, args) => {
      console.log('addUser', args)
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const user = new User({
        email: args.email,
        passwordHash: passwordHash,
        givenname: args.givenname,
        surname: args.surname
      })

      try {
        await user.save()
        return user
      } catch (e) {
        console.log('Error when saving the user', e)
      }
      console.log(`User ${user} created and saved.`)
      return null
    },
    login: async (root, args) => {
      console.log('login', args)
      const typedEmail = args.email
      const typedPwd = args.password

      const user = await User.findOne({ email: typedEmail })
      console.log('user', user)
      if (!user) {
        console.log('invalid username or password')
        throw new UserInputError('wrong credentials')
      }

      const passwordOk = await bcrypt.compare(typedPwd, user.passwordHash)
      console.log('passwordOk', passwordOk)
      if (!passwordOk) {
        console.log('Invalid username or password')
        throw new UserInputError('wrong credentials')
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

const context = async ({ req }) => {
  let currentUser = null
  // Get the token from the request
  const token = getTokenFromReq(req)
  if (!token) {
    console.log('missing or invalid token')
  } else {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      if (!token || !decodedToken.id) {
        console.log('missing or invalid token')
      } else {
        currentUser = await User.findById(decodedToken.id)
        console.log('user', currentUser, ' set as currentUser')
      }
    } catch (e) {
      console.log('Error with token handling', e)
    }
  }

  return { currentUser }
}

const getTokenFromReq = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const server = new ApolloServer({
  typeDefs,
  context,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
