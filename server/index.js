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
        preferences: [String!]!
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
        findDinings: [Dining!]!
        findDiningHalls: [Dining!]!
        findNonDiningHalls: [Dining!]!
        findDining(id: ID!): Dining!
        dining: Dining!

        findMenus: [Menu!]!
        findMenu(id: ID!): Menu!
        menus: [Menu!]!

        foods: [Food!]!

    }
    type Mutation {
        createDining(name: String!, hours: String!, isHall: Boolean!): Dining!
        updateDining(id: ID!, rating: Int, hours: Int): Boolean!
        removeDining(id: ID!): Boolean!

        createMenu(diningId: ID!, timeOfDay: String!, date: String!, foodIds: [ID!]): Menu!
        updateMenu(id: ID!, foodIds: [ID!], date: String): Boolean!
        removeMenu(id: ID!): Boolean!

        createFood(name: String!, diet: String, diningId: ID!): Food!
        updateFood(id: ID!, thumbsUp: Int, thumbsDown: Int): Boolean!
        removeFood(id: ID!): Boolean!

        createUser(name: String!, diet: String, preferences: [String!]): User!
        updateUser(id: ID!, name: String, diet: String, preferences: [String!]): Boolean!
        addFaveFoods(id: ID!, faveFoodIds: [ID!]!): Boolean!
        removeUser(id: ID!): Boolean!
    }
`
// mongo generates an id by default, ID is a special type in graphql
// passing the id in an update function is how graphQL knows which item to update

resolvers = {
    Query: {
        //DINING
        findDinings: () => Dining.find({}),
        findDiningHalls: () => Dining.find({isHall: true}),
        findNonDiningHalls: () => Dining.find({isHall: false}),
        findDining: (_, {id}) => Dining.findById(id),
        dining: (parent, {}) => Dining.findById(parent.diningId),

        //MENU
        findMenus: () => Menu.find({}),
        findMenu: (_, {id}) => Menu.findById(id),
        menus: (parent, {}) => parent.menuIds.map(
            (id) => Menu.findById(id)),
        
        //USER
        foods: (parent, {}) => parent.foodIds.map(
            (id) => Food.findById(id)),
        findFoods: () => Food.find({}),
        findFood: (_, {id}) => Food.findById(id),
        findFoodByNameAndDining: (_, {name, dining}) => Food.find()
        

    },

    Mutation: {
        //DINING
        createDining: async (_, {name, hours, isHall}) => {
            const dining = new Dining({
                name: name,
                rating: 0,
                hours: hours,
                isHall: isHall,
                menuIds: [],
                foodIds: []
            });
            await dining.save();
            return dining;
        },
        updateDining: async (_, {id, rating, hours}) => {
            await Dining.findByIdAndUpdate(id, {
                rating: rating,
                hours: hours
            });
            return true;

        },
        removeDining: async (_, {id}) => {
            await Dining.findByIdAndRemove(id);
            return true;
        },

        //MENU
        createMenu: async (_, {diningId, timeOfDay, date, foodIds}) => {
            const menu = new Menu({
                date: date,
                timeOfDay: timeOfDay,
                diningId: diningId,
                foodIds: foodIds
            });
            await menu.save();
            return menu;
        },
        updateMenu: async (_, {id, foodIds, date}) => {
            await Menu.findByIdAndUpdate(id, {
                foodIds: foodIds,
                date: date
            });
            return true;
        },
        removeMenu: async (_, {id}) => {
            await Menu.findByIdAndRemove(id);
            return true;
        },

        //FOOD
        createFood: async (_, {name, diet, diningId}) => {
            const food = new Food({
                name: name,
                thumbsUp: 0,
                thumbsDown: 0,
                diet: diet,
                preferences: [], // use food name and description to match with preferences
                diningId: diningId
            });
            await food.save();
            return food;
        },
        updateFood: async (_, {id, thumbsUp, thumbsDown}) => {
            await Food.findByIdAndUpdate(id, {
                thumbsUp: thumbsUp,
                thumbsDown: thumbsDown
            });
            return true;
        },
        removeFood: async (_, {id}) => {
            await Food.findByIdAndRemove(id);
            return true;
        },

        //USER
        createUser: async (_, {name, diet, preferences = []}) => {
            const user = new User({
                name: name,
                diet: diet,
                preferences: preferences,
                faveFoodIds: []
            });
            await user.save();
            return user;
        },
        updateUser: async (_, {id, name, diet, preferences}) => {
            await User.findByIdAndUpdate(id, {
                name: name,
                diet: diet,
                preferences: preferences
            });
            return true;
        },
        addFaveFoods: async (_, {id, faveFoodIds}) => {
            await User.findByIdAndUpdate(id, {
                $push: {faveFoodIds: {$each: faveFoodIds}}
            });
            return true;
        },
        removeUser: async (_, {id}) => {
            await User.findByIdAndRemove(id);
            return true;
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log('Server is running on localhost:4000'));
});
