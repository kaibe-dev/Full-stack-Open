const { GraphQLError, subscribe } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (args.genre) {
          return await Book.find({genres: args.genre, author: author }).populate('author')
        }
        return await Book.find({ author: author }).populate('author')
      }

      if (args.genre) {
        return await Book.find({ genres: args.genre }).populate('author')
      }

      return await Book.find({}).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})
      return authors.map(author => ({
        ...author.toObject(),
        bookCount: books.filter(book => book.author.toString() === author._id.toString()).length
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('invalid authentication', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const foundAuthor = await Author.findOne({ name: args.author })
      if (!foundAuthor) {
        const newAuthor = new Author({ 'name': args.author })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed',{
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const author = await Author.findOne({ name: args.author })
      const book = new Book ( {...args, author: author } )
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed',{
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('invalid authentication', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const foundAuthor = await Author.findOne({ name: args.name })
      if (!foundAuthor) {
        console.log('Author not found')
        return null
      }
    
      foundAuthor.born = args.setBornTo
      const updatedAuthor = await foundAuthor.save()
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      
      return user.save()
        .catch (error => {
          throw new GraphQLError('Saving user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      
      if (!user || args.password !== 'password') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
        subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers