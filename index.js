const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
  PubSub
} = require('apollo-server')
require('dotenv').config()
const { typeDefs } = require('./typeDefs')
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

const createPwdHash = async password => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

const startInMemoryDb = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server')
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useUnifiedTopology: true
  }

  let uri
  try {
    const mongod = await new MongoMemoryServer()
    uri = await mongod.getConnectionString()
    console.log('uri', uri)
    await mongoose.connect(uri, mongooseOpts)
    console.log('connected to the in-memory MongoDB')
  } catch (e) {
    console.log(e)
  }
}

const initE2eDb = async () => {
  const email = 'teemu.testaaja@test.net'
  const password = 'ThisIsMyPwd_2019'
  const passwordHash = await createPwdHash(password)
  const givenname = 'Teemu'
  const surname = 'Testaaja'
  const user = new User({
    email: email,
    passwordHash: passwordHash,
    givenname: givenname,
    surname: surname
  })

  try {
    const testUser = await user.save()
    console.log('Created user', testUser)
    const note = new Note({
      title: 'An interesting story about the Finnish football',
      content:
        'https://dynamic.hs.fi/2019/karsintakuvat/?_ga=2.73417106.1043337552.1573848580-425762508.1569652028',
      keywords: 'football',
      user: testUser
    })
    const testNote = await note.save()
    console.log('Created test note', testNote)
  } catch (e) {
    console.log(e)
  }
}

const startDb = async () => {
  const MONGODB_URI = process.env.MONGODB_URI
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('connected to MongoDB')
  } catch (e) {
    console.log('error when connecting to MongoDB', e.message)
  }
}

console.log('NODE_ENV', process.env.NODE_ENV)
// If the environment is "e2e" we want to use the in-memory mongoDB for testing
// start and initialize a database
if (process.env.NODE_ENV === 'e2e') {
  console.log('Setting up everything for the e2e tests on the backend')
  startInMemoryDb()
  initE2eDb()
} else {
  startDb()
}

let notes = []
let users = []

const resolvers = {
  Query: {
    me: (root, args, context) => {
      console.log('me()', args, 'currentUser: ', context.currentUser)
      return context.currentUser
    },
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
    // TODO: tests
    // The method enables adding a note by an authenticated user
    addNote: async (root, args, context) => {
      console.log('addNote', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      const note = new Note({
        title: args.title,
        content: args.content,
        keywords: args.keywords,
        user: currentUser,
        modified: Date.now().toString()
      })

      try {
        await note.save()
      } catch (e) {
        console.log('Error when saving the note', e)
        throw new UserInputError(e.message, { invalidArgs: args })
      }
      console.log(`Note ${note} saved.`)
      return note
    },
    // The method enables deleting a note belonging to an authenticated user
    deleteNote: async (root, args, context) => {
      console.log('deleteNote', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      const idOfNoteToDelete = args.id

      const note = await Note.findById(idOfNoteToDelete)
      if (note) {
        if (!note.user.equals(currentUser._id)) {
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
    // The method enables editing of a note belonging to an authenticated user
    editNote: async (root, args, context) => {
      console.log('editNote', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }

      const idOfNoteToBeEdited = args.id
      return await Note.findOneAndUpdate(
        { _id: idOfNoteToBeEdited, user: currentUser },
        {
          title: args.title,
          content: args.content,
          keywords: args.keywords,
          modified: Date.now().toString()
        }
      ).populate('user')
    },
    // The method takes care of creating new users
    addUser: async (root, args) => {
      console.log('addUser', args)

      if (!args.password || args.password.length < 6) {
        throw new UserInputError(
          'Invalid password (minimum length 6 characters)',
          { invalidArgs: args.password }
        )
      }

      const passwordHash = await createPwdHash(args.password)
      console.log('passwordHash', passwordHash)
      const user = new User({
        email: args.email,
        passwordHash: passwordHash,
        givenname: args.givenname,
        surname: args.surname
      })

      try {
        await user.save()
      } catch (e) {
        console.log('Error when saving the user', e)
        throw new UserInputError(e.message, { invalidArgs: args })
      }
      console.log(`User ${user} created and saved.`)
      return user
    },
    // The method enables changing the attributes of existing users
    editUser: async (root, args, context) => {
      console.log('editUser', args)
      if (!args.email || args.email.length < 4) {
        throw new UserInputError(
          'Invalid email address (minimum length 4 characters',
          { invalidArgs: args }
        )
      }

      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      try {
        currentUser.givenname = args.givenname
        currentUser.surname = args.surname
        currentUser.email = args.email
        return await currentUser.save()
      } catch (e) {
        console.log('error when updating the user data', e)
        throw new UserInputError(e.message, { invalidArgs: args })
      }
    },
    changePassword: async (root, args, context) => {
      console.log('changePassword', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }

      const currentPassword = args.currentPassword
      const newPassword = args.newPassword
      const newPassword2 = args.newPassword2

      if (
        !currentPassword ||
        !newPassword ||
        !newPassword2 ||
        currentPassword.length < 6 ||
        newPassword.length < 6 ||
        newPassword2.length < 6
      ) {
        throw new UserInputError(
          'Invalid password (minimum length 6 characters)',
          { invalidArgs: args }
        )
      }

      // In case the provided passwords do not match, return null
      if (newPassword !== newPassword2) {
        console.log(
          'The provided new passwords differ from each other, throwing an exception'
        )
        throw new UserInputError(
          'The provided passwords differ from each other',
          { invalidArgs: args }
        )
      }

      const passwordOk = await bcrypt.compare(
        currentPassword,
        currentUser.passwordHash
      )
      if (!passwordOk) {
        console.log(
          'The given current password differs from the one of the current user, cannot proceed.'
        )
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }

      const newPasswordHash = await createPwdHash(newPassword)
      try {
        currentUser.passwordHash = newPasswordHash
        return await currentUser.save()
      } catch (e) {
        console.log('Error when saving the user', currentUser)
        throw new UserInputError(e.message, { invalidArgs: args })
      }
    },
    // The method enables the login for a user and takes the email address and the password as parameters
    login: async (root, args) => {
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
  if (token) {
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
