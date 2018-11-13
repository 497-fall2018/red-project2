const { GraphQLServer } = require('graphql-yoga');
// graphql-yoga uses express under the hood
// graphql-playground is also set up
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/NUdining', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const Dining = require('./models/dining')
const Menu = require('./models/menu')
const Food = require('./models/food')
const User = require('./models/user')

function compareRatings(food1, food2) {
    return (food2.thumbsUp - food2.thumbsDown) - (food1.thumbsUp - food1.thumbsDown);
    // if food1 is better, result is < 0, and food1 will have a lower index
    // sorts the array of foods in descending order
}
function sortFoods(foodArray, num) {
    let sortedFoods = foodArray.sort(compareRatings);
    return sortedFoods.slice(0, num);
}


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
        topFoods(num: Int!): [Food!]!
    }
    type Food {
        id: ID
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
        dining(id: ID!): Dining!
        diningByName(name: String!): Dining

        menus: [Menu!]!
        menu(id: ID!): Menu
        menuByDiningDateTimeOfDay(diningId: ID!, date: String!, timeOfDay: String): Menu

        foods: [Food!]!
        food(id: ID!): Food
        foodByNameAndDining(name: String!, diningId: ID!): Food
        topFoods(num: Int!, isHall: Boolean!, date: String!, timeOfDay: String!): [Food!]!

        users: [User!]!
        user(id: ID!): User
        userByName(name: String!): User

    }
    type Mutation {
        createDining(name: String!, hours: String!, isHall: Boolean!): Dining!
        updateDining(id: ID!, rating: Int, hours: Int): Boolean!
        removeDining(id: ID!): Boolean!

        createMenu(diningId: ID!, timeOfDay: String!, date: String!): Menu!
        addFoodToMenu(menuId: ID!, foodId: ID!): Boolean!
        removeFoodFromMenu(menuId: ID!, foodID: ID!): Boolean!
        removeMenu(id: ID!): Boolean!

        createFood(name: String!, description: String, diet: String, category: String, diningId: ID!): Food
        updateFood(id: ID!, thumbsUp: Int, thumbsDown: Int): Boolean!
        thumbsUp(id: ID!): Boolean!
        thumbsDown(id: ID!): Boolean!
        removeFood(id: ID!): Boolean!

        createUser(name: String!, diet: String, preferences: [String!]): User!
        updateUser(id: ID!, name: String, diet: String, preferences: [String!]): Boolean!
        addFaveFood(userId: ID!, foodId: ID!): Boolean!
        removeFaveFood(userId: ID!, foodId: ID!): Boolean!
        removeUser(id: ID!): Boolean!
    }
