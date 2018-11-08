const { GraphQLServer } = require('graphql-yoga');
// graphql-yoga uses express under the hood
// graphql-playground is also set up
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NUdining', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const Dining = require('./models/dining')
const Menu = require('./models/menu')
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
        dinings: [Dining!]!
        diningHalls: [Dining!]!
        nonDiningHalls: [Dining!]!
        findDining(id: ID!): Dining
        dining: Dining!
        diningByName(name: String!): Dining!

        menus: [Menu!]!
        menu(id: ID!): Menu

        foods: [Food!]!
        food(id: ID!): Food
        foodByNameAndDining(name: String!, diningId: ID!): Food!

        users: [User!]!
        user(id: ID!): User
        userByName(name: String!): User

    }
    type Mutation {
        createDining(name: String!, hours: String!, isHall: Boolean!): Dining!
        updateDining(id: ID!, rating: Int, hours: Int): Boolean!
        removeDining(id: ID!): Boolean!

        createMenu(diningId: ID!, timeOfDay: String!, date: String!): Menu!
        addFoodToMenu(id: ID!, foodId: ID!): Boolean!
        updateMenu(id: ID!, foodIds: [ID!], date: String): Boolean!
        removeMenu(id: ID!): Boolean!

        createFood(name: String!, description: String, diet: String, category: String, diningId: ID!): Food!
        updateFood(id: ID!, thumbsUp: Int, thumbsDown: Int): Boolean!
        removeFood(id: ID!): Boolean!
        thumbsUp(id: ID!): Boolean!
        thumbsDown(id: ID!): Boolean!

        createUser(name: String!, diet: String, preferences: [String!]): User!
        updateUser(id: ID!, name: String, diet: String, preferences: [String!]): Boolean!
        addFaveFoods(id: ID!, faveFoodIds: [ID!]!): Boolean!
        removeUser(id: ID!): Boolean!
    }
`
// mongo generates an id by default, ID is a special type in graphql
// passing the id in an update function is how graphQL knows which item to update

resolvers = {
    Dining: {
        menus: (parent) => parent.menuIds.map(
            (id) => Menu.findById(id)),
        foods: (parent) => parent.foodIds.map(
            (id) => Food.findById(id))
    },
    Menu: {
        dining: (parent) => Dining.findById(parent.diningId),
        foods: (parent) => parent.foodIds.map(
            (id) => Food.findById(id))
    },
    Food: {
        dining: (parent) => Dining.findById(parent.diningId)
    },
    User: {
        faveFoods: (parent) => parent.faveFoodIds.map(
            (id) => Food.findById(id)),
    },
    Query: {
        //DINING
        dinings: () => Dining.find({}),
        diningHalls: () => Dining.find({isHall: true}),
        nonDiningHalls: () => Dining.find({isHall: false}),
        findDining: (_, {id}) => Dining.findById(id),
        dining: (parent) => Dining.findById(parent.diningId),
        diningByName: (_, {name}) => Dining.findOne({name: name}),

        //MENU
        menus: () => Menu.find({}),
        menu: (_, {id}) => Menu.findById(id),
            
        
        //FOOD
        foods: () => Food.find({}),
        food: (_, {id}) => Food.findById(id),
        foodByNameAndDining: (_, {name, diningId}) => Food.find({name: name, diningId: diningId}),

        //USER
        users: () => User.find({}),
        user: (_, {id}) => User.findById(id),
        userByName: (_, {name}) => User.find({name})
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
        createMenu: async (_, {diningId, timeOfDay, date}) => {
            let menu = new Menu({
                date: date,
                timeOfDay: timeOfDay,
                diningId: diningId
            });
            await menu.save();
            await Dining.findByIdAndUpdate(diningId, {
                $push: {menuIds: menu._id}
            });
            return menu;
        },
        updateMenu: async (_, {id, foodIds, date}) => {
            await Menu.findByIdAndUpdate(id, {
                foodIds: foodIds,
                date: date
            });
            return true;
        },
        addFoodToMenu: async (_, {id, foodId}) => {
            await Menu.findByIdAndUpdate(id, {
                $push: {foodIds: foodId}
            });
            return True
        },
        removeMenu: async (_, {id}) => {
            let menu = Menu.findById(id);
            await Dining.findByIdAndUpdate(menu.diningId, {
                $pull: {menuIds: id}
            });
            await Menu.findByIdAndRemove(id);
            return true;
        },

        //FOOD
        createFood: async (_, {name, description, diet, category, diningId}) => {
            let food = new Food({
                name: name,
                description: description,
                thumbsUp: 0,
                thumbsDown: 0,
                diet: diet,
                category: category,
                preferences: [], // use food name and description to match with preferences
                diningId: diningId
            });
            await food.save();
            await Dining.findByIdAndUpdate(diningId, {
                $push: {foodIds: food._id}
            });
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
            let food = Food.findById(id);
            await Dining.findByIdAndUpdate(food.diningId, {
                $pull: {foodIds: id}
            });
            await User.update({})
            await Food.findByIdAndRemove(id);
            return true;
        },
        thumbsUp: async (_, {id}) => {
            await Food.findByIdAndUpdate(id, { $inc: {thumbsUp: 1}});
            return true;
        },
        thumbsDown: async (_, {id}) => {
            await Food.findByIdAndUpdate(id, { $inc: {thumbsDown: 1}});
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

/*
// for a day
    // for a dining hall
        // for every menu ***
            // we have all the foods for that menu
            // for each food
                // look in the database to see if a food with that name is already there
                // if it is, put the foodId into foodIds for this new menu


//for every menu
`mutation {
    createMenu(date: "November 8", timeOfDay: "Lunch", diningName: "Sargent")
}
`

//for each food in the menu
`query {
    foodByNameAndDining(name: "chipotle chicken", diningId:) // returns the food
}
`
// if true, add foodId to foodIds array for the menu
// if false
`mutation {
    createFood(name: "chipotle chicken", decription: "blah", diet: "blah")
}`
// foodId to foodIds array for the menu




// top 5 for the day overall - dining only
// top 5 for particular meal - dining only
// top 5 for a dining hall
// make 5 a parameter
*/