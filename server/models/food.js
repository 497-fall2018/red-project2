const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    diet: String,
    diningHallID: String
});

module.exports = mongoose.model('Food', foodSchema);

// a model is a collection in the database
// the model name is 'Food' and the objects in it follow the foodSchema