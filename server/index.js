const { GraphQLServer } = require('graphql-yoga');
// graphql-yoga uses express under the hood
// graphql-playground is also set up
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NUdining', { useNewUrlParser: true });

const Dining = require('./models/dining')
const Food = require('./models/food')
const User = require('./models/user')

DiningHall = mongoose.model('DiningHall', {
    name: String,
    rating: Number,
    hours: String
});

// typeDefs is the schema (what requests you can make to the server)
// resolvers implement how our requests will be handled
typeDefs = `
    type Query {
        diningHalls: [DiningHall]
    }
    type DiningHall {
        id: ID!
        name: String!
        rating: Int!
        hours: String!

    }
    type Mutation {
        createDiningHall(name: String!, hours: String!): DiningHall
        updateDiningHall(id: ID!, rating: Int!): Boolean
        removeDiningHall(id: ID!): Boolean
    }
`
// mongo generates an id by default, ID is a special type in graphql
// passing the id in an update function is how graphQL knows which item to update

resolvers = {
    Query: {
        diningHalls: () => DiningHall.find()
    },
    Mutation: {
        createDiningHall: async (_, {name, hours}) => {
            const diningHall = new DiningHall({name, rating: 0, hours});
            await diningHall.save();
            return diningHall;
        },
        updateDiningHall: async (_, {id, rating}) => {
            await DiningHall.findByIdAndUpdate(id, {rating});
            return True;
        },
        removeDiningHall: async (_, {id}) => {
            await DiningHall.findByIdAndRemove(id);
            return True;
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log('Server is running on localhost:4000'));
});
