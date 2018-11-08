const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    thumbsUp: Number,
    thumbsDown: Number,
    diet: String,
    category: String,
    preferences: [String],
    diningId: String
});

module.exports = mongoose.model('Food', foodSchema);

// a model is a collection in the database
// the model name is 'Food' and the objects in it follow the foodSchema