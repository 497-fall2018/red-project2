const { GraphQLServer } = require('graphql-yoga');
// graphql-yoga uses express under the hood
// graphql-playground is also set up
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NUdining', { useNewUrlParser: true });

const Dining = require('./models/dining')
const Food = require('./models/food')
const User = require('./models/user')

// typeDefs is the schema (what requests you can make to the server)
// resolvers implement how our requests will be handled
typeDefs = `
    type Dining {
        id: ID!
        name: String!
        rating: Int!
        hours: String!
        isHall: Boolean!
        menus: [Menu!]!
        foods: [Food!]!
    }
    type Menu {
        id: ID!
        date: String!
        timeOfDay: String!
        dining: Dining!
        foods: [Food!]!
    }
    type Food {
        id: ID!
        name: String!
        thumbsUp: Int!
        thumbsDown: Int!
        diet: String
        preference: [String!]!
        dining: Dining!
    }
    type User {
        id: ID!
        name: String!
        diet: String
        preferences: [String!]!
        faveFoods: [Food!]!

    }
    type Query {
        dinings: [DiningHall!]!
        diningHall:
    }
    type Mutation {
        createDining(name: String!, hours: String, isHall: Boolean!): Dining!
        updateDining(id: ID!, rating: Int, hours: Int): Boolean!
        removeDining(id: ID!): Boolean!

        createMenu(dining: Dining!, timeOfDay: String, date: String, foods: [Food!]): Menu!
        updateMenu(id: ID!, foods: [Food!], date: String): Boolean!
        removeMenu(id: ID!): Boolean!

        createFood(name: String!, diet: String, dining: Dining!): Food!
        updateFood(id: ID!, thumbsUp: Int, thumpsDown: Int): Boolean!
        removeFood(id: ID!): Boolean!

        createUser(name: String!, diet: String, preferences: [String!]): User!
        updateUser(id: ID!, name: String, diet: String, preferences: [String!]): Boolean!
        updateFaveFoods(id: ID!, faveFoods: [Foods!]!): Boolean!
        removeUser(id: ID!): Boolean!
    }
`
// mongo generates an id by default, ID is a special type in graphql
// passing the id in an update function is how graphQL knows which item to update

resolvers = {
    Query: {

    },

    Mutation: {

    }
    
    
    /*
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
    */
}

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log('Server is running on localhost:4000'));
});
