const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    thumbsUp: Number,
    thumbsDown: Number,
    diet: String,
    preferences: [String],
    diningId: String
});

module.exports = mongoose.model('Food', foodSchema);

// a model is a collection in the database
// the model name is 'Food' and the objects in it follow the foodSchema