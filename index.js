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
  "A User entity with the possibility to create, edit and delete own notes."
  type User {
    """
    id: an identifier of the User
    """
    id: ID!
    """
    email: each User has an email address that is unique and can be used to identify the user
    """
    email: String!
    """
    passwordHash: a computed hash value of the password provided by a User is stored to the document database.
    """
    passwordHash: String!
    """
    givenname: the first name of a User
    """
    givenname: String
    """
    surname: the family name of a User
    """
    surname: String
  }
  "A Note entity containing a title, content and possibly a set of keywords that are used to search for and categorize the notes."
  type Note {
    id: ID!
    title: String
    content: String!
    keywords: [String]
    user: User
  }
  "A Token entity bearing a JSON Web Token computed by the user data and a secret"
  type Token {
    value: String!
  }
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
  }
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
    """
    Enables adding a User to the database.
    Parameters: email (String, mandatory), password (String, mandatory), givenname (String), surname (String).
    Return value: Created user or null
    """
    addUser(
      email: String!
      password: String!
      givenname: String
      surname: String
    ): User
    """
    Enables editing an existing User (e.g. change email, password or name).
    Parameters: ID (String, mandatory), email (String), password (String), givenname (String), surname (String).
    Return value: Changed user or null
    """
    editUser(
      id: ID!
      email: String
      password: String
      givenname: String
      surname: String
    ): User
    """
    Enables the login of a User. Parameters: email (String, mandatory), password (String, mandatory).
    Return value: Token entity containing the access token value or null
    """
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
    // TODO: tests
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
    // The method enables editing the notes of an authenticated user
    editNote: async (root, args, context) => {
      console.log('editNote', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }

      const idOfNoteToBeEdited = args.id
      return await Note.findOneAndUpdate(
        { _id: idOfNoteToBeEdited, user: currentUser },
        { title: args.title, content: args.content, keywords: args.keywords }
      ).populate('user')
    },
    // The method takes care of creating new users
    addUser: async (root, args) => {
      console.log('addUser', args)
      const passwordHash = await createPwdHash(args.password)
      const user = new User({
        email: args.email,
        passwordHash: passwordHash,
        givenname: args.givenname,
        surname: args.surname
      })

      try {
        await user.save()
        return user
        console.log(`User ${user} created and saved.`)
      } catch (e) {
        console.log('Error when saving the user', e)
      }
      console.log('no user added, returning null')
      return null
    },
    // The method enables changing the attributes of existing users
    editUser: async (root, args, context) => {
      console.log('editUser', args)
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError(NOT_AUTHENTICATED)
      }
      const idOfUserToBeEdited = args.id
      const passwordHash = await createPwdHash(args.password)
      try {
        return await User.findByIdAndUpdate({
          _id: idOfUserToBeEdited,
          email: args.email,
          passwordHash: passwordHash,
          givenname: args.givenname,
          surname: args.surname
        })
      } catch (e) {
        console.log('error when updating the user', e)
        return null
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

const createPwdHash = async password => {
  const saltRounds = 10
  return await bcrypt.hash(args.password, saltRounds)
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