`
// mongo generates an id by default, ID is a special type in graphql
// passing the id in an update function is how graphQL knows which item to update


resolvers = {
    Dining: {
        menus: async (parent) => await Promise.all(
            parent.menuIds.map(
                (id) => Menu.findById(id)
        )),
        foods: async (parent) => await Promise.all(
            parent.foodIds.map(
                (id) => Food.findById(id)
        ))
    },
    Menu: {
        dining: async (parent) => await Dining.findById(parent.diningId),
        foods: async (parent) => await Promise.all(
            parent.foodIds.map(
                (id) => Food.findById(id)
        )),

        topFoods: async (parent, { num }) => {
            const foods = await Promise.all(parent.foodIds.map(
                (id) => Food.findById(id)
            ));
            return sortFoods(foods, num);
        }
    },
    Food: {
        dining: async (parent) => await Dining.findById(parent.diningId)
    },
    User: {
        faveFoods: async (parent) => await Promise.all(
            parent.faveFoodIds.map(
                (id) => Food.findById(id)))
    },
    Query: {
        //DINING
        dinings: async () => await Dining.find(),
        dining: async (_, { id }) => await Dining.findById(id),

        diningByName: async (_, { name }) => await Dining.findOne({name: name}),
        diningHalls: async () => await Dining.find({ isHall: true }),
        nonDiningHalls: async () => await Dining.find({ isHall: false }),

        //MENU
        menus: async () => await Menu.find(),
        menu: async (_, { id }) => await Menu.findById(id),
        menuByDiningDateTimeOfDay: async(_, { diningId, date, timeOfDay }) => await Menu.findOne({ 
            diningId: diningId,
            date: date,
            timeOfDay: timeOfDay
        }),


        //FOOD
        foods: async () => await Food.find(),
        food: async (_, { id }) => await Food.findById(id),

        foodByNameAndDining: async (_, { name, diningId }) => await Food.findOne({ name: name, diningId: diningId }),
        topFoods: async (_, { num, isHall, date, timeOfDay}) => {
            let dining_Ids = await Dining.find({ isHall: isHall }).select({ "_id": 1 });
            let diningIds = dining_Ids.map(_ => _.id);

            let menu_foodIds = await Menu.find({
                diningId: { $in: diningIds },
                date: date,
                timeOfDay: timeOfDay
            }).select({ foodIds: 1 });
            let foodIds = (menu_foodIds.map(_ => _.foodIds));
            foodIds = foodIds.reduce((acc, val) => acc.concat(val), []);

            let foods = await Promise.all(foodIds.map(
                (id) => Food.findById(id)
            ));
            return sortFoods(foods, num);
        },

        //USER
        users: async () => await User.find(),
        user: async (_, { id }) => await User.findById(id),

        userByName: async (_, { name }) => await User.findOne({ name: name })
    },

    Mutation: {
        //DINING
        createDining: async (_, { name, hours, isHall }) => {
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
        updateDining: async (_, { id, rating, hours }) => {
            await Dining.findByIdAndUpdate(id, {
                rating: rating,
                hours: hours
            });
            return true;

        },
        removeDining: async (_, { id }) => {
            const dining = await Dining.findById(id);
            await Promise.all(dining.foodIds.map(
                (id) => Food.findByIdAndRemove(id)
            ));
            await Promise.all(dining.menuIds.map(
                (id) => Menu.findByIdAndRemove(id)
            ));
            await Dining.findByIdAndRemove(id);
            return true;
        },

        //MENU
        createMenu: async (_, { diningId, timeOfDay, date }) => {
            let menu = new Menu({
                date: date,
                timeOfDay: timeOfDay,
                diningId: diningId
            });
            await menu.save();
            await Dining.findByIdAndUpdate(diningId, {
                $push: { menuIds: menu._id }
            });
            return menu;
        },
        addFoodToMenu: async (_, { menuId, foodId }) => {
            await Menu.findByIdAndUpdate(menuId, {
                $push: { foodIds: foodId }
            });
            return true;
        },
        removeFoodFromMenu: async (_, { menuId, foodId }) => {
            await Menu.findByIdAndUpdate(id, {
                $pull: { foodIds: foodId }
            });
        },
        removeMenu: async (_, { id }) => {
            const menu = await Menu.findById(id);
            await Dining.findByIdAndUpdate(menu.diningId, {
                $pull: {menuIds: id}
            });
            await Menu.findByIdAndRemove(id);
            return true;
        },

        //FOOD
        createFood: async (_, { name, description, diet, category, diningId }) => {
            let foundFood = await Food.findOne({ name: name, diningId: diningId });
            if (foundFood == null) {
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
                    $push: { foodIds: food._id }
                });
                return food;
            }
            else {
                return foundFood;
            }
        },
        updateFood: async (_, { id, thumbsUp, thumbsDown }) => {
            await Food.findByIdAndUpdate(id, {
                thumbsUp: thumbsUp,
                thumbsDown: thumbsDown
            });
            return true;
        },
        thumbsUp: async (_, {id}) => {
            await Food.findByIdAndUpdate(id, {
                $inc: { thumbsUp: 1 }
            });
            return true;
        },
        thumbsDown: async (_, {id}) => {
            await Food.findByIdAndUpdate(id, {
                $inc: { thumbsDown: 1 }
            });
            return true;
        },
        removeFood: async (_, {id}) => {
            let food = await Food.findById(id);
            await Dining.findByIdAndUpdate(food.diningId, {
                $pull: { foodIds: id }
            });
            await Menu.updateMany({
                $pull: { foodIds: id }
            });
            await User.updateMany({
                $pull: { faveFoodIds: id }
            })
            await Food.findByIdAndRemove(id);
            return true;
        },

        //USER
        createUser: async (_, { name, diet, preferences = [] }) => {
            const user = new User({
                name: name,
                diet: diet,
                preferences: preferences,
                faveFoodIds: []
            });
            await user.save();
            return user;
        },
        updateUser: async (_, { id, name, diet, preferences }) => {
            await User.findByIdAndUpdate(id, {
                name: name,
                diet: diet,
                preferences: preferences
            });
            return true;
        },
        addFaveFood: async (_, { userId, foodId }) => {
            await User.findByIdAndUpdate(userId, {
                $push: { faveFoodIds: foodId }
            });
            return true;
        },
        removeFaveFood: async (_, { userId, foodId }) => {
            await User.findByIdAndUpdate(userId, {
                $pull: { faveFoodIds: foodId }
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
